import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import prisma from "@/lib/db";
import Link from "next/link";
import React from "react";

const JournalsPage = async () => {
  const journals = await prisma.journal.findMany();
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Journals</h1>
          <Button>
            <Link href="/dashboard/journals/new">Create New Journal</Link>
          </Button>
        </div>
        <div>
          {journals.map((journal) => (
            <div key={journal.id}>{journal.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalsPage;
