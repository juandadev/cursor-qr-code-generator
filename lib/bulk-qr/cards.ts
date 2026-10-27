import type { CardItem } from './types'

export interface CardSummary {
  /** Primary label shown in lists and under the preview. */
  title: string
  /** Short secondary label (code or serial). */
  detail: string
  /** File-name-safe-ish hint used when exporting this card. */
  fileHint: string
}

export function formatSerial(serial: number, total: number): string {
  const width = String(total).length
  return `${String(serial).padStart(width, '0')}/${total}`
}

export function describeCard(card: CardItem): CardSummary {
  if (card.kind === 'redeem') {
    return { title: card.url, detail: card.code, fileHint: card.code }
  }
  return {
    title: card.itemName,
    detail: formatSerial(card.serial, card.itemTotal),
    fileHint: `${card.itemName}-${card.serial}`,
  }
}
