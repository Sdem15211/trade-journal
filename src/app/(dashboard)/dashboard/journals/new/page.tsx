import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JournalForm } from "@/components/journals/journal-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function NewJournalPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Journals", href: "/dashboard/journals" },
    { label: "Create New Journal" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <h1 className="text-2xl font-bold">Create New Journal</h1>
        </div>
      </div>
      <JournalForm />
    </div>
  );
}
