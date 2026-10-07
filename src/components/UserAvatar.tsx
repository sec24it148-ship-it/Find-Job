import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

const palette = [
  'bg-primary/15 text-primary',
  'bg-success/15 text-success',
  'bg-warning/30 text-warning-foreground',
  'bg-chart-4/20 text-foreground',
]

export function UserAvatar({ name, className }: { name: string; className?: string }) {
  const colorIndex = name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % palette.length
  return (
    <Avatar className={cn('size-10', className)}>
      <AvatarFallback className={cn('font-semibold', palette[colorIndex])}>{initials(name)}</AvatarFallback>
    </Avatar>
  )
}
