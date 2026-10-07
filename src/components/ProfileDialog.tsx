import { BadgeCheck, Briefcase, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RatingStars } from '@/components/RatingStars'
import { UserAvatar } from '@/components/UserAvatar'
import { useApp } from '@/context/AppContext'
import type { User } from '@/types'

export function ProfileDialog({ user, open, onOpenChange }: { user: User; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { userRating, reviews, getUser } = useApp()
  const { rating, count } = userRating(user.id)
  const received = reviews.filter((r) => r.revieweeId === user.id).slice(0, 3)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader className="flex-row items-center gap-3 text-left">
          <UserAvatar name={user.name} className="size-14 text-lg" />
          <div>
            <DialogTitle className="flex items-center gap-1.5">
              {user.name}
              {user.verified && <BadgeCheck className="size-5 text-primary" aria-label="Verified" />}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden="true" /> {user.location}
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex items-center gap-4 rounded-xl bg-muted p-3 text-sm">
          <div className="flex items-center gap-1.5">
            <RatingStars value={rating} />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({count})</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Briefcase className="size-4" aria-hidden="true" /> {user.completedJobs} jobs done
          </div>
        </div>
        <p className="text-sm leading-relaxed">{user.bio}</p>
        <div>
          <h4 className="mb-2 text-sm font-semibold">Skills</h4>
          <ul className="flex flex-wrap gap-1.5">
            {user.skills.map((s) => (
              <li key={s} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-1 text-sm font-semibold">Experience</h4>
          <p className="text-sm text-muted-foreground">{user.experience}</p>
        </div>
        {received.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">Recent reviews</h4>
            <ul className="space-y-2">
              {received.map((r) => {
                const reviewer = getUser(r.reviewerId)
                return (
                  <li key={r.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{reviewer?.company ?? reviewer?.name}</span>
                      <RatingStars value={r.rating} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
