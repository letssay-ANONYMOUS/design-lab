import { create } from 'zustand'

/**
 * Ephemeral drag state for arrange mode.
 *
 * Deliberately outside `useLab`: none of this belongs in a snapshot, in the
 * undo stack, or in localStorage. Only the final drop touches the page.
 */

export interface DropTarget {
  sectionId: string
  /** Index within that section's component list. */
  index: number
  /** Screen-space line to draw, in px. */
  rect: { top: number; left: number; width: number; height: number }
  /** Which way the line runs. */
  axis: 'x' | 'y'
}

interface ArrangeState {
  /** The component being dragged, or null. */
  dragging: { sectionId: string; componentId: string; label: string } | null
  /** Where it would land if released now. */
  target: DropTarget | null
  /** Pointer position, for the ghost. */
  pointer: { x: number; y: number }
  start: (dragging: NonNullable<ArrangeState['dragging']>, pointer: { x: number; y: number }) => void
  move: (pointer: { x: number; y: number }, target: DropTarget | null) => void
  end: () => void
}

export const useArrange = create<ArrangeState>((set) => ({
  dragging: null,
  target: null,
  pointer: { x: 0, y: 0 },
  start: (dragging, pointer) => set({ dragging, pointer, target: null }),
  move: (pointer, target) => set({ pointer, target }),
  end: () => set({ dragging: null, target: null }),
}))
