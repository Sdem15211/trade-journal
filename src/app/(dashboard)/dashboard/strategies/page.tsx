import { StrategiesGrid } from "@/components/strategies/strategies-grid";
import { StrategiesGridSkeleton } from "@/components/strategies/strategies-grid-skeleton";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function StrategiesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Trading Strategies</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/strategies/new" className="gap-2">
            <PlusIcon className="h-4 w-4" />
            New Strategy
          </Link>
        </Button>
      </div>

      <Suspense fallback={<StrategiesGridSkeleton />}>
        <StrategiesGrid />
      </Suspense>
    </div>
  );
}
