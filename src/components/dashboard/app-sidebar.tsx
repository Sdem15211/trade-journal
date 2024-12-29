import { BookOpen, Database, Home, LineChart, Sparkles } from "lucide-react";
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
  SidebarMenuButton,
  SidebarRail,
} from "../ui/sidebar";
import { SidebarUserProfile } from "./sidebar-user-profile";
import { SidebarCollapsibleItem } from "./sidebar-collapsible-item";
import Link from "next/link";
import { auth } from "@/lib/auth";

const TEMP_JOURNAL_TYPES = ["Forex", "Crypto", "Stocks"];

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
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarCollapsibleItem
                icon={<BookOpen />}
                label="Journals"
                items={TEMP_JOURNAL_TYPES}
              />

              <SidebarCollapsibleItem
                icon={<Database />}
                label="Backtesting"
                items={TEMP_JOURNAL_TYPES}
              />

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/ai-insights">
                    <Sparkles />
                    <span>AI insights</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/upgrade">
                    <LineChart />
                    <span>Upgrade plan</span>
                  </Link>
                </SidebarMenuButton>
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
