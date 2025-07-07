import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import type { ReactNode } from 'react';

export function MathText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const regex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
  let lastIndex = 0;
  for (const match of text.matchAll(regex)) {
    if (match.index !== undefined && match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const math = match[1] || match[2];
    if (match[1]) {
      parts.push(<BlockMath key={parts.length} math={math} />);
    } else {
      parts.push(<InlineMath key={parts.length} math={math} />);
    }
    lastIndex = (match.index || 0) + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? <span key={i}>{part}</span> : part
      )}
    </>
  );
}
