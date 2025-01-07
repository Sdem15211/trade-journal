"use client";

import { Trade, Journal, JournalField } from "@prisma/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TradeActions } from "./trade-actions";
import { format } from "date-fns";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface TradeWeekGroupProps {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  trades: Trade[];
  journal: Journal & {
    fields: JournalField[];
  };
}

export function TradeWeekGroup({
  weekNumber,
  startDate,
  endDate,
  trades,
  journal,
}: TradeWeekGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const formattedDateRange = `${format(startDate, "dd/MM/yy")}-${format(
    endDate,
    "dd/MM/yy"
  )}`;

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors duration-200 rounded-[var(--radius)]">
            <div className="flex items-center gap-2">
              <ChevronRight
                className={`h-5 w-5 transition-transform duration-200 text-muted-foreground ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  W{weekNumber}
                </span>
                <span className="mx-1">-</span>
                <span className="text-xs">{formattedDateRange}</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-[120px]">
              <span className="text-xs text-muted-foreground">
                {trades.length} trade{trades.length !== 1 ? "s" : ""}
              </span>
              <span
                className={`text-sm font-semibold ${
                  totalPnL > 0
                    ? "text-green-600"
                    : totalPnL < 0
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                {totalPnL > 0 ? "+" : ""}
                {totalPnL.toFixed(2)}%
              </span>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="pt-0">
            {trades.length > 0 ? (
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
                  {trades.map((trade) => (
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
                          className="font-medium px-8 min-w-[180px] max-w-[180px] whitespace-normal"
                        >
                          {field.type === "MULTI_SELECT" ? (
                            <div className="flex flex-wrap gap-1 items-center">
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

                                return values
                                  .filter(Boolean)
                                  .map((value, i) => (
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
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No trades for this week
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
