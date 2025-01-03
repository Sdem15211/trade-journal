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
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      fields: JSON.parse(formData.get("fields") as string),
    };

    // Validate input
    const validatedData = CreateJournalSchema.safeParse(input);

    if (!validatedData.success) {
      return {
        error: validatedData.error.flatten().fieldErrors,
      };
    }

    await prisma.journal.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        userId: session.user.id!,
        fields: {
          create: input.fields.map((field, index) => ({
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

    // Handle Prisma unique constraint error
    if (
      error instanceof Error &&
      error.message.includes(
        "Unique constraint failed on the fields: (`name`,`userId`)"
      )
    ) {
      return { error: "You already have a journal with this name" };
    }

    return { error: "Failed to create journal" };
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
