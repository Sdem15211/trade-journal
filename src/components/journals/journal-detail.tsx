"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Journal, JournalField, Trade } from "@prisma/client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogTradeDialog } from "@/components/journals/log-trade-dialog";
import { Badge } from "@/components/ui/badge";
import { TradeActions } from "@/components/journals/trade-actions";
import { JournalActions } from "./journal-actions";
import { useState } from "react";
import { JournalPLChart } from "./journal-pl-chart";
import { startOfWeek, endOfWeek, getISOWeek } from "date-fns";
import { TradeWeekGroup } from "./trade-week-group";

interface JournalDetailProps {
  journal: Journal & {
    fields: JournalField[];
    trades: Trade[];
  };
  statistics: {
    winRate: number;
    cummProfit: number;
    avgReturn: number;
  };
  monthlyData: Array<{
    month: string;
    value: number;
  }>;
}

export function JournalDetail({ journal, statistics }: JournalDetailProps) {
  const [chartPeriod, setChartPeriod] = useState<"monthly" | "weekly">(
    "monthly"
  );

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger />
        <Breadcrumbs
          items={[
            { label: "Journals", href: "/dashboard/journals" },
            { label: journal.name },
          ]}
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{journal.name}</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <JournalActions isDetail={true} journal={journal} />
        </div>
      </div>

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
            <JournalPLChart trades={journal.trades} period={chartPeriod} />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end items-center mt-12 mb-4">
        <LogTradeDialog journal={journal} />
      </div>

      <div>
        {(() => {
          // Group trades by week
          const tradesByWeek = new Map<string, Trade[]>();

          journal.trades.forEach((trade) => {
            const weekStart = startOfWeek(trade.openDate, {
              weekStartsOn: 1,
            });
            const weekKey = weekStart.toISOString();

            if (!tradesByWeek.has(weekKey)) {
              tradesByWeek.set(weekKey, []);
            }
            tradesByWeek.get(weekKey)?.push(trade);
          });

          // Sort weeks by date (most recent first)
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
                trades={trades}
                journal={journal}
              />
            );
          });
        })()}
      </div>
    </div>
  );
}
