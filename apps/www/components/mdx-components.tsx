import React from "react";
import { CodeBlock } from "./code-block";
import Link from "next/link";

export const MDXComponents = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-foreground mt-8 mb-6 scroll-m-20 text-3xl font-bold tracking-tight md:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-foreground border-border/40 mt-10 mb-4 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight md:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-foreground mt-8 mb-4 scroll-m-20 text-xl font-semibold tracking-tight md:text-2xl">
      {children}
    </h3>
  ),
  h4: ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-foreground mt-6 mb-4 scroll-m-20 text-lg font-semibold tracking-tight md:text-xl">
      {children}
    </h4>
  ),
  h5: ({ children }: { children: React.ReactNode }) => (
    <h5 className="text-foreground mt-4 mb-2 scroll-m-20 text-base font-semibold tracking-tight md:text-lg">
      {children}
    </h5>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-foreground/90 mb-6 text-base leading-7 [&:not(:first-child)]:mt-6">
      {children}
    </p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="text-foreground/90 my-6 ml-6 list-disc [&>li]:mt-2">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="text-foreground/90 my-6 ml-6 list-decimal [&>li]:mt-2">
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="text-foreground/90 leading-7">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-border text-foreground/80 mt-6 mb-6 border-l-4 pl-6 italic">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <Link
      href={href}
      className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
    >
      {children}
    </Link>
  ),
  hr: () => <hr className="border-border/50 my-8" />,
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-foreground font-semibold">{children}</strong>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code>{children}</code>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <img
      src={src}
      alt={alt}
      className="border-border my-8 h-auto max-w-full rounded-md border"
    />
  ),
  pre: ({ children, ...props }: any) => {
    const child = children?.props;
    if (child?.className?.includes("language-")) {
      const language = child.className.replace("language-", "");
      return <CodeBlock language={language}>{child.children}</CodeBlock>;
    }
    return <pre {...props}>{children}</pre>;
  },
};
