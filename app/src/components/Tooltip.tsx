'use client'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { css, cx } from '@/styled-system/css'

export type TooltipProps = {
  content: React.ReactNode
  children: React.ReactElement
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={4}
            collisionPadding={4}
            className={cx(
              css({
                background: 'gray.700',
                color: 'white',
                borderRadius: 'sm',
                paddingX: '2',
                paddingY: '1',
                fontSize: 'sm',
                zIndex: 'tooltip',
                maxWidth: 'xs',
              })
            )}
          >
            {content}
            <TooltipPrimitive.Arrow
              className={css({ fill: 'gray.700' })}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
