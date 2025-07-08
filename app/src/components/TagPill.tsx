'use client'
import { css } from '@/styled-system/css'

export type TagPillProps = {
  text: string
  vector: number[]
  range?: { min: number[]; max: number[] }
}

function vectorToColor(v: number[], range?: { min: number[]; max: number[] }): string {
  if (v.length < 3) return '#999'
  const min = range?.min ?? [-1, -1, -1]
  const max = range?.max ?? [1, 1, 1]
  const hue = ((v[0] - min[0]) / (max[0] - min[0])) * 360
  const sat = 50 + ((v[1] - min[1]) / (max[1] - min[1])) * 50
  const light = 40 + ((v[2] - min[2]) / (max[2] - min[2])) * 20
  return `hsl(${Math.floor(hue) % 360}, ${Math.floor(sat)}%, ${Math.floor(light)}%)`
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
