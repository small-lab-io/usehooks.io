import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Define the hook metadata type
type HookMeta = {
  name: string;
  description: string;
  category: string;
  examples?: Array<{ name: string; description: string }>;
};

// Function to get all hooks metadata
async function getHooks(): Promise<HookMeta[]> {
  const hooksPath = path.join(
    process.cwd(),
    "../../packages/hooks/src/index.json"
  );
  const data = await fs.readFile(hooksPath, "utf8");
  return JSON.parse(data);
}

// Function to get a specific hook's source code
async function getHookSource(name: string): Promise<string> {
  const hookPath = path.join(
    process.cwd(),
    `../../packages/hooks/src/${name}/index.ts`
  );
  try {
    return await fs.readFile(hookPath, "utf8");
  } catch (error) {
    console.error(`Error reading hook source file: ${error}`);
    return "Source code not available";
  }
}

// Generate static params for all hooks
export async function generateStaticParams() {
  const hooks = await getHooks();
  return hooks.map((hook) => ({
    name: hook.name,
  }));
}

export default async function HookPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const hooks = await getHooks();
  const { name } = await params;
  const hook = hooks.find((h) => h.name === name);

  if (!hook) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Hook not found</h1>
        <Link href="/hooks" className="text-blue-500 hover:underline">
          Back to hooks
        </Link>
      </div>
    );
  }

  const sourceCode = await getHookSource(name);

  return (
    <div className="flex-1">
      <h1 className="text-4xl font-bold mb-2">{hook.name}</h1>
      <span className="inline-block bg-gray-200 dark:bg-slate-700 text-sm px-2 py-1 rounded mb-8">
        {hook.category}
      </span>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p className="text-lg">{hook.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Implementation</h2>
        <SyntaxHighlighter
          language="typescript"
          style={oneDark}
          PreTag="div"
          showLineNumbers
        >
          {sourceCode}
        </SyntaxHighlighter>
      </div>

      {hook.examples && hook.examples.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Examples</h2>
          {hook.examples.map((example) => (
            <div key={example.name} className="mb-4">
              <h3 className="text-xl font-semibold mb-2">{example.name}</h3>
              <p>{example.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
