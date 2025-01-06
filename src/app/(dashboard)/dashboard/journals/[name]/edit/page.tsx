import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { ModifyJournalForm } from "@/components/journals/modify-journal-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import prisma from "@/lib/db";
import { createSlug } from "@/lib/utils";

export default async function EditJournalPage({
  params,
}: {
  params: { name: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const name = (await params).name;

  const journals = await prisma.journal.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      fields: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  const journal = journals.find((journal) => createSlug(journal.name) === name);

  if (!journal) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Journals", href: "/dashboard/journals" },
    { label: journal.name, href: `/dashboard/journals/${params.name}` },
    { label: "Edit Journal" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <h1 className="text-2xl font-bold">Edit Journal</h1>
        </div>
      </div>
      <ModifyJournalForm journal={journal} />
    </div>
  );
}
