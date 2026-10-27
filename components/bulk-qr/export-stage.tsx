'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { SharedCardFace, VariableCardFace } from './card-face'
import type { CardConfig, CardItem } from '@/lib/bulk-qr/types'

export interface ExportStageHandle {
  getVariableNode: (cardId: string) => HTMLElement | null
  getSharedNode: () => HTMLElement | null
}

interface ExportStageProps {
  cards: CardItem[]
  config: CardConfig
}

/**
 * Off-screen stage that renders every card at full physical size so
 * html-to-image can capture them. Positioned outside the viewport
 * (instead of `display: none`) so layout and canvases actually paint.
 */
export const ExportStage = forwardRef<ExportStageHandle, ExportStageProps>(
  function ExportStage({ cards, config }, ref) {
    const variableRefs = useRef<Map<string, HTMLDivElement | null>>(new Map())
    const sharedRef = useRef<HTMLDivElement | null>(null)

    useImperativeHandle(
      ref,
      () => ({
        getVariableNode: (cardId: string) =>
          variableRefs.current.get(cardId) ?? null,
        getSharedNode: () => sharedRef.current,
      }),
      [],
    )

    return (
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: -10000,
          top: 0,
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        {cards.map((card) => (
          <VariableCardFace
            key={card.id}
            card={card}
            config={config}
            ref={(node) => {
              variableRefs.current.set(card.id, node)
            }}
          />
        ))}
        <SharedCardFace ref={sharedRef} config={config} />
      </div>
    )
  },
)
