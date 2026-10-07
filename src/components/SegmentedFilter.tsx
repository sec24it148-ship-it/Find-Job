import { cn } from '@/lib/utils'

interface SegmentedFilterProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; count?: number }[]
}

export function SegmentedFilter({ label, value, onChange, options }: SegmentedFilterProps) {
  return (
    <div role="group" aria-label={label} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors',
              active ? 'border-primary bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={cn('rounded-full px-1.5 text-xs', active ? 'bg-primary-foreground/20' : 'bg-muted')}>{o.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
