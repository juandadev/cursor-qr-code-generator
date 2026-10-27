export type CardLocale = 'en' | 'es'

/**
 * All strings printed on the cards. Kept here so the card components stay
 * presentational and translations live in one strongly-typed source.
 *
 * Spanish copy targets es-MX and intentionally leaves proper nouns like
 * "Team" (the name of a Cursor plan) untranslated.
 */
export interface RedeemCopy {
  eyebrow: string
  headline: string
  steps: {
    scan: string
    signIn: string
    redeem: string
  }
}

export interface VoucherCopy {
  lead: string
  formatItem: (itemName: string) => string
}

const REDEEM_COPY: Record<CardLocale, RedeemCopy> = {
  en: {
    eyebrow: 'Cursor credits',
    headline: 'Scan to redeem',
    steps: {
      scan: 'Scan the QR.',
      signIn: 'Sign in (personal account, not Team).',
      redeem: 'Redeem — applies to your next invoice.',
    },
  },
  es: {
    eyebrow: 'Créditos de Cursor',
    headline: 'Escanea para canjear',
    steps: {
      scan: 'Escanea el QR.',
      signIn: 'Inicia sesión (cuenta personal, no Team).',
      redeem: 'Canjéalo — se aplica a tu próxima factura.',
    },
  },
}

// Spanish skips the article: item genders are unknown ("un espresso", "una horchata").
const VOUCHER_COPY: Record<CardLocale, VoucherCopy> = {
  en: {
    lead: 'This is valid for',
    formatItem: (itemName) => `${indefiniteArticle(itemName)} ${itemName}.`,
  },
  es: {
    lead: 'Este cupón es válido por',
    formatItem: (itemName) => `${itemName}.`,
  },
}

export function getRedeemCopy(locale: CardLocale): RedeemCopy {
  return REDEEM_COPY[locale]
}

export function getVoucherCopy(locale: CardLocale): VoucherCopy {
  return VOUCHER_COPY[locale]
}

function indefiniteArticle(word: string): 'a' | 'an' {
  const lower = word.trim().toLowerCase()
  if (/^(hour|honest|honou?r|heir)/.test(lower)) return 'an'
  if (/^(uni|use|usu|eu|one|once)/.test(lower)) return 'a'
  return /^[aeiou]/.test(lower) ? 'an' : 'a'
}

export const CARD_LOCALE_OPTIONS: ReadonlyArray<{
  value: CardLocale
  label: string
  ariaLabel: string
}> = [
  { value: 'en', label: 'EN', ariaLabel: 'English' },
  { value: 'es', label: 'ES', ariaLabel: 'Spanish (Mexico)' },
]
