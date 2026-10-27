'use client'

import { useRef, useState } from 'react'
import { Layers, ListPlus, Sparkles } from 'lucide-react'
import { useRedeemSources } from '@/hooks/use-redeem-sources'
import { useVoucherMenu } from '@/hooks/use-voucher-menu'
import { getCardMode, getSharedFace, pluralizeUnit } from '@/lib/bulk-qr/modes'
import {
  LOGO_SIZE_RANGE,
  type CardConfig,
  type CardFace,
  type CardItem,
  type CardMode,
} from '@/lib/bulk-qr/types'
import { CardCustomizer } from './card-customizer'
import { CardPreview } from './card-preview'
import { CardsList } from './cards-list'
import { DownloadActions } from './download-actions'
import { ExportStage, type ExportStageHandle } from './export-stage'
import { MenuEditor } from './menu-editor'
import { ModeSelector } from './mode-selector'
import { RedeemSourcesPanel } from './redeem-sources-panel'

const DEFAULT_CONFIG: CardConfig = {
  mode: 'redeem',
  theme: 'dark',
  qrStyle: 'dots',
  eventName: '',
  locale: 'en',
  logoSize: LOGO_SIZE_RANGE.default,
}

export function BulkQrGenerator() {
  const redeemSources = useRedeemSources()
  const voucherMenu = useVoucherMenu()
  const [config, setConfig] = useState<CardConfig>(DEFAULT_CONFIG)
  const [previewFace, setPreviewFace] = useState<CardFace>('front')
  const stageRef = useRef<ExportStageHandle | null>(null)

  const mode = getCardMode(config.mode)
  const cards: CardItem[] =
    config.mode === 'redeem' ? redeemSources.codes : voucherMenu.cards
  const unitLabel = pluralizeUnit(config.mode, cards.length)

  function handleModeChange(next: CardMode) {
    setConfig((prev) => ({ ...prev, mode: next }))
    setPreviewFace(getCardMode(next).variableFace)
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-6 lg:px-8">
      <header className="flex shrink-0 flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
            <Layers className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Event cards
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Bulk card generator
          </h1>
          <p className="max-w-xl text-pretty text-sm text-muted-foreground">
            Generate print-ready cards in bulk — QR redeem links or menu
            vouchers with tracked quantities — then export them as PNGs or a
            PDF.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:overflow-hidden">
        <aside className="flex flex-col gap-6 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-2 lg:[scrollbar-gutter:stable]">
          <SidebarSection label="Mode">
            <ModeSelector value={config.mode} onChange={handleModeChange} />
          </SidebarSection>

          <SidebarSection
            icon={<ListPlus className="h-3.5 w-3.5" aria-hidden="true" />}
            label={mode.sourceHeading}
          >
            {config.mode === 'redeem' ? (
              <RedeemSourcesPanel sources={redeemSources} />
            ) : (
              <MenuEditor menu={voucherMenu} />
            )}
          </SidebarSection>

          <SidebarSection
            icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
            label="2. Customize"
          >
            <CardCustomizer
              config={config}
              onChange={setConfig}
              onEventNameFocus={() => setPreviewFace('back')}
              onLogoSizeFocus={() => setPreviewFace('front')}
            />
          </SidebarSection>

          <SidebarSection label="3. Export">
            <DownloadActions
              cards={cards}
              config={config}
              getVariableNode={(id) =>
                stageRef.current?.getVariableNode(id) ?? null
              }
              getSharedNode={() => stageRef.current?.getSharedNode() ?? null}
            />
            {cards.length > 0 ? (
              <p className="text-[11px] text-muted-foreground">
                ZIP contains a{' '}
                <span className="font-mono">{mode.variableFace}s/</span> folder
                with one PNG per {mode.unit.singular}, plus a single{' '}
                <span className="font-mono">
                  {getSharedFace(config.mode)}.png
                </span>
                .
              </p>
            ) : null}
          </SidebarSection>
        </aside>

        <div className="flex flex-col gap-6 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-2 lg:[scrollbar-gutter:stable]">
          <div className="lg:sticky lg:top-0 lg:z-10 lg:bg-background lg:pb-6">
            <CardPreview
              key={config.mode}
              cards={cards}
              config={config}
              face={previewFace}
              onFaceChange={setPreviewFace}
            />
          </div>
          {cards.length > 0 ? (
            <CardsList
              title={`${mode.listTitle} · ${cards.length} ${unitLabel}`}
              cards={cards}
            />
          ) : null}
        </div>
      </div>

      <ExportStage ref={stageRef} cards={cards} config={config} />
    </div>
  )
}

function SidebarSection({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {icon ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            {icon}
          </span>
        ) : null}
        {label}
      </div>
      {children}
    </section>
  )
}
