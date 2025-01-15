"use client";

import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "../ui/sidebar";
import Link from "next/link";
import { ReactNode } from "react";

interface SidebarActiveLinkProps {
  href: string;
  children: ReactNode;
  size?: "default" | "lg";
}

export function SidebarActiveLink({
  href,
  children,
  size,
}: SidebarActiveLinkProps) {
  const pathname = usePathname();

  // Exact match for dashboard homepage
  if (href === "/dashboard") {
    return (
      <SidebarMenuButton asChild size={size} isActive={pathname === href}>
        <Link href={href}>{children}</Link>
      </SidebarMenuButton>
    );
  }

  // For other routes, check if the current path starts with the href
  // This prevents partial matches in the middle of the path
  const isActive = pathname.startsWith(href);

  return (
    <SidebarMenuButton asChild size={size} isActive={isActive}>
      <Link href={href}>{children}</Link>
    </SidebarMenuButton>
  );
}
