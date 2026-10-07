import { Link, useNavigate } from 'react-router-dom'
import { Bell, Briefcase, CheckCircle2, Clock, IndianRupee, MessageCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useApp } from '@/context/AppContext'
import { timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types'

export const notificationIcons: Record<Notification['type'], typeof Bell> = {
  application: CheckCircle2,
  job: Briefcase,
  message: MessageCircle,
  reminder: Clock,
  payment: IndianRupee,
  review: Star,
}

export function useMyNotifications() {
  const { notifications, currentUser } = useApp()
  const mine = notifications
    .filter((n) => n.userId === currentUser?.id)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  return { notifications: mine, unread: mine.filter((n) => !n.read).length }
}

export function NotificationItem({ notification }: { notification: Notification }) {
  const Icon = notificationIcons[notification.type]
  return (
    <div className="flex w-full items-start gap-3 text-left">
      <span
        className={cn(
          'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full',
          notification.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary',
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn('block text-sm leading-snug', !notification.read && 'font-semibold')}>{notification.text}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{timeAgo(notification.timestamp)}</span>
      </span>
      {!notification.read && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
    </div>
  )
}

export function NotificationPanel() {
  const { role, markNotificationRead, markAllNotificationsRead } = useApp()
  const { notifications, unread } = useMyNotifications()
  const navigate = useNavigate()
  const base = role === 'employer' ? '/employer' : '/seeker'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-lg" className="relative" aria-label={`Notifications, ${unread} unread`} />
        }
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="font-semibold">Notifications</p>
          {unread > 0 && (
            <button type="button" className="text-xs font-semibold text-primary hover:underline" onClick={markAllNotificationsRead}>
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {notifications.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">{"You're all caught up."}</p>}
          {notifications.slice(0, 6).map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="items-start rounded-lg p-3"
              onClick={() => {
                markNotificationRead(n.id)
                if (n.link) navigate(n.link)
              }}
            >
              <NotificationItem notification={n} />
            </DropdownMenuItem>
          ))}
        </div>
        <div className="border-t p-2">
          <Link to={`${base}/notifications`} className="block rounded-md py-1.5 text-center text-sm font-semibold text-primary hover:bg-muted">
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
