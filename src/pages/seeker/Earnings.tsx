import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CalendarCheck, Clock, TrendingUp, Wallet } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { useApp } from '@/context/AppContext'
import { DEMO_TODAY, formatCurrency, formatLongDate } from '@/lib/format'
import { cn } from '@/lib/utils'

const monthKey = (iso: string) => iso.slice(0, 7)
const monthLabel = (key: string) =>
  new Date(`${key}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'short' })

export default function Earnings() {
  const { payments, currentUser, getUser } = useApp()
  const mine = payments.filter((p) => p.seekerId === currentUser?.id).sort((a, b) => b.date.localeCompare(a.date))
  const paid = mine.filter((p) => p.status === 'paid')
  const total = paid.reduce((s, p) => s + p.amount, 0)
  const pending = mine.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const thisMonth = paid.filter((p) => monthKey(p.date) === monthKey(DEMO_TODAY)).reduce((s, p) => s + p.amount, 0)

  const today = new Date(`${DEMO_TODAY}T00:00:00`)
  const chart = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    return { month: monthLabel(key), amount: paid.filter((p) => monthKey(p.date) === key).reduce((s, p) => s + p.amount, 0) }
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Earnings" description="Your payouts from completed jobs." />

      <section aria-label="Earnings summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total earned" value={formatCurrency(total)} icon={Wallet} tone="success" />
        <StatCard label="This month" value={formatCurrency(thisMonth)} icon={TrendingUp} />
        <StatCard label="Pending" value={formatCurrency(pending)} icon={Clock} tone="warning" />
        <StatCard label="Paid jobs" value={paid.length} icon={CalendarCheck} tone="neutral" />
      </section>

      <section className="rounded-3xl border bg-card p-5">
        <h2 className="text-lg font-bold">Last 6 months</h2>
        <div className="mt-4 h-64" role="img" aria-label="Bar chart of monthly earnings">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart} margin={{ left: -12, right: 4, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: 'var(--muted)' }}
                formatter={(v) => [formatCurrency(Number(v)), 'Earned']}
                contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }}
              />
              <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl border bg-card">
        <h2 className="border-b px-5 py-4 text-lg font-bold">Payment history</h2>
        {mine.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={Wallet} title="No payments yet" description="Complete your first job to start earning." />
          </div>
        ) : (
          <ul className="divide-y">
            {mine.map((p) => {
              const employer = getUser(p.employerId)
              return (
                <li key={p.id} className="flex items-center gap-4 px-5 py-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
                    <Wallet className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.jobTitle}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {employer?.company ?? employer?.name} · {formatLongDate(p.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">+{formatCurrency(p.amount)}</p>
                    <p className={cn('text-xs font-semibold capitalize', p.status === 'paid' ? 'text-success' : 'text-warning-foreground')}>
                      {p.status}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
