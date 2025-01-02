"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const FieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  type: z.enum(["TEXT", "SELECT", "MULTI_SELECT", "RADIO"]),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const CreateJournalSchema = z.object({
  name: z.string().min(1, "Journal name is required"),
  description: z.string().optional(),
  fields: z.array(FieldSchema),
});

export type CreateJournalInput = z.infer<typeof CreateJournalSchema>;

export async function createJournal(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Parse form data
    const input = {
      name: formData.get("name"),
      description: formData.get("description"),
      fields: JSON.parse(formData.get("fields") as string),
    };

    // Validate input
    const validatedData = CreateJournalSchema.parse(input);

    await prisma.journal.create({
      data: {
        name: validatedData.name,
        description: validatedData.description ?? null,
        userId: session.user.id!,
        fields: {
          create: validatedData.fields.map((field, index) => ({
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

    revalidatePath("/dashboard/journals");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors };
    }
    return { error: "Failed to create journal" };
  }
}
