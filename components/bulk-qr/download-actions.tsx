'use client'

import { useState } from 'react'
import { Download, Package, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
import {
  nodeToPngBlob,
  triggerDownload,
  zipCards,
  type CardAsset,
} from '@/lib/bulk-qr/export'
import {
  getExportSlug,
  getSharedFileName,
  getVariableFileName,
  getVariableFolderName,
} from '@/lib/bulk-qr/export-naming'
import { describeCard } from '@/lib/bulk-qr/cards'
import { getSharedFace } from '@/lib/bulk-qr/modes'
import type { CardConfig, CardItem } from '@/lib/bulk-qr/types'
import type { ExportStageHandle } from './export-stage'
import { PdfExportDialog } from './pdf-export-dialog.lazy'

interface DownloadActionsProps {
  cards: CardItem[]
  config: CardConfig
  /**
   * Returns the per-card face element for the given card id. The element
   * must be currently mounted and visible for html-to-image to capture it.
   */
  getVariableNode: ExportStageHandle['getVariableNode']
  getSharedNode: ExportStageHandle['getSharedNode']
  getBlankNode: ExportStageHandle['getBlankNode']
}

type Status =
  | { kind: 'idle' }
  | { kind: 'working'; label: string; progress: number }
  | { kind: 'error'; message: string }

export function DownloadActions({
  cards,
  config,
  getVariableNode,
  getSharedNode,
  getBlankNode,
}: DownloadActionsProps) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const sharedFace = getSharedFace(config.mode)

  async function handleDownloadShared() {
    try {
      const node = getSharedNode()
      if (!node) throw new Error(`The card ${sharedFace} is not available.`)
      setStatus({
        kind: 'working',
        label: `Rendering ${sharedFace}…`,
        progress: 100,
      })
      const blob = await nodeToPngBlob(node)
      triggerDownload(blob, `${getExportSlug(config)}-${sharedFace}.png`)
      setStatus({ kind: 'idle' })
    } catch (err) {
      setStatus({
        kind: 'error',
        message:
          err instanceof Error
            ? err.message
            : `Failed to render the card ${sharedFace}.`,
      })
    }
  }

  async function handleDownloadAll() {
    try {
      const total = cards.length + 1
      const assets: CardAsset[] = []

      setStatus({ kind: 'working', label: 'Rendering cards…', progress: 0 })

      for (const [index, card] of cards.entries()) {
        const node = getVariableNode(card.id)
        if (!node)
          throw new Error(`Missing card for ${describeCard(card).title}.`)
        const blob = await nodeToPngBlob(node)
        assets.push({
          fileName: getVariableFileName(card, index, config),
          blob,
        })
        setStatus({
          kind: 'working',
          label: `Rendered ${index + 1} of ${cards.length} cards…`,
          progress: Math.round(((index + 1) / total) * 100),
        })
      }

      const sharedNode = getSharedNode()
      if (!sharedNode) {
        throw new Error(`The card ${sharedFace} is not available.`)
      }
      const sharedBlob = await nodeToPngBlob(sharedNode)
      setStatus({ kind: 'working', label: 'Packaging ZIP…', progress: 100 })

      const zip = await zipCards({
        folderName: getVariableFolderName(config),
        assets,
        shared: { fileName: getSharedFileName(config), blob: sharedBlob },
      })
      triggerDownload(zip, `${getExportSlug(config)}-cards.zip`)
      setStatus({ kind: 'idle' })
    } catch (err) {
      setStatus({
        kind: 'error',
        message:
          err instanceof Error ? err.message : 'Failed to generate the ZIP.',
      })
    }
  }

  const isWorking = status.kind === 'working'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleDownloadAll}
          disabled={isWorking || cards.length === 0}
          className="w-full"
        >
          {isWorking ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <Package className="h-4 w-4" aria-hidden="true" />
          )}
          Download all ({cards.length})
        </Button>
        <Button
          onClick={handleDownloadShared}
          disabled={isWorking}
          variant="outline"
          className="w-full"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download {sharedFace}
        </Button>
        <PdfExportDialog
          cards={cards}
          config={config}
          getVariableNode={getVariableNode}
          getSharedNode={getSharedNode}
          getBlankNode={getBlankNode}
          externallyDisabled={isWorking}
        />
      </div>

      {isWorking ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{status.label}</span>
            <span>{status.progress}%</span>
          </div>
          <Progress value={status.progress} />
        </div>
      ) : null}

      <AlertDialog
        open={status.kind === 'error'}
        onOpenChange={(open) => {
          if (!open) setStatus({ kind: 'idle' })
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle
                className="h-4 w-4 text-destructive"
                aria-hidden="true"
              />
              Export failed
            </AlertDialogTitle>
            <AlertDialogDescription>
              {status.kind === 'error' ? status.message : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setStatus({ kind: 'idle' })}>
              Dismiss
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
