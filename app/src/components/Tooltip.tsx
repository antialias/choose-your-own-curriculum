import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';
import { css } from '@/styled-system/css';

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
};

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={100} skipDelayDuration={0}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={4}
            className={css({
              zIndex: 'tooltip',
              maxWidth: '64',
              backgroundColor: 'gray.900',
              color: 'white',
              borderRadius: 'sm',
              paddingX: '2',
              paddingY: '1',
              fontSize: 'sm',
            })}
          >
            {content}
            <TooltipPrimitive.Arrow className={css({ fill: 'gray.900' })} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
