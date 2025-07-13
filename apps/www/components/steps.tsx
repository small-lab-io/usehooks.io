export function Steps({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

export function Step({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
}
