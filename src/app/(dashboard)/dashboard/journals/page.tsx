import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import React, { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JournalsTable } from "@/components/journals/journals-table";
import { JournalsTableSkeleton } from "@/components/journals/journals-table-skeleton";

const JournalsPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Journals</h1>
        </div>
      </div>

      <main>
        <h2 className="text-xl font-semibold mb-4 text-center">My journals</h2>

        <Suspense fallback={<JournalsTableSkeleton />}>
          <JournalsTable />
        </Suspense>

        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link href="/dashboard/journals/new" className="gap-2">
              Create new journal
              <span>+</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default JournalsPage;
