import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import initialData from '@/data/data.json'
import { DEMO_TODAY, demoNowIso, formatCurrency } from '@/lib/format'
import type {
  AppData,
  Application,
  ApplicationStatus,
  Job,
  Notification,
  Review,
  Role,
  User,
} from '@/types'

const STORAGE_KEY = '1dhire-demo-state-v1'
const SEEKER_ID = 'user-1'
const EMPLOYER_ID = 'emp-1'

interface PersistedState extends AppData {
  role: Role | null
  savedJobs: string[]
}

function freshState(): PersistedState {
  return {
    ...(structuredClone(initialData) as AppData),
    role: null,
    savedJobs: ['job-5'],
  }
}

function loadState(): PersistedState {
  if (typeof window === 'undefined') return freshState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...freshState(), ...(JSON.parse(raw) as PersistedState) }
  } catch {
    // Corrupt storage falls back to the original JSON data.
  }
  return freshState()
}

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`

export type NewJobInput = Omit<Job, 'id' | 'employerId' | 'postedAt' | 'distanceKm' | 'map' | 'duration'> & {
  duration?: string
}

interface AppContextValue extends PersistedState {
  currentUser: User | null
  login: (role: Role) => void
  logout: () => void
  getUser: (id: string) => User | undefined
  getJob: (id: string) => Job | undefined
  userRating: (userId: string) => { rating: number; count: number }
  applyToJob: (jobId: string) => void
  toggleSaveJob: (jobId: string) => void
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void
  postJob: (input: NewJobInput) => Job
  updateJob: (jobId: string, input: Partial<Job>) => void
  sendMessage: (conversationId: string, text: string) => void
  startConversation: (seekerId: string, employerId: string, jobId: string) => string
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  addReview: (review: Omit<Review, 'id' | 'date' | 'reviewerId'>) => void
  updateProfile: (changes: Partial<User>) => void
  resetDemo: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function calcDuration(start: string, end: string) {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let minutes = eh * 60 + em - (sh * 60 + sm)
  if (minutes <= 0) minutes += 24 * 60
  const hours = minutes / 60
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hours`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const currentUserId = state.role === 'employer' ? EMPLOYER_ID : state.role === 'jobSeeker' ? SEEKER_ID : null
  const currentUser = useMemo(
    () => state.users.find((u) => u.id === currentUserId) ?? null,
    [state.users, currentUserId],
  )

  const getUser = useCallback((id: string) => state.users.find((u) => u.id === id), [state.users])
  const getJob = useCallback((id: string) => state.jobs.find((j) => j.id === id), [state.jobs])

  const userRating = useCallback(
    (userId: string) => {
      const received = state.reviews.filter((r) => r.revieweeId === userId)
      if (received.length === 0) {
        return { rating: state.users.find((u) => u.id === userId)?.rating ?? 0, count: 0 }
      }
      const avg = received.reduce((sum, r) => sum + r.rating, 0) / received.length
      return { rating: Math.round(avg * 10) / 10, count: received.length }
    },
    [state.reviews, state.users],
  )

  const notify = (userId: string, type: Notification['type'], text: string, link?: string): Notification => ({
    id: uid('n'),
    userId,
    type,
    text,
    link,
    read: false,
    timestamp: demoNowIso(),
  })

  const login = useCallback((role: Role) => setState((s) => ({ ...s, role })), [])
  const logout = useCallback(() => setState((s) => ({ ...s, role: null })), [])

  const applyToJob = useCallback((jobId: string) => {
    setState((s) => {
      if (s.applications.some((a) => a.jobId === jobId && a.seekerId === SEEKER_ID)) return s
      const job = s.jobs.find((j) => j.id === jobId)
      const seeker = s.users.find((u) => u.id === SEEKER_ID)
      if (!job || !seeker) return s
      const application: Application = {
        id: uid('app'),
        jobId,
        seekerId: SEEKER_ID,
        status: 'applied',
        appliedAt: demoNowIso(),
      }
      return {
        ...s,
        applications: [application, ...s.applications],
        notifications: [
          notify(job.employerId, 'application', `${seeker.name} applied for ${job.title}.`, `/employer/jobs/${job.id}/applicants`),
          ...s.notifications,
        ],
      }
    })
  }, [])

  const toggleSaveJob = useCallback((jobId: string) => {
    setState((s) => ({
      ...s,
      savedJobs: s.savedJobs.includes(jobId) ? s.savedJobs.filter((id) => id !== jobId) : [...s.savedJobs, jobId],
    }))
  }, [])

  const updateApplicationStatus = useCallback((applicationId: string, status: ApplicationStatus) => {
    setState((s) => {
      const application = s.applications.find((a) => a.id === applicationId)
      if (!application) return s
      const job = s.jobs.find((j) => j.id === application.jobId)
      if (!job) return s
      const employer = s.users.find((u) => u.id === job.employerId)
      const seeker = s.users.find((u) => u.id === application.seekerId)
      const employerName = employer?.company ?? employer?.name ?? 'Employer'

      const applications = s.applications.map((a) => (a.id === applicationId ? { ...a, status } : a))
      let jobs = s.jobs
      let payments = s.payments
      let users = s.users
      const newNotifications: Notification[] = []

      const seekerMessages: Partial<Record<ApplicationStatus, string>> = {
        shortlisted: `You were shortlisted for ${job.title} by ${employerName}.`,
        accepted: `Your application for ${job.title} was accepted.`,
        rejected: `Your application for ${job.title} was not selected this time.`,
        in_progress: `Your ${job.title} shift has started. Have a great day!`,
      }
      const text = seekerMessages[status]
      if (text) newNotifications.push(notify(application.seekerId, 'application', text, '/seeker/applications'))

      if (status === 'in_progress' && job.status === 'open') {
        jobs = jobs.map((j) => (j.id === job.id ? { ...j, status: 'in_progress' } : j))
      }

      if (status === 'completed') {
        const alreadyPaid = s.payments.some((p) => p.jobId === job.id && p.seekerId === application.seekerId)
        if (!alreadyPaid) {
          payments = [
            {
              id: uid('pay'),
              seekerId: application.seekerId,
              employerId: job.employerId,
              jobId: job.id,
              jobTitle: job.title,
              amount: job.salary,
              date: DEMO_TODAY,
              status: 'paid',
            },
            ...payments,
          ]
          newNotifications.push(
            notify(
              application.seekerId,
              'payment',
              `Payment of ${formatCurrency(job.salary)} completed for ${job.title}.`,
              '/seeker/earnings',
            ),
            notify(
              job.employerId,
              'payment',
              `${seeker?.name ?? 'Worker'} completed ${job.title}. ${formatCurrency(job.salary)} paid.`,
              `/employer/jobs/${job.id}/applicants`,
            ),
          )
          users = users.map((u) =>
            u.id === application.seekerId || u.id === job.employerId ? { ...u, completedJobs: u.completedJobs + 1 } : u,
          )
        }
        const hired = applications.filter(
          (a) => a.jobId === job.id && ['accepted', 'in_progress'].includes(a.status),
        )
        if (hired.length === 0) {
          jobs = jobs.map((j) => (j.id === job.id ? { ...j, status: 'completed' } : j))
        }
      }

      return {
        ...s,
        applications,
        jobs,
        payments,
        users,
        notifications: [...newNotifications, ...s.notifications],
      }
    })
  }, [])

  const postJob = useCallback((input: NewJobInput) => {
    const job: Job = {
      ...input,
      id: uid('job'),
      employerId: EMPLOYER_ID,
      postedAt: demoNowIso(),
      duration: input.duration || calcDuration(input.startTime, input.endTime),
      distanceKm: Math.round((1 + Math.random() * 12) * 10) / 10,
      map: { x: 15 + Math.round(Math.random() * 70), y: 15 + Math.round(Math.random() * 70) },
    }
    setState((s) => ({
      ...s,
      jobs: [job, ...s.jobs],
      notifications:
        job.status === 'open'
          ? [notify(SEEKER_ID, 'job', `New job available near you: ${job.title} in ${job.location}.`, `/seeker/jobs/${job.id}`), ...s.notifications]
          : s.notifications,
    }))
    return job
  }, [])

  const updateJob = useCallback((jobId: string, input: Partial<Job>) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) => {
        if (j.id !== jobId) return j
        const next = { ...j, ...input }
        if (input.startTime || input.endTime) next.duration = calcDuration(next.startTime, next.endTime)
        return next
      }),
    }))
  }, [])

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      if (!currentUserId) return
      setState((s) => {
        const conversation = s.conversations.find((c) => c.id === conversationId)
        if (!conversation) return s
        const recipientId = currentUserId === conversation.seekerId ? conversation.employerId : conversation.seekerId
        const sender = s.users.find((u) => u.id === currentUserId)
        const senderName = sender?.company ?? sender?.name ?? 'Someone'
        const recipientRoute = recipientId.startsWith('emp') ? '/employer/messages' : '/seeker/messages'
        return {
          ...s,
          messages: [
            ...s.messages,
            { id: uid('msg'), conversationId, senderId: currentUserId, text, timestamp: demoNowIso() },
          ],
          notifications: [
            notify(recipientId, 'message', `${senderName} sent you a message.`, `${recipientRoute}?c=${conversationId}`),
            ...s.notifications,
          ],
        }
      })
    },
    [currentUserId],
  )

  const startConversation = useCallback(
    (seekerId: string, employerId: string, jobId: string) => {
      const existing = state.conversations.find((c) => c.seekerId === seekerId && c.employerId === employerId)
      if (existing) return existing.id
      const id = uid('conv')
      setState((s) => ({ ...s, conversations: [...s.conversations, { id, seekerId, employerId, jobId }] }))
      return id
    },
    [state.conversations],
  )

  const markNotificationRead = useCallback((id: string) => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.userId === currentUserId ? { ...n, read: true } : n)),
    }))
  }, [currentUserId])

  const addReview = useCallback(
    (review: Omit<Review, 'id' | 'date' | 'reviewerId'>) => {
      if (!currentUserId) return
      setState((s) => {
        const reviewer = s.users.find((u) => u.id === currentUserId)
        const job = review.jobId ? s.jobs.find((j) => j.id === review.jobId) : undefined
        const revieweeRoute = review.revieweeId.startsWith('emp') ? '/employer/profile' : '/seeker/profile'
        return {
          ...s,
          reviews: [{ ...review, id: uid('rev'), reviewerId: currentUserId, date: DEMO_TODAY }, ...s.reviews],
          notifications: [
            notify(
              review.revieweeId,
              'review',
              `${reviewer?.company ?? reviewer?.name ?? 'Someone'} left you a ${review.rating}-star review${job ? ` for ${job.title}` : ''}.`,
              revieweeRoute,
            ),
            ...s.notifications,
          ],
        }
      })
    },
    [currentUserId],
  )

  const updateProfile = useCallback(
    (changes: Partial<User>) => {
      if (!currentUserId) return
      setState((s) => ({ ...s, users: s.users.map((u) => (u.id === currentUserId ? { ...u, ...changes } : u)) }))
    },
    [currentUserId],
  )

  const resetDemo = useCallback(() => {
    setState((s) => ({ ...freshState(), role: s.role }))
  }, [])

  const value: AppContextValue = {
    ...state,
    currentUser,
    login,
    logout,
    getUser,
    getJob,
    userRating,
    applyToJob,
    toggleSaveJob,
    updateApplicationStatus,
    postJob,
    updateJob,
    sendMessage,
    startConversation,
    markNotificationRead,
    markAllNotificationsRead,
    addReview,
    updateProfile,
    resetDemo,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

export const DEMO_IDS = { seeker: SEEKER_ID, employer: EMPLOYER_ID }
