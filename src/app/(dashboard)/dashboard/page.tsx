import LogoutButton from "@/components/auth/logout-button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        <LogoutButton />
      </div>
      <div>Welcome back, {session.user.name || session.user.email}!</div>
    </div>
  );
}
