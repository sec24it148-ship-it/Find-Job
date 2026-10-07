import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Briefcase, CalendarDays, LogOut, MapPin, Pencil, Phone, RotateCcw, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RatingStars } from '@/components/RatingStars'
import { UserAvatar } from '@/components/UserAvatar'
import { useApp } from '@/context/AppContext'
import { formatLongDate } from '@/lib/format'

export default function Profile() {
  const { currentUser, userRating, reviews, getUser, updateProfile, logout, resetDemo } = useApp()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  if (!currentUser) return null

  const isEmployer = currentUser.role === 'employer'
  const displayName = currentUser.company ?? currentUser.name
  const { rating, count } = userRating(currentUser.id)
  const received = reviews.filter((r) => r.revieweeId === currentUser.id).sort((a, b) => b.date.localeCompare(a.date))

  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const get = (k: string) => String(data.get(k) ?? '').trim()
    updateProfile({
      name: get('name') || currentUser.name,
      ...(isEmployer ? { company: get('company') || currentUser.company, industry: get('industry') } : {}),
      location: get('location'),
      phone: get('phone'),
      bio: get('bio'),
      experience: get('experience'),
      skills: get('skills')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    setEditing(false)
    toast.success('Profile updated.')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="rounded-3xl border bg-card p-5 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <UserAvatar name={displayName} className="size-20 text-2xl" />
            <div className="min-w-0 flex-1">
              <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight md:text-3xl">
                {displayName}
                {currentUser.verified && <BadgeCheck className="size-6 text-primary" aria-label="Verified" />}
              </h1>
              {isEmployer && <p className="text-muted-foreground">{currentUser.name} · {currentUser.industry}</p>}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" aria-hidden="true" /> {currentUser.location}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="size-4" aria-hidden="true" /> {currentUser.phone}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-4" aria-hidden="true" /> Member since {currentUser.memberSince}
                </span>
              </div>
            </div>
            {!editing && (
              <Button variant="outline" size="lg" onClick={() => setEditing(true)}>
                <Pencil aria-hidden="true" /> Edit Profile
              </Button>
            )}
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-muted p-4 text-center">
              <dt className="text-xs text-muted-foreground">Rating</dt>
              <dd className="mt-1 flex items-center justify-center gap-1 text-xl font-extrabold">
                <Star className="size-5 fill-warning text-warning" aria-hidden="true" /> {rating.toFixed(1)}
              </dd>
            </div>
            <div className="rounded-2xl bg-muted p-4 text-center">
              <dt className="text-xs text-muted-foreground">Reviews</dt>
              <dd className="mt-1 text-xl font-extrabold">{count}</dd>
            </div>
            <div className="rounded-2xl bg-muted p-4 text-center">
              <dt className="text-xs text-muted-foreground">{isEmployer ? 'Hires' : 'Jobs done'}</dt>
              <dd className="mt-1 text-xl font-extrabold">{currentUser.completedJobs}</dd>
            </div>
          </dl>
        </section>

        {editing ? (
          <form onSubmit={save} className="space-y-4 rounded-3xl border bg-card p-5 md:p-8">
            <h2 className="text-lg font-bold">Edit profile</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="p-name">Full name</Label>
                <Input id="p-name" name="name" defaultValue={currentUser.name} className="h-11" required />
              </div>
              {isEmployer && (
                <>
                  <div className="grid gap-1.5">
                    <Label htmlFor="p-company">Company</Label>
                    <Input id="p-company" name="company" defaultValue={currentUser.company} className="h-11" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="p-industry">Industry</Label>
                    <Input id="p-industry" name="industry" defaultValue={currentUser.industry} className="h-11" />
                  </div>
                </>
              )}
              <div className="grid gap-1.5">
                <Label htmlFor="p-location">Location</Label>
                <Input id="p-location" name="location" defaultValue={currentUser.location} className="h-11" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="p-phone">Phone</Label>
                <Input id="p-phone" name="phone" type="tel" defaultValue={currentUser.phone} className="h-11" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="p-bio">About</Label>
              <Textarea id="p-bio" name="bio" defaultValue={currentUser.bio} rows={3} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="p-exp">Experience</Label>
              <Input id="p-exp" name="experience" defaultValue={currentUser.experience} className="h-11" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="p-skills">Skills (comma separated)</Label>
              <Input id="p-skills" name="skills" defaultValue={currentUser.skills.join(', ')} className="h-11" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="lg">
                Save changes
              </Button>
              <Button type="button" variant="ghost" size="lg" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <section className="space-y-5 rounded-3xl border bg-card p-5 md:p-8">
            <div>
              <h2 className="mb-2 text-lg font-bold">About</h2>
              <p className="leading-relaxed text-pretty">{currentUser.bio}</p>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold">{isEmployer ? 'Usually hiring for' : 'Skills'}</h2>
              <ul className="flex flex-wrap gap-2">
                {currentUser.skills.map((s) => (
                  <li key={s} className="rounded-lg bg-secondary px-2.5 py-1 text-sm font-medium text-secondary-foreground">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold">Experience</h2>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="size-4" aria-hidden="true" /> {currentUser.experience}
              </p>
            </div>
          </section>
        )}
      </div>

      <aside className="space-y-4">
        <section className="rounded-3xl border bg-card p-5">
          <h2 className="text-lg font-bold">Reviews</h2>
          {received.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {received.map((r) => {
                const reviewer = getUser(r.reviewerId)
                return (
                  <li key={r.id} className="rounded-2xl bg-muted p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold">{reviewer?.company ?? reviewer?.name}</span>
                      <RatingStars value={r.rating} />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed">{r.comment}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">{formatLongDate(r.date)}</p>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
        <section className="space-y-2 rounded-3xl border bg-card p-5">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
              resetDemo()
              toast.success('Demo data has been reset.')
            }}
          >
            <RotateCcw aria-hidden="true" /> Reset demo data
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            <LogOut aria-hidden="true" /> Log out
          </Button>
        </section>
      </aside>
    </div>
  )
}
