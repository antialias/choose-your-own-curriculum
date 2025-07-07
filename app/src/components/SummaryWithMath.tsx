import { InlineMath, BlockMath } from 'react-katex'

export function SummaryWithMath({ text }: { text: string }) {
  const parts = text.split(
    /(\$\$[^$]*\$\$|\$[^$]*\$|\\\[[^\]]*\\\]|\\\([^\)]*\\\))/g
  )
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>
        }
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
          return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>
        }
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
          return <InlineMath key={i}>{part.slice(2, -2)}</InlineMath>
        }
        const lines = part.split('\n')
        return lines.map((line, j) => (
          <span key={`${i}-${j}`}> 
            {line}
            {j < lines.length - 1 && <br />} 
          </span>
        ))
      })}
    </span>
  )
}
