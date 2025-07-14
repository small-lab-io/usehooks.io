"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getHooks } from "@/lib/get-hooks";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { getHooksByCategory } from "@/lib/get-hooks-by-category";
import { HookMeta } from "@/lib/types";

const navMain = [
  {
    title: "Introduction",
    url: "/docs/introduction",
  },
  {
    title: "CLI",
    url: "/docs/cli",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [hooks, setHooks] = useState<HookMeta[]>([]);
  const hooksByCategory = getHooksByCategory(hooks);

  useEffect(() => {
    async function fetchHooks() {
      try {
        const hooksData = await getHooks();
        setHooks(hooksData);
      } catch (error) {
        console.error("Error fetching hooks:", error);
      }
    }
    fetchHooks();
  }, []);

  if (!Array.isArray(hooks)) {
    return (
      <div className="sticky top-16">
        <ScrollArea className="scrollbar-hide">
          <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader />
            <SidebarGroup>
              <SidebarContent>
                <SidebarGroupLabel>Hooks</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="p-4 text-sm text-yellow-600">
                    Data loaded but not in expected format. Check console.
                  </div>
                </SidebarGroupContent>
              </SidebarContent>
            </SidebarGroup>
          </Sidebar>
        </ScrollArea>
      </div>
    );
  }

  if (Object.keys(hooksByCategory).length === 0) {
    return (
      <div className="sticky top-16">
        <ScrollArea>
          <Sidebar variant="floating" collapsible="none">
            <SidebarHeader />
            <SidebarGroup>
              <SidebarContent>
                <SidebarGroupLabel>Hooks</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="p-4 text-sm text-gray-500">
                    No hooks found in any category.
                  </div>
                </SidebarGroupContent>
              </SidebarContent>
            </SidebarGroup>
          </Sidebar>
        </ScrollArea>
      </div>
    );
  }

  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="sticky top-16 h-[calc(100vh-4rem)] bg-none !border-r-0"
    >
      <SidebarContent className="gap-0 bg-none">
        <SidebarGroupLabel>Get Started</SidebarGroupLabel>
        <SidebarGroup>
          <SidebarMenu className="gap-0">
            {navMain.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link
                      href={item.url}
                      className={cn(
                        "font-medium",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroupLabel>Hooks</SidebarGroupLabel>
        <SidebarGroup>
          <SidebarMenu className="gap-0">
            {Object.entries(hooksByCategory).map(
              ([category, categoryHooks]) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton asChild>
                    <Link href={`/docs/category/${category}`}>
                      <span className="font-medium capitalize">{category}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {categoryHooks.map((hook) => {
                      const hookPath = `/docs/${hook.name.toLowerCase()}`;
                      const isActive = pathname === hookPath;
                      return (
                        <SidebarMenuSubItem key={hook.name}>
                          <SidebarMenuSubButton asChild isActive={isActive}>
                            <Link
                              href={hookPath}
                              className={cn(
                                "block py-2 text-sm text-gray-600 hover:underline",
                                isActive &&
                                  "bg-accent text-accent-foreground font-medium"
                              )}
                            >
                              {hook.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
