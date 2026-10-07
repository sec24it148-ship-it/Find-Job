import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, CalendarDays, Check, Clock, MapPin, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DEMO_IDS, useApp } from '@/context/AppContext'
import { formatCurrency, formatJobDate, formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Job } from '@/types'

export function JobCard({ job }: { job: Job }) {
  const { getUser, applications, savedJobs, applyToJob, toggleSaveJob, userRating } = useApp()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const employer = getUser(job.employerId)
  const applied = applications.some((a) => a.jobId === job.id && a.seekerId === DEMO_IDS.seeker)
  const saved = savedJobs.includes(job.id)
  const rating = userRating(job.employerId).rating

  return (
    <article className="group flex flex-col rounded-2xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
            {job.category}
          </span>
          <h3 className="mt-2 truncate text-lg font-bold">
            <Link to={`/seeker/jobs/${job.id}`} className="hover:text-primary focus-visible:outline-none focus-visible:underline">
              {job.title}
            </Link>
          </h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="truncate">{employer?.company}</span>
            <Star className="size-3.5 shrink-0 fill-warning text-warning" aria-hidden="true" />
            <span className="shrink-0">{rating.toFixed(1)}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-primary">{formatCurrency(job.salary)}</p>
          <p className="text-xs text-muted-foreground">per day</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <dt className="sr-only">Location</dt>
          <dd className="truncate">
            {job.location} · {job.distanceKm} km
          </dd>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <dt className="sr-only">Date</dt>
          <dd>{formatJobDate(job.date)}</dd>
        </div>
        <div className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <dt className="sr-only">Time</dt>
          <dd>
            {formatTime(job.startTime)} – {formatTime(job.endTime)} · {job.duration}
          </dd>
        </div>
      </dl>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Required skills">
        {job.skills.map((skill) => (
          <li key={skill} className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {skill}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2 pt-1">
        <Link to={`/seeker/jobs/${job.id}`} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'flex-1')}>
          View Details
        </Link>
        <Button size="lg" className="flex-1" disabled={applied} onClick={() => setConfirmOpen(true)}>
          {applied ? (
            <>
              <Check aria-hidden="true" /> Applied
            </>
          ) : (
            'Apply'
          )}
        </Button>
        <Button
          size="icon-lg"
          variant="outline"
          aria-pressed={saved}
          aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
          onClick={() => {
            toggleSaveJob(job.id)
            toast(saved ? 'Removed from saved jobs' : 'Job saved')
          }}
        >
          <Bookmark className={cn(saved && 'fill-primary text-primary')} />
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Apply for this job?"
        description={`${job.title} at ${employer?.company} · ${formatJobDate(job.date)} · ${formatCurrency(job.salary)}`}
        confirmLabel="Confirm Application"
        onConfirm={() => {
          applyToJob(job.id)
          toast.success('Application Submitted', { description: `${employer?.company} will review your profile.` })
        }}
      />
    </article>
  )
}
