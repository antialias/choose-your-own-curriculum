'use client'
import { css } from '@/styled-system/css'

export type TagPillProps = {
  text: string
  vector: number[]
}

function vectorToColor(v: number[]): string {
  if (v.length < 3) return '#999'
  const hue = ((v[0] + 1) / 2) * 360
  const sat = 60 + ((v[1] + 1) / 2) * 40
  const light = 35 + ((v[2] + 1) / 2) * 30
  return `hsl(${Math.floor(hue) % 360}, ${Math.floor(sat)}%, ${Math.floor(light)}%)`
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
        marginTop: '3',
      })}
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  )
}
