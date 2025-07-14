"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import { MDXComponents } from "./mdx-components";

interface MDXRendererProps {
  code: string;
}

export function MDXRenderer({ code }: MDXRendererProps) {
  const MDXContent = useMDXComponent(code);

  return <MDXContent components={MDXComponents as any} />;
}
