import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { JournalDetail } from "@/components/journals/journal-detail";
import { createSlug } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function JournalPage({
  params,
}: {
  params: { name: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }
  const name = (await params).name;

  const journals = await prisma.journal.findMany({
    where: {
      userId: session.user.id,
    },
  });

  // Find the journal by matching the slug
  const journal = journals.find((journal) => createSlug(journal.name) === name);

  if (!journal) {
    notFound();
  }

  // Fetch full journal data with fields and trades
  const journalData = await prisma.journal.findUnique({
    where: {
      id: journal.id,
    },
    include: {
      fields: {
        orderBy: {
          order: "asc",
        },
      },
      trades: {
        orderBy: {
          openDate: "desc",
        },
      },
    },
  });

  if (!journalData) {
    notFound();
  }

  // Calculate statistics
  const trades = journalData.trades;
  const winningTrades = trades.filter((trade) => trade.result === "WIN");
  const winRate =
    trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
  const cummProfit = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const avgReturn = trades.length > 0 ? cummProfit / trades.length : 0;

  // Group trades by month for the chart
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(new Date().getFullYear(), i);
    const monthTrades = trades.filter(
      (trade) =>
        trade.openDate.getMonth() === month.getMonth() &&
        trade.openDate.getFullYear() === month.getFullYear()
    );
    const monthlyPnL = monthTrades.reduce((sum, trade) => sum + trade.pnl, 0);

    return {
      month: month.toLocaleString("default", { month: "short" }),
      value: Number(monthlyPnL.toFixed(2)),
    };
  });

  return (
    <JournalDetail
      journal={journalData}
      statistics={{
        winRate,
        cummProfit,
        avgReturn,
      }}
      monthlyData={monthlyData}
    />
  );
}
