"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { Button } from "@workspace/ui/components/button";
import { getHooks } from "@/lib/get-hooks";
import { HookMeta } from "@/lib/types";

export function CommandMenu() {
  const router = useRouter();
  const [hooks, setHooks] = useState<HookMeta[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHooks = async () => {
      setLoading(true);
      try {
        const hooksData = await getHooks();
        setHooks(hooksData);
      } catch (error) {
        console.error("Error fetching hooks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHooks();
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        className="bg-slate-100 hover:bg-slate-200 text-surface-foreground/60 items-center flex dark:bg-slate-800 hover:dark:bg-slate-700 relative h-9 w-full justify-start pl-2.5 font-normal shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64 cursor-pointer"
        onClick={() => setOpen((open) => !open)}
      >
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <div className="absolute top-2 right-1.5 hidden gap-1 sm:flex">
          <kbd className="bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none">
            ⌘
          </kbd>
          <kbd className="bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none aspect-square">
            K
          </kbd>
        </div>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput />
        {/*@ts-ignore*/}
        <CommandList>
          {/*@ts-ignore*/}
          <CommandEmpty>No results found.</CommandEmpty>
          {/*@ts-ignore*/}
          <CommandGroup heading="Blog">
            {allPosts.map((post) => (
              // @ts-ignore
              <CommandItem
                key={post._id}
                onSelect={() => {
                  router.push(post.url);
                  setOpen(false);
                }}
                className="flex flex-col items-start"
              >
                <span className="text-lg font-medium">{post.title}</span>
                <span className="text-sm text-muted-foreground italic">
                  {post.description}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Hooks">
            {loading ? (
              // @ts-ignore
              <CommandItem disabled>
                <span>Loading hooks...</span>
              </CommandItem>
            ) : hooks.length > 0 ? (
              hooks.map((hook) => (
                // @ts-ignore
                <CommandItem
                  key={hook.name}
                  onSelect={() => {
                    router.push(`/docs/${hook.name}`);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start"
                >
                  <span className="text-lg font-medium">{hook.title}</span>
                  <span className="text-sm text-muted-foreground italic">
                    {hook.description}
                  </span>
                </CommandItem>
              ))
            ) : (
              // @ts-ignore
              <CommandItem disabled>
                <span>No hooks available</span>
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
