import { Link } from 'react-router-dom'
import {
  Box,
  Briefcase,
  CalendarCheck,
  ClipboardCheck,
  Megaphone,
  PartyPopper,
  Search,
  Truck,
  Users,
  UtensilsCrossed,
  Wallet,
  Zap,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/utils'

const stats = [
  { value: '10K+', label: 'Job Seekers' },
  { value: '2K+', label: 'Employers' },
  { value: '15K+', label: 'Jobs Completed' },
]

export function Stats() {
  return (
    <section aria-label="Platform stats" className="border-y bg-card">
      <dl className="mx-auto grid max-w-6xl grid-cols-3 divide-x px-4 py-8 md:px-6">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col text-center">
            <dt className="order-2 mt-1 text-sm text-muted-foreground">{s.label}</dt>
            <dd className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const categories = [
  { name: 'Catering', icon: UtensilsCrossed, jobs: 320 },
  { name: 'Events', icon: PartyPopper, jobs: 210 },
  { name: 'Delivery', icon: Truck, jobs: 280 },
  { name: 'Warehouse', icon: Box, jobs: 190 },
  { name: 'Retail', icon: Megaphone, jobs: 140 },
  { name: 'Office', icon: Briefcase, jobs: 95 },
]

export function Categories() {
  return (
    <section id="find-jobs" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 md:px-6 md:py-20">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">Find Jobs</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl text-balance">Work that fits your day</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Pick up shifts across Chennai in the categories you know best.</p>
        </div>
        <Link to="/login" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
          Browse all jobs
        </Link>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((c) => (
          <li key={c.name} className="rounded-2xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <c.icon className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-4 font-semibold">{c.name}</p>
            <p className="text-sm text-muted-foreground">{c.jobs} open jobs</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

const steps = [
  { icon: Search, title: 'Find a nearby job', text: 'Browse one-day shifts by location, pay and date.' },
  { icon: ClipboardCheck, title: 'Apply in one tap', text: 'Your profile and ratings do the talking for you.' },
  { icon: CalendarCheck, title: 'Show up and work', text: 'Get the address, timings and instructions upfront.' },
  { icon: Wallet, title: 'Get paid same day', text: 'Earnings land as soon as the employer marks it done.' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-card py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-sm font-semibold text-primary">How It Works</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl text-balance">From search to salary in a day</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border bg-background p-6">
              <span className="text-sm font-bold text-muted-foreground">0{i + 1}</span>
              <s.icon className="mt-3 size-7 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const employerPoints = [
  { icon: Zap, title: 'Hire in hours', text: 'Post a job and get applicants from nearby workers fast.' },
  { icon: Users, title: 'Verified workers', text: 'See ratings, skills and completed jobs before you accept.' },
  { icon: Wallet, title: 'Pay per shift', text: 'No contracts. Only pay for the days you need help.' },
]

export function ForEmployers() {
  return (
    <section id="employers" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 md:px-6 md:py-20">
      <div className="grid items-center gap-10 rounded-3xl bg-primary p-8 text-primary-foreground md:p-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-primary-foreground/80">For Employers</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl text-balance">
            Short-staffed tomorrow? Fill the shift today.
          </h2>
          <p className="mt-4 leading-relaxed text-primary-foreground/85">
            Caterers, event companies, warehouses and shops across Chennai use 1DHire to find reliable workers on demand.
          </p>
          <Link to="/login" className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'mt-8 h-12 px-6 text-base')}>
            Post a Job
          </Link>
        </div>
        <ul className="grid gap-4">
          {employerPoints.map((p) => (
            <li key={p.title} className="flex gap-4 rounded-2xl bg-primary-foreground/10 p-5">
              <p.icon className="size-6 shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-primary-foreground/85">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:px-6">
        <Logo />
        <p>{'© 2026 1DHire. Built in Chennai.'}</p>
      </div>
    </footer>
  )
}
