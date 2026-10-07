import { useNavigate } from 'react-router-dom'
import { Building2, ChevronDown, LogOut, RotateCcw, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export function DemoSwitcher() {
  const { role, login, logout, resetDemo } = useApp()
  const navigate = useNavigate()

  const switchTo = (next: 'jobSeeker' | 'employer') => {
    login(next)
    navigate(next === 'employer' ? '/employer' : '/seeker')
    toast(`Switched to ${next === 'employer' ? 'Employer' : 'Job Seeker'} view`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="lg" className="gap-1.5 border-dashed border-primary/50 text-primary" />}
      >
        <span className="hidden sm:inline">Demo:</span>
        <span className="font-semibold">{role === 'employer' ? 'Employer' : 'Job Seeker'}</span>
        <ChevronDown aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch demo role</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => switchTo('jobSeeker')} className={cn(role === 'jobSeeker' && 'bg-muted')}>
            <UserRound /> Job Seeker · Arun
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchTo('employer')} className={cn(role === 'employer' && 'bg-muted')}>
            <Building2 /> Employer · Saravana
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            resetDemo()
            toast.success('Demo data reset')
          }}
        >
          <RotateCcw /> Reset demo data
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
