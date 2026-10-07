import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ApplicationCard } from '@/components/ApplicationCard'
import { EmptyState } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { SegmentedFilter } from '@/components/SegmentedFilter'
import { useApp } from '@/context/AppContext'
import type { ApplicationStatus } from '@/types'

const groups: { value: string; label: string; statuses: ApplicationStatus[] }[] = [
  { value: 'all', label: 'All', statuses: [] },
  { value: 'pending', label: 'Pending', statuses: ['applied', 'shortlisted'] },
  { value: 'active', label: 'Upcoming', statuses: ['accepted', 'in_progress'] },
  { value: 'completed', label: 'Completed', statuses: ['completed'] },
  { value: 'rejected', label: 'Rejected', statuses: ['rejected'] },
]

export default function MyApplications() {
  const { applications, currentUser } = useApp()
  const [tab, setTab] = useState('all')
  const mine = applications
    .filter((a) => a.seekerId === currentUser?.id)
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
  const group = groups.find((g) => g.value === tab)!
  const visible = group.statuses.length ? mine.filter((a) => group.statuses.includes(a.status)) : mine

  return (
    <div className="space-y-5">
      <PageHeader title="My Applications" description="Track every job you've applied for." />
      <SegmentedFilter
        label="Filter applications"
        value={tab}
        onChange={setTab}
        options={groups.map((g) => ({
          value: g.value,
          label: g.label,
          count: g.statuses.length ? mine.filter((a) => g.statuses.includes(a.status)).length : mine.length,
        }))}
      />
      {visible.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nothing here yet"
          description="Applications you make will show up here with live status updates."
          action={
            <Link to="/seeker/jobs" className={buttonVariants()}>
              Find Jobs
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.map((a) => (
            <ApplicationCard key={a.id} application={a} />
          ))}
        </div>
      )}
    </div>
  )
}
