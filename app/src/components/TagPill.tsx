'use client'
import { css } from '@/styled-system/css'

export type TagPillProps = { text: string; color: string }

export function TagPill({ text, color }: TagPillProps) {
  return (
    <span
      className={css({
        paddingX: '2',
        paddingY: '1',
        borderRadius: 'full',
        color: 'white',
        fontSize: 'xs',
        marginRight: '1',
        display: 'inline-block',
      })}
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  )
}
