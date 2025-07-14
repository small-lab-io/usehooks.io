import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getHooks } from "@/lib/get-hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Terminal } from "@/components/terminal";
import { CopyToClipboard } from "@/components/copy-to-clipboard";

interface DocMethod {
  name: string;
  type: string;
  description: string;
  category: string;
  parameters?: Array<{
    name: string;
    type: string;
    description: string;
    optional?: boolean;
    default?: string;
  }>;
  returns?: string;
}

interface DocExample {
  title: string;
  description: string;
  code: string;
}

interface HookDoc {
  name: string;
  description: string;
  category: string;
  parameters: Array<{
    name: string;
    type: string;
    optional?: boolean;
    default?: string;
    description: string;
  }>;
  methods: DocMethod[];
  examples: DocExample[];
  dependencies: string[];
  notes: string[];
}

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

async function getHookDoc(name: string): Promise<HookDoc | null> {
  const docPath = path.join(
    process.cwd(),
    `../../packages/hooks/src/${name}/doc.json`
  );
  try {
    const docContent = await fs.readFile(docPath, "utf8");
    return JSON.parse(docContent);
  } catch (error) {
    console.error(`Error reading hook doc file: ${error}`);
    return null;
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

  // Find current hook index and get previous/next hooks
  const currentIndex = hooks.findIndex((h) => h.name === name);
  const previousHook = currentIndex > 0 ? hooks[currentIndex - 1] : null;
  const nextHook =
    currentIndex < hooks.length - 1 ? hooks[currentIndex + 1] : null;

  const sourceCode = await getHookSource(name);
  const hookDoc = await getHookDoc(name);

  return (
    <div className="pb-20 space-y-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">{hook.title}</h1>
      <span className="inline-block bg-gray-200 dark:bg-slate-700 text-sm px-2 py-1 rounded mb-8">
        {hook.category}
      </span>

      <div>
        <h1 className="text-4xl font-bold mb-2">Installation</h1>
        <div className="relative">
          <Terminal>npx usehooks-cli@latest add {hook.name}</Terminal>
          <CopyToClipboard
            text={`npx usehooks-cli@latest add ${hook.title}`}
            className="absolute top-2 right-2"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p className="text-lg">{hookDoc?.description || hook.description}</p>
      </div>

      {hookDoc && (
        <>
          {/* Parameters Section */}
          {hookDoc.parameters && hookDoc.parameters.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Parameters</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left border-b">Name</th>
                      <th className="px-4 py-2 text-left border-b">Type</th>
                      <th className="px-4 py-2 text-left border-b">Default</th>
                      <th className="px-4 py-2 text-left border-b">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hookDoc.parameters.map((param, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-mono text-sm">
                          {param.name}
                          {param.optional && (
                            <span className="text-gray-500 ml-1">?</span>
                          )}
                        </td>
                        <td className="px-4 py-2 font-mono text-sm">
                          {param.type}
                        </td>
                        <td className="px-4 py-2 font-mono text-sm">
                          {param.default || "-"}
                        </td>
                        <td className="px-4 py-2">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Methods Section */}
          {hookDoc.methods && hookDoc.methods.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Methods & Properties</h2>
              <div className="space-y-4">
                {hookDoc.methods.map((method, index) => (
                  <Card
                    key={index}
                    className="bg-secondary shadow-none border-none"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="font-mono text-lg">
                          {method.name}
                        </CardTitle>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          {method.category}
                        </span>
                      </div>
                      <CardDescription className="font-mono">
                        {method.type}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <p className="mb-4">{method.description}</p>

                      {method.parameters && method.parameters.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-3">Parameters:</h4>
                          <div className="space-y-2">
                            {method.parameters.map((param, paramIndex) => (
                              <div
                                key={paramIndex}
                                className="text-sm p-3 bg-muted/50 rounded-md"
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <span className="font-mono font-medium">
                                    {param.name}
                                  </span>
                                  {param.optional && (
                                    <span className="text-muted-foreground">
                                      ?
                                    </span>
                                  )}
                                  <span className="text-muted-foreground">
                                    :
                                  </span>
                                  <span className="font-mono text-blue-600 dark:text-blue-400">
                                    {param.type}
                                  </span>
                                  {param.default && (
                                    <span className="text-muted-foreground">
                                      = {param.default}
                                    </span>
                                  )}
                                </div>
                                <p className="text-muted-foreground">
                                  {param.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {method.returns && (
                        <div className="text-sm p-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                          <span className="font-semibold text-green-800 dark:text-green-200">
                            Returns:{" "}
                          </span>
                          <span className="text-green-700 dark:text-green-300">
                            {method.returns}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Examples Section */}
          {hookDoc.examples && hookDoc.examples.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Examples</h2>
              <div className="space-y-6">
                {hookDoc.examples.map((example, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {example.title}
                    </h3>
                    <p className="mb-4">{example.description}</p>
                    <div className="relative">
                      <SyntaxHighlighter
                        language="typescript"
                        style={oneDark}
                        PreTag="div"
                        showLineNumbers
                      >
                        {example.code}
                      </SyntaxHighlighter>
                      <CopyToClipboard
                        text={example.code}
                        className="absolute top-2 right-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dependencies Section */}
          {hookDoc.dependencies && hookDoc.dependencies.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Dependencies</h2>
              <div className="flex flex-wrap gap-2">
                {hookDoc.dependencies.map((dep, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-mono"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {hookDoc.notes && hookDoc.notes.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Notes</h2>
              <ul className="space-y-2">
                {hookDoc.notes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Implementation</h2>
        <div className="overflow-x-auto relative">
          <SyntaxHighlighter
            language="typescript"
            style={oneDark}
            PreTag="div"
            showLineNumbers
            wrapLongLines={true}
            customStyle={{
              maxWidth: "100%",
              fontSize: "14px",
            }}
          >
            {sourceCode}
          </SyntaxHighlighter>
          <CopyToClipboard
            text={sourceCode}
            className="absolute top-4 right-2"
          />
        </div>
      </div>

      {hook.examples && hook.examples.length > 0 && !hookDoc?.examples && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Examples</h2>
          {hook.examples.map((example) => (
            <div key={example.name} className="mb-4">
              <h3 className="text-xl font-semibold mb-2">{example.name}</h3>
              <p>{example.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Replace the navigation section at the end */}
      <div className="border-t pt-8">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {previousHook && (
              <Link
                href={`/docs/${previousHook.name}`}
                className="group flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <div className="text-left">
                  <div className="text-xs uppercase tracking-wide">
                    Previous
                  </div>
                  <div className="font-medium group-hover:underline">
                    {previousHook.title}
                  </div>
                </div>
              </Link>
            )}
          </div>

          <div className="flex space-x-4">
            <Link
              href="/docs/cli"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              CLI Docs
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              All Hooks
            </Link>
          </div>

          <div className="flex-1 flex justify-end">
            {nextHook && (
              <Link
                href={`/docs/${nextHook.name}`}
                className="group flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wide">Next</div>
                  <div className="font-medium group-hover:underline">
                    {nextHook.title}
                  </div>
                </div>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
