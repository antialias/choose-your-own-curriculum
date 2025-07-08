'use client'
import { css } from '@/styled-system/css'

export type TagPillProps = {
  text: string
  vector: number[]
  range?: {
    min: number[]
    max: number[]
  }
}

function norm(value: number, min: number, max: number) {
  if (max - min === 0) return 0.5
  return (value - min) / (max - min)
}

function vectorToColor(v: number[], range?: { min: number[]; max: number[] }): string {
  if (v.length < 3) return '#999'
  const defaults = {
    min: [-1, -1, -1],
    max: [1, 1, 1],
  }
  const r = range ?? defaults
  const h = norm(v[0], r.min[0], r.max[0]) * 360
  const s = 60 + norm(v[1], r.min[1], r.max[1]) * 30
  const l = 45 + norm(v[2], r.min[2], r.max[2]) * 20
  return `hsl(${Math.round(h) % 360}, ${Math.round(s)}%, ${Math.round(l)}%)`
}

export function TagPill({ text, vector, range }: TagPillProps) {
  const color = vectorToColor(vector, range)
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
