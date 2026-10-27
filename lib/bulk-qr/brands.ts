import type { BrandId, CardColorTokens, CardTheme } from './types'

export interface BrandDefinition {
  id: BrandId
  name: string
  tokens: Record<CardTheme, CardColorTokens>
}

export const BRANDS: Record<BrandId, BrandDefinition> = {
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    tokens: {
      dark: {
        background: '#15120B',
        container: '#1C1B16',
        border: '#33322D',
        foreground: '#FDFDFB',
        mutedForeground: '#969590',
        accent: '#D95910',
      },
      light: {
        background: '#FAFAF9',
        container: '#F5F5F4',
        border: '#D6D3D1',
        foreground: '#0C0A09',
        mutedForeground: '#79716B',
        accent: '#CE530D',
      },
    },
  },
  raycast: {
    id: 'raycast',
    name: 'Raycast',
    tokens: {
      dark: {
        background: '#070709',
        container: '#111114',
        border: '#2A2A30',
        foreground: '#F4F4F6',
        mutedForeground: '#8B8B94',
        accent: '#FF6363',
      },
      light: {
        background: '#FFFFFF',
        container: '#F6F6F8',
        border: '#DCDCE1',
        foreground: '#111114',
        mutedForeground: '#6B6B75',
        accent: '#E5484D',
      },
    },
  },
}

export function getBrand(id: BrandId): BrandDefinition {
  return BRANDS[id]
}
