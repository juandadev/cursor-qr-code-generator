'use client'

import { Coffee, QrCode } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CARD_MODE_OPTIONS, getCardMode } from '@/lib/bulk-qr/modes'
import type { CardMode } from '@/lib/bulk-qr/types'

const MODE_ICONS: Record<CardMode, LucideIcon> = {
  redeem: QrCode,
  voucher: Coffee,
}

interface ModeSelectorProps {
  value: CardMode
  onChange: (mode: CardMode) => void
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(next) => {
          if (next) onChange(next as CardMode)
        }}
        variant="outline"
        className="w-full"
        aria-label="Card mode"
      >
        {CARD_MODE_OPTIONS.map((mode) => {
          const Icon = MODE_ICONS[mode.id]
          return (
            <ToggleGroupItem
              key={mode.id}
              value={mode.id}
              className="flex-1 gap-2"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {mode.label}
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
      <p className="text-pretty text-xs text-muted-foreground">
        {getCardMode(value).description}
      </p>
    </div>
  )
}
