import { cn } from '@/lib/utils'

interface RaycastLogoProps {
  className?: string
  title?: string
}

/** Official Raycast mark. Uses `currentColor` so it follows the card theme. */
export function RaycastLogo({
  className,
  title = 'Raycast',
}: RaycastLogoProps) {
  return (
    <svg
      viewBox="0 0 150 150"
      className={cn('block', className)}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.5054 96.8518V112.5L0 75L7.82255 67.1786L37.5054 96.8625V96.8518ZM53.1558 112.5H37.5054L75.0107 150L82.8333 142.179L53.1558 112.5ZM142.172 82.8321L150 75L74.9893 0L67.1775 7.85357L96.8549 37.5214H78.922L58.2083 16.8536L50.3858 24.675L63.2715 37.5536H54.2703V95.7643H112.484V86.7643L125.37 99.6429L133.192 91.8214L112.484 71.1107V53.1804L142.172 82.8321ZM41.4166 33.6214L33.5673 41.4536L41.9685 49.8429L49.7964 42.0214L41.4166 33.6214ZM108.026 100.221L100.204 108.054L108.594 116.454L116.427 108.621L108.026 100.221ZM24.6249 50.4107L16.7917 58.2429L37.5054 78.9536V63.2946L24.6249 50.4107ZM86.7552 112.532H71.0887L91.8024 133.243L99.6357 125.411L86.7552 112.532Z"
        fill="currentColor"
      />
    </svg>
  )
}
