import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserAvatar } from '@/components/UserAvatar'
import { useApp } from '@/context/AppContext'
import { formatChatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types'

interface ChatWindowProps {
  conversation: Conversation
  onBack?: () => void
}

export function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const { messages, currentUser, getUser, getJob, sendMessage } = useApp()
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const otherId = currentUser?.id === conversation.seekerId ? conversation.employerId : conversation.seekerId
  const other = getUser(otherId)
  const otherName = other?.company ?? other?.name ?? 'User'
  const job = getJob(conversation.jobId)
  const thread = messages
    .filter((m) => m.conversationId === conversation.id)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [thread.length, conversation.id])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    sendMessage(conversation.id, text)
    setDraft('')
  }

  return (
    <section className="flex h-full min-h-0 flex-col" aria-label={`Conversation with ${otherName}`}>
      <header className="flex items-center gap-3 border-b px-4 py-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to conversations" className="md:hidden">
            <ArrowLeft />
          </Button>
        )}
        <UserAvatar name={otherName} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{otherName}</p>
          {job && <p className="truncate text-xs text-muted-foreground">Re: {job.title}</p>}
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4" role="log" aria-live="polite">
        {thread.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No messages yet. Say hello!</p>
        )}
        {thread.map((m) => {
          const mine = m.senderId === currentUser?.id
          return (
            <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-xs',
                  mine ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md border bg-card',
                )}
              >
                <p className="leading-relaxed text-pretty">{m.text}</p>
                <p className={cn('mt-1 text-right text-[10px]', mine ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
                  {formatChatTime(m.timestamp)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t bg-card p-3">
        <label htmlFor="chat-input" className="sr-only">
          Type a message
        </label>
        <Input
          id="chat-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          className="h-11 flex-1"
          autoComplete="off"
        />
        <Button type="submit" size="icon-lg" className="size-11" disabled={!draft.trim()} aria-label="Send message">
          <Send />
        </Button>
      </form>
    </section>
  )
}
