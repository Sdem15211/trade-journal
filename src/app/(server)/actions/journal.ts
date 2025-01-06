"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/components/journals/journal-form";

const FieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  type: z.enum(["TEXT", "SELECT", "MULTI_SELECT"]),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const CreateJournalSchema = z.object({
  name: z.string().min(1, "Journal name is required"),
  description: z.string().optional(),
  fields: z.array(FieldSchema),
});

export type CreateJournalInput = z.infer<typeof CreateJournalSchema>;

export async function createJournal(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    // Parse form data
    const rawInput: CreateJournalInput = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      fields: JSON.parse(formData.get("fields") as string),
    };

    // Validate input
    const validatedData = CreateJournalSchema.safeParse(rawInput);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the input fields",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    await prisma.journal.create({
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
      },
      include: {
        fields: true,
      },
    });

    return {
      success: true,
      message: "Journal created successfully",
      data: validatedData.data,
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
        message: "You already have a journal with this name",
      };
    }

    console.error("Journal creation error:", error);
    return {
      success: false,
      message: "Failed to create journal",
    };
  }
}

export async function deleteJournal(journalId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Verify the journal belongs to the user
    const journal = await prisma.journal.findFirst({
      where: {
        id: journalId,
        userId: session.user.id,
      },
    });

    if (!journal) {
      return { error: "Journal not found" };
    }

    await prisma.journal.delete({
      where: {
        id: journalId,
      },
    });

    revalidatePath("/dashboard/journals");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete journal" };
  }
}
