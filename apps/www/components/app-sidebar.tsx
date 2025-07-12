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

type HookMeta = {
  name: string;
  title: string;
  description: string;
  category: string;
};

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

export async function AppSidebar() {
  const hooks = await getHooks();

  // Check if we have data but it's not an array
  if (!Array.isArray(hooks)) {
    console.log("Data is not an array:", hooks);
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

  // Process the hooks data
  const hooksByCategory = hooks.reduce(
    (acc: Record<string, HookMeta[]>, hook: HookMeta) => {
      if (!acc[hook.category]) {
        acc[hook.category] = [];
      }
      acc[hook.category]?.push(hook);
      return acc;
    },
    {}
  );

  // Check if we have no categories
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
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="font-medium">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroupLabel>Hooks</SidebarGroupLabel>
        <SidebarGroup>
          <SidebarMenu className="gap-0">
            {Object.entries(hooksByCategory).map(
              ([category, categoryHooks]) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton asChild>
                    <span className="font-medium capitalize">{category}</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {categoryHooks.map((hook) => (
                      <SidebarMenuSubItem key={hook.name}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            key={hook.name}
                            href={`/docs/${hook.name.toLowerCase()}`}
                            className="block py-2 text-sm text-gray-600 hover:underline"
                          >
                            {hook.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
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
