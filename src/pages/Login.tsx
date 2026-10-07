import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, UserRound, type LucideIcon } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useApp } from '@/context/AppContext'
import type { Role } from '@/types'

const options: { role: Role; title: string; text: string; who: string; icon: LucideIcon }[] = [
  {
    role: 'jobSeeker',
    title: 'Continue as Job Seeker',
    text: 'Find nearby one-day jobs, apply instantly and track your earnings.',
    who: 'Demo account: Arun Kumar',
    icon: UserRound,
  },
  {
    role: 'employer',
    title: 'Continue as Employer',
    text: 'Post jobs, review applicants and hire workers for your shifts.',
    who: 'Demo account: Saravana Caterers',
    icon: Building2,
  },
]

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()

  const go = (role: Role) => {
    login(role)
    navigate(role === 'employer' ? '/employer' : '/seeker')
  }

  return (
    <div className="flex min-h-svh flex-col bg-muted/40">
      <header className="mx-auto flex h-16 w-full max-w-5xl items-center px-4">
        <Logo />
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10">
        <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl text-balance">Welcome to 1DHire</h1>
        <p className="mt-3 text-center text-muted-foreground">Choose how you want to use the app. No password needed.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {options.map((o) => (
            <button
              key={o.role}
              type="button"
              onClick={() => go(o.role)}
              className="group flex flex-col rounded-3xl border-2 bg-card p-6 text-left shadow-xs transition-all hover:border-primary hover:shadow-lg focus-visible:border-primary focus-visible:outline-none md:p-8"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <o.icon className="size-7" aria-hidden="true" />
              </span>
              <span className="mt-6 text-xl font-bold">{o.title}</span>
              <span className="mt-2 leading-relaxed text-muted-foreground">{o.text}</span>
              <span className="mt-6 flex items-center justify-between border-t pt-4 text-sm">
                <span className="text-muted-foreground">{o.who}</span>
                <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go('jobSeeker')}
          className="mx-auto mt-8 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Skip Login / Demo Mode
        </button>
      </main>
    </div>
  )
}
