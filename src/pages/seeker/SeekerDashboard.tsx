import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardList, MapPin, Search, Star, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { JobCard } from '@/components/JobCard'
import { MapPreview } from '@/components/MapPreview'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { applyJobFilters, defaultFilters } from '@/components/JobFilters'
import { useApp } from '@/context/AppContext'
import { formatCurrency, formatJobDate, formatTime, greeting } from '@/lib/format'

export default function SeekerDashboard() {
  const { currentUser, jobs, applications, payments, userRating, getJob } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  if (!currentUser) return null

  const mine = applications.filter((a) => a.seekerId === currentUser.id)
  const upcoming = mine.filter((a) => a.status === 'accepted' || a.status === 'in_progress')
  const earned = payments.filter((p) => p.seekerId === currentUser.id && p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const { rating } = userRating(currentUser.id)
  const appliedIds = new Set(mine.map((a) => a.jobId))
  const recommended = applyJobFilters(jobs, defaultFilters, currentUser.skills).filter((j) => !appliedIds.has(j.id))

  const search = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/seeker/jobs${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-primary p-6 text-primary-foreground md:p-8">
        <p className="text-primary-foreground/80">{greeting()},</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">{currentUser.name.split(' ')[0]}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-primary-foreground/85">
          <MapPin className="size-4" aria-hidden="true" /> {recommended.length} jobs open near {currentUser.location}
        </p>
        <form onSubmit={search} role="search" className="mt-6 flex max-w-2xl gap-2">
          <label htmlFor="dash-search" className="sr-only">
            Search jobs
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="dash-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search catering, delivery, events…"
              className="h-12 bg-card pl-11 text-base text-foreground"
            />
          </div>
          <Button type="submit" variant="secondary" size="lg" className="h-12 px-5">
            Search
          </Button>
        </form>
      </section>

      <section aria-label="Your stats" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Applications" value={mine.length} icon={ClipboardList} />
        <StatCard label="Upcoming jobs" value={upcoming.length} icon={CalendarDays} tone="warning" />
        <StatCard label="Total earned" value={formatCurrency(earned)} icon={Wallet} tone="success" />
        <StatCard label="Your rating" value={rating.toFixed(1)} icon={Star} tone="neutral" hint={`${currentUser.completedJobs} jobs done`} />
      </section>

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold">Upcoming jobs</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {upcoming.map((a) => {
              const job = getJob(a.jobId)
              if (!job) return null
              return (
                <li key={a.id}>
                  <Link
                    to={`/seeker/jobs/${job.id}`}
                    className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-md"
                  >
                    <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-success/15 text-success">
                      <CheckCircle2 className="size-6" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{job.title}</span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {formatJobDate(job.date)} · {formatTime(job.startTime)} · {job.location}
                      </span>
                    </span>
                    <StatusBadge status={a.status} />
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recommended for you</h2>
            <Link to="/seeker/jobs" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View all <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recommended.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-xl font-bold">Jobs on the map</h2>
          <MapPreview jobs={recommended} className="aspect-square xl:aspect-[4/5]" />
        </div>
      </section>
    </div>
  )
}
