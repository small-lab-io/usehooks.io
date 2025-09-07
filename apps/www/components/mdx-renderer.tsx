import { MDXRemote } from "next-mdx-remote/rsc";
import { MDXComponents } from "./mdx-components";

interface MDXRendererProps {
  source: string;
}

export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <MDXRemote
      source={source}
      components={MDXComponents as any}
      options={{
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [],
        },
      }}
    />
  );
}
