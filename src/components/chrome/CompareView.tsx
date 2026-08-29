import { StaticContext } from '@/components/canvas/SectionContext'
import { ScrollRootContext } from '@/components/canvas/Reveal'
import { ToolButton } from '@/components/ui/primitives'
import { SectionRenderer } from '@/sections/SectionRenderer'
import { useLab } from '@/store/useLab'
import type { Page } from '@/types'
import { RotateCcw, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A/B compare with a draggable divider.
 *
 * Both panes are full-width renders clipped by `inset()`, not squeezed into
 * half the space — squeezing changes the line lengths and column counts, which
 * is exactly the thing you are trying to compare. Scroll is mirrored so the
 * same content sits under the divider on both sides.
 */
export function CompareView() {
  const compare = useLab((s) => s.view.compare)
  const snapshots = useLab((s) => s.snapshots)
  const setCompare = useLab((s) => s.setCompare)
  const restoreSnapshot = useLab((s) => s.restoreSnapshot)

  const [split, setSplit] = useState(50)
  const wrapRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const syncing = useRef(false)

  const left = snapshots.find((s) => s.id === compare?.[0])
  const right = snapshots.find((s) => s.id === compare?.[1])

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    event.preventDefault()
    const move = (e: PointerEvent) => {
      const box = wrapRef.current?.getBoundingClientRect()
      if (!box) return
      setSplit(Math.min(96, Math.max(4, ((e.clientX - box.left) / box.width) * 100)))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }, [])

  /* Mirror scroll between the two panes without a feedback loop. */
  useEffect(() => {
    const a = leftRef.current
    const b = rightRef.current
    if (!a || !b) return
    const link = (from: HTMLElement, to: HTMLElement) => () => {
      if (syncing.current) return
      syncing.current = true
      to.scrollTop = from.scrollTop
      requestAnimationFrame(() => {
        syncing.current = false
      })
    }
    const onA = link(a, b)
    const onB = link(b, a)
    a.addEventListener('scroll', onA, { passive: true })
    b.addEventListener('scroll', onB, { passive: true })
    return () => {
      a.removeEventListener('scroll', onA)
      b.removeEventListener('scroll', onB)
    }
  }, [left, right])

  if (!compare || !left || !right) return null

  return (
    <div ref={wrapRef} className="relative min-h-0 flex-1 overflow-hidden bg-ui-950 select-none">
      <Pane innerRef={leftRef} page={left.page} clip={`inset(0 ${100 - split}% 0 0)`} />
      <Pane innerRef={rightRef} page={right.page} clip={`inset(0 0 0 ${split}%)`} />

      {/* Divider */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(split)}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') setSplit((v) => Math.max(4, v - 2))
          if (event.key === 'ArrowRight') setSplit((v) => Math.min(96, v + 2))
        }}
        className="absolute inset-y-0 z-30 w-px cursor-ew-resize bg-brand"
        style={{ left: `${split}%` }}
      >
        <span className="absolute top-1/2 left-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand bg-ui-900 text-[10px] font-semibold text-brand-soft shadow-xl">
          A|B
        </span>
      </div>

      {/* Labels */}
      <Label side="left" name={left.name} onRestore={() => restoreSnapshot(left.id)} />
      <Label side="right" name={right.name} onRestore={() => restoreSnapshot(right.id)} />

      <ToolButton
        variant="outline"
        onClick={() => setCompare(null)}
        className="absolute top-3 left-1/2 z-40 -translate-x-1/2 bg-ui-900/90 backdrop-blur"
        icon={<X size={13} />}
      >
        Exit compare
      </ToolButton>
    </div>
  )
}

function Pane({
  page,
  clip,
  innerRef,
}: {
  page: Page
  clip: string
  innerRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={innerRef}
      className="inset-0 overflow-y-auto overflow-x-hidden"
      /* Inline, not a class: framer-motion reads computed position to measure
       * scroll offsets inside this pane. */
      style={{ position: 'absolute', clipPath: clip }}
    >
      <StaticContext.Provider value>
        <ScrollRootContext.Provider value={innerRef}>
          <div className="dl-canvas-root mx-auto min-h-full" style={{ maxWidth: 1440 }}>
            {page.sections.map((section) => (
              <SectionRenderer key={section.id} section={section} tokens={page.tokens} />
            ))}
          </div>
        </ScrollRootContext.Provider>
      </StaticContext.Provider>
    </div>
  )
}

function Label({
  side,
  name,
  onRestore,
}: {
  side: 'left' | 'right'
  name: string
  onRestore: () => void
}) {
  return (
    <div
      className="absolute bottom-3 z-40 flex items-center gap-1.5 rounded-lg border border-ui-700 bg-ui-900/92 py-1 pr-1 pl-2.5 shadow-xl backdrop-blur"
      style={side === 'left' ? { left: 12 } : { right: 12 }}
    >
      <span className="text-[10px] font-semibold tracking-wide text-ui-500 uppercase">
        {side === 'left' ? 'A' : 'B'}
      </span>
      <span className="max-w-[180px] truncate text-[11px] text-ui-200">{name}</span>
      <ToolButton size="sm" onClick={onRestore} title="Restore this one" icon={<RotateCcw size={12} />} />
    </div>
  )
}
