import { AppSidebar } from "@/components/app-sidebar";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { SidebarProvider } from "@workspace/ui/components/sidebar";

export default function DocsLayout({ details }: { details: React.ReactNode }) {
  return (
    <div className="h-[calc(100vh-64px)] flex">
      <ScrollArea className="flex-1">
        <div className="container mx-auto ">
          <SidebarProvider>
            <AppSidebar />
            <div className="container mx-auto py-12 px-4">{details}</div>
          </SidebarProvider>
        </div>
      </ScrollArea>
    </div>
  );
}
