'use client'

import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { VoucherMenu } from '@/hooks/use-voucher-menu'
import { MenuItemRow } from './menu-item-row'

interface MenuEditorProps {
  menu: VoucherMenu
}

export function MenuEditor({ menu }: MenuEditorProps) {
  const { items, cards, incompleteCount } = menu

  return (
    <div className="flex flex-col gap-3">
      <div
        className="grid grid-cols-[minmax(0,1fr)_5rem_2.25rem] gap-2 text-[11px] font-medium text-muted-foreground"
        aria-hidden="true"
      >
        <span>Item</span>
        <span className="text-right">Qty</span>
      </div>

      <ul className="flex flex-col gap-2" aria-label="Menu items">
        {items.map((item, index) => (
          <MenuItemRow
            key={item.id}
            item={item}
            position={index + 1}
            canRemove={items.length > 1}
            onChange={(patch) => menu.updateItem(item.id, patch)}
            onRemove={() => menu.removeItem(item.id)}
          />
        ))}
      </ul>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={menu.addItem}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add item
      </Button>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary" className="font-mono tabular-nums">
          {cards.length} {cards.length === 1 ? 'voucher' : 'vouchers'}
        </Badge>
        <span>One card is generated per unit.</span>
      </div>

      {incompleteCount > 0 ? (
        <p role="status" className="text-xs text-destructive">
          Skipping {incompleteCount} {incompleteCount === 1 ? 'item' : 'items'}{' '}
          without a name or quantity.
        </p>
      ) : null}
    </div>
  )
}
