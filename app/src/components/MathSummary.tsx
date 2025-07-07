import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import React from 'react';

type Props = {
  text: string;
};

/**
 * Parses a string containing $...$ or $$...$$ LaTeX expressions
 * and returns React elements rendering math with KaTeX.
 */
export function MathSummary({ text }: Props) {
  const elements: React.ReactNode[] = [];
  const regex = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }
    const expr = match[0];
    if (expr.startsWith('$$')) {
      elements.push(
        <BlockMath key={elements.length} math={expr.slice(2, -2)} />
      );
    } else {
      elements.push(
        <InlineMath key={elements.length} math={expr.slice(1, -1)} />
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return <span>{elements.map((el, i) => <React.Fragment key={i}>{el}</React.Fragment>)}</span>;
}
