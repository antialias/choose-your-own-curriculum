'use client'
import { css } from '@/styled-system/css'

export function ThumbnailPlaceholder({ mime }: { mime?: string | null }) {
  const ext = mime?.split('/').pop()?.toUpperCase() || ''
  return (
    <div
      data-testid="thumbnail-placeholder"
      className={css({
        width: '1.5in',
        height: '1.5in',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: '1px',
        borderColor: 'gray.300',
        color: 'gray.600',
        fontSize: 'sm',
      })}
    >
      {ext}
    </div>
  )
}
