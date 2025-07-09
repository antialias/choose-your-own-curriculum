'use client'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { css } from '@/styled-system/css'

export function Tooltip({ children, content }: { children: React.ReactNode; content: React.ReactNode }) {
  return (
    <TooltipPrimitive.Root delayDuration={300}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={4}
          collisionPadding={8}
          className={css({
            bg: 'gray.800',
            color: 'white',
            borderRadius: 'md',
            paddingX: '3',
            paddingY: '2',
            fontSize: 'sm',
            maxWidth: '60',
            boxShadow: 'md',
          })}
        >
          {content}
          <TooltipPrimitive.Arrow className={css({ fill: 'gray.800' })} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
