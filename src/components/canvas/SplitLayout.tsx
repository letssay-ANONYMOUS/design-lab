import { useIsStatic } from '@/components/canvas/SectionContext'
import { useLab } from '@/store/useLab'
import type { Section } from '@/types'
import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'

const MIN = 22
const MAX = 78

/**
 * A two-column layout whose divider can be dragged.
 *
 * Every two-column section has one decision buried in it — how much room the
 * image gets versus the copy — and until now that decision was a hardcoded
 * `1fr 1fr` in the variant. Exposing it as a drag turns a fixed archetype into
 * something you can actually push around, which is the point of the lab.
 *
 * The handle is absolutely positioned rather than being a third grid column,
 * because the columns use `order` to mirror themselves and a real grid item
 * would have to be re-ordered along with them.
 */
export function SplitLayout({
  section,
  defaultRatio,
  gap,
  className,
  style,
  children,
}: {
  section: Section
  /** Where the divider sits when the section has never been dragged. */
  defaultRatio: number
  /** Any CSS length expression. Also positions the handle, so it must match. */
  gap: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const isStatic = useIsStatic()
  const setSectionMeta = useLab((s) => s.setSectionMeta)
  const commit = useLab((s) => s.commit)

  const stored = section.meta.splitRatio ?? defaultRatio
  /* Live ratio while dragging. The store only hears the final value, so one
   * drag is one undo step rather than one per pixel. */
  const [draft, setDraft] = useState<number | null>(null)
  const ratio = draft ?? stored

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const wrap = wrapRef.current
    if (!wrap) return

    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)
    const box = wrap.getBoundingClientRect()
    let latest = stored

    const onMove = (moveEvent: PointerEvent) => {
      const next = Math.round(clamp(((moveEvent.clientX - box.left) / box.width) * 100, MIN, MAX))
      if (next !== latest) {
        latest = next
        setDraft(next)
      }
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      setDraft(null)
      if (latest !== stored) setSectionMeta(section.id, { splitRatio: latest })
    }

    commit()
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', ...style }}>
      <div
        className={`grid ${className ?? ''}`}
        style={{
          gridTemplateColumns: `minmax(0, ${ratio}fr) minmax(0, ${100 - ratio}fr)`,
          gap,
        }}
      >
        {children}
      </div>

      {!isStatic && (
        <span
          role="slider"
          tabIndex={0}
          aria-label={`Column split — left column is ${ratio}% wide`}
          aria-valuenow={ratio}
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          onPointerDown={onPointerDown}
          onKeyDown={(event) => {
            const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
            if (step === 0) return
            event.preventDefault()
            setSectionMeta(section.id, {
              splitRatio: clamp(stored + step * (event.shiftKey ? 5 : 1), MIN, MAX),
            })
          }}
          className="dl-resize absolute cursor-col-resize"
          style={{
            /* The columns divide the width left over after the gap, so the
             * boundary sits that far in, plus half a gap to land in the middle
             * of the gutter rather than against a column edge. */
            left: `calc((100% - (${gap})) * ${ratio / 100} + (${gap}) / 2)`,
            top: 0,
            bottom: 0,
            width: 10,
            marginLeft: -5,
            touchAction: 'none',
          }}
        >
          <span
            className="pointer-events-none absolute top-1/2 left-1/2 block"
            style={{
              width: 5,
              height: 46,
              marginTop: -23,
              marginLeft: -2.5,
              borderRadius: 999,
              background: 'rgba(124,108,255,.92)',
              boxShadow: '0 2px 8px rgba(0,0,0,.35)',
            }}
          />
        </span>
      )}
    </div>
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
