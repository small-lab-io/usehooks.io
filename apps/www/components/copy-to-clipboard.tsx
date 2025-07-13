"use client";

import { useClipboard } from "@/hooks/use-clipboard";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Copy } from "lucide-react";

interface CopyToClipboardProps {
  text: string;
  className?: string;
}

export function CopyToClipboard({ text, className }: CopyToClipboardProps) {
  const { copy, copied } = useClipboard();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("cursor-pointer hover:dark:bg-slate-700", className)}
      onClick={() => copy(text)}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}
