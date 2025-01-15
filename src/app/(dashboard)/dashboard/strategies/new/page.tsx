import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StrategyForm } from "@/components/strategies/strategy-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function NewStrategyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Strategies", href: "/dashboard/strategies" },
    { label: "Create New Strategy" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <h1 className="text-2xl font-bold">Create New Strategy</h1>
        </div>
      </div>
      <StrategyForm />
    </div>
  );
}
