import { Strategy } from "@prisma/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createSlug } from "@/lib/utils";
import { StrategyActions } from "./strategy-actions";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function StrategiesGrid() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const strategies = await prisma.strategy.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (strategies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No strategies yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first trading strategy to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {strategies.map((strategy) => (
        <Card key={strategy.id} className="group relative">
          <Link href={`/dashboard/strategies/${createSlug(strategy.name)}`}>
            <CardHeader>
              <CardTitle className="text-xl">{strategy.name}</CardTitle>
            </CardHeader>
          </Link>
          <div className="absolute top-3 right-3">
            <StrategyActions strategy={strategy} />
          </div>
        </Card>
      ))}
    </div>
  );
}
