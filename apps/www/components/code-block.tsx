"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  showLineNumbers?: boolean;
}

// Helper function to extract text content from React nodes
function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string") {
    return node;
  }
  if (typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    return getTextContent((node as any).props.children);
  }
  return "";
}

export function CodeBlock({
  children,
  language = "typescript",
  showLineNumbers = true,
}: CodeBlockProps) {
  const [isClient, setIsClient] = useState(false);
  const codeString = getTextContent(children);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fallback for SSR
  if (!isClient) {
    return (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
        <code>{codeString}</code>
      </pre>
    );
  }

  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      showLineNumbers={showLineNumbers}
      wrapLines={true}
      customStyle={{
        width: "100%",
        maxWidth: "100%",
        overflow: "auto",
        display: "block",
        margin: 0,
        borderRadius: "0.375rem",
        fontSize: "0.875rem",
        lineHeight: "1.5",
      }}
      codeTagProps={{
        style: {
          fontSize: "inherit",
          fontFamily: "inherit",
        },
      }}
      PreTag="pre"
    >
      {codeString}
    </SyntaxHighlighter>
  );
}
