import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  CalendarDays,
  Check,
  Clock,
  Info,
  MapPin,
  MessageCircle,
  Pencil,
  SearchX,
  Users,
  Wallet,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { ApplicantCard } from '@/components/ApplicantCard'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EmptyState } from '@/components/EmptyState'
import { MapPreview } from '@/components/MapPreview'
import { RatingStars } from '@/components/RatingStars'
import { StatusBadge } from '@/components/StatusBadge'
import { UserAvatar } from '@/components/UserAvatar'
import { useApp } from '@/context/AppContext'
import { formatCurrency, formatLongDate, formatTime, timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'

function Fact({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted p-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-semibold">{value}</dd>
      </div>
    </div>
  )
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 leading-relaxed">
            <Check className="mt-1 size-4 shrink-0 text-success" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function JobDetails({ role }: { role: Role }) {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { getJob, getUser, userRating, applications, savedJobs, applyToJob, toggleSaveJob, startConversation, currentUser } = useApp()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const job = getJob(id)
  const base = role === 'employer' ? '/employer' : '/seeker'

  if (!job) {
    return (
      <EmptyState
        icon={SearchX}
        title="Job not found"
        description="This job may have been removed."
        action={
          <Link to={`${base}/jobs`} className={buttonVariants({ variant: 'outline' })}>
            Back to jobs
          </Link>
        }
      />
    )
  }

  const employer = getUser(job.employerId)
  const employerName = employer?.company ?? employer?.name ?? 'Employer'
  const { rating, count } = userRating(job.employerId)
  const jobApplications = applications.filter((a) => a.jobId === job.id)
  const myApplication = jobApplications.find((a) => a.seekerId === currentUser?.id)
  const saved = savedJobs.includes(job.id)
  const isEmployer = role === 'employer'
  const hired = jobApplications.filter((a) => ['accepted', 'in_progress', 'completed'].includes(a.status)).length

  return (
    <div className="pb-24 lg:pb-0">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <article className="space-y-6 rounded-3xl border bg-card p-5 md:p-8">
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">{job.category}</span>
              {isEmployer && <StatusBadge status={job.status} />}
              {myApplication && <StatusBadge status={myApplication.status} />}
              <span className="text-xs text-muted-foreground">Posted {timeAgo(job.postedAt)}</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-balance md:text-4xl">{job.title}</h1>
            <p className="mt-2 text-3xl font-extrabold text-primary">
              {formatCurrency(job.salary)} <span className="text-base font-medium text-muted-foreground">/ day</span>
            </p>
          </header>

          <dl className="grid gap-3 sm:grid-cols-2">
            <Fact icon={CalendarDays} label="Date" value={formatLongDate(job.date)} />
            <Fact icon={Clock} label="Timing" value={`${formatTime(job.startTime)} – ${formatTime(job.endTime)} (${job.duration})`} />
            <Fact icon={MapPin} label="Location" value={`${job.location} · ${job.distanceKm} km away`} />
            <Fact icon={Users} label="Workers needed" value={isEmployer ? `${hired} of ${job.workersRequired} hired` : job.workersRequired} />
          </dl>

          <section>
            <h2 className="mb-2 text-lg font-bold">About this job</h2>
            <p className="leading-relaxed text-pretty">{job.description}</p>
          </section>

          <ListBlock title="Responsibilities" items={job.responsibilities} />
          <ListBlock title="Requirements" items={job.requirements} />

          <section>
            <h2 className="mb-3 text-lg font-bold">Skills</h2>
            <ul className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <li
                  key={s}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-sm font-medium',
                    currentUser?.skills.includes(s) ? 'bg-success/15 text-success' : 'bg-secondary text-secondary-foreground',
                  )}
                >
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">Experience: {job.experience}</p>
          </section>

          {job.instructions && (
            <section className="flex gap-3 rounded-2xl border border-warning/50 bg-warning/10 p-4">
              <Info className="mt-0.5 size-5 shrink-0 text-warning-foreground" aria-hidden="true" />
              <div>
                <h2 className="font-bold">Instructions</h2>
                <p className="mt-1 text-sm leading-relaxed">{job.instructions}</p>
              </div>
            </section>
          )}

          {isEmployer && (
            <section>
              <h2 className="mb-3 text-lg font-bold">Applicants ({jobApplications.length})</h2>
              {jobApplications.length === 0 ? (
                <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">No applicants yet. Check back soon.</p>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {jobApplications.map((a) => (
                    <ApplicantCard key={a.id} application={a} />
                  ))}
                </div>
              )}
            </section>
          )}
        </article>

        <aside className="space-y-4">
          {!isEmployer && (
            <section className="rounded-3xl border bg-card p-5">
              <h2 className="text-sm font-semibold text-muted-foreground">Employer</h2>
              <div className="mt-3 flex items-center gap-3">
                <UserAvatar name={employerName} className="size-12" />
                <div className="min-w-0">
                  <p className="flex items-center gap-1 truncate font-bold">
                    {employerName}
                    {employer?.verified && <BadgeCheck className="size-4 shrink-0 text-primary" aria-label="Verified" />}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <RatingStars value={rating} /> {rating.toFixed(1)} ({count})
                  </p>
                </div>
              </div>
              {employer?.bio && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{employer.bio}</p>}
            </section>
          )}

          <section className="space-y-2">
            <MapPreview jobs={[job]} highlightId={job.id} className="aspect-[4/3]" label={job.location} />
            <p className="flex items-start gap-1.5 px-1 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {job.address}
            </p>
          </section>

          <div className="fixed inset-x-0 bottom-16 z-20 flex gap-2 border-t bg-card p-3 lg:static lg:rounded-3xl lg:border lg:p-5">
            {isEmployer ? (
              <>
                <Link to={`/employer/jobs/${job.id}/edit`} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-12 flex-1')}>
                  <Pencil aria-hidden="true" /> Edit Job
                </Link>
                <Link to={`/employer/applicants?job=${job.id}`} className={cn(buttonVariants({ size: 'lg' }), 'h-12 flex-1')}>
                  <Users aria-hidden="true" /> Applicants
                </Link>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="size-12"
                  aria-label={saved ? 'Remove from saved' : 'Save job'}
                  aria-pressed={saved}
                  onClick={() => {
                    toggleSaveJob(job.id)
                    toast(saved ? 'Removed from saved jobs.' : 'Job saved.')
                  }}
                >
                  <Bookmark className={cn(saved && 'fill-primary text-primary')} />
                </Button>
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="size-12"
                  aria-label="Message employer"
                  onClick={() => {
                    if (!currentUser) return
                    const cid = startConversation(currentUser.id, job.employerId, job.id)
                    navigate(`/seeker/messages?c=${cid}`)
                  }}
                >
                  <MessageCircle />
                </Button>
                {myApplication ? (
                  <Button size="lg" disabled className="h-12 flex-1 bg-success text-success-foreground disabled:opacity-100">
                    <Check aria-hidden="true" /> Applied
                  </Button>
                ) : (
                  <Button size="lg" className="h-12 flex-1 text-base" onClick={() => setConfirmOpen(true)} disabled={job.status !== 'open'}>
                    <Wallet aria-hidden="true" /> Apply Now
                  </Button>
                )}
              </>
            )}
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Apply for ${job.title}?`}
        description={`${employerName} will see your profile. ${formatCurrency(job.salary)} · ${formatLongDate(job.date)}`}
        confirmLabel="Confirm & Apply"
        onConfirm={() => {
          applyToJob(job.id)
          toast.success('Application submitted successfully.')
        }}
      />
    </div>
  )
}
