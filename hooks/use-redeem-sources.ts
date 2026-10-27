'use client'

import { useMemo, useState } from 'react'
import { parseManualRedeemLinks } from '@/lib/bulk-qr/csv-parser'
import type { RedeemCode } from '@/lib/bulk-qr/types'

export interface RedeemSources {
  codes: RedeemCode[]
  csvCodes: RedeemCode[]
  fileName: string | null
  manualLinks: string
  manualCodeCount: number
  manualSkippedCount: number
  setManualLinks: (value: string) => void
  setCsv: (codes: RedeemCode[], fileName: string) => void
  resetCsv: () => void
}

/** Combines CSV-uploaded and manually pasted redeem links into one list. */
export function useRedeemSources(): RedeemSources {
  const [csvCodes, setCsvCodes] = useState<RedeemCode[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [manualLinks, setManualLinks] = useState('')

  const manualInput = useMemo(
    () => parseManualRedeemLinks(manualLinks),
    [manualLinks],
  )
  const codes = useMemo(
    () => [...csvCodes, ...manualInput.codes],
    [csvCodes, manualInput.codes],
  )

  return {
    codes,
    csvCodes,
    fileName,
    manualLinks,
    manualCodeCount: manualInput.codes.length,
    manualSkippedCount: manualInput.skipped,
    setManualLinks,
    setCsv: (parsed, name) => {
      setCsvCodes(parsed)
      setFileName(name)
    },
    resetCsv: () => {
      setCsvCodes([])
      setFileName(null)
    },
  }
}
