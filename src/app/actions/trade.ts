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

export interface TradeActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof CreateTradeInput]?: string[];
  };
}

export async function createTrade(
  prevState: TradeActionResponse | null,
  formData: FormData
): Promise<TradeActionResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    // Process custom fields
    const customFields: Record<string, string | string[]> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("fields.")) {
        const fieldName = key.replace("fields.", "");
        try {
          const parsedValue = JSON.parse(value as string);
          if (Array.isArray(parsedValue)) {
            customFields[fieldName] = parsedValue;
          } else {
            customFields[fieldName] = value as string;
          }
        } catch {
          customFields[fieldName] = value as string;
        }
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
        success: false,
        message: "Please fix the errors in the input fields",
        errors: validatedData.error.flatten().fieldErrors,
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
      return { success: false, message: "Journal not found" };
    }

    await prisma.trade.create({
      data: {
        journalId: validatedData.data.journalId,
        pair: validatedData.data.pair,
        openDate: validatedData.data.openDate,
        closeDate: validatedData.data.closeDate,
        result: validatedData.data.result,
        pnl: validatedData.data.pnl,
        notes: validatedData.data.notes,
        fields: validatedData.data.fields,
      },
    });

    revalidatePath(`/dashboard/journals/${journal.name}`);
    return { success: true, message: "Trade logged successfully" };
  } catch (error) {
    console.error("Trade creation error:", error);
    return { success: false, message: "Failed to create trade" };
  }
}

export async function deleteTrade(tradeId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Verify the trade belongs to the user
    const trade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        journal: {
          userId: session.user.id,
        },
      },
    });

    if (!trade) {
      return { error: "Trade not found" };
    }

    await prisma.trade.delete({
      where: {
        id: tradeId,
      },
    });

    revalidatePath("/dashboard/journals/[name]");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete trade" };
  }
}

export async function updateTrade(
  prevState: TradeActionResponse | null,
  formData: FormData
): Promise<TradeActionResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const tradeId = formData.get("tradeId") as string;

    // Process custom fields
    const customFields: Record<string, string | string[]> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("fields.")) {
        const fieldName = key.replace("fields.", "");
        try {
          const parsedValue = JSON.parse(value as string);
          if (Array.isArray(parsedValue)) {
            customFields[fieldName] = parsedValue;
          } else {
            customFields[fieldName] = value as string;
          }
        } catch {
          customFields[fieldName] = value as string;
        }
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
        success: false,
        message: "Please fix the errors in the input fields",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    // Verify trade belongs to user
    const trade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        journal: {
          userId: session.user.id,
        },
      },
    });

    if (!trade) {
      return { success: false, message: "Trade not found" };
    }

    await prisma.trade.update({
      where: { id: tradeId },
      data: {
        pair: validatedData.data.pair,
        openDate: validatedData.data.openDate,
        closeDate: validatedData.data.closeDate,
        result: validatedData.data.result,
        pnl: validatedData.data.pnl,
        notes: validatedData.data.notes,
        fields: validatedData.data.fields,
      },
    });

    revalidatePath("/dashboard/journals/[name]");
    return { success: true, message: "Trade updated successfully" };
  } catch (error) {
    console.error("Trade update error:", error);
    return { success: false, message: "Failed to update trade" };
  }
}
