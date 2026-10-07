import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Briefcase, Check, MapPin, MessageCircle, Star, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ProfileDialog } from '@/components/ProfileDialog'
import { ReviewDialog } from '@/components/ReviewDialog'
import { StatusBadge } from '@/components/StatusBadge'
import { StatusStepper } from '@/components/StatusStepper'
import { UserAvatar } from '@/components/UserAvatar'
import { useApp } from '@/context/AppContext'
import type { Application } from '@/types'

const advanceLabels: Partial<Record<Application['status'], { label: string; toast: string; next: Application['status'] }>> = {
  accepted: { label: 'Start Job', toast: 'Job marked as In Progress.', next: 'in_progress' },
  in_progress: { label: 'Mark Completed', toast: 'Job completed. Payment released to worker.', next: 'completed' },
}

export function ApplicantCard({ application, showJob }: { application: Application; showJob?: boolean }) {
  const { getUser, getJob, userRating, updateApplicationStatus, startConversation, reviews, currentUser } = useApp()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const seeker = getUser(application.seekerId)
  const job = getJob(application.jobId)
  if (!seeker || !job) return null
  const { rating } = userRating(seeker.id)
  const advance = advanceLabels[application.status]
  const canDecide = application.status === 'applied' || application.status === 'shortlisted'
  const reviewed = reviews.some((r) => r.jobId === job.id && r.reviewerId === currentUser?.id && r.revieweeId === seeker.id)

  return (
    <article className="flex flex-col rounded-2xl border bg-card p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <UserAvatar name={seeker.name} className="size-12" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex items-center gap-1 truncate font-bold">
              {seeker.name}
              {seeker.verified && <BadgeCheck className="size-4 shrink-0 text-primary" aria-label="Verified" />}
            </h3>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
              {rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="size-3.5" aria-hidden="true" />
              {seeker.completedJobs} jobs
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden="true" />
              {seeker.location}
            </span>
          </p>
        </div>
      </div>

      {showJob && (
        <p className="mt-3 rounded-lg bg-muted px-3 py-1.5 text-sm">
          Applied for <span className="font-semibold">{job.title}</span>
        </p>
      )}

      <p className="mt-3 text-sm text-muted-foreground">{seeker.experience}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Skills">
        {seeker.skills.map((s) => (
          <li key={s} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {s}
          </li>
        ))}
      </ul>

      {application.status !== 'rejected' && application.status !== 'applied' && (
        <div className="mt-4">
          <StatusStepper status={application.status} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
        <Button variant="outline" size="lg" onClick={() => setProfileOpen(true)}>
          View Profile
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          aria-label={`Message ${seeker.name}`}
          onClick={() => {
            const id = startConversation(seeker.id, job.employerId, job.id)
            navigate(`/employer/messages?c=${id}`)
          }}
        >
          <MessageCircle />
        </Button>
        {application.status === 'applied' && (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              updateApplicationStatus(application.id, 'shortlisted')
              toast.success(`${seeker.name} shortlisted.`)
            }}
          >
            Shortlist
          </Button>
        )}
        {canDecide && (
          <>
            <Button
              size="lg"
              className="bg-success text-success-foreground hover:bg-success/90"
              onClick={() => {
                updateApplicationStatus(application.id, 'accepted')
                toast.success('Worker accepted successfully.')
              }}
            >
              <Check aria-hidden="true" /> Accept
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={() => {
                updateApplicationStatus(application.id, 'rejected')
                toast('Application rejected.')
              }}
            >
              <X aria-hidden="true" /> Reject
            </Button>
          </>
        )}
        {advance && (
          <Button
            size="lg"
            onClick={() => {
              updateApplicationStatus(application.id, advance.next)
              toast.success(advance.toast)
            }}
          >
            {advance.label} <ArrowRight aria-hidden="true" />
          </Button>
        )}
        {application.status === 'completed' &&
          (reviewed ? (
            <span className="inline-flex items-center gap-1 px-2 text-sm font-medium text-success">
              <Star className="size-4 fill-current" aria-hidden="true" /> Reviewed
            </span>
          ) : (
            <Button size="lg" onClick={() => setReviewOpen(true)}>
              <Star aria-hidden="true" /> Rate Worker
            </Button>
          ))}
      </div>

      <ProfileDialog user={seeker} open={profileOpen} onOpenChange={setProfileOpen} />
      <ReviewDialog open={reviewOpen} onOpenChange={setReviewOpen} jobId={job.id} revieweeId={seeker.id} revieweeName={seeker.name} />
    </article>
  )
}
