import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JournalActions } from "@/components/journals/journal-actions";
import prisma from "@/lib/db";
import Link from "next/link";
import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createSlug } from "@/lib/utils";

const JournalsPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const journals = await prisma.journal.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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

        <div className="rounded-lg border mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Win rate</TableHead>
                <TableHead>Cumm. profit</TableHead>
                <TableHead>Number of trades</TableHead>
                <TableHead>Last trade</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journals.map((journal) => (
                <TableRow key={journal.id}>
                  <TableCell>{journal.name}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-20"
                        asChild
                      >
                        <Link
                          href={`/dashboard/journals/${createSlug(
                            journal.name
                          )}`}
                        >
                          Open
                        </Link>
                      </Button>
                      <JournalActions
                        journalId={journal.id}
                        journalName={journal.name}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
