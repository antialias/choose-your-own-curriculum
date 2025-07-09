
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { InlineMath, BlockMath } from "react-katex";

export function SummaryWithMath({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        math: ({ value }: { value: string }) => (
          <BlockMath>{value}</BlockMath>
        ),
        inlineMath: ({ value }: { value: string }) => (
          <InlineMath>{value}</InlineMath>
        ),
      } as never}
    >
      {text}
    </ReactMarkdown>
  );
}
