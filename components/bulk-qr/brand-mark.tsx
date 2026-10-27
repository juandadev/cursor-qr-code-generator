import { getBrand } from '@/lib/bulk-qr/brands'
import type { BrandId } from '@/lib/bulk-qr/types'
import { CursorLogo } from './cursor-logo'
import { RaycastLogo } from './raycast-logo'

interface BrandMarkProps {
  brand: BrandId
  className?: string
}

export function BrandMark({ brand, className }: BrandMarkProps) {
  const { name } = getBrand(brand)
  switch (brand) {
    case 'cursor':
      return <CursorLogo className={className} title={name} />
    case 'raycast':
      return <RaycastLogo className={className} title={name} />
  }
}
