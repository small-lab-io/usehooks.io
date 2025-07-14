"use client";

import { Button } from "@workspace/ui/components/button";
import { ShareIcon } from "lucide-react";
import { toast } from "sonner";

export function ShareButton() {
  const handleShare = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: "Check this out!",
          url: window.location.href,
        });
      } catch (err) {
        toast.error("Failed to share");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("URL copied to clipboard");
      } catch {
        toast.error("Could not copy URL");
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      size="icon"
      variant="outline"
      className="cursor-pointer border-none shadow-none bg-slate-100"
    >
      <ShareIcon />
    </Button>
  );
}
