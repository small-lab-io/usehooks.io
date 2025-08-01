import React from "react";
import Link from "next/link";
import { getHooks } from "@/lib/get-hooks";
import { getHooksByCategory } from "@/lib/get-hooks-by-category";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StructuredData } from "@/components/structured-data";

interface CategoryPageProps {
  params: Promise<{
    cat: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const cat = (await params).cat;
  const hooks = await getHooks();
  const hooksByCategory = getHooksByCategory(hooks);
  const categoryHooks = hooksByCategory[cat] || [];

  return (
    <>
      <StructuredData type="website" />

      <div className="pb-20 space-y-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Documentation", href: "/docs" },
            { label: `${cat}` },
          ]}
        />
        <h1 className="text-3xl font-bold mb-4">Category: {cat}</h1>

        {categoryHooks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryHooks.map((hook) => (
              <Link href={`/docs/${hook.name}`} key={hook.name}>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-semibold mb-2">{hook.title}</h2>
                  <span className="inline-block bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded mb-2 capitalize">
                    {hook.category}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {hook.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="prose max-w-none">
            <p>No hooks found in the {cat} category.</p>
          </div>
        )}
      </div>
    </>
  );
}
