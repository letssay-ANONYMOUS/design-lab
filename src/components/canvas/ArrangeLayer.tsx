import { useArrange } from '@/store/useArrange'
import { AnimatePresence, motion } from 'framer-motion'
import { GripVertical } from 'lucide-react'
import { createPortal } from 'react-dom'

/**
 * What a drag looks like: a label following the cursor and a line showing
 * exactly where the element will land.
 *
 * Both are portalled and `pointer-events: none`, so they can never become the
 * hit-test result while the drop target is being resolved under the cursor.
 */
export function ArrangeLayer() {
  const dragging = useArrange((s) => s.dragging)
  const target = useArrange((s) => s.target)
  const pointer = useArrange((s) => s.pointer)

  return createPortal(
    <AnimatePresence>
      {dragging && (
        <motion.div
          key="arrange"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="pointer-events-none fixed inset-0 z-[220]"
        >
          {target && (
            <motion.span
              className="absolute block rounded-full bg-brand"
              /* Animating position makes the line glide between slots rather
               * than teleport, which is what sells it as a real placement. */
              animate={{
                top: target.rect.top,
                left: target.rect.left,
                width: target.rect.width,
                height: target.rect.height,
              }}
              transition={{ type: 'spring', stiffness: 900, damping: 60, mass: 0.5 }}
              style={{ boxShadow: '0 0 0 3px rgba(124,108,255,.25), 0 0 14px rgba(124,108,255,.5)' }}
            />
          )}

          <span
            className="absolute flex items-center gap-1.5 rounded-lg border border-ui-700 bg-ui-900/95 px-2 py-1 text-[11px] font-medium text-ui-100 shadow-2xl backdrop-blur"
            style={{ top: pointer.y + 14, left: pointer.x + 14 }}
          >
            <GripVertical size={12} className="text-brand-soft" />
            {dragging.label}
            {!target && <span className="text-ui-500">— drop on an element</span>}
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
