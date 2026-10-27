'use client'

import { useMemo, useState } from 'react'
import {
  DEFAULT_MENU,
  createMenuItem,
  expandMenu,
  isCompleteMenuItem,
} from '@/lib/bulk-qr/menu'
import type { MenuItem, VoucherCard } from '@/lib/bulk-qr/types'

export type MenuItemPatch = Partial<Omit<MenuItem, 'id'>>

export interface VoucherMenu {
  items: MenuItem[]
  cards: VoucherCard[]
  incompleteCount: number
  addItem: () => void
  updateItem: (id: string, patch: MenuItemPatch) => void
  removeItem: (id: string) => void
}

/** Owns the editable menu and expands it into one voucher per unit. */
export function useVoucherMenu(): VoucherMenu {
  const [items, setItems] = useState<MenuItem[]>(DEFAULT_MENU)

  const cards = useMemo(() => expandMenu(items), [items])
  const incompleteCount = useMemo(
    () => items.filter((item) => !isCompleteMenuItem(item)).length,
    [items],
  )

  return {
    items,
    cards,
    incompleteCount,
    addItem: () => setItems((prev) => [...prev, createMenuItem()]),
    updateItem: (id, patch) =>
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      ),
    removeItem: (id) =>
      setItems((prev) => prev.filter((item) => item.id !== id)),
  }
}
