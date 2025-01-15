"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/components/strategies/strategy-form";
import { createSlug } from "@/lib/utils";

const FieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  type: z.enum(["TEXT", "SELECT", "MULTI_SELECT"]),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const CreateStrategySchema = z.object({
  name: z.string().min(1, "Strategy name is required"),
  description: z.string().optional(),
  fields: z.array(FieldSchema),
});

const UpdateStrategySchema = z.object({
  strategyId: z.string(),
  name: z.string().min(1, "Strategy name is required"),
  description: z.string().optional(),
  fields: z.array(FieldSchema),
});

export type CreateStrategyInput = z.infer<typeof CreateStrategySchema>;

export async function createStrategy(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const rawInput: CreateStrategyInput = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      fields: JSON.parse(formData.get("fields") as string),
    };

    const validatedData = CreateStrategySchema.safeParse(rawInput);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the input fields",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const strategy = await prisma.strategy.create({
      data: {
        name: validatedData.data.name,
        description: validatedData.data.description ?? null,
        userId: session.user.id,
        fields: {
          create: validatedData.data.fields.map((field, index) => ({
            name: field.name,
            type: field.type,
            required: field.required,
            options: field.options || [],
            order: index,
          })),
        },
        // Create the LiveJournal automatically for the strategy
        liveJournal: {
          create: {},
        },
      },
      include: {
        fields: true,
        liveJournal: true,
      },
    });

    revalidatePath("/dashboard/strategies");
    return {
      success: true,
      message: "Strategy created successfully",
      data: strategy,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(
        "Unique constraint failed on the fields: (`name`,`userId`)"
      )
    ) {
      return {
        success: false,
        message: "You already have a strategy with this name",
      };
    }

    console.error("Strategy creation error:", error);
    return {
      success: false,
      message: "Failed to create strategy",
    };
  }
}

export async function deleteStrategy(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    // First verify the strategy belongs to the user
    const strategy = await prisma.strategy.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!strategy) {
      return { success: false, message: "Strategy not found" };
    }

    // Delete the strategy and all related data
    await prisma.strategy.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard/strategies");
    return {
      success: true,
      message: "Strategy deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting strategy:", error);
    return {
      success: false,
      message: "Failed to delete strategy",
    };
  }
}
