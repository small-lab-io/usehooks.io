import { z } from "zod";
import path from "path";
import fs from "fs-extra";

export const configSchema = z.object({
  style: z.string().default("default"),
  rsc: z.boolean().default(false),
  tsx: z.boolean().default(true),
  tailwind: z
    .object({
      config: z.string(),
      css: z.string(),
      baseColor: z.string().default("slate"),
      cssVariables: z.boolean().default(true),
    })
    .optional(),
  aliases: z.object({
    hooks: z.string().default("./hooks"),
  }),
});

export type Config = z.infer<typeof configSchema>;

const CONFIG_FILE = "usehooks.json";

export async function getConfig(cwd: string): Promise<Config | null> {
  try {
    const configPath = path.resolve(cwd, CONFIG_FILE);
    const configExists = await fs.pathExists(configPath);

    if (!configExists) {
      return null;
    }

    const configFile = await fs.readJSON(configPath);
    return configSchema.parse(configFile);
  } catch (error) {
    return null;
  }
}

export async function saveConfig(config: Config, cwd: string): Promise<void> {
  const configPath = path.resolve(cwd, CONFIG_FILE);
  await fs.writeJSON(configPath, config, { spaces: 2 });
}
