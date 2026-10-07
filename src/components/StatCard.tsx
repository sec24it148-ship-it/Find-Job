import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  hint?: string
  tone?: 'primary' | 'success' | 'warning' | 'neutral'
}

const tones = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/25 text-warning-foreground',
  neutral: 'bg-muted text-foreground',
}

export function StatCard({ label, value, icon: Icon, hint, tone = 'primary' }: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn('flex size-8 items-center justify-center rounded-lg', tones[tone])}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
