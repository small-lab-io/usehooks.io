import { getHooks } from "@/lib/get-hooks";

export default async function HooksPage() {
  const hooks = await getHooks();

  return (
    <div className="pb-20 px-20">
      <h1 className="text-4xl font-bold mb-6">React Hooks Collection</h1>
      <p className="text-lg text-gray-600 mb-8">
        A comprehensive collection of {hooks.length} custom React hooks to
        enhance your development experience.
      </p>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {hooks.map((hook) => (
          <div className="container mx-auto py-12 px-4" key={hook.name}>
            <h1 className="text-2xl font-bold mb-2">{hook.title}</h1>
            <span className="inline-block bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded mb-8 capitalize">
              {hook.category}
            </span>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-lg">{hook.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
