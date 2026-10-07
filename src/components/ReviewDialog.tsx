import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RatingStars } from '@/components/RatingStars'
import { useApp } from '@/context/AppContext'

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobId: string
  revieweeId: string
  revieweeName: string
}

export function ReviewDialog({ open, onOpenChange, jobId, revieweeId, revieweeName }: ReviewDialogProps) {
  const { addReview } = useApp()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const submit = () => {
    addReview({ jobId, revieweeId, rating, comment: comment.trim() || 'Great experience!' })
    toast.success('Review submitted', { description: `Thanks for rating ${revieweeName}.` })
    setComment('')
    setRating(5)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
          <DialogDescription>How was working with {revieweeName}?</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 py-2">
          <RatingStars value={rating} onChange={setRating} size="lg" />
          <p className="text-sm font-medium text-muted-foreground">
            {['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'][rating]}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="review-text">Your review</Label>
          <Textarea
            id="review-text"
            rows={4}
            placeholder="Share a few words about the job…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
            Later
          </Button>
          <Button size="lg" onClick={submit}>
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
