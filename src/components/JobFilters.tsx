import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FilterSelect, type Option } from '@/components/FilterSelect'
import { daysFromToday } from '@/lib/format'
import type { Job } from '@/types'

export interface JobFilterState {
  keyword: string
  category: string
  location: string
  minSalary: string
  date: string
  distance: string
  sort: 'recommended' | 'pay' | 'nearest' | 'newest'
}

export const defaultFilters: JobFilterState = {
  keyword: '',
  category: 'all',
  location: 'all',
  minSalary: 'any',
  date: 'any',
  distance: 'any',
  sort: 'recommended',
}

const salaryOptions: Option[] = [
  { value: 'any', label: 'Any pay' },
  { value: '700', label: '₹700+' },
  { value: '900', label: '₹900+' },
  { value: '1000', label: '₹1,000+' },
]
const dateOptions: Option[] = [
  { value: 'any', label: 'Any date' },
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'week', label: 'This week' },
]
const distanceOptions: Option[] = [
  { value: 'any', label: 'Any distance' },
  { value: '5', label: 'Within 5 km' },
  { value: '10', label: 'Within 10 km' },
  { value: '20', label: 'Within 20 km' },
]
export const sortOptions: Option[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'pay', label: 'Highest Pay' },
  { value: 'nearest', label: 'Nearest' },
  { value: 'newest', label: 'Newest' },
]

export function applyJobFilters(jobs: Job[], f: JobFilterState, userSkills: string[] = []) {
  const keyword = f.keyword.trim().toLowerCase()
  const filtered = jobs.filter((job) => {
    if (job.status !== 'open') return false
    if (
      keyword &&
      ![job.title, job.category, job.location, job.description, ...job.skills].some((v) => v.toLowerCase().includes(keyword))
    )
      return false
    if (f.category !== 'all' && job.category !== f.category) return false
    if (f.location !== 'all' && job.location !== f.location) return false
    if (f.minSalary !== 'any' && job.salary < Number(f.minSalary)) return false
    if (f.distance !== 'any' && job.distanceKm > Number(f.distance)) return false
    const days = daysFromToday(job.date)
    if (f.date === 'today' && days !== 0) return false
    if (f.date === 'tomorrow' && days !== 1) return false
    if (f.date === 'week' && (days < 0 || days > 6)) return false
    return true
  })

  const score = (job: Job) => job.skills.filter((s) => userSkills.includes(s)).length * 10 - job.distanceKm
  return [...filtered].sort((a, b) => {
    if (f.sort === 'pay') return b.salary - a.salary
    if (f.sort === 'nearest') return a.distanceKm - b.distanceKm
    if (f.sort === 'newest') return b.postedAt.localeCompare(a.postedAt)
    return score(b) - score(a)
  })
}

interface JobFiltersProps {
  jobs: Job[]
  value: JobFilterState
  onChange: (next: JobFilterState) => void
}

export function JobFilters({ jobs, value, onChange }: JobFiltersProps) {
  const categories = [...new Set(jobs.map((j) => j.category))].sort()
  const locations = [...new Set(jobs.map((j) => j.location))].sort()
  const set = <K extends keyof JobFilterState>(key: K, v: JobFilterState[K]) => onChange({ ...value, [key]: v })

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      <div className="grid gap-1.5">
        <Label htmlFor="filter-category" className="text-xs text-muted-foreground">
          Category
        </Label>
        <FilterSelect
          id="filter-category"
          value={value.category}
          onChange={(v) => set('category', v)}
          options={[{ value: 'all', label: 'All categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="filter-location" className="text-xs text-muted-foreground">
          Location
        </Label>
        <FilterSelect
          id="filter-location"
          value={value.location}
          onChange={(v) => set('location', v)}
          options={[{ value: 'all', label: 'All of Chennai' }, ...locations.map((l) => ({ value: l, label: l }))]}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="filter-salary" className="text-xs text-muted-foreground">
          Salary
        </Label>
        <FilterSelect id="filter-salary" value={value.minSalary} onChange={(v) => set('minSalary', v)} options={salaryOptions} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="filter-date" className="text-xs text-muted-foreground">
          Date
        </Label>
        <FilterSelect id="filter-date" value={value.date} onChange={(v) => set('date', v)} options={dateOptions} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="filter-distance" className="text-xs text-muted-foreground">
          Distance
        </Label>
        <FilterSelect id="filter-distance" value={value.distance} onChange={(v) => set('distance', v)} options={distanceOptions} />
      </div>
      <div className="col-span-2 flex items-end md:col-span-3 lg:col-span-5">
        <Button variant="ghost" size="sm" onClick={() => onChange({ ...defaultFilters, keyword: value.keyword })}>
          <RotateCcw aria-hidden="true" /> Clear filters
        </Button>
      </div>
    </div>
  )
}
