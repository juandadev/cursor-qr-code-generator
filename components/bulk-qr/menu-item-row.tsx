'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { MenuItemPatch } from '@/hooks/use-voucher-menu'
import { MENU_LIMITS, parseQuantity } from '@/lib/bulk-qr/menu'
import type { MenuItem } from '@/lib/bulk-qr/types'

interface MenuItemRowProps {
  item: MenuItem
  position: number
  canRemove: boolean
  onChange: (patch: MenuItemPatch) => void
  onRemove: () => void
}

export function MenuItemRow({
  item,
  position,
  canRemove,
  onChange,
  onRemove,
}: MenuItemRowProps) {
  const label = item.name.trim() || `item ${position}`

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_5rem_2.25rem] items-center gap-2">
      <Input
        value={item.name}
        onChange={(event) => onChange({ name: event.target.value })}
        placeholder="e.g. Flat white"
        maxLength={MENU_LIMITS.nameMax}
        aria-label={`Name for menu item ${position}`}
        autoComplete="off"
      />
      <Input
        type="number"
        inputMode="numeric"
        min={MENU_LIMITS.quantityMin}
        max={MENU_LIMITS.quantityMax}
        step={1}
        value={item.quantity || ''}
        onChange={(event) =>
          onChange({ quantity: parseQuantity(event.target.value) })
        }
        placeholder="0"
        aria-label={`Quantity of ${label}`}
        className="text-right font-mono tabular-nums"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label={`Remove ${label}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </li>
  )
}
