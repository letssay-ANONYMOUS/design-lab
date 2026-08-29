import { useIsStatic, useSectionId } from '@/components/canvas/SectionContext'
import { beginArrangeDrag } from '@/lib/arrange'
import { useEditing, type EditField } from '@/store/useEditing'
import { useLab } from '@/store/useLab'
import type { MouseEvent, PointerEvent } from 'react'

/**
 * Wires a rendered element into the selection system without wrapping it.
 *
 * Wrapping every atom in a `<div>` would quietly break the flex and grid
 * layouts the section variants depend on, so instead we hang data attributes
 * and handlers straight onto the element the layout already renders. The
 * selection ring is pure CSS; the floating toolbar measures the element by its
 * `data-dl-node` attribute (see SelectionLayer).
 */
export function useNode(componentId: string) {
  const sectionId = useSectionId()
  const isStatic = useIsStatic()
  const select = useLab((s) => s.select)
  const selected = useLab(
    (s) => s.selection?.componentId === componentId && s.selection.sectionId === sectionId,
  )
  const arrange = useLab((s) => s.view.arrange)
  const setHover = useEditing((s) => s.setHover)

  if (isStatic) return { 'data-dl-node': componentId } as const

  return {
    'data-dl-node': componentId,
    'data-dl-selected': selected ? 'true' : undefined,
    /* Read by the CSS in arrange mode for the grab cursor and lifted look, and
     * by the drop-target search to know which section a node belongs to. */
    'data-dl-owner': sectionId,
    onClick: (event: MouseEvent) => {
      event.stopPropagation()
      select({ sectionId, componentId })
    },
    onPointerDown: arrange
      ? (event: PointerEvent) => {
          beginArrangeDrag(event, sectionId, componentId)
        }
      : undefined,
    onMouseEnter: () => setHover(componentId),
    onMouseLeave: () => setHover(null),
  } as const
}

/** Adds double-click-to-edit on top of `useNode`, for text-bearing atoms. */
export function useEditableNode(componentId: string, field: EditField = 'text') {
  const node = useNode(componentId)
  const isStatic = useIsStatic()
  const beginEdit = useEditing((s) => s.beginEdit)
  const editing = useEditing((s) => s.editingId === componentId && s.editingField === field)

  if (isStatic) return { node, editing: false }

  return {
    node: {
      ...node,
      onDoubleClick: (event: MouseEvent) => {
        event.stopPropagation()
        beginEdit(componentId, field)
      },
    },
    editing,
  }
}
