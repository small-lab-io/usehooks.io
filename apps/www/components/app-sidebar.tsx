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
  description: string;
  category: string;
};

const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
  ],
};

export async function AppSidebar() {
  const hooks = await getHooks();

  // Check if we have data but it's not an array
  if (!Array.isArray(hooks)) {
    console.log("Data is not an array:", hooks);
    return (
      <Sidebar variant="floating" collapsible="none">
        <SidebarHeader />
        <SidebarGroup>
          <SidebarContent className="sticky top-16">
            <SidebarGroupLabel>Hooks</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-4 text-sm text-yellow-600">
                Data loaded but not in expected format. Check console.
              </div>
            </SidebarGroupContent>
          </SidebarContent>
        </SidebarGroup>
      </Sidebar>
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
      <Sidebar variant="floating" collapsible="none">
        <SidebarHeader />
        <SidebarGroup>
          <SidebarContent className="sticky top-16">
            <SidebarGroupLabel>Hooks</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-4 text-sm text-gray-500">
                No hooks found in any category.
              </div>
            </SidebarGroupContent>
          </SidebarContent>
        </SidebarGroup>
      </Sidebar>
    );
  }

  return (
    <div className="sticky top-16">
      <ScrollArea>
        <Sidebar
          variant="floating"
          collapsible="none"
          className="bg-transparent"
        >
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu className="gap-2">
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="font-medium">
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Hooks ({hooks.length})</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Object.entries(hooksByCategory).map(
                    ([category, categoryHooks]) => (
                      <div key={category} className="mt-4">
                        <h3 className="text-lg font-medium text-gray-500 capitalize">
                          {category} ({categoryHooks.length})
                        </h3>
                        {categoryHooks.map((hook) => (
                          <Link
                            key={hook.name}
                            href={`/docs/${hook.name.toLowerCase()}`}
                            className="block py-2 text-sm text-gray-600 hover:underline"
                          >
                            {hook.name}
                          </Link>
                        ))}
                      </div>
                    )
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </ScrollArea>
    </div>
  );
}
