"use client";

import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "../ui/sidebar";
import Link from "next/link";
import { ReactNode } from "react";

interface SidebarActiveLinkProps {
  href: string;
  children: ReactNode;
  isCollapsible?: boolean;
  size?: "default" | "lg";
}

export function SidebarActiveLink({
  href,
  children,
  isCollapsible,
  size,
}: SidebarActiveLinkProps) {
  const pathname = usePathname();
  const isActive = isCollapsible ? pathname.includes(href) : pathname === href;

  return (
    <SidebarMenuButton asChild size={size} isActive={isActive}>
      <Link href={href}>{children}</Link>
    </SidebarMenuButton>
  );
}
