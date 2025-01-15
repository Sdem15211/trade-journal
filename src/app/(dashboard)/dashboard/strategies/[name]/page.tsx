import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, LineChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import prisma from "@/lib/db";
import { createSlug } from "@/lib/utils";
import { JournalDetail } from "@/components/journals/journal-detail";
import { StrategyProvider } from "@/contexts/strategy-context";

export default async function StrategyPage({
  params,
}: {
  params: { name: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const name = (await params).name;

  const strategies = await prisma.strategy.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const strategy = strategies.find(
    (strategy) => createSlug(strategy.name) === name
  );

  if (!strategy) {
    notFound();
  }

  const strategyData = await prisma.strategy.findUnique({
    where: {
      id: strategy.id,
    },
    include: {
      fields: true,
      liveJournal: {
        include: {
          trades: true,
        },
      },
      backtests: {
        include: {
          trades: true,
        },
      },
    },
  });

  if (!strategyData) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Strategies", href: "/dashboard/strategies" },
    { label: strategy.name },
  ];

  // Calculate statistics
  const trades = strategyData.liveJournal?.trades || [];
  const winningTrades = trades.filter((trade) => trade.result === "WIN");
  const losingTrades = trades.filter((trade) => trade.result === "LOSS");
  const totalTradesExcludingBreakeven =
    winningTrades.length + losingTrades.length;
  const winRate =
    totalTradesExcludingBreakeven > 0
      ? (winningTrades.length / totalTradesExcludingBreakeven) * 100
      : 0;
  const cummProfit = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const avgReturn = trades.length > 0 ? cummProfit / trades.length : 0;

  // Calculate monthly data for the chart
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(new Date().getFullYear(), i);
    const monthTrades = trades.filter(
      (trade) =>
        trade.openDate.getMonth() === month.getMonth() &&
        trade.openDate.getFullYear() === month.getFullYear()
    );
    const monthlyPnL = monthTrades.reduce(
      (sum, trade) => sum + (trade.pnl || 0),
      0
    );

    return {
      month: month.toLocaleString("default", { month: "short" }),
      value: Number(monthlyPnL.toFixed(2)),
    };
  });

  return (
    <StrategyProvider
      value={{
        strategy: strategyData,
        statistics: {
          winRate,
          cummProfit,
          avgReturn,
        },
        monthlyData,
      }}
    >
      <div className="p-8 space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <Tabs defaultValue="journal">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{strategy.name}</h1>
              <div className="w-[300px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="journal">Journal</TabsTrigger>
                  <TabsTrigger value="backtest">Backtest</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="mt-6">
              <TabsContent value="journal">
                <JournalDetail />
              </TabsContent>

              <TabsContent value="backtest">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5" />
                      <CardTitle>Backtest Results</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Backtest results will be implemented here
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5" />
                      <CardTitle>Strategy Insights</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Strategy insights will be implemented here
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </StrategyProvider>
  );
}
