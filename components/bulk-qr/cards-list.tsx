import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { describeCard } from '@/lib/bulk-qr/cards'
import type { CardItem } from '@/lib/bulk-qr/types'

interface CardsListProps {
  title: string
  cards: CardItem[]
}

export function CardsList({ title, cards }: CardsListProps) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Badge variant="secondary" className="font-mono tabular-nums">
          {cards.length}
        </Badge>
      </header>
      <ScrollArea className="h-[220px]">
        <ol className="divide-y divide-border text-xs">
          {cards.map((card, index) => {
            const summary = describeCard(card)
            return (
              <li key={card.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="w-6 shrink-0 text-right font-mono tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="truncate font-mono text-foreground">
                  {summary.title}
                </span>
                <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {summary.detail.slice(0, 14)}
                </span>
              </li>
            )
          })}
        </ol>
      </ScrollArea>
    </section>
  )
}
