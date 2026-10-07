import { useNavigate } from 'react-router-dom'
import { Bell, BriefcaseBusiness, CalendarClock, CheckCheck, ClipboardCheck, MessageCircle, Star, Wallet, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { useApp } from '@/context/AppContext'
import { timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types'

const icons: Record<Notification['type'], LucideIcon> = {
  application: ClipboardCheck,
  job: BriefcaseBusiness,
  message: MessageCircle,
  reminder: CalendarClock,
  payment: Wallet,
  review: Star,
}

export default function Notifications() {
  const { notifications, currentUser, markNotificationRead, markAllNotificationsRead } = useApp()
  const navigate = useNavigate()
  const mine = notifications
    .filter((n) => n.userId === currentUser?.id)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  const unread = mine.filter((n) => !n.read).length

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        description={unread ? `You have ${unread} unread notification${unread > 1 ? 's' : ''}.` : "You're all caught up."}
        action={
          unread > 0 && (
            <Button variant="outline" onClick={markAllNotificationsRead}>
              <CheckCheck aria-hidden="true" /> Mark all read
            </Button>
          )
        }
      />
      {mine.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="Updates about your jobs will appear here." />
      ) : (
        <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
          {mine.map((n) => {
            const Icon = icons[n.type]
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    markNotificationRead(n.id)
                    if (n.link) navigate(n.link)
                  }}
                  className={cn('flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-muted', !n.read && 'bg-primary/5')}
                >
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-xl',
                      n.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary',
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn('block leading-snug text-pretty', !n.read && 'font-semibold')}>{n.text}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{timeAgo(n.timestamp)}</span>
                  </span>
                  {!n.read && (
                    <span className="mt-2 size-2.5 shrink-0 rounded-full bg-primary">
                      <span className="sr-only">Unread</span>
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
