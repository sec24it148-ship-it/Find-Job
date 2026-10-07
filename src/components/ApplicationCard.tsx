import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, MapPin, MessageCircle, Star } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { ReviewDialog } from '@/components/ReviewDialog'
import { StatusBadge } from '@/components/StatusBadge'
import { StatusStepper } from '@/components/StatusStepper'
import { useApp } from '@/context/AppContext'
import { formatCurrency, formatJobDate, formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Application } from '@/types'

export function ApplicationCard({ application }: { application: Application }) {
  const { getJob, getUser, reviews, startConversation, currentUser } = useApp()
  const navigate = useNavigate()
  const [reviewOpen, setReviewOpen] = useState(false)
  const job = getJob(application.jobId)
  if (!job) return null
  const employer = getUser(job.employerId)
  const employerName = employer?.company ?? employer?.name ?? 'Employer'
  const reviewed = reviews.some((r) => r.jobId === job.id && r.reviewerId === currentUser?.id)

  return (
    <article className="rounded-2xl border bg-card p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">
            <Link to={`/seeker/jobs/${job.id}`} className="hover:text-primary">
              {job.title}
            </Link>
          </h3>
          <p className="truncate text-sm text-muted-foreground">{employerName}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4 text-primary" aria-hidden="true" />
          {formatJobDate(job.date)} · {formatTime(job.startTime)}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4 text-primary" aria-hidden="true" />
          {job.location}
        </span>
        <span className="font-bold text-foreground">{formatCurrency(job.salary)}</span>
      </div>

      {application.status !== 'rejected' && (
        <div className="mt-4">
          <StatusStepper status={application.status} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link to={`/seeker/jobs/${job.id}`} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
          View Job
        </Link>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            const id = startConversation(application.seekerId, job.employerId, job.id)
            navigate(`/seeker/messages?c=${id}`)
          }}
        >
          <MessageCircle aria-hidden="true" /> Message
        </Button>
        {application.status === 'completed' &&
          (reviewed ? (
            <span className="inline-flex items-center gap-1 px-2 text-sm font-medium text-success">
              <Star className="size-4 fill-current" aria-hidden="true" /> Reviewed
            </span>
          ) : (
            <Button size="lg" onClick={() => setReviewOpen(true)}>
              <Star aria-hidden="true" /> Rate Employer
            </Button>
          ))}
      </div>

      <ReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        jobId={job.id}
        revieweeId={job.employerId}
        revieweeName={employerName}
      />
    </article>
  )
}
