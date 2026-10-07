import { Link } from 'react-router-dom'
import { MapPin, Navigation } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Job } from '@/types'

interface MapPreviewProps {
  jobs: Job[]
  highlightId?: string
  className?: string
  label?: string
}

export function MapPreview({ jobs, highlightId, className, label = 'Chennai' }: MapPreviewProps) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl border bg-secondary', className)}
      role="img"
      aria-label={`Map preview showing ${jobs.length} jobs near ${label}`}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 62 C 25 55, 45 70, 100 58" stroke="white" strokeWidth="2.5" fill="none" />
        <path d="M38 0 C 42 30, 48 60, 55 100" stroke="white" strokeWidth="2" fill="none" />
        <path d="M100 20 C 80 40, 78 70, 85 100" stroke="oklch(0.85 0.06 230)" strokeWidth="5" fill="none" />
      </svg>

      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" aria-hidden="true">
        <span className="relative flex size-4">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40" />
          <span className="relative inline-flex size-4 rounded-full border-2 border-white bg-primary" />
        </span>
      </div>

      {jobs.map((job) => (
        <Link
          key={job.id}
          to={`/seeker/jobs/${job.id}`}
          className="group absolute -translate-x-1/2 -translate-y-full focus-visible:outline-none"
          style={{ left: `${job.map.x}%`, top: `${job.map.y}%` }}
          aria-label={`${job.title} in ${job.location}, ${formatCurrency(job.salary)}`}
        >
          <span
            className={cn(
              'mb-0.5 hidden rounded-md bg-card px-1.5 py-0.5 text-[10px] font-bold whitespace-nowrap shadow-sm group-hover:block group-focus-visible:block',
              highlightId === job.id && 'block',
            )}
          >
            {formatCurrency(job.salary)}
          </span>
          <MapPin
            className={cn(
              'mx-auto size-6 drop-shadow transition-transform group-hover:scale-125',
              highlightId === job.id ? 'fill-destructive text-white' : 'fill-primary text-white',
            )}
            aria-hidden="true"
          />
        </Link>
      ))}

      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold shadow-sm">
        <Navigation className="size-3.5 text-primary" aria-hidden="true" />
        {label}
      </div>
      <div className="absolute right-3 bottom-3 rounded-full bg-card/95 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
        Map preview
      </div>
    </div>
  )
}
