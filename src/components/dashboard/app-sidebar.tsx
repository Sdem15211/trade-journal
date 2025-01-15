import { Database, Home, LineChart, Sparkles, Target } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";
import { SidebarUserProfile } from "./sidebar-user-profile";
import { auth } from "@/lib/auth";
import { SidebarActiveLink } from "./sidebar-active-link";
import Link from "next/link";
import { SidebarMenuButton } from "../ui/sidebar";

export async function AppSidebar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Database className="size-4" />
                </div>
                <span className="font-semibold">Trade</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarActiveLink href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </SidebarActiveLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarActiveLink href="/dashboard/strategies">
                  <Target />
                  <span>Trading Strategies</span>
                </SidebarActiveLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarActiveLink href="/dashboard/ai-insights">
                  <Sparkles />
                  <span>AI insights</span>
                </SidebarActiveLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarActiveLink href="/dashboard/upgrade">
                  <LineChart />
                  <span>Upgrade plan</span>
                </SidebarActiveLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarUserProfile user={session.user} />
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
