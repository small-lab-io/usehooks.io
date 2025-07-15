"use client";

import { Button } from "@workspace/ui/components/button";

export function CaterogyButton({
  category,
  hooks,
  index,
}: {
  category: string;
  hooks: any;
  index: number;
}) {
  return (
    <Button
      key={category}
      onClick={() => {
        const element = document.getElementById(category);
        element?.scrollIntoView({ behavior: "smooth" });
      }}
      className="cursor-pointer w-full md:w-fit"
      variant="secondary"
      style={{ animationDelay: `${1500 + index * 100}ms` }}
    >
      <div className="px-4 py-2 text-sm font-medium">
        {category}
        <span className="ml-2 text-xs text-muted-foreground">
          (
          {
            hooks.filter(
              (hook: { category: string }) => hook.category === category
            ).length
          }
          )
        </span>
      </div>
    </Button>
  );
}
