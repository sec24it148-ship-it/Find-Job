import { useSearchParams } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { ChatWindow } from '@/components/ChatWindow'
import { EmptyState } from '@/components/EmptyState'
import { UserAvatar } from '@/components/UserAvatar'
import { useApp } from '@/context/AppContext'
import { formatChatTime } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function Messages() {
  const { conversations, messages, currentUser, getUser, getJob } = useApp()
  const [params, setParams] = useSearchParams()
  const activeId = params.get('c')

  const mine = conversations
    .filter((c) => c.seekerId === currentUser?.id || c.employerId === currentUser?.id)
    .map((c) => {
      const thread = messages.filter((m) => m.conversationId === c.id).sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      return { conversation: c, last: thread.at(-1) }
    })
    .sort((a, b) => (b.last?.timestamp ?? '').localeCompare(a.last?.timestamp ?? ''))

  const active = mine.find((m) => m.conversation.id === activeId)?.conversation

  return (
    <div className="flex h-[calc(100svh-12rem)] min-h-[480px] overflow-hidden rounded-3xl border bg-card lg:h-[calc(100svh-8rem)]">
      <aside className={cn('flex w-full flex-col border-r md:w-80', active && 'hidden md:flex')} aria-label="Conversations">
        <h1 className="border-b px-4 py-4 text-xl font-bold">Messages</h1>
        {mine.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No conversations yet.</p>
        ) : (
          <ul className="flex-1 overflow-y-auto">
            {mine.map(({ conversation, last }) => {
              const otherId = currentUser?.id === conversation.seekerId ? conversation.employerId : conversation.seekerId
              const other = getUser(otherId)
              const name = other?.company ?? other?.name ?? 'User'
              const job = getJob(conversation.jobId)
              const selected = conversation.id === activeId
              return (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => setParams({ c: conversation.id })}
                    aria-current={selected ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted',
                      selected && 'bg-primary/8',
                    )}
                  >
                    <UserAvatar name={name} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold">{name}</span>
                        {last && <span className="shrink-0 text-[11px] text-muted-foreground">{formatChatTime(last.timestamp)}</span>}
                      </span>
                      <span className="block truncate text-xs text-primary">{job?.title}</span>
                      <span className="block truncate text-sm text-muted-foreground">{last?.text ?? 'Start the conversation'}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </aside>
      <div className={cn('min-w-0 flex-1', !active && 'hidden md:block')}>
        {active ? (
          <ChatWindow conversation={active} onBack={() => setParams({})} />
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <EmptyState icon={MessageCircle} title="Select a conversation" description="Pick a chat on the left to read and reply." />
          </div>
        )}
      </div>
    </div>
  )
}
