import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Map as MapIcon, Search, SearchX, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/EmptyState'
import { FilterSelect } from '@/components/FilterSelect'
import { JobCard } from '@/components/JobCard'
import { applyJobFilters, defaultFilters, JobFilters, sortOptions, type JobFilterState } from '@/components/JobFilters'
import { MapPreview } from '@/components/MapPreview'
import { PageHeader } from '@/components/PageHeader'
import { useApp } from '@/context/AppContext'

export default function FindJobs() {
  const { jobs, currentUser } = useApp()
  const [params] = useSearchParams()
  const [filters, setFilters] = useState<JobFilterState>({ ...defaultFilters, keyword: params.get('q') ?? '' })
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const results = useMemo(() => applyJobFilters(jobs, filters, currentUser?.skills), [jobs, filters, currentUser])
  const activeCount = (Object.keys(defaultFilters) as (keyof JobFilterState)[]).filter(
    (k) => k !== 'keyword' && k !== 'sort' && filters[k] !== defaultFilters[k],
  ).length

  return (
    <div className="space-y-5">
      <PageHeader title="Find Jobs" description="One-day and short-term work near you in Chennai." />

      <div className="flex flex-col gap-3 sm:flex-row" role="search">
        <div className="relative flex-1">
          <label htmlFor="job-search" className="sr-only">
            Search jobs
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="job-search"
            type="search"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            placeholder="Search by title, skill or area"
            className="h-12 bg-card pl-11 text-base"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            size="lg"
            className="h-12 flex-1 sm:flex-none"
            aria-expanded={showFilters}
            onClick={() => setShowFilters((s) => !s)}
          >
            <SlidersHorizontal aria-hidden="true" /> Filters
            {activeCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{activeCount}</span>
            )}
          </Button>
          <Button
            variant={showMap ? 'secondary' : 'outline'}
            size="lg"
            className="h-12 flex-1 sm:flex-none"
            aria-pressed={showMap}
            onClick={() => setShowMap((s) => !s)}
          >
            <MapIcon aria-hidden="true" /> Map
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="rounded-2xl border bg-card p-4">
          <JobFilters jobs={jobs} value={filters} onChange={setFilters} />
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-semibold text-foreground">{results.length}</span> jobs found
        </p>
        <div className="w-44">
          <FilterSelect
            ariaLabel="Sort jobs"
            value={filters.sort}
            onChange={(v) => setFilters({ ...filters, sort: v as JobFilterState['sort'] })}
            options={sortOptions}
          />
        </div>
      </div>

      {showMap && <MapPreview jobs={results} className="aspect-[16/9] md:aspect-[21/9]" />}

      {results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No jobs match your search"
          description="Try removing a filter or searching for something broader."
          action={
            <Button variant="outline" onClick={() => setFilters(defaultFilters)}>
              Clear all filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
