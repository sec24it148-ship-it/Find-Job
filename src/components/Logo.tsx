import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function Logo({ to = '/', className }: { to?: string; className?: string }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2 font-extrabold tracking-tight', className)} aria-label="1DHire home">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground">
        1D
      </span>
      <span className="text-lg">
        1D<span className="text-primary">Hire</span>
      </span>
    </Link>
  )
}
