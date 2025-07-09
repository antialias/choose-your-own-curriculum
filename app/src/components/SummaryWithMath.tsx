
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export function SummaryWithMath({ text }: { text: string }) {
  const normalized = text
    .replace(/\\\\/g, "\\")
    .replace(/\\\(([^]*?)\\\)/g, (_match, math) => `$${math}$`)
    .replace(/\\\[([^]*?)\\\]/g, (_match, math) => `$$${math}$$`);
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {normalized}
    </ReactMarkdown>
  );
}
