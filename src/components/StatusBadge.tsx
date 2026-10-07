import { cn } from '@/lib/utils'
import type { ApplicationStatus, JobStatus } from '@/types'

const styles: Record<ApplicationStatus | JobStatus, { label: string; className: string }> = {
  applied: { label: 'Applied', className: 'bg-secondary text-secondary-foreground' },
  shortlisted: { label: 'Shortlisted', className: 'bg-warning/25 text-warning-foreground' },
  accepted: { label: 'Accepted', className: 'bg-success/15 text-success' },
  in_progress: { label: 'In Progress', className: 'bg-primary/10 text-primary' },
  completed: { label: 'Completed', className: 'bg-foreground/8 text-foreground' },
  rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive' },
  open: { label: 'Active', className: 'bg-success/15 text-success' },
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground ring-1 ring-border' },
  closed: { label: 'Closed', className: 'bg-destructive/10 text-destructive' },
}

export function StatusBadge({ status, className }: { status: ApplicationStatus | JobStatus; className?: string }) {
  const style = styles[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        style.className,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {style.label}
    </span>
  )
}
