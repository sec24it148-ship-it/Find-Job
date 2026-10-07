import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/types'

export const statusFlow: ApplicationStatus[] = ['applied', 'shortlisted', 'accepted', 'in_progress', 'completed']

const labels: Record<string, string> = {
  applied: 'Applied',
  shortlisted: 'Shortlisted',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export function nextStatus(status: ApplicationStatus): ApplicationStatus | null {
  const index = statusFlow.indexOf(status)
  if (index === -1 || index === statusFlow.length - 1) return null
  return statusFlow[index + 1]
}

export function StatusStepper({ status }: { status: ApplicationStatus }) {
  if (status === 'rejected') return null
  const current = statusFlow.indexOf(status)
  return (
    <ol className="flex items-center" aria-label="Application progress">
      {statusFlow.map((step, i) => {
        const done = i <= current
        return (
          <li key={step} className={cn('flex items-center', i < statusFlow.length - 1 && 'flex-1')}>
            <span className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full border-2 text-[10px] font-bold',
                  done ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground',
                )}
                aria-current={i === current ? 'step' : undefined}
              >
                {done ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
              </span>
              <span className={cn('hidden text-[11px] whitespace-nowrap sm:block', done ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                {labels[step]}
              </span>
            </span>
            {i < statusFlow.length - 1 && (
              <span className={cn('mx-1 h-0.5 flex-1 rounded sm:mb-5', i < current ? 'bg-primary' : 'bg-border')} aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )
}
