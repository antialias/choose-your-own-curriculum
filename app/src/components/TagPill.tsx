'use client'

export function TagPill({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        backgroundColor: color,
        color: '#fff',
        padding: '0.1rem 0.4rem',
        borderRadius: '0.5rem',
        marginRight: '0.25rem',
        display: 'inline-block',
        fontSize: '0.85em',
      }}
    >
      {text}
    </span>
  )
}
