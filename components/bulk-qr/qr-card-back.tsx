import { forwardRef } from 'react'
import { getCardTokens } from '@/lib/bulk-qr/modes'
import type { CardConfig } from '@/lib/bulk-qr/types'
import { CardFrame } from './card-frame'
import { CursorLogo, CursorWordmark } from './cursor-logo'

interface QrCardBackProps {
  config: CardConfig
}

/**
 * Shared back of a redeem card, centered around the Cursor mark, wordmark,
 * and an optional event/city name.
 */
export const QrCardBack = forwardRef<HTMLDivElement, QrCardBackProps>(
  function QrCardBack({ config }, ref) {
    const tokens = getCardTokens(config)
    const eventName = config.eventName.trim()

    return (
      <CardFrame
        ref={ref}
        face="back"
        tokens={tokens}
        className="tracking-[-0.06em]"
        innerClassName="items-center justify-center"
      >
        <div className="flex flex-col items-center gap-2.5">
          <CursorLogo className="h-10 w-auto" />
          <CursorWordmark className="h-[18px] w-auto" />
          {eventName ? (
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <span
                className="h-px w-8"
                style={{ background: tokens.border }}
                aria-hidden="true"
              />
              <span
                className="text-[14px]"
                style={{ color: tokens.mutedForeground }}
              >
                {eventName}
              </span>
            </div>
          ) : null}
        </div>
      </CardFrame>
    )
  },
)
