import { forwardRef } from 'react'
import type { CardConfig, CardItem } from '@/lib/bulk-qr/types'
import { QrCardBack } from './qr-card-back'
import { QrCardFront } from './qr-card-front'
import { VoucherCardBack } from './voucher-card-back'
import { VoucherCardFront } from './voucher-card-front'

interface VariableCardFaceProps {
  card: CardItem
  config: CardConfig
}

/** Renders the face that is unique to a single card for the card's mode. */
export const VariableCardFace = forwardRef<
  HTMLDivElement,
  VariableCardFaceProps
>(function VariableCardFace({ card, config }, ref) {
  switch (card.kind) {
    case 'redeem':
      return <QrCardFront ref={ref} code={card} config={config} />
    case 'voucher':
      return <VoucherCardBack ref={ref} card={card} config={config} />
  }
})

interface SharedCardFaceProps {
  config: CardConfig
}

/** Renders the face that every card in the current mode has in common. */
export const SharedCardFace = forwardRef<HTMLDivElement, SharedCardFaceProps>(
  function SharedCardFace({ config }, ref) {
    switch (config.mode) {
      case 'redeem':
        return <QrCardBack ref={ref} config={config} />
      case 'voucher':
        return <VoucherCardFront ref={ref} config={config} />
    }
  },
)
