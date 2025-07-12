import { AppSidebar } from "@/components/app-sidebar";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { SidebarProvider } from "@workspace/ui/components/sidebar";

export default function DocsLayout({
  details,
  aside,
}: {
  details: React.ReactNode;
  aside: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-64px)] flex">
      <ScrollArea className="flex-1">
        <SidebarProvider>
          <div className="container mx-auto pb-20 flex space-x-2">
            <AppSidebar />
            {details}
          </div>
        </SidebarProvider>
      </ScrollArea>
    </div>
  );
}
