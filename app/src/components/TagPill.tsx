'use client'
import { css } from '@/styled-system/css'

export type TagPillProps = {
  text: string
  vector: number[]
}

function vectorToColor(v: number[]): string {
  if (v.length < 3) return '#999'
  const clamp = (n: number) => Math.max(-1, Math.min(1, n))
  const normalize = (n: number) => (clamp(n) + 1) / 2

  const h = (normalize(v[0]) + 0.15 * normalize(v[1]) + 0.05 * normalize(v[2])) % 1
  const hue = h * 360
  const sat = 60 + normalize(v[1]) * 30
  const light = 45 + normalize(v[2]) * 30
  return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%)`
}

export function TagPill({ text, vector }: TagPillProps) {
  const color = vectorToColor(vector)
  return (
    <span
      className={css({
        display: 'inline-block',
        paddingX: '2',
        paddingY: '1',
        borderRadius: 'full',
        color: 'white',
        fontSize: 'sm',
        marginRight: '1',
        marginBottom: '1',
      })}
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  )
}
