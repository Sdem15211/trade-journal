"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const TradeSchema = z.object({
  journalId: z.string(),
  pair: z.string().min(1, "Pair is required"),
  openDate: z.date(),
  closeDate: z.date(),
  result: z.enum(["WIN", "LOSS", "BREAKEVEN"]),
  pnl: z.number(),
  notes: z.string().optional(),
  fields: z.record(z.union([z.string(), z.array(z.string())])),
});

export type CreateTradeInput = z.infer<typeof TradeSchema>;

export async function createTrade(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Process custom fields
    const customFields: Record<string, string | string[]> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("fields.")) {
        const fieldName = key.replace("fields.", "");
        customFields[fieldName] = value as string;
      }
    }

    // Parse form data
    const input = {
      journalId: formData.get("journalId") as string,
      pair: formData.get("pair") as string,
      openDate: new Date(formData.get("openDate") as string),
      closeDate: new Date(formData.get("closeDate") as string),
      result: formData.get("result") as "WIN" | "LOSS" | "BREAKEVEN",
      pnl: Number(formData.get("pnl")),
      notes: formData.get("notes") as string,
      fields: customFields,
    };

    // Validate input
    const validatedData = TradeSchema.safeParse(input);

    if (!validatedData.success) {
      return {
        error: validatedData.error.flatten().fieldErrors,
      };
    }

    // Verify journal belongs to user
    const journal = await prisma.journal.findFirst({
      where: {
        id: input.journalId,
        userId: session.user.id,
      },
    });

    if (!journal) {
      return { error: "Journal not found" };
    }

    await prisma.trade.create({
      data: {
        journalId: input.journalId,
        pair: input.pair,
        openDate: input.openDate,
        closeDate: input.closeDate,
        result: input.result,
        pnl: input.pnl,
        notes: input.notes,
        fields: input.fields,
      },
    });

    revalidatePath(`/dashboard/journals/${journal.name}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to create trade" };
  }
}
