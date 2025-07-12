import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function HookAside() {
  return (
    <aside className="sticky top-16 min-w-64 hidden lg:block p-2">
      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">
            <p className="mb-2">Install any hook with:</p>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
              npx usehooks-cli@latest add [hook-name]
            </code>
          </div>

          <div className="text-sm">
            <p className="mb-2">Or install all hooks:</p>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
              npm install @workspace/hooks
            </code>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Popular Hooks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <a
              href="/docs/use-local-storage"
              className="block hover:text-blue-500"
            >
              useLocalStorage
            </a>
            <a href="/docs/use-counter" className="block hover:text-blue-500">
              useCounter
            </a>
            <a href="/docs/use-toggle" className="block hover:text-blue-500">
              useToggle
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>Check out our examples and documentation for each hook.</p>
        </CardContent>
      </Card>
    </aside>
  );
}
