import { getBrand } from './brands'
import type {
  BrandId,
  CardColorTokens,
  CardConfig,
  CardFace,
  CardMode,
} from './types'

export interface CardModeDefinition {
  id: CardMode
  label: string
  description: string
  brand: BrandId
  /** The face that changes per card. The opposite face is shared by all cards. */
  variableFace: CardFace
  unit: { singular: string; plural: string }
  sourceHeading: string
  listTitle: string
  eventPlaceholder: string
  emptyState: { title: string; description: string }
}

export const CARD_MODES: Record<CardMode, CardModeDefinition> = {
  redeem: {
    id: 'redeem',
    label: 'Redeem links',
    description:
      'One card per URL with a unique QR on the front. Cursor-branded credit cards.',
    brand: 'cursor',
    variableFace: 'front',
    unit: { singular: 'code', plural: 'codes' },
    sourceHeading: '1. Add codes',
    listTitle: 'Loaded codes',
    eventPlaceholder: 'e.g. Cursor Meetup Lisbon',
    emptyState: {
      title: 'Add codes to preview',
      description:
        'Upload a CSV or paste links manually to see each card render here with your styling applied.',
    },
  },
  voucher: {
    id: 'voucher',
    label: 'Menu vouchers',
    description:
      'One card per menu unit, so every voucher printed matches your inventory. Raycast-branded.',
    brand: 'raycast',
    variableFace: 'back',
    unit: { singular: 'voucher', plural: 'vouchers' },
    sourceHeading: '1. Build menu',
    listTitle: 'Voucher run',
    eventPlaceholder: 'e.g. Raycast Café',
    emptyState: {
      title: 'Add menu items to preview',
      description:
        'Add at least one item with a quantity to generate a voucher for every unit.',
    },
  },
}

export const CARD_MODE_OPTIONS: readonly CardModeDefinition[] =
  Object.values(CARD_MODES)

export function getCardMode(mode: CardMode): CardModeDefinition {
  return CARD_MODES[mode]
}

export function getSharedFace(mode: CardMode): CardFace {
  return getCardMode(mode).variableFace === 'front' ? 'back' : 'front'
}

export function getCardTokens(
  config: Pick<CardConfig, 'mode' | 'theme'>,
): CardColorTokens {
  return getBrand(getCardMode(config.mode).brand).tokens[config.theme]
}

export function pluralizeUnit(mode: CardMode, count: number): string {
  const { unit } = getCardMode(mode)
  return count === 1 ? unit.singular : unit.plural
}
