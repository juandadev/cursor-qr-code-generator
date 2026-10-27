'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { SharedCardFace, VariableCardFace } from './card-face'
import { describeCard } from '@/lib/bulk-qr/cards'
import { getCardMode } from '@/lib/bulk-qr/modes'
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  PREVIEW_SCALE,
  type CardConfig,
  type CardFace,
  type CardItem,
} from '@/lib/bulk-qr/types'

interface CardPreviewProps {
  cards: CardItem[]
  config: CardConfig
  face: CardFace
  onFaceChange: (face: CardFace) => void
}

export function CardPreview({
  cards,
  config,
  face,
  onFaceChange,
}: CardPreviewProps) {
  const [index, setIndex] = useState(0)
  const mode = getCardMode(config.mode)

  const currentIndex = Math.min(index, Math.max(0, cards.length - 1))
  const currentCard = cards[currentIndex]
  const showsVariableFace = face === mode.variableFace

  if (!currentCard) {
    return (
      <Empty className="h-full min-h-[360px] border border-dashed">
        <EmptyHeader>
          <EmptyTitle>{mode.emptyState.title}</EmptyTitle>
          <EmptyDescription>{mode.emptyState.description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const summary = describeCard(currentCard)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={face}
          onValueChange={(value) => onFaceChange(value as CardFace)}
        >
          <TabsList>
            <TabsTrigger value="front">Front</TabsTrigger>
            <TabsTrigger value="back">Back</TabsTrigger>
          </TabsList>
        </Tabs>
        {showsVariableFace && cards.length > 1 ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setIndex((i) => (i - 1 + cards.length) % cards.length)
              }
              aria-label="Previous card"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <span className="min-w-[72px] text-center font-mono text-xs tabular-nums text-muted-foreground">
              {currentIndex + 1} / {cards.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIndex((i) => (i + 1) % cards.length)}
              aria-label="Next card"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>

      <div
        className="flex items-center justify-center rounded-2xl border border-border bg-secondary/40 p-8"
        data-theme-preview={config.theme}
      >
        <div
          style={{
            width: CARD_WIDTH * PREVIEW_SCALE,
            height: CARD_HEIGHT * PREVIEW_SCALE,
          }}
          aria-label={`Card preview at ${PREVIEW_SCALE}x scale`}
        >
          <div
            style={{
              transform: `scale(${PREVIEW_SCALE})`,
              transformOrigin: 'top left',
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
            }}
          >
            {showsVariableFace ? (
              <VariableCardFace card={currentCard} config={config} />
            ) : (
              <SharedCardFace config={config} />
            )}
          </div>
        </div>
      </div>

      {showsVariableFace ? (
        <EmptyContent className="flex flex-col items-center gap-1 text-center">
          <span className="font-mono text-[11px] text-muted-foreground break-all">
            {summary.title}
            {currentCard.kind === 'voucher' ? ` · ${summary.detail}` : null}
          </span>
        </EmptyContent>
      ) : null}
    </div>
  )
}
