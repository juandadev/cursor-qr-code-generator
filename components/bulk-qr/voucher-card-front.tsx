import { forwardRef } from 'react'
import { getCardMode, getCardTokens } from '@/lib/bulk-qr/modes'
import type { CardConfig } from '@/lib/bulk-qr/types'
import { BrandMark } from './brand-mark'
import { CardFrame } from './card-frame'

interface VoucherCardFrontProps {
  config: CardConfig
}

/** Shared voucher front: the brand mark alone, dead center. */
export const VoucherCardFront = forwardRef<
  HTMLDivElement,
  VoucherCardFrontProps
>(function VoucherCardFront({ config }, ref) {
  const tokens = getCardTokens(config)
  const { brand } = getCardMode(config.mode)

  return (
    <CardFrame
      ref={ref}
      face="front"
      tokens={tokens}
      innerClassName="items-center justify-center"
    >
      <span style={{ color: tokens.accent }}>
        <BrandMark brand={brand} className="h-14 w-14" />
      </span>
    </CardFrame>
  )
})
