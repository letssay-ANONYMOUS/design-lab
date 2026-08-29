import { useArrange, type DropTarget } from '@/store/useArrange'
import { useLab } from '@/store/useLab'
import type { PointerEvent as ReactPointerEvent } from 'react'

/**
 * Pointer-driven drag and drop for canvas components.
 *
 * @dnd-kit runs the section list, but it cannot run this one: sortable items
 * need a wrapper element, and the whole selection system exists precisely so
 * components are never wrapped — a wrapper div would change the flex and grid
 * geometry of every section variant the moment you enabled the mode.
 *
 * So the drop target is found by hit-testing the DOM instead. Every editable
 * node already carries `data-dl-node` and `data-dl-owner`, which is enough to
 * work out what is under the cursor and which section owns it.
 */

const DRAG_THRESHOLD = 5

/** Walks up from a hit-tested element to the nearest editable node. */
function nodeAt(x: number, y: number): HTMLElement | null {
  for (const el of document.elementsFromPoint(x, y)) {
    const node = (el as HTMLElement).closest?.('[data-dl-node]')
    if (node instanceof HTMLElement && node.dataset.dlOwner) return node
  }
  return null
}

/**
 * Decides which side of the hovered element the drop line goes.
 *
 * The axis is chosen from whichever offset from centre is larger once
 * normalised by the element's own size, so a row of buttons gets a vertical
 * line between them and a stack of paragraphs gets a horizontal one, with no
 * per-section configuration.
 */
function resolveTarget(node: HTMLElement, x: number, y: number): DropTarget | null {
  const sectionId = node.dataset.dlOwner
  const componentId = node.dataset.dlNode
  if (!sectionId || !componentId) return null

  const section = useLab.getState().page.sections.find((s) => s.id === sectionId)
  if (!section) return null
  const index = section.components.findIndex((c) => c.id === componentId)
  if (index === -1) return null

  const box = node.getBoundingClientRect()
  const dx = (x - (box.left + box.width / 2)) / Math.max(1, box.width)
  const dy = (y - (box.top + box.height / 2)) / Math.max(1, box.height)
  const axis: 'x' | 'y' = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
  const after = axis === 'x' ? dx > 0 : dy > 0

  const pad = 5
  return {
    sectionId,
    index: after ? index + 1 : index,
    axis,
    rect:
      axis === 'x'
        ? {
            top: box.top - pad,
            left: (after ? box.right : box.left) - 1,
            width: 2,
            height: box.height + pad * 2,
          }
        : {
            top: (after ? box.bottom : box.top) - 1,
            left: box.left - pad,
            width: box.width + pad * 2,
            height: 2,
          },
  }
}

/**
 * Starts a drag from a pointerdown on a component.
 *
 * Nothing happens until the pointer has travelled past a small threshold, so a
 * plain click still selects and a double-click still opens the inline editor.
 */
export function beginArrangeDrag(
  event: ReactPointerEvent,
  sectionId: string,
  componentId: string,
): void {
  if (event.button !== 0) return

  const origin = { x: event.clientX, y: event.clientY }
  const label =
    useLab
      .getState()
      .page.sections.find((s) => s.id === sectionId)
      ?.components.find((c) => c.id === componentId)?.type ?? 'element'

  let started = false

  const onMove = (moveEvent: PointerEvent) => {
    const travelled = Math.hypot(moveEvent.clientX - origin.x, moveEvent.clientY - origin.y)
    if (!started) {
      if (travelled < DRAG_THRESHOLD) return
      started = true
      useArrange.getState().start({ sectionId, componentId, label }, origin)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      /* Set straight on the DOM rather than through React: every node would
       * otherwise have to subscribe to a store that updates on each pointer
       * move, which is a lot of re-renders to fade out one element. */
      document
        .querySelector(`[data-dl-node="${componentId}"]`)
        ?.setAttribute('data-dl-lifted', 'true')
      document.querySelector('.dl-editing')?.classList.add('dl-dragging')
    }

    const point = { x: moveEvent.clientX, y: moveEvent.clientY }
    const node = nodeAt(point.x, point.y)
    /* Ignore the element being dragged: a line on either side of it means the
     * same no-op drop and just looks broken. */
    const target =
      node && node.dataset.dlNode !== componentId ? resolveTarget(node, point.x, point.y) : null
    useArrange.getState().move(point, target)
  }

  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    document.body.style.removeProperty('cursor')
    document.body.style.removeProperty('user-select')
    document.querySelector(`[data-dl-node="${componentId}"]`)?.removeAttribute('data-dl-lifted')
    document.querySelector('.dl-editing')?.classList.remove('dl-dragging')

    if (!started) return
    const { target } = useArrange.getState()
    useArrange.getState().end()
    if (target) {
      useLab.getState().moveComponent(sectionId, componentId, target.sectionId, target.index)
      useLab.getState().select({ sectionId: target.sectionId, componentId })
    }
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
}
