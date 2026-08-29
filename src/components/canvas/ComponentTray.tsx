import { ToolButton } from '@/components/ui/primitives'
import { COMPONENT_TRAY } from '@/lib/registry'
import { useLab } from '@/store/useLab'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * Insert-component menu. Anchored inside the section's hover toolbar so a new
 * element always lands in a known section rather than "wherever the cursor was".
 */
export function ComponentTray({ sectionId }: { sectionId: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const addComponent = useLab((s) => s.addComponent)

  useEffect(() => {
    if (!open) return
    const onDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
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

  const groups = [...new Set(COMPONENT_TRAY.map((item) => item.group))]

  return (
    <div ref={ref} className="relative">
      <ToolButton
        active={open}
        onClick={(event) => {
          event.stopPropagation()
          setOpen((value) => !value)
        }}
        icon={<Plus size={13} />}
        title="Add a component to this section"
      >
        Add
      </ToolButton>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-50 mt-1.5 w-52 origin-top-right rounded-xl border border-ui-700 bg-ui-900 p-1.5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {groups.map((group) => (
              <div key={group} className="mb-1 last:mb-0">
                <p className="m-0 px-2 py-1 text-[9px] font-semibold tracking-[0.13em] text-ui-500 uppercase">
                  {group}
                </p>
                {COMPONENT_TRAY.filter((item) => item.group === group).map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      addComponent(sectionId, item.type)
                      setOpen(false)
                    }}
                    className="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-left text-[11px] text-ui-200 transition-colors hover:bg-ui-750 hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
