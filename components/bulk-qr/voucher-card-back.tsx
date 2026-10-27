import { forwardRef } from 'react'
import { formatSerial } from '@/lib/bulk-qr/cards'
import { getVoucherCopy } from '@/lib/bulk-qr/i18n'
import { getCardMode, getCardTokens } from '@/lib/bulk-qr/modes'
import type { CardConfig, VoucherCard } from '@/lib/bulk-qr/types'
import { BrandMark } from './brand-mark'
import { CardFrame } from './card-frame'

interface VoucherCardBackProps {
  card: VoucherCard
  config: CardConfig
}

/**
 * Unique voucher back: states which menu item the card is valid for, plus a
 * per-item serial so every printed voucher can be counted against inventory.
 */
export const VoucherCardBack = forwardRef<HTMLDivElement, VoucherCardBackProps>(
  function VoucherCardBack({ card, config }, ref) {
    const tokens = getCardTokens(config)
    const { brand } = getCardMode(config.mode)
    const copy = getVoucherCopy(config.locale)
    const eventName = config.eventName.trim()

    return (
      <CardFrame
        ref={ref}
        face="back"
        tokens={tokens}
        className="tracking-[-0.02em]"
        innerClassName="flex-col justify-between p-3.5"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <BrandMark brand={brand} className="h-3.5 w-3.5 shrink-0" />
            {eventName ? (
              <span
                className="truncate text-[7px] font-medium"
                style={{ color: tokens.mutedForeground }}
              >
                {eventName}
              </span>
            ) : null}
          </div>
          <span
            className="shrink-0 font-mono text-[7px] tabular-nums tracking-normal"
            style={{ color: tokens.accent }}
          >
            {formatSerial(card.serial, card.itemTotal)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span
            className="text-[8px] font-medium"
            style={{ color: tokens.mutedForeground }}
          >
            {copy.lead}
          </span>
          <p className="line-clamp-2 text-balance text-[20px] font-semibold leading-[1.1]">
            {copy.formatItem(card.itemName)}
          </p>
        </div>
      </CardFrame>
    )
  },
)
