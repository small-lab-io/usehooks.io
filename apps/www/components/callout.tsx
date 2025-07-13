import { cn } from "@workspace/ui/lib/utils";

export function Callout({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/50 p-4 rounded-r-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
