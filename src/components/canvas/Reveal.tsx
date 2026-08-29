import { useScrollRoot } from '@/components/canvas/scroll'
import { useLab } from '@/store/useLab'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Position in the stagger sequence. */
  index?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * The single entry animation used everywhere on the canvas. Distance, stagger
 * and easing all come from the choreography panel so the whole page can be
 * retuned from three sliders.
 */
export function Reveal({ children, index = 0, className, style }: RevealProps) {
  const stagger = useLab((s) => s.view.choreo.stagger)
  const distance = useLab((s) => s.view.choreo.distance)
  const root = useScrollRoot()

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2, root: root ?? undefined }}
      transition={{
        duration: 0.62,
        delay: Math.min(index * stagger, 0.9),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
