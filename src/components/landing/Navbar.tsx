import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/utils'

const links = [
  { href: '#find-jobs', label: 'Find Jobs' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#employers', label: 'For Employers' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className={buttonVariants({ variant: 'ghost', size: 'lg' })}>
            Login
          </Link>
          <Link to="/login" className={buttonVariants({ size: 'lg' })}>
            Get Started
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon-lg"
          className="md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      <div className={cn('border-t bg-background px-4 pb-4 md:hidden', !open && 'hidden')}>
        <nav aria-label="Mobile primary" className="flex flex-col py-2">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2.5 font-medium">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="grid grid-cols-2 gap-2">
          <Link to="/login" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            Login
          </Link>
          <Link to="/login" className={buttonVariants({ size: 'lg' })}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
