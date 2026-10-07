import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'lg'
  className?: string
}

export function RatingStars({ value, onChange, size = 'sm', className }: RatingStarsProps) {
  const iconSize = size === 'lg' ? 'size-8' : 'size-4'
  if (!onChange) {
    return (
      <div className={cn('flex items-center gap-0.5', className)} aria-label={`Rated ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden="true"
            className={cn(iconSize, star <= Math.round(value) ? 'fill-warning text-warning' : 'text-border')}
          />
        ))}
      </div>
    )
  }
  return (
    <div className={cn('flex items-center gap-1', className)} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onChange(star)}
          className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Star className={cn(iconSize, star <= value ? 'fill-warning text-warning' : 'text-border')} />
        </button>
      ))}
    </div>
  )
}
