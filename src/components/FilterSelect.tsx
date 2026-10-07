import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface Option {
  value: string
  label: string
}

interface FilterSelectProps {
  id?: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  className?: string
  ariaLabel?: string
}

export function FilterSelect({ id, value, onChange, options, className, ariaLabel }: FilterSelectProps) {
  return (
    <Select items={options} value={value} onValueChange={(next) => onChange(String(next ?? ''))}>
      <SelectTrigger id={id} aria-label={ariaLabel} className={cn('h-10 w-full bg-card', className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
