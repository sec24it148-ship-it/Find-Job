import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { DemoSwitcher } from '@/components/DemoSwitcher'
import { NotificationPanel } from '@/components/NotificationPanel'
import { UserAvatar } from '@/components/UserAvatar'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'
import { mobileNav, sidebarNav } from './nav'

export function AppShell({ role }: { role: Role }) {
  const { role: activeRole, currentUser } = useApp()
  if (activeRole !== role || !currentUser) return <Navigate to="/login" replace />

  const home = role === 'employer' ? '/employer' : '/seeker'
  const displayName = currentUser.company ?? currentUser.name

  return (
    <div className="min-h-svh bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center px-6">
          <Logo to={home} />
        </div>
        <nav aria-label="Main" className="flex-1 space-y-1 px-3 py-4">
          {sidebarNav[role].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  isActive && 'bg-primary/10 font-semibold text-primary hover:bg-primary/10 hover:text-primary',
                )
              }
            >
              <item.icon className="size-5" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="m-3 flex items-center gap-3 rounded-xl bg-muted p-3">
          <UserAvatar name={displayName} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{role === 'employer' ? 'Employer' : 'Job Seeker'}</p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-card/90 px-4 backdrop-blur md:px-8">
          <Logo to={home} className="lg:hidden" />
          <p className="hidden text-sm text-muted-foreground lg:block">
            Signed in as <span className="font-semibold text-foreground">{currentUser.name}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <DemoSwitcher />
            <NotificationPanel />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 md:px-8 lg:pb-12">
          <Outlet />
        </main>
      </div>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {mobileNav[role].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground',
                isActive && 'text-primary',
              )
            }
          >
            <item.icon className="size-5" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
