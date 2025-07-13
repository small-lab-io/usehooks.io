import { cn } from "@workspace/ui/lib/utils";

export function Terminal({
  children,
  className,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <pre
      className={cn(
        "bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono",
        className
      )}
      {...props}
    >
      <code>{children}</code>
    </pre>
  );
}
