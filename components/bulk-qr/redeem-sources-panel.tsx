'use client'

import type { RedeemSources } from '@/hooks/use-redeem-sources'
import { CsvUploader } from './csv-uploader'
import { ManualLinksInput } from './manual-links-input'

interface RedeemSourcesPanelProps {
  sources: RedeemSources
}

export function RedeemSourcesPanel({ sources }: RedeemSourcesPanelProps) {
  const total = sources.codes.length

  return (
    <>
      <CsvUploader
        fileName={sources.fileName}
        codeCount={sources.csvCodes.length}
        onCodesParsed={sources.setCsv}
        onReset={sources.resetCsv}
      />
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Optional
          </span>
        </div>
      </div>
      <ManualLinksInput
        value={sources.manualLinks}
        codeCount={sources.manualCodeCount}
        skippedCount={sources.manualSkippedCount}
        onChange={sources.setManualLinks}
      />
      <p className="text-[11px] text-muted-foreground">
        {total > 0
          ? `Using ${total} total ${total === 1 ? 'link' : 'links'} (${describeCodeSources(sources.csvCodes.length, sources.manualCodeCount)}).`
          : 'Upload a CSV, paste links, or combine both before exporting.'}
      </p>
    </>
  )
}

function describeCodeSources(csvCount: number, manualCount: number) {
  if (csvCount > 0 && manualCount > 0) {
    return `${csvCount} from CSV, ${manualCount} manual`
  }
  if (csvCount > 0) return `${csvCount} from CSV`
  if (manualCount > 0) return `${manualCount} manual`
  return '0'
}
