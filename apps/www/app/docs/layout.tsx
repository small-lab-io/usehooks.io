import { AppSidebar } from "@/components/app-sidebar";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

export default function DocsLayout({
  details,
  aside,
}: {
  details: React.ReactNode;
  aside: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-64px)] flex container mx-auto">
      <AppSidebar />
      <ScrollArea className="h-[calc(100vh-64px)]">
        <>{details}</>
      </ScrollArea>
      {aside}
    </div>
  );
}
