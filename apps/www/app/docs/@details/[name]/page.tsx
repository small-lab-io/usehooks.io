import Link from "next/link";
import type { Metadata } from "next";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Terminal } from "@/components/terminal";
import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { getHooks } from "@/lib/get-hooks";
import { getHookSource } from "@/lib/get-hook-source";
import { getHookDoc } from "@/lib/get-hook-doc";
import { getHooksByCategory } from "@/lib/get-hooks-by-category";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StructuredData } from "@/components/structured-data";
import { ShareButton } from "@/components/share-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
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
    title: `${hook.title} - React Hook`,
    description: `${hook.description} Learn how to use ${hook.title} in your React projects with examples and TypeScript support.`,
    keywords: [
      hook.title,
      hook.name,
      "React hook",
      "React",
      "TypeScript",
      hook.category,
      "custom hook",
      "useHooks.io",
    ],
    openGraph: {
      title: `${hook.title} - React Hook | useHooks.io`,
      description: hook.description,
      type: "article",
      url: `https://usehooks.io/docs/${hook.name}`,
      images: [
        {
          url: `/docs/${hook.name}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${hook.title} - React Hook`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${hook.title} - React Hook`,
      description: hook.description,
      images: [`/docs/${hook.name}/opengraph-image`],
    },
    alternates: {
      canonical: `https://usehooks.io/docs/${hook.name}`,
    },
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
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Documentation", href: "/docs" },
            { label: "Hook not found" },
          ]}
        />
        <h1 className="text-4xl font-bold mb-8">Hook not found</h1>
        <Link href="/docs" className="text-blue-500 hover:underline">
          Back to docs
        </Link>
      </div>
    );
  }
  const sourceCode = await getHookSource(name);
  const hookDoc = await getHookDoc(name);

  const hooksByCategory = getHooksByCategory(hooks);

  // Find current hook's category and position within that category
  const currentCategory = hook.category;
  const hooksInCategory = hooksByCategory[currentCategory] || [];
  const currentIndexInCategory = hooksInCategory.findIndex(
    (h) => h.name === name
  );

  // Get all categories in order
  const categories = Object.keys(hooksByCategory);
  const currentCategoryIndex = categories.indexOf(currentCategory);

  // Function to get previous hook
  const getPreviousHook = () => {
    // If not the first hook in current category, get previous in same category
    if (currentIndexInCategory > 0) {
      return hooksInCategory[currentIndexInCategory - 1];
    }

    // If first hook in category, get last hook from previous category
    if (currentCategoryIndex > 0) {
      const previousCategory = categories[currentCategoryIndex - 1];
      const previousCategoryHooks =
        hooksByCategory[previousCategory as keyof typeof hooksByCategory];
      return previousCategoryHooks
        ? previousCategoryHooks[previousCategoryHooks.length - 1]
        : null;
    }

    return null; // First hook overall
  };

  // Function to get next hook
  const getNextHook = () => {
    // If not the last hook in current category, get next in same category
    if (currentIndexInCategory < hooksInCategory.length - 1) {
      return hooksInCategory[currentIndexInCategory + 1];
    }

    // If last hook in category, get first hook from next category
    if (currentCategoryIndex < categories.length - 1) {
      const nextCategory = categories[currentCategoryIndex + 1];
      const nextCategoryHooks =
        hooksByCategory[nextCategory as keyof typeof hooksByCategory];
      return nextCategoryHooks ? nextCategoryHooks[0] : null;
    }

    return null; // Last hook overall
  };

  const previousHook = getPreviousHook();
  const nextHook = getNextHook();

  return (
    <>
      <StructuredData hook={hook} type="article" />
      <div className="pb-20 space-y-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Documentation", href: "/docs" },
            { label: hook.category, href: `/docs/category/${hook.category}` },
            { label: hook.title },
          ]}
        />

        <h1 className="text-4xl font-bold mb-2 flex justify-between">
          {hook.title} <ShareButton />
        </h1>

        <span className="inline-block bg-gray-200 dark:bg-slate-700 text-sm px-2 py-1 rounded mb-8">
          {hook.category}
        </span>

        <div>
          <h1 className="text-4xl font-bold mb-2">Installation</h1>
          <div className="relative">
            <Terminal>npx usehooks-cli@latest add {hook.name}</Terminal>
            <CopyToClipboard
              text={`npx usehooks-cli@latest add ${hook.name}`}
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
                        <th className="px-4 py-2 text-left border-b">
                          Default
                        </th>
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

                {/* Parameter Properties */}
                {hookDoc.parameters.some(
                  (param) => param.properties && param.properties.length > 0
                ) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Parameter Properties
                    </h3>
                    {hookDoc.parameters.map(
                      (param, paramIndex) =>
                        param.properties &&
                        param.properties.length > 0 && (
                          <div key={paramIndex} className="mb-4">
                            <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">
                              {param.name} properties:
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full min-w-[500px] text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                  <tr>
                                    <th className="px-3 py-2 text-left border-b">
                                      Name
                                    </th>
                                    <th className="px-3 py-2 text-left border-b">
                                      Type
                                    </th>
                                    <th className="px-3 py-2 text-left border-b">
                                      Description
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {param.properties.map((prop, propIndex) => (
                                    <tr key={propIndex}>
                                      <td className="px-3 py-2 font-mono">
                                        {prop.name}
                                        {prop.optional && (
                                          <span className="text-gray-500 ml-1">
                                            ?
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-3 py-2 font-mono">
                                        {prop.type}
                                      </td>
                                      <td className="px-3 py-2">
                                        {prop.description}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Return Type Section */}
            {hookDoc.returnType &&
              hookDoc.returnType?.properties?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Return Type</h2>
                  <div className="mb-4">
                    <span className="font-mono text-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                      {hookDoc.returnType.type}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-2 text-left border-b">
                            Property
                          </th>
                          <th className="px-4 py-2 text-left border-b">Type</th>
                          <th className="px-4 py-2 text-left border-b">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hookDoc.returnType?.properties?.map((prop, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 font-mono text-sm">
                              {prop.name}
                            </td>
                            <td className="px-4 py-2 font-mono text-sm">
                              {prop.type}
                            </td>
                            <td className="px-4 py-2">{prop.description}</td>
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
                <h2 className="text-2xl font-bold mb-4">
                  Methods & Properties
                </h2>
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

            {/* Examples Section - FIXED */}
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

        {/* Navigation section */}
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
    </>
  );
}
