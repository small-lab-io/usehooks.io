import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getHooks } from "@/lib/get-hooks";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const hooks = await getHooks();
  const hook = hooks.find((h) => h.name === name);

  if (!hook) {
    return {
      title: "Hook not found",
      description: "The requested hook could not be found",
    };
  }

  return {
    title: hook.name,
    description: hook.description,
  };
}

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
        <Link href="/docs" className="text-blue-500 hover:underline">
          Back to docs
        </Link>
      </div>
    );
  }

  const sourceCode = await getHookSource(name);

  return (
    <div className="pb-20 space-y-10 px-20 container mx-auto">
      <h1 className="text-4xl font-bold mb-2">{hook.title}</h1>
      <span className="inline-block bg-gray-200 dark:bg-slate-700 text-sm px-2 py-1 rounded mb-8">
        {hook.category}
      </span>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p className="text-lg">{hook.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Implementation</h2>
        {/*@ts-ignore*/}
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
