'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, Download, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  nodeToPngBlob,
  PRINT_SCALE,
  triggerDownload,
} from '@/lib/bulk-qr/export'
import { getExportSlug } from '@/lib/bulk-qr/export-naming'
import { describeCard } from '@/lib/bulk-qr/cards'
import { getCardMode, getSharedFace } from '@/lib/bulk-qr/modes'
import {
  computePdfLayout,
  countPdfPages,
  DEFAULT_PDF_SETTINGS,
  generateCardsPdf,
  type PdfExportSettings,
} from '@/lib/bulk-qr/pdf'
import type { CardConfig, CardFace, CardItem } from '@/lib/bulk-qr/types'

import { PdfExportFields } from './pdf-export-fields'
import { PdfLayoutPreview } from './pdf-layout-preview'

interface PdfExportDialogProps {
  cards: CardItem[]
  config: CardConfig
  getVariableNode: (cardId: string) => HTMLElement | null
  /**
   * Returns the face every card shares. It's identical for all cards, so we
   * only render it once and tile it on a single final page in the PDF.
   */
  getSharedNode: () => HTMLElement | null
  /** Blank write-in face used to fill spare slots on the last per-card page. */
  getBlankNode: () => HTMLElement | null
  /** Disables the trigger while other exports are in-flight. */
  externallyDisabled?: boolean
}

type Status =
  | { kind: 'idle' }
  | { kind: 'rendering'; done: number; total: number }
  | { kind: 'packaging' }
  | { kind: 'error'; message: string }

/**
 * Orchestrates the "Export as PDF" flow:
 *   1. User tweaks paper / layout settings.
 *   2. SVG preview updates live (cards/page, total pages).
 *   3. On download, render each per-card face at print-ready DPI, then hand off
 *      to {@link generateCardsPdf} which lays them on real-world mm pages.
 */
export function PdfExportDialog({
  cards,
  config,
  getVariableNode,
  getSharedNode,
  getBlankNode,
  externallyDisabled,
}: PdfExportDialogProps) {
  const { variableFace, unit } = getCardMode(config.mode)
  const sharedFace = getSharedFace(config.mode)
  const [open, setOpen] = useState(false)
  const [settings, setSettings] =
    useState<PdfExportSettings>(DEFAULT_PDF_SETTINGS)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const layout = useMemo(() => computePdfLayout(settings), [settings])
  const totalPages = countPdfPages(cards.length, layout)
  const cardsOnFirstPage = Math.min(cards.length, layout.perPage)
  const canDownload = layout.perPage > 0 && cards.length > 0

  const isBusy = status.kind === 'rendering' || status.kind === 'packaging'

  async function handleDownload() {
    if (!canDownload) return
    try {
      setStatus({ kind: 'rendering', done: 0, total: cards.length })

      const variable: Blob[] = []
      for (let i = 0; i < cards.length; i += 1) {
        const node = getVariableNode(cards[i].id)
        if (!node) {
          throw new Error(`Missing card for ${describeCard(cards[i]).title}.`)
        }
        const blob = await nodeToPngBlob(node, { pixelRatio: PRINT_SCALE })
        variable.push(blob)
        setStatus({ kind: 'rendering', done: i + 1, total: cards.length })
      }

      setStatus({ kind: 'packaging' })

      // Render the shared face exactly once — it's identical for every card,
      // so a single tiled page is appended to the PDF.
      const sharedNode = getSharedNode()
      if (!sharedNode) {
        throw new Error(`The card ${sharedFace} is not available.`)
      }
      const sharedBlob = await nodeToPngBlob(sharedNode, {
        pixelRatio: PRINT_SCALE,
      })

      const blankNode = getBlankNode()
      const fillerBlob = blankNode
        ? await nodeToPngBlob(blankNode, { pixelRatio: PRINT_SCALE })
        : undefined

      const slug = getExportSlug(config)
      const pdfBlob = await generateCardsPdf({
        variable,
        shared: sharedBlob,
        filler: fillerBlob,
        layout,
        documentTitle: `${slug}-cards`,
      })
      triggerDownload(pdfBlob, `${slug}-cards.pdf`)

      setStatus({ kind: 'idle' })
      setOpen(false)
    } catch (err) {
      setStatus({
        kind: 'error',
        message:
          err instanceof Error ? err.message : 'Failed to generate the PDF.',
      })
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isBusy) return // lock while working
    setOpen(nextOpen)
    if (!nextOpen) setStatus({ kind: 'idle' })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full"
          disabled={externallyDisabled || cards.length === 0}
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          Export as PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export as PDF</DialogTitle>
          <DialogDescription>
            Pick a paper size and layout. We&apos;ll generate a print-ready PDF
            using real-world millimeter sizing, with gaps between cards so you
            can trim cleanly. One extra page of tiled card {sharedFace}s is
            appended at the end.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <PdfExportFields
            settings={settings}
            onChange={setSettings}
            disabled={isBusy}
          />

          <div className="flex flex-col gap-3">
            <PdfLayoutPreview
              layout={layout}
              filledOnFirstPage={cardsOnFirstPage}
            />
            <LayoutStats
              cols={layout.cols}
              rows={layout.rows}
              perPage={layout.perPage}
              totalCards={cards.length}
              totalVariablePages={totalPages}
              unitPlural={unit.plural}
              variableFace={variableFace}
              sharedFace={sharedFace}
            />
          </div>
        </div>

        {status.kind === 'error' ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Export failed</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        ) : null}

        {isBusy ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {status.kind === 'rendering'
                  ? `Rendering ${status.done} of ${status.total} cards…`
                  : 'Assembling PDF…'}
              </span>
              <span>
                {status.kind === 'rendering' && status.total > 0
                  ? `${Math.round((status.done / status.total) * 100)}%`
                  : null}
              </span>
            </div>
            <Progress
              value={
                status.kind === 'rendering' && status.total > 0
                  ? Math.round((status.done / status.total) * 100)
                  : undefined
              }
            />
          </div>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isBusy}
          >
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={isBusy || !canDownload}>
            {isBusy ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" aria-hidden="true" />
            )}
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface LayoutStatsProps {
  cols: number
  rows: number
  perPage: number
  totalCards: number
  /** Number of per-card pages, not counting the single appended shared page. */
  totalVariablePages: number
  unitPlural: string
  variableFace: CardFace
  sharedFace: CardFace
}

function LayoutStats({
  cols,
  rows,
  perPage,
  totalCards,
  totalVariablePages,
  unitPlural,
  variableFace,
  sharedFace,
}: LayoutStatsProps) {
  const hasCards = totalVariablePages > 0
  // One tiled shared-face page is always appended when there are any cards.
  const totalPages = hasCards ? totalVariablePages + 1 : 0
  return (
    <dl className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-3 text-sm">
      <StatRow
        label="Cards per page"
        value={perPage > 0 ? `${cols} × ${rows} = ${perPage}` : '0'}
      />
      <StatRow label={`Total ${unitPlural}`} value={`${totalCards}`} />
      <StatRow
        label="Pages"
        value={
          hasCards
            ? `${totalPages} (${totalVariablePages} ${variableFace} + 1 ${sharedFace})`
            : '0'
        }
        tone={totalPages === 0 ? 'warn' : 'default'}
      />
      <StatRow
        label={`Last ${variableFace} page fill`}
        value={
          perPage > 0 && totalCards > 0
            ? `${totalCards - (totalVariablePages - 1) * perPage} / ${perPage}`
            : '—'
        }
      />
    </dl>
  )
}

interface StatRowProps {
  label: string
  value: string
  tone?: 'default' | 'warn'
}

function StatRow({ label, value, tone = 'default' }: StatRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={
          tone === 'warn'
            ? 'font-mono text-sm tabular-nums text-destructive'
            : 'font-mono text-sm tabular-nums text-foreground'
        }
      >
        {value}
      </dd>
    </div>
  )
}
