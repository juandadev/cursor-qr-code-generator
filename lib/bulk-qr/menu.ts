import type { MenuItem, VoucherCard } from './types'

export const MENU_LIMITS = {
  nameMax: 32,
  quantityMin: 1,
  quantityMax: 500,
} as const

/** Stable ids so the initial menu renders identically on server and client. */
export const DEFAULT_MENU: MenuItem[] = [
  { id: 'menu-espresso', name: 'Espresso', quantity: 5 },
  { id: 'menu-cappuccino', name: 'Cappuccino', quantity: 10 },
  { id: 'menu-latte', name: 'Latte', quantity: 15 },
]

export function createMenuItem(): MenuItem {
  return { id: `menu-${crypto.randomUUID()}`, name: '', quantity: 1 }
}

export function parseQuantity(raw: string): number {
  const parsed = Number.parseInt(raw, 10)
  if (Number.isNaN(parsed)) return 0
  return Math.min(Math.max(parsed, 0), MENU_LIMITS.quantityMax)
}

export function isCompleteMenuItem(item: MenuItem): boolean {
  return item.name.trim().length > 0 && item.quantity >= MENU_LIMITS.quantityMin
}

/** Expands every complete menu item into one voucher per unit, in menu order. */
export function expandMenu(items: MenuItem[]): VoucherCard[] {
  return items.filter(isCompleteMenuItem).flatMap((item) => {
    const itemName = item.name.trim()
    return Array.from({ length: item.quantity }, (_, index) => ({
      kind: 'voucher' as const,
      id: `${item.id}-${index + 1}`,
      itemName,
      serial: index + 1,
      itemTotal: item.quantity,
    }))
  })
}
