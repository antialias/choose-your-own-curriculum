import { InlineMath, BlockMath } from 'react-katex';

export function RenderedSummary({ text }: { text: string }) {
  const parts: Array<string | { math: string; display: boolean }> = [];
  const regex = /(\$\$([^$]+)\$\$|\$([^$]+)\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push({ math: match[2], display: true });
    } else if (match[3]) {
      parts.push({ math: match[3], display: false });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return (
    <span>
      {parts.map((part, idx) =>
        typeof part === 'string' ? (
          part
        ) : part.display ? (
          <BlockMath key={idx} math={part.math} />
        ) : (
          <InlineMath key={idx} math={part.math} />
        )
      )}
    </span>
  );
}
