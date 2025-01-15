"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LiveJournal, Trade } from "@prisma/client";
import { LogTradeDialog } from "@/components/journals/log-trade-dialog";
import { useState } from "react";
import { JournalPLChart } from "./journal-pl-chart";
import { startOfWeek, endOfWeek, getISOWeek } from "date-fns";
import { TradeWeekGroup } from "./trade-week-group";
import { useStrategy } from "@/contexts/strategy-context";
import { BookOpen } from "lucide-react";

export function JournalDetail() {
  const { strategy, statistics, monthlyData } = useStrategy();
  const [chartPeriod, setChartPeriod] = useState<"monthly" | "weekly">(
    "monthly"
  );

  if (!strategy.liveJournal) {
    return null;
  }

  return (
    <div>
      <div className="grid md:grid-cols-[300px,1fr] gap-6">
        <div className="flex flex-col justify-between">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <div className="text-4xl text-center font-bold text-green-500 mt-2">
                {statistics.winRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Cumm. profit</div>
              <div className="text-4xl text-center font-bold text-green-500 mt-2">
                {statistics.cummProfit.toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Avg. return</div>
              <div className="text-4xl text-center font-bold text-green-500 mt-2">
                {statistics.avgReturn.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">P&L</h2>
              <Select
                value={chartPeriod}
                onValueChange={(value: "monthly" | "weekly") =>
                  setChartPeriod(value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <JournalPLChart
              trades={strategy.liveJournal.trades}
              period={chartPeriod}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-12 mb-4">
        <LogTradeDialog />
      </div>

      {strategy.liveJournal.trades.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No trades logged yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start logging your trades to track your performance
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          {(() => {
            const tradesByWeek = new Map<string, Trade[]>();

            strategy.liveJournal.trades.forEach((trade) => {
              const weekStart = startOfWeek(trade.openDate, {
                weekStartsOn: 1,
              });
              const weekKey = weekStart.toISOString();

              if (!tradesByWeek.has(weekKey)) {
                tradesByWeek.set(weekKey, []);
              }
              tradesByWeek.get(weekKey)?.push(trade);
            });

            const sortedWeeks = Array.from(tradesByWeek.entries()).sort(
              (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
            );

            return sortedWeeks.map(([weekKey, trades]) => {
              const weekStart = new Date(weekKey);
              const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
              const weekNumber = getISOWeek(weekStart);

              return (
                <TradeWeekGroup
                  key={weekKey}
                  weekNumber={weekNumber}
                  startDate={weekStart}
                  endDate={weekEnd}
                  strategy={strategy}
                />
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}
