import { cn } from '@/lib/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

/* ------------------------------- Tool button ------------------------------ */

interface ToolButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  variant?: 'ghost' | 'solid' | 'outline' | 'danger'
  size?: 'sm' | 'md'
  icon?: ReactNode
}

export function ToolButton({
  active,
  variant = 'ghost',
  size = 'md',
  icon,
  children,
  className,
  ...rest
}: ToolButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-all duration-150 select-none',
        'disabled:pointer-events-none disabled:opacity-40',
        size === 'sm' ? 'h-7 px-2 text-[11px]' : 'h-8 px-2.5 text-xs',
        variant === 'ghost' &&
          (active
            ? 'bg-brand/18 text-brand-soft shadow-[inset_0_0_0_1px_rgba(124,108,255,.4)]'
            : 'text-ui-300 hover:bg-ui-750 hover:text-ui-100'),
        variant === 'solid' && 'bg-brand text-white hover:bg-brand/88 active:scale-[.97]',
        variant === 'outline' &&
          'border border-ui-700 text-ui-200 hover:border-ui-600 hover:bg-ui-800',
        variant === 'danger' && 'text-ui-300 hover:bg-red-500/15 hover:text-red-300',
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}

/* --------------------------------- Slider -------------------------------- */

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  /** Rendered on the right of the label — the current value, formatted. */
  display?: string
  onChange: (value: number) => void
}

export function Slider({ label, value, min, max, step = 1, display, onChange }: SliderProps) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[11px] font-medium text-ui-300">
          {label}
        </label>
        <span className="font-mono text-[11px] text-ui-400 tabular-nums">
          {display ?? value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="dl-slider h-4 w-full cursor-pointer appearance-none bg-transparent"
        style={{ '--pct': `${pct}%` } as React.CSSProperties}
      />
    </div>
  )
}

/* -------------------------------- Segmented ------------------------------- */

interface SegmentedProps<T extends string> {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  className?: string
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
}: SegmentedProps<T>) {
  const groupId = useId()
  return (
    <div className={cn('flex rounded-lg bg-ui-850 p-0.5', className)}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex-1 cursor-pointer rounded-[6px] px-2 py-1.5 text-[11px] font-medium transition-colors duration-150',
              active ? 'text-ui-100' : 'text-ui-400 hover:text-ui-200',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${groupId}`}
                className="absolute inset-0 rounded-[6px] bg-ui-700"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* --------------------------------- Toggle --------------------------------- */

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  hint?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-ui-850"
    >
      <span className="flex flex-col">
        <span className="text-[11px] font-medium text-ui-200">{label}</span>
        {hint && <span className="text-[10px] text-ui-500">{hint}</span>}
      </span>
      <span
        className={cn(
          'relative h-[18px] w-8 shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-brand' : 'bg-ui-700',
        )}
      >
        <motion.span
          className="absolute top-[2px] left-[2px] h-[14px] w-[14px] rounded-full bg-white shadow"
          animate={{ x: checked ? 14 : 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 34 }}
        />
      </span>
    </button>
  )
}

/* ---------------------------------- Modal --------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 720,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  width?: number
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-[3px]"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative flex max-h-[86vh] w-full flex-col overflow-hidden rounded-2xl border border-ui-700 bg-ui-900 shadow-2xl outline-none"
            style={{ maxWidth: width }}
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-ui-800 px-5 py-4">
              <div>
                <h2 className="m-0 text-sm font-semibold text-ui-100">{title}</h2>
                {subtitle && <p className="m-0 mt-0.5 text-xs text-ui-400">{subtitle}</p>}
              </div>
              <ToolButton onClick={onClose} aria-label="Close" icon={<X size={15} />} />
            </header>
            <div className="min-h-0 flex-1 overflow-auto">{children}</div>
            {footer && (
              <footer className="flex items-center justify-end gap-2 border-t border-ui-800 px-5 py-3">
                {footer}
              </footer>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/* -------------------------------- Popover --------------------------------- */

/**
 * A small anchored panel. Closes on Escape, on outside click, and when the
 * canvas scrolls away underneath it — anything else leaves orphaned popovers
 * floating over the artwork you are trying to judge.
 */
export function Popover({
  trigger,
  children,
  width = 240,
  align = 'start',
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode
  children: ReactNode
  width?: number
  align?: 'start' | 'end'
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={wrapRef} className="relative">
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -3, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute top-[calc(100%+6px)] z-[150] rounded-xl border border-ui-700 bg-ui-900 p-3 shadow-2xl',
              align === 'end' ? 'right-0' : 'left-0',
            )}
            style={{ width }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* --------------------------------- Panels --------------------------------- */

export function PanelSection({
  title,
  children,
  action,
}: {
  title: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <section className="flex flex-col gap-2.5 border-b border-ui-850 px-3.5 py-3.5 last:border-b-0">
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-4 py-8 text-center">
      <p className="m-0 text-xs font-medium text-ui-300">{title}</p>
      {hint && <p className="m-0 text-[11px] text-ui-500">{hint}</p>}
    </div>
  )
}
