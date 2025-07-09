'use client'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { css } from '@/styled-system/css'
import { ReactNode } from 'react'

export function Tooltip({ content, children }: { content: ReactNode, children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={4}
            collisionPadding={8}
            className={css({
              zIndex: 'dropdown',
              bg: 'gray.700',
              color: 'white',
              borderRadius: 'sm',
              px: '2',
              py: '1',
              maxW: '60',
              fontSize: 'sm',
            })}
          >
            {content}
            <TooltipPrimitive.Arrow className={css({ fill: 'gray.700' })} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
