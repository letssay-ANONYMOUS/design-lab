import { useScroll, useTransform, type MotionValue } from 'framer-motion'
import { createContext, useContext, type RefObject } from 'react'

/**
 * Scroll plumbing for the canvas. It lives apart from `Reveal` so that file can
 * export a component and nothing else — every section imports it, so losing
 * fast refresh there means a full reload on almost any edit.
 */

/** The canvas' scroll container — needed so IntersectionObserver watches the
 * right box rather than the (never-scrolling) window. */
export const ScrollRootContext = createContext<RefObject<HTMLElement | null> | null>(null)

export function useScrollRoot() {
  return useContext(ScrollRootContext)
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
