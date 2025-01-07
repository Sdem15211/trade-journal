"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Trade } from "@prisma/client";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  subWeeks,
  getISOWeek,
  addWeeks,
  getYear,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ChartData {
  label: string;
  value: number;
  isCurrentWeek?: boolean;
}

interface JournalPLChartProps {
  trades: Trade[];
  period: "monthly" | "weekly";
}

export function JournalPLChart({ trades, period }: JournalPLChartProps) {
  // Track the end date of the visible range
  const [weekEndDate, setWeekEndDate] = useState(() => {
    // Always use current week's end as the default end date
    return endOfWeek(new Date(), { weekStartsOn: 1 });
  });

  // Add state for selected year in monthly view
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear()
  );

  // Check if we're viewing the current period
  const isCurrentPeriod =
    endOfWeek(weekEndDate, { weekStartsOn: 1 }).getTime() ===
    endOfWeek(new Date(), { weekStartsOn: 1 }).getTime();

  const data =
    period === "monthly"
      ? getMonthlyData(trades, selectedYear)
      : getWeeklyData(trades, weekEndDate);

  const values = data.map((d) => d.value);
  const minPL = Math.min(...values, 0);
  const maxPL = Math.max(...values, 0);

  const standardTicks =
    period === "monthly"
      ? [-5, 0, 5, 10, 15, 20, 25]
      : [-5, -2.5, 0, 2.5, 5, 7.5, 10];

  const yDomain = [
    Math.min(standardTicks[0], Math.floor(minPL)),
    Math.max(standardTicks[standardTicks.length - 1], Math.ceil(maxPL)),
  ];

  // Get the week numbers and years for display
  const startDate = subWeeks(weekEndDate, 11);
  const startWeekNumber = getISOWeek(startDate);
  const endWeekNumber = getISOWeek(weekEndDate);
  const startYear = getYear(startDate);
  const endYear = getYear(weekEndDate);

  // Format the date range display
  const getDateRangeText = () => {
    if (startYear === endYear) {
      return `Weeks ${startWeekNumber} - ${endWeekNumber}, ${endYear}`;
    }
    return `Week ${startWeekNumber}, ${startYear} - Week ${endWeekNumber}, ${endYear}`;
  };

  const handleNavigateWeeks = (direction: "forward" | "back") => {
    setWeekEndDate((current) => {
      return direction === "forward"
        ? addWeeks(current, 12)
        : subWeeks(current, 12);
    });
  };

  const handleNavigateYear = (direction: "forward" | "back") => {
    setSelectedYear((current) => current + (direction === "forward" ? 1 : -1));
  };

  return (
    <div>
      {period === "monthly" ? (
        <div className="flex items-center gap-2 w-full justify-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigateYear("back")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{selectedYear}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigateYear("forward")}
            disabled={selectedYear === new Date().getFullYear()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1 w-full justify-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigateWeeks("back")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {getDateRangeText()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigateWeeks("forward")}
            disabled={isCurrentPeriod}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      <ChartContainer
        config={{
          pl: {
            label: "P&L",
            color: "hsl(var(--primary))",
          },
        }}
        className="h-[200px] w-full"
      >
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid
            horizontal={true}
            vertical={false}
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            className="opacity-50"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
            className="text-muted-foreground text-xs"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
            domain={yDomain}
            tickFormatter={(value) => `${value}%`}
            className="text-muted-foreground text-xs"
            ticks={standardTicks}
            interval={0} // Force display all ticks
          />
          <Bar
            dataKey="value"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            className="fill-primary"
          />
          <ChartTooltip
            cursor={false}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const value = payload[0].value as number;
              return (
                <div className="rounded-lg bg-popover/95 p-2 shadow-md border text-xs">
                  {value > 0 ? "+" : ""}
                  {value.toFixed(2)}%
                </div>
              );
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function getMonthlyData(trades: Trade[], year: number): ChartData[] {
  const monthlyData = new Array(12).fill(null).map((_, i) => {
    const month = new Date(year, i);
    const monthTrades = trades.filter(
      (trade) =>
        trade.openDate.getMonth() === month.getMonth() &&
        trade.openDate.getFullYear() === year
    );
    const monthlyPL = monthTrades.reduce((sum, trade) => sum + trade.pnl, 0);

    return {
      label: format(month, "MMM"),
      value: Number(monthlyPL.toFixed(2)),
    };
  });

  return monthlyData;
}

function getWeeklyData(trades: Trade[], endDate: Date): ChartData[] {
  const startDate = subWeeks(endDate, 11);
  const weeks = eachWeekOfInterval({
    start: startDate,
    end: endDate,
  });

  // Current week is always the last week
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  return weeks.map((week) => {
    const weekStart = startOfWeek(week, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
    const weekNumber = getISOWeek(week);

    // Compare actual dates for current week detection
    const isCurrentWeek = weekEnd.getTime() === currentWeekEnd.getTime();

    const weekTrades = trades.filter(
      (trade) => trade.openDate >= weekStart && trade.openDate <= weekEnd
    );

    const weeklyPL = weekTrades.reduce((sum, trade) => sum + trade.pnl, 0);

    return {
      label: `W${weekNumber}${isCurrentWeek ? "*" : ""}`,
      value: Number(weeklyPL.toFixed(2)),
    };
  });
}
