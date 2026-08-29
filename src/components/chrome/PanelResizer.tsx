import { PANEL_LIMITS, useLab } from '@/store/useLab'
import { useRef, type PointerEvent as ReactPointerEvent } from 'react'

/**
 * The draggable seam between a side panel and the canvas.
 *
 * Browser zoom scales the panels along with the artwork, which is the opposite
 * of what you want when the page is the thing you are trying to see. Dragging
 * the seam gives the canvas the extra width instead, and the widths persist so
 * a working setup survives a refresh.
 *
 * Dragging a panel below its minimum snaps it shut rather than leaving a
 * unusable sliver; double-clicking restores the default width.
 */
export function PanelResizer({ side }: { side: 'left' | 'right' }) {
  const width = useLab((s) => (side === 'left' ? s.view.leftWidth : s.view.rightWidth))
  const setView = useLab((s) => s.setView)
  const limits = PANEL_LIMITS[side]
  const dragging = useRef(false)

  const apply = (next: number) => {
    /* Below the minimum the panel is not usable, so treat the drag as a close
     * gesture — the toolbar toggle brings it back. */
    const collapsed = next < limits.min - 28
    const value = collapsed ? 0 : Math.min(limits.max, Math.max(limits.min, next))
    if (side === 'left') setView({ leftWidth: value, minimap: value > 0 })
    else setView({ rightWidth: value })
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)
    dragging.current = true

    const startX = event.clientX
    const startWidth = width

    const onMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX
      apply(side === 'left' ? startWidth + delta : startWidth - delta)
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      document.body.style.removeProperty('cursor')
      document.body.style.removeProperty('user-select')
    }

    /* Held on the body so the cursor does not flicker to a text caret when the
     * pointer crosses the canvas mid-drag. */
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize the ${side === 'left' ? 'pacing rail' : 'token panel'}`}
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={limits.max}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onDoubleClick={() => apply(limits.default)}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 32 : 8
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          apply(side === 'left' ? width - step : width + step)
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          apply(side === 'left' ? width + step : width - step)
        }
      }}
      title="Drag to resize · double-click to reset"
      className="group relative z-20 w-1 shrink-0 cursor-ew-resize bg-ui-800 transition-colors hover:bg-brand/70 focus-visible:bg-brand focus-visible:outline-none"
    >
      {/* A wider invisible target than the 4px line, so it is grabbable. */}
      <span className="absolute inset-y-0 -left-1.5 -right-1.5 block" />
      <span className="pointer-events-none absolute top-1/2 left-1/2 h-9 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ui-600 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}
