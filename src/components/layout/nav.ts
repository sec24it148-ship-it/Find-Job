import {
  Bell,
  Briefcase,
  ClipboardList,
  LayoutDashboard,
  MessageCircle,
  PlusCircle,
  Search,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { Role } from '@/types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const sidebarNav: Record<Role, NavItem[]> = {
  jobSeeker: [
    { to: '/seeker', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/seeker/jobs', label: 'Find Jobs', icon: Search },
    { to: '/seeker/applications', label: 'My Applications', icon: ClipboardList },
    { to: '/seeker/earnings', label: 'Earnings', icon: Wallet },
    { to: '/seeker/messages', label: 'Messages', icon: MessageCircle },
    { to: '/seeker/notifications', label: 'Notifications', icon: Bell },
    { to: '/seeker/profile', label: 'Profile', icon: User },
  ],
  employer: [
    { to: '/employer', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/employer/post-job', label: 'Post Job', icon: PlusCircle },
    { to: '/employer/jobs', label: 'My Jobs', icon: Briefcase },
    { to: '/employer/applicants', label: 'Applicants', icon: Users },
    { to: '/employer/messages', label: 'Messages', icon: MessageCircle },
    { to: '/employer/notifications', label: 'Notifications', icon: Bell },
    { to: '/employer/profile', label: 'Profile', icon: User },
  ],
}

export const mobileNav: Record<Role, NavItem[]> = {
  jobSeeker: [
    { to: '/seeker', label: 'Home', icon: LayoutDashboard, end: true },
    { to: '/seeker/jobs', label: 'Jobs', icon: Search },
    { to: '/seeker/applications', label: 'Applications', icon: ClipboardList },
    { to: '/seeker/messages', label: 'Messages', icon: MessageCircle },
    { to: '/seeker/profile', label: 'Profile', icon: User },
  ],
  employer: [
    { to: '/employer', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/employer/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/employer/applicants', label: 'Applications', icon: Users },
    { to: '/employer/messages', label: 'Messages', icon: MessageCircle },
    { to: '/employer/profile', label: 'Profile', icon: User },
  ],
}
