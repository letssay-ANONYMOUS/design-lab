import { ScrollRootContext } from '@/components/canvas/scroll'
import { SectionShell } from '@/components/canvas/SectionShell'
import { SelectionLayer } from '@/components/canvas/SelectionLayer'
import { EmptyState, ToolButton } from '@/components/ui/primitives'
import { tokensToVars } from '@/lib/tokens'
import { useLab } from '@/store/useLab'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'

/** The 12-column + 8pt overlay. Purely diagnostic; never exported. */
function GridOverlay() {
  return (
    <div
      className="dl-grid-overlay pointer-events-none absolute inset-0 z-[60]"
      aria-hidden
      style={{ mixBlendMode: 'multiply' }}
    >
      <div
        className="mx-auto grid h-full"
        style={{
          maxWidth: 1180,
          paddingInline: 'var(--dl-pad-x, 48px)',
          gridTemplateColumns: 'repeat(12, minmax(0,1fr))',
          gap: 'var(--dl-gap, 24px)',
        }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ background: 'rgba(124,108,255,.075)' }} />
        ))}
      </div>
    </div>
  )
}

export function Canvas({ onOpenPicker }: { onOpenPicker: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const page = useLab((s) => s.page)
  const view = useLab((s) => s.view)
  const reorderSections = useLab((s) => s.reorderSections)
  const select = useLab((s) => s.select)
  const setActiveSection = useLab((s) => s.setActiveSection)

  /* Sections mount one render late, after the scroll container exists. Without
   * this, the parallax and reveal hooks run against a still-null ref on the
   * first render and silently fall back to measuring the document. A callback
   * ref rather than an effect, so the flag flips exactly when the node
   * attaches. */
  const [scrollerReady, setScrollerReady] = useState(false)
  const attachScroller = useCallback((node: HTMLDivElement | null) => {
    scrollRef.current = node
    setScrollerReady(node !== null)
  }, [])

  const sensors = useSensors(
    /* 6px of slop so a click-to-select never starts a drag by accident. */
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = page.sections.findIndex((s) => s.id === active.id)
    const to = page.sections.findIndex((s) => s.id === over.id)
    if (from !== -1 && to !== -1) reorderSections(from, to)
  }

  /* Preview playback: snap to the top, then glide the whole page past the
   * viewport so every reveal fires in sequence. */
  useEffect(() => {
    if (view.previewNonce === 0) return
    const scroller = scrollRef.current
    if (!scroller) return

    scroller.scrollTo({ top: 0, behavior: 'auto' })
    let frame = 0
    let cancelled = false
    const start = performance.now()
    const distance = scroller.scrollHeight - scroller.clientHeight
    const duration = Math.min(14000, Math.max(4200, distance * 2.1))

    const tick = (now: number) => {
      if (cancelled) return
      const progress = Math.min(1, (now - start) / duration)
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2
      scroller.scrollTop = distance * eased
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    const kickoff = window.setTimeout(() => {
      frame = requestAnimationFrame(tick)
    }, 260)

    const stop = () => {
      cancelled = true
    }
    scroller.addEventListener('wheel', stop, { passive: true })
    scroller.addEventListener('pointerdown', stop)

    return () => {
      cancelled = true
      window.clearTimeout(kickoff)
      cancelAnimationFrame(frame)
      scroller.removeEventListener('wheel', stop)
      scroller.removeEventListener('pointerdown', stop)
    }
  }, [view.previewNonce])

  return (
    <ScrollRootContext.Provider value={scrollRef}>
      <div className="relative min-h-0 flex-1 bg-ui-950">
        <div
          ref={attachScroller}
          /* Positioning is set inline rather than by class because
           * framer-motion reads the computed style to measure scroll offsets,
           * and it has to hold even before the stylesheet lands. */
          style={{ position: 'relative' }}
          className="dl-editing h-full overflow-y-auto overflow-x-hidden"
          onMouseDown={() => {
            select(null)
            setActiveSection(null)
          }}
        >
          <div
            key={view.previewNonce}
            className="dl-canvas-root relative mx-auto min-h-full"
            style={{
              ...(tokensToVars(page.tokens) as CSSProperties),
              maxWidth: 1440,
              filter: view.squint ? 'blur(7px) saturate(1.05)' : undefined,
              transition: 'filter .28s cubic-bezier(.22,1,.36,1)',
            }}
          >
            {view.grid && <GridOverlay />}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={page.sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {scrollerReady &&
                  page.sections.map((section, index) => (
                    <SectionShell key={section.id} section={section} index={index} />
                  ))}
              </SortableContext>
            </DndContext>

            {page.sections.length === 0 && (
              <div className="flex min-h-[70vh] items-center justify-center">
                <div className="rounded-2xl border border-dashed border-ui-700 bg-ui-900/60 px-10 py-12">
                  <EmptyState
                    title="Nothing on the page yet"
                    hint="Add a section to start, or load a preset from the top bar."
                  />
                  <div className="mt-2 flex justify-center">
                    <ToolButton variant="solid" onClick={onOpenPicker} icon={<Plus size={14} />}>
                      Add a section
                    </ToolButton>
                  </div>
                </div>
              </div>
            )}

            {page.sections.length > 0 && (
              <div className="flex justify-center bg-white/0 py-8">
                <ToolButton
                  variant="outline"
                  onClick={(event) => {
                    event.stopPropagation()
                    onOpenPicker()
                  }}
                  icon={<Plus size={14} />}
                >
                  Add section
                </ToolButton>
              </div>
            )}
          </div>
        </div>

        {!view.squint && <SelectionLayer scrollRef={scrollRef} />}
      </div>
    </ScrollRootContext.Provider>
  )
}
