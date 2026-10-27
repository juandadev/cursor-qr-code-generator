import { describeCard } from './cards'
import { sanitizeFileSegment } from './export'
import { getCardMode, getSharedFace } from './modes'
import type { CardConfig, CardItem } from './types'

/** Base name for downloaded files: the event name, else the brand id. */
export function getExportSlug(config: Pick<CardConfig, 'eventName' | 'mode'>) {
  return sanitizeFileSegment(config.eventName) || getCardMode(config.mode).brand
}

export function getVariableFileName(
  card: CardItem,
  index: number,
  config: Pick<CardConfig, 'mode'>,
): string {
  const hint =
    sanitizeFileSegment(describeCard(card).fileHint) ||
    getCardMode(config.mode).unit.singular
  return `${String(index + 1).padStart(3, '0')}-${hint}.png`
}

export function getVariableFolderName(config: Pick<CardConfig, 'mode'>) {
  return `${getCardMode(config.mode).variableFace}s`
}

export function getSharedFileName(config: Pick<CardConfig, 'mode'>) {
  return `${getSharedFace(config.mode)}.png`
}
