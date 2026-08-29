import { useLab } from '@/store/useLab'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { createContext, useContext, type ReactNode, type RefObject } from 'react'

/** The canvas' scroll container — needed so IntersectionObserver watches the
 * right box rather than the (never-scrolling) window. */
export const ScrollRootContext = createContext<RefObject<HTMLElement | null> | null>(null)

export function useScrollRoot() {
  return useContext(ScrollRootContext)
}

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

/**
 * Hero image drift. Intensity is 0–100 from the choreography panel; at 0 the
 * transform is a no-op rather than a subtly-wrong 1px shift.
 */
export function useParallaxY(
  target: RefObject<HTMLElement | null>,
  intensity: number,
): MotionValue<number> {
  const root = useScrollRoot()
  const { scrollYProgress } = useScroll({
    target,
    container: root ?? undefined,
    offset: ['start end', 'end start'],
  })
  const travel = (intensity / 100) * 90
  return useTransform(scrollYProgress, [0, 1], [travel, -travel])
}

export { motion }
