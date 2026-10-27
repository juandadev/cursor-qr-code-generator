import type { CardLocale } from './i18n'

export type CardTheme = 'light' | 'dark'
export type QrStyle = 'square' | 'dots'
export type CardFace = 'front' | 'back'

/**
 * - `redeem`: one card per redeem URL. The front is unique (QR), the back is shared.
 * - `voucher`: one card per menu unit. The front is shared (logo), the back is unique (item).
 */
export type CardMode = 'redeem' | 'voucher'

export type BrandId = 'cursor' | 'raycast'

export interface RedeemCode {
  kind: 'redeem'
  id: string
  url: string
  /** The short code after the last slash, if any. Used as a file name hint. */
  code: string
}

/** A single editable row in the voucher menu. */
export interface MenuItem {
  id: string
  name: string
  quantity: number
}

/** One printable voucher, expanded from a {@link MenuItem}. */
export interface VoucherCard {
  kind: 'voucher'
  id: string
  itemName: string
  /** 1-based position within its menu item (e.g. 3 of 5 espressos). */
  serial: number
  itemTotal: number
}

export type CardItem = RedeemCode | VoucherCard

export interface CardConfig {
  mode: CardMode
  theme: CardTheme
  qrStyle: QrStyle
  eventName: string
  locale: CardLocale
  /** Edge length of the centered brand logo on the voucher front, in CSS px. */
  logoSize: number
}

export const LOGO_SIZE_RANGE = {
  min: 24,
  max: 120,
  step: 4,
  default: 56,
} as const

/**
 * All color roles used inside a printed card. Both sides and the embedded
 * QR all derive their colors from here, so a brand theme is edited in one place.
 */
export interface CardColorTokens {
  /** Card outer background (outside the inner container). */
  background: string
  /** Inner container fill — also used as the QR's effective background. */
  container: string
  /** Inner container hairline border. */
  border: string
  /** Main text, brand marks, and QR dots. */
  foreground: string
  /** Secondary labels, event/city name, divider caps. */
  mutedForeground: string
  /** Brand accent for headlines, links, and highlights. */
  accent: string
}

/** Physical card dimensions, in CSS pixels. This is the exact size used for export. */
export const CARD_WIDTH = 249
export const CARD_HEIGHT = 165

/**
 * Aspect ratio (width / height) of a single card. The printed card preserves
 * this exactly so the design never gets distorted — users configure width,
 * height is derived from it.
 */
export const CARD_ASPECT = CARD_WIDTH / CARD_HEIGHT

/**
 * Size of the QR code rendered on the front of the card.
 * Must fit inside the QR column (30% of ~231px inner width ≈ 69px).
 */
export const QR_SIZE = 64

/**
 * Scale factor used for on-screen preview. The card still renders at its real
 * pixel size internally (so the export matches exactly), but is visually
 * enlarged via CSS transform. Keeps aspect ratio intact.
 */
export const PREVIEW_SCALE = 2
