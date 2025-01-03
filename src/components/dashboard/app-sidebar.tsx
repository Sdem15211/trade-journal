import {
  BadgeCheck,
  BookOpen,
  CreditCard,
  Database,
  Home,
  LineChart,
  Sparkles,
} from "lucide-react";
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
import { SidebarCollapsibleItem } from "./sidebar-collapsible-item";
import { auth } from "@/lib/auth";
import { SidebarActiveLink } from "./sidebar-active-link";
import Link from "next/link";
import { SidebarMenuButton } from "../ui/sidebar";
import prisma from "@/lib/db";
import { createSlug } from "@/lib/utils";

export async function AppSidebar() {
  const session = await auth();

  if (!session?.user) return null;

  // Fetch user's journals
  const journals = await prisma.journal.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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

              <SidebarCollapsibleItem
                icon={<BookOpen />}
                label="Journals"
                items={journals}
                baseRoute="dashboard/journals"
              />

              <SidebarCollapsibleItem
                icon={<Database />}
                label="Backtesting"
                items={journals}
                baseRoute="dashboard/backtesting"
              />

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
