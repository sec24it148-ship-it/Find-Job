export type Role = 'jobSeeker' | 'employer'

export interface User {
  id: string
  role: Role
  name: string
  company?: string
  industry?: string
  location: string
  bio: string
  rating: number
  skills: string[]
  experience: string
  completedJobs: number
  verified: boolean
  phone: string
  memberSince: string
}

export type JobStatus = 'open' | 'draft' | 'in_progress' | 'completed' | 'closed'

export interface Job {
  id: string
  title: string
  employerId: string
  location: string
  address: string
  distanceKm: number
  date: string
  startTime: string
  endTime: string
  duration: string
  salary: number
  category: string
  skills: string[]
  description: string
  responsibilities: string[]
  requirements: string[]
  workersRequired: number
  experience: string
  instructions: string
  status: JobStatus
  postedAt: string
  map: { x: number; y: number }
}

export type ApplicationStatus =
  | 'applied'
  | 'shortlisted'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'rejected'

export interface Application {
  id: string
  jobId: string
  seekerId: string
  status: ApplicationStatus
  appliedAt: string
}

export interface Conversation {
  id: string
  seekerId: string
  employerId: string
  jobId: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  timestamp: string
}

export interface Notification {
  id: string
  userId: string
  type: 'application' | 'job' | 'message' | 'reminder' | 'payment' | 'review'
  text: string
  timestamp: string
  read: boolean
  link?: string
}

export interface Payment {
  id: string
  seekerId: string
  employerId: string
  jobId: string | null
  jobTitle: string
  amount: number
  date: string
  status: 'paid' | 'pending'
}

export interface Review {
  id: string
  jobId: string | null
  reviewerId: string
  revieweeId: string
  rating: number
  comment: string
  date: string
}

export interface AppData {
  users: User[]
  jobs: Job[]
  applications: Application[]
  conversations: Conversation[]
  messages: Message[]
  notifications: Notification[]
  payments: Payment[]
  reviews: Review[]
}
