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

export function JournalDetail({
  journal,
  statistics,
  monthlyData,
}: JournalDetailProps) {
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

      <div className="flex justify-end items-center mt-16 mb-4">
        <LogTradeDialog journal={journal} />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap px-8 min-w-[120px]">
                    Pair
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-8 min-w-[180px]">
                    Date
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-8 min-w-[100px]">
                    Result
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-8 min-w-[100px]">
                    P&L
                  </TableHead>
                  {journal.fields.map((field) => (
                    <TableHead
                      key={field.id}
                      className="whitespace-nowrap px-8 min-w-[180px]"
                    >
                      {field.name}
                    </TableHead>
                  ))}
                  <TableHead className="whitespace-nowrap px-8 min-w-[250px]">
                    Notes
                  </TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journal.trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="font-bold whitespace-nowrap px-8 min-w-[120px]">
                      {trade.pair}
                    </TableCell>
                    <TableCell className="text-xs font-medium whitespace-nowrap px-8 min-w-[180px]">
                      <div>open: {formatDate(trade.openDate)}</div>
                      <div>close: {formatDate(trade.closeDate)}</div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-8 min-w-[100px]">
                      <span
                        className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-bold ${
                          trade.result === "WIN"
                            ? "bg-green-200 text-green-900"
                            : trade.result === "LOSS"
                            ? "bg-red-200 text-red-900"
                            : "bg-slate-200 text-slate-900"
                        }`}
                      >
                        {trade.result === "BREAKEVEN"
                          ? "BE"
                          : trade.result === "LOSS"
                          ? "Loss"
                          : "Win"}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap px-8 min-w-[100px]">
                      <span
                        className={
                          trade.pnl > 0
                            ? "text-green-700"
                            : trade.pnl < 0
                            ? "text-red-700"
                            : ""
                        }
                      >
                        {trade.pnl}%
                      </span>
                    </TableCell>
                    {journal.fields.map((field) => (
                      <TableCell
                        key={field.id}
                        className="font-medium px-8 min-w-[180px] whitespace-nowrap"
                      >
                        {field.type === "MULTI_SELECT" ? (
                          <div className="flex gap-1 items-center">
                            {(() => {
                              const fieldValue =
                                typeof trade.fields === "string"
                                  ? JSON.parse(trade.fields)[field.name]
                                  : trade.fields[field.name];

                              const values = Array.isArray(fieldValue)
                                ? fieldValue
                                : typeof fieldValue === "string"
                                ? fieldValue.split(",")
                                : [];

                              return values.filter(Boolean).map((value, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-xs whitespace-nowrap"
                                >
                                  {value.trim()}
                                </Badge>
                              ));
                            })()}
                          </div>
                        ) : typeof trade.fields === "string" ? (
                          JSON.parse(trade.fields)[field.name]
                        ) : (
                          trade.fields[field.name]
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="px-8 min-w-[250px]">
                      {trade.notes}
                    </TableCell>
                    <TableCell>
                      <TradeActions
                        journalId={journal.id}
                        trade={trade}
                        journal={journal}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
