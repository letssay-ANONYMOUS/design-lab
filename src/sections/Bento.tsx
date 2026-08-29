import { CText } from '@/components/canvas/atoms'
import { Reveal } from '@/components/canvas/Reveal'
import { useIsStatic, useSectionId } from '@/components/canvas/SectionContext'
import { useNode } from '@/components/canvas/useNode'
import { pickImage, useImageUrl } from '@/lib/images'
import { useLab } from '@/store/useLab'
import type { Component, Section } from '@/types'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { CARD_FILLS, CONTAINER, byType, sectionPad } from './parts'
import { SectionHeader } from './SectionHeader'

const COLS = 12
const MIN_COL = 3
const MAX_ROW = 3
/** Below this the image band snaps shut — a sliver of photo reads as a bug. */
const MIN_SHARE = 8
/** Leaves room for at least the card's title under any image. */
const MAX_SHARE = 82
/** Padding plus roughly a title and one line of body — the copy's floor, in px. */
const TEXT_FLOOR = 104

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
  const url = useImageUrl(c.props.imageId)

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

  /* Live image share while dragging the divider, same reason as the span. */
  const [shareDraft, setShareDraft] = useState<number | null>(null)
  const tall = span.row >= 2
  const storedShare = c.props.mediaShare ?? (tall ? 45 : 0)
  const share = shareDraft ?? storedShare

  const onMediaResizeStart = (event: ReactPointerEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const card = event.currentTarget.parentElement
    if (!card) return

    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)
    const box = card.getBoundingClientRect()
    let latest = storedShare

    const onMove = (moveEvent: PointerEvent) => {
      const raw = ((moveEvent.clientY - box.top) / box.height) * 100
      /* Anything under the snap point collapses to nothing, so the same drag
       * that grows the image can also remove it. */
      const next = raw < MIN_SHARE ? 0 : Math.round(clamp(raw, 0, MAX_SHARE))
      if (next !== latest) {
        latest = next
        setShareDraft(next)
      }
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      setShareDraft(null)
      if (latest !== storedShare) update(sectionId, c.id, { mediaShare: latest })
    }

    commit()
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const uploadImage = () => {
    void pickImage().then((imageId) => {
      if (imageId) update(sectionId, c.id, { imageId, mediaShare: share || 45 })
    })
  }

  const outline = variant === 'outline'
  const fill = CARD_FILLS[(c.props.placeholder ?? index) % CARD_FILLS.length]!

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 420, damping: 38, mass: 0.8 }}
      style={{
        gridColumn: `span ${span.col}`,
        gridRow: `span ${span.row}`,
        position: 'relative',
        overflow: 'hidden',
        /* The image takes a true percentage of the card, so a large share on a
         * short card would crush the copy into nothing. Growing the card
         * instead keeps the ratio honest and lets the row stretch — which is
         * the whole point of dragging it: seeing what the balance costs. */
        minHeight: share > 0 ? Math.round(TEXT_FLOOR / (1 - share / 100)) : undefined,
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
          {share > 0 && (
            <div
              onClick={isStatic ? undefined : () => !c.props.imageId && uploadImage()}
              onDoubleClick={
                isStatic
                  ? undefined
                  : (event) => {
                      event.stopPropagation()
                      uploadImage()
                    }
              }
              className={
                !isStatic && !c.props.imageId ? 'relative cursor-pointer' : 'relative'
              }
              style={{
                flex: `0 0 ${share}%`,
                minHeight: 0,
                background: url ? undefined : fill,
                backgroundImage: url ? `url(${url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          <div
            className="flex flex-col"
            style={{
              gap: '6px',
              padding: 'var(--dl-gap)',
              flex: '1 1 auto',
              minHeight: 0,
            }}
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
          aria-label={
            share > 0
              ? `Image share — ${share}% of the card. Drag up or down.`
              : 'No image on this card. Drag down to give it one.'
          }
          aria-valuenow={share}
          aria-valuemin={0}
          aria-valuemax={MAX_SHARE}
          onPointerDown={onMediaResizeStart}
          onKeyDown={(event) => {
            const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
            if (step === 0) return
            event.preventDefault()
            const next = clamp(storedShare + step * (event.shiftKey ? 10 : 2), 0, MAX_SHARE)
            update(sectionId, c.id, { mediaShare: next < MIN_SHARE ? 0 : next })
          }}
          className="dl-resize absolute cursor-ns-resize"
          style={{
            left: 0,
            right: 0,
            /* Sits on the seam between image and text. At zero it rides the top
             * edge of the card, which is the only affordance saying an image
             * can be pulled out of a card that does not have one yet. */
            top: `${share}%`,
            marginTop: share === 0 ? 0 : -5,
            height: 10,
            touchAction: 'none',
          }}
        >
          <span
            className="pointer-events-none absolute top-1/2 left-1/2 block"
            style={{
              width: 42,
              height: 5,
              marginTop: share === 0 ? -1 : -2.5,
              marginLeft: -21,
              borderRadius: 999,
              background: 'rgba(124,108,255,.92)',
              boxShadow: '0 2px 6px rgba(0,0,0,.3)',
            }}
          />
        </span>
      )}

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
