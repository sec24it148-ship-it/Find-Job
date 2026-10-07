// The demo data is anchored to a fixed "today" so the dashboards always look consistent.
export const DEMO_TODAY = '2026-10-07'

export function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

function toDate(isoDate: string) {
  return new Date(`${isoDate.slice(0, 10)}T00:00:00`)
}

export function daysFromToday(isoDate: string) {
  const diff = toDate(isoDate).getTime() - toDate(DEMO_TODAY).getTime()
  return Math.round(diff / 86_400_000)
}

export function formatJobDate(isoDate: string) {
  const days = daysFromToday(isoDate)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  return toDate(isoDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatLongDate(isoDate: string) {
  return toDate(isoDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

export function timeAgo(isoTimestamp: string) {
  const now = new Date(`${DEMO_TODAY}T12:00:00`).getTime()
  const then = new Date(isoTimestamp).getTime()
  const minutes = Math.round((now - then) / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export function formatChatTime(isoTimestamp: string) {
  return new Date(isoTimestamp).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}

export function demoNowIso() {
  const real = new Date()
  const time = real.toTimeString().slice(0, 8)
  return `${DEMO_TODAY}T${time}`
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}
