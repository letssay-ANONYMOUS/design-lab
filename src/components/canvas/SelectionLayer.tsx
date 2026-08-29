import { ToolButton } from '@/components/ui/primitives'
import { pickImage } from '@/lib/images'
import { useLab } from '@/store/useLab'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Image as ImageIcon,
  Languages,
  Palette,
  Ratio,
  Star,
  Trash2,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const RATIOS = ['4/5', '1/1', '4/3', '16/9', '3/4']
const EMPHASIS = ['primary', 'secondary', 'ghost'] as const

interface Rect {
  top: number
  left: number
  width: number
}

/**
 * The floating mini-toolbar for the selected component.
 *
 * It measures the live DOM node rather than being rendered inside it — putting
 * a toolbar in the flow would reflow the artwork the moment you selected
 * something, which makes judging a layout impossible.
 */
export function SelectionLayer({ scrollRef }: { scrollRef: React.RefObject<HTMLElement | null> }) {
  const selection = useLab((s) => s.selection)
  const page = useLab((s) => s.page)
  const select = useLab((s) => s.select)
  const tone = useLab((s) => s.view.tone)
  const removeComponent = useLab((s) => s.removeComponent)
  const duplicateComponent = useLab((s) => s.duplicateComponent)
  const updateComponent = useLab((s) => s.updateComponent)
  const reorderComponents = useLab((s) => s.reorderComponents)

  const [rect, setRect] = useState<Rect | null>(null)

  const section = page.sections.find((s) => s.id === selection?.sectionId)
  const index = section?.components.findIndex((c) => c.id === selection?.componentId) ?? -1
  const component = index >= 0 ? section?.components[index] : undefined

  const measure = useCallback(() => {
    if (!selection) {
      setRect(null)
      return
    }
    const el = document.querySelector<HTMLElement>(`[data-dl-node="${selection.componentId}"]`)
    if (!el) {
      setRect(null)
      return
    }
    const box = el.getBoundingClientRect()
    setRect({ top: box.top, left: box.left, width: box.width })
  }, [selection])

  useEffect(() => {
    /* Measuring a laid-out node is the one thing that genuinely cannot be
     * derived during render, so the lint rule does not apply here. */
    // oxlint-disable-next-line react/set-state-in-effect
    measure()
    if (!selection) return

    /* rAF-throttled so scrolling stays at 60fps while the toolbar tracks. */
    let frame = 0
    const onChange = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    const scroller = scrollRef.current
    scroller?.addEventListener('scroll', onChange, { passive: true })
    window.addEventListener('resize', onChange)
    const observer = new ResizeObserver(onChange)
    if (scroller) observer.observe(scroller)

    return () => {
      cancelAnimationFrame(frame)
      scroller?.removeEventListener('scroll', onChange)
      window.removeEventListener('resize', onChange)
      observer.disconnect()
    }
  }, [selection, measure, scrollRef, page])

  if (!selection || !component || !section || !rect) return null

  const props = component.props
  const hasTones = Boolean(props.tones)

  /* Copies the voice you are looking at into all three, for when an inline
   * edit should apply everywhere rather than just the current tone. */
  const syncVoices = () => {
    const current = props.tones?.[tone]
    if (!current) return
    updateComponent(section.id, component.id, {
      tones: { authority: current, warm: current, urgent: current },
    })
  }

  const cycleEmphasis = () => {
    const at = EMPHASIS.indexOf((props.emphasis ?? 'primary') as (typeof EMPHASIS)[number])
    updateComponent(section.id, component.id, {
      emphasis: EMPHASIS[(at + 1) % EMPHASIS.length],
    })
  }

  const cycleRatio = () => {
    const at = RATIOS.indexOf(props.ratio ?? '4/3')
    updateComponent(section.id, component.id, { ratio: RATIOS[(at + 1) % RATIOS.length] })
  }

  const cycleRating = () => {
    const next = (props.rating ?? 5) - 0.5
    updateComponent(section.id, component.id, { rating: next < 3 ? 5 : next })
  }

  const replaceImage = () => {
    void pickImage().then((imageId) => {
      if (imageId) updateComponent(section.id, component.id, { imageId })
    })
  }

  const cyclePlaceholder = () => {
    updateComponent(section.id, component.id, {
      placeholder: ((props.placeholder ?? 0) + 1) % 8,
      imageId: undefined,
    })
  }

  const top = Math.max(52, rect.top - 42)

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={component.id}
        initial={{ opacity: 0, y: 4, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 2, scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto fixed z-[120] flex items-center gap-0.5 rounded-xl border border-ui-700 bg-ui-900/95 p-1 shadow-2xl backdrop-blur"
        style={{ top, left: rect.left }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="px-1.5 text-[10px] font-semibold tracking-wide text-ui-500 uppercase">
          {component.type}
        </span>
        <span className="mx-0.5 h-4 w-px bg-ui-750" />

        <ToolButton
          size="sm"
          disabled={index <= 0}
          onClick={() => reorderComponents(section.id, index, index - 1)}
          title="Move up"
          icon={<ArrowUp size={13} />}
        />
        <ToolButton
          size="sm"
          disabled={index >= section.components.length - 1}
          onClick={() => reorderComponents(section.id, index, index + 1)}
          title="Move down"
          icon={<ArrowDown size={13} />}
        />

        {component.type === 'button' && (
          <ToolButton
            size="sm"
            onClick={cycleEmphasis}
            title={`Style: ${props.emphasis ?? 'primary'}`}
            icon={<Palette size={13} />}
          >
            {props.emphasis ?? 'primary'}
          </ToolButton>
        )}

        {component.type === 'imageSlot' && (
          <>
            <ToolButton size="sm" onClick={replaceImage} title="Upload image" icon={<ImageIcon size={13} />} />
            <ToolButton
              size="sm"
              onClick={cycleRatio}
              title={`Aspect ratio: ${props.ratio ?? '4/3'}`}
              icon={<Ratio size={13} />}
            >
              {props.ratio ?? '4/3'}
            </ToolButton>
            <ToolButton size="sm" onClick={cyclePlaceholder} title="Cycle placeholder fill" icon={<Palette size={13} />} />
          </>
        )}

        {component.type === 'starRating' && (
          <ToolButton size="sm" onClick={cycleRating} title="Rating" icon={<Star size={13} />}>
            {props.rating ?? 5}
          </ToolButton>
        )}

        {hasTones && (
          <ToolButton
            size="sm"
            onClick={syncVoices}
            title="Copy this voice into all three tones"
            icon={<Languages size={13} />}
          />
        )}

        <span className="mx-0.5 h-4 w-px bg-ui-750" />

        <ToolButton
          size="sm"
          onClick={() => duplicateComponent(section.id, component.id)}
          title="Duplicate"
          icon={<Copy size={13} />}
        />
        <ToolButton
          size="sm"
          variant="danger"
          onClick={() => {
            removeComponent(section.id, component.id)
            select(null)
          }}
          title="Delete"
          icon={<Trash2 size={13} />}
        />
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
