"use client";

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
import { useSession } from "next-auth/react";

const TEMP_JOURNAL_TYPES = ["Forex", "Crypto", "Stocks"];

export function AppSidebar() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path d="M4 4h16v16H4V4z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-lg font-semibold">Trade</span>
        </div>
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
