"use client";

import { createContext, useContext } from "react";
import type {
  Strategy,
  LiveJournal,
  Trade,
  StrategyField,
} from "@prisma/client";

interface StrategyContextType {
  strategy: Strategy & {
    fields: StrategyField[];
    liveJournal?: LiveJournal & {
      trades: Trade[];
    };
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

const StrategyContext = createContext<StrategyContextType | null>(null);

export function StrategyProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: StrategyContextType;
}) {
  return (
    <StrategyContext.Provider value={value}>
      {children}
    </StrategyContext.Provider>
  );
}

export function useStrategy() {
  const context = useContext(StrategyContext);
  if (!context) {
    throw new Error("useStrategy must be used within a StrategyProvider");
  }
  return context;
}
