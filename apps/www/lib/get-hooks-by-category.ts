import { HookMeta } from "./types";

export const getHooksByCategory = (hooks: HookMeta[]) =>
  hooks.reduce((acc: Record<string, HookMeta[]>, hook: HookMeta) => {
    if (!acc[hook.category]) {
      acc[hook.category] = [];
    }
    acc[hook.category]?.push(hook);
    return acc;
  }, {});
