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
  const codeString = getTextContent(children);

  return (
    <div className="relative my-6">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={showLineNumbers}
        wrapLines={true}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}
