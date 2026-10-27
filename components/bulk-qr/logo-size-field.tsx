'use client'

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Slider } from '@/components/ui/slider'
import { LOGO_SIZE_RANGE } from '@/lib/bulk-qr/types'

interface LogoSizeFieldProps {
  value: number
  onChange: (value: number) => void
  onFocus?: () => void
}

export function LogoSizeField({
  value,
  onChange,
  onFocus,
}: LogoSizeFieldProps) {
  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="logo-size">Logo size</FieldLabel>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {value}px
        </span>
      </div>
      <Slider
        id="logo-size"
        aria-label="Logo size"
        min={LOGO_SIZE_RANGE.min}
        max={LOGO_SIZE_RANGE.max}
        step={LOGO_SIZE_RANGE.step}
        value={[value]}
        onValueChange={([next]) => onChange(next)}
        onPointerDown={onFocus}
        onFocus={onFocus}
      />
      <FieldDescription>
        Scales the logo on the card front. It stays centered.
      </FieldDescription>
    </Field>
  )
}
