import { CText } from '@/components/canvas/atoms'
import { Reveal } from '@/components/canvas/Reveal'
import { useIsStatic, useSectionId } from '@/components/canvas/SectionContext'
import { useNode } from '@/components/canvas/useNode'
import { useLab } from '@/store/useLab'
import type { Component, Section } from '@/types'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { CONTAINER, byType, sectionPad } from './parts'
import { SectionHeader } from './SectionHeader'

const COLS = 12
const MIN_COL = 3
const MAX_ROW = 3

interface Props {
  section: Section
  comps: Component[]
}

export function Bento({ section, comps }: Props) {
  const p = byType(comps)
  const gridRef = useRef<HTMLDivElement>(null)
  const isStatic = useIsStatic()
  const addComponent = useLab((s) => s.addComponent)
  const loud = section.variant === 'contrast'

  return (
    <div
      style={{
        background: loud ? 'var(--dl-loud-bg)' : 'var(--dl-bg)',
        color: loud ? 'var(--dl-loud-text)' : 'var(--dl-text)',
        ...sectionPad(),
      }}
    >
      <div style={CONTAINER}>
        <SectionHeader
          subheadings={p.subheadings}
          headings={p.headings}
          paragraphs={p.paragraphs}
          loud={loud}
        />

        <div
          ref={gridRef}
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            gridAutoRows: 'minmax(148px, auto)',
            gap: 'var(--dl-gap-sm)',
          }}
        >
          {p.cards.map((c, i) => (
            <BentoCard
              key={c.id}
              c={c}
              index={i}
              gridRef={gridRef}
              variant={section.variant}
              loud={loud}
            />
          ))}

          {!isStatic && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                addComponent(section.id, 'bentoCard')
              }}
              className="flex cursor-pointer items-center justify-center gap-2 border-0 bg-transparent transition-colors"
              style={{
                gridColumn: 'span 4',
                minHeight: 148,
                borderRadius: 'var(--dl-radius)',
                border: '1.5px dashed',
                borderColor: loud
                  ? 'color-mix(in oklab, var(--dl-loud-text) 26%, transparent)'
                  : 'var(--dl-border)',
                color: loud ? 'var(--dl-loud-text)' : 'var(--dl-muted)',
                fontFamily: 'var(--dl-font-body)',
                fontSize: 'var(--dl-size-sm)',
                fontWeight: 600,
              }}
            >
              <Plus size={16} /> Add card
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const CARD_FILLS = [
  'linear-gradient(135deg, color-mix(in oklab, var(--dl-primary) 80%, black), color-mix(in oklab, var(--dl-accent) 50%, var(--dl-surface)))',
  'linear-gradient(210deg, color-mix(in oklab, var(--dl-accent) 62%, var(--dl-surface)), color-mix(in oklab, var(--dl-primary) 70%, black))',
  'radial-gradient(110% 110% at 15% 15%, color-mix(in oklab, var(--dl-accent) 60%, white), color-mix(in oklab, var(--dl-primary) 78%, black))',
  'linear-gradient(320deg, color-mix(in oklab, var(--dl-text) 90%, black), color-mix(in oklab, var(--dl-primary) 62%, var(--dl-accent)))',
]

function BentoCard({
  c,
  index,
  gridRef,
  variant,
  loud,
}: {
  c: Component
  index: number
  gridRef: React.RefObject<HTMLDivElement | null>
  variant: string
  loud: boolean
}) {
  const node = useNode(c.id)
  const isStatic = useIsStatic()
  const sectionId = useSectionId()
  const update = useLab((s) => s.updateComponent)
  const commit = useLab((s) => s.commit)

  const stored = c.props.span ?? { col: 4, row: 1 }
  /* Live span while dragging. Committing on every pointermove would flood the
   * undo stack with one entry per pixel, so the store only hears about the
   * final size. */
  const [draft, setDraft] = useState<{ col: number; row: number } | null>(null)
  const span = draft ?? stored

  const onResizeStart = (event: ReactPointerEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const grid = gridRef.current
    if (!grid) return

    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)

    const gridBox = grid.getBoundingClientRect()
    const styles = getComputedStyle(grid)
    const gap = Number.parseFloat(styles.columnGap || '0') || 0
    const rowGap = Number.parseFloat(styles.rowGap || '0') || gap
    const colUnit = (gridBox.width - gap * (COLS - 1)) / COLS + gap

    const cardBox = handle.parentElement?.getBoundingClientRect()
    const rowUnit = cardBox ? cardBox.height / stored.row + rowGap : 148 + rowGap

    const startX = event.clientX
    const startY = event.clientY
    let latest = stored

    const onMove = (moveEvent: PointerEvent) => {
      const dCol = Math.round((moveEvent.clientX - startX) / colUnit)
      const dRow = Math.round((moveEvent.clientY - startY) / rowUnit)
      const next = {
        col: clamp(stored.col + dCol, MIN_COL, COLS),
        row: clamp(stored.row + dRow, 1, MAX_ROW),
      }
      if (next.col !== latest.col || next.row !== latest.row) {
        latest = next
        setDraft(next)
      }
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      setDraft(null)
      if (latest.col !== stored.col || latest.row !== stored.row) {
        update(sectionId, c.id, { span: latest })
      }
    }

    commit()
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const outline = variant === 'outline'
  const fill = CARD_FILLS[(c.props.placeholder ?? index) % CARD_FILLS.length]!
  const tall = span.row >= 2

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 420, damping: 38, mass: 0.8 }}
      style={{
        gridColumn: `span ${span.col}`,
        gridRow: `span ${span.row}`,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--dl-radius)',
        background: outline
          ? 'transparent'
          : loud
            ? 'color-mix(in oklab, var(--dl-loud-text) 8%, transparent)'
            : 'var(--dl-surface)',
        border: '1px solid',
        borderColor: loud
          ? 'color-mix(in oklab, var(--dl-loud-text) 16%, transparent)'
          : 'var(--dl-border)',
      }}
    >
      <Reveal index={index} style={{ height: '100%' }}>
        <div {...node} className="flex h-full flex-col">
          {tall && (
            <div style={{ flex: '1 1 45%', minHeight: 90, background: fill }} aria-hidden />
          )}
          <div
            className="flex flex-col"
            style={{ gap: '6px', padding: 'var(--dl-gap)', flex: tall ? '0 0 auto' : '1 1 auto' }}
          >
            <CText c={c} as="h3" size="lg" heading weight={650} color={loud ? 'loud' : 'text'} />
            <CText c={c} field="sub" size="base" color={loud ? 'loud' : 'muted'} />
          </div>
        </div>
      </Reveal>

      {!isStatic && (
        <span
          role="slider"
          tabIndex={0}
          aria-label={`Resize card — ${span.col} of 12 columns, ${span.row} rows`}
          aria-valuenow={span.col}
          aria-valuemin={MIN_COL}
          aria-valuemax={COLS}
          onPointerDown={onResizeStart}
          onKeyDown={(event) => {
            const step =
              event.key === 'ArrowRight'
                ? { col: 1, row: 0 }
                : event.key === 'ArrowLeft'
                  ? { col: -1, row: 0 }
                  : event.key === 'ArrowDown'
                    ? { col: 0, row: 1 }
                    : event.key === 'ArrowUp'
                      ? { col: 0, row: -1 }
                      : null
            if (!step) return
            event.preventDefault()
            update(sectionId, c.id, {
              span: {
                col: clamp(stored.col + step.col, MIN_COL, COLS),
                row: clamp(stored.row + step.row, 1, MAX_ROW),
              },
            })
          }}
          className="dl-resize absolute cursor-nwse-resize"
          style={{
            right: 5,
            bottom: 5,
            width: 18,
            height: 18,
            borderRadius: 5,
            background: 'rgba(124,108,255,.92)',
            boxShadow: '0 2px 6px rgba(0,0,0,.3)',
            touchAction: 'none',
          }}
        />
      )}
    </motion.div>
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
