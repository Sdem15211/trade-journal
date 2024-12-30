"use client";

import { ChevronRight } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarCollapsibleItemProps {
  icon: ReactNode;
  label: string;
  items: string[];
  baseRoute: string;
}

export function SidebarCollapsibleItem({
  icon,
  label,
  items,
  baseRoute,
}: SidebarCollapsibleItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.includes(`/${baseRoute}`);
  const [isOpen, setIsOpen] = useState(isActive);

  // Synchronize open state with active state
  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

  return (
    <Collapsible
      className="group/collapsible"
      asChild
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={label}
            onClick={() => router.push(`/${baseRoute}`)}
            isActive={isActive}
          >
            {icon}
            <span>{label}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => {
              const itemPath = `/${baseRoute}/${item.toLowerCase()}`;
              return (
                <SidebarMenuSubItem key={item}>
                  <SidebarMenuButton asChild isActive={pathname === itemPath}>
                    <Link href={itemPath}>
                      <span>{item}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
