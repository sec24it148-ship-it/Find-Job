import { useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck, CalendarDays, MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'

const previewJobs = [
  { title: 'Catering Helper', pay: '₹800/day', place: 'Chennai', tag: 'Catering', when: 'Tomorrow · 10 AM' },
  { title: 'Event Staff', pay: '₹1,000/day', place: 'Tambaram', tag: 'Events', when: 'Fri · 4 PM' },
  { title: 'Delivery Assistant', pay: '₹900/day', place: 'Guindy', tag: 'Delivery', when: 'Today · 9 AM' },
]

export function Hero() {
  const navigate = useNavigate()
  const { login } = useApp()

  const start = (role: 'jobSeeker' | 'employer') => {
    login(role)
    navigate(role === 'employer' ? '/employer' : '/seeker/jobs')
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_20%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:px-6 md:py-24 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-medium text-muted-foreground">
            <span className="size-2 rounded-full bg-success" aria-hidden="true" />
            1,200+ jobs posted in Chennai this week
          </span>
          <h1 className="mt-5 text-5xl leading-[1.05] font-extrabold tracking-tight text-balance md:text-6xl">
            Find a Job Today.
            <br />
            <span className="text-primary">Earn Today.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
            1DHire connects you with nearby one-day and short-term jobs so you can work when you need it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-12 px-6 text-base" onClick={() => start('jobSeeker')}>
              <Search aria-hidden="true" /> Find Jobs
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base" onClick={() => start('employer')}>
              Hire Workers <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {['Same-day payouts', 'Verified employers', 'No signup fees'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <BadgeCheck className="size-4 text-success" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md" aria-label="App preview">
          <div className="rounded-3xl border bg-card p-4 shadow-xl shadow-primary/10">
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="text-xs text-muted-foreground">Good Morning, Arun</p>
                <p className="font-bold">Jobs near you</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                <MapPin className="size-3.5 text-primary" aria-hidden="true" /> Chennai
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm text-muted-foreground">
              <Search className="size-4" aria-hidden="true" /> Search jobs...
            </div>
            <ul className="mt-3 space-y-2.5">
              {previewJobs.map((job, i) => (
                <li key={job.title} className="rounded-2xl border p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{job.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" aria-hidden="true" /> {job.place}
                        <span aria-hidden="true">·</span>
                        <CalendarDays className="size-3" aria-hidden="true" /> {job.when}
                      </p>
                    </div>
                    <p className="font-bold text-primary">{job.pay}</p>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{job.tag}</span>
                    <span
                      className={
                        i === 0
                          ? 'rounded-lg bg-success/15 px-2.5 py-1 text-xs font-semibold text-success'
                          : 'rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground'
                      }
                    >
                      {i === 0 ? 'Applied ✓' : 'Apply'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border bg-card px-4 py-3 shadow-lg sm:block">
            <p className="text-xs text-muted-foreground">Earned today</p>
            <p className="text-xl font-extrabold text-success">₹1,800</p>
          </div>
        </div>
      </div>
    </section>
  )
}
