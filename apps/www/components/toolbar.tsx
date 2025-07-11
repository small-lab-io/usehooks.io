import React from "react";

interface ToolbarProps {
  children?: React.ReactNode;
  className?: string;
}

export function Toolbar({ children, className = "" }: ToolbarProps) {
  return (
    <div
      className={`h-16 flex items-center gap-2 border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {children}
    </div>
  );
}

export function ToolbarButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ToolbarSeparator() {
  return <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800" />;
}
