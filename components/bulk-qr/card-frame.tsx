import { forwardRef } from 'react'
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  type CardColorTokens,
  type CardFace,
} from '@/lib/bulk-qr/types'
import { cn } from '@/lib/utils'

interface CardFrameProps {
  face: CardFace
  tokens: CardColorTokens
  className?: string
  innerClassName?: string
  children: React.ReactNode
}

/**
 * Shared shell for every printed card face: a thin outer frame (card
 * background) wrapping a bordered inner container, sized to the exact print
 * dimensions.
 */
export const CardFrame = forwardRef<HTMLDivElement, CardFrameProps>(
  function CardFrame(
    { face, tokens, className, innerClassName, children },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden p-2', className)}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: tokens.background,
          color: tokens.foreground,
        }}
        data-card-face={face}
      >
        <div
          className={cn('flex h-full w-full border', innerClassName)}
          style={{
            background: tokens.container,
            borderColor: tokens.border,
          }}
        >
          {children}
        </div>
      </div>
    )
  },
)
