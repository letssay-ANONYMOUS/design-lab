import { create } from 'zustand'

/** Mirrors `CopyField` in the canvas atoms — which string is being edited. */
export type EditField = 'text' | 'sub' | 'plain'

interface EditingState {
  /** Component id currently in contenteditable mode, or null. */
  editingId: string | null
  /** Which text field of that component: the main copy or the sub-line. */
  editingField: EditField
  hoverId: string | null
  beginEdit: (id: string, field?: EditField) => void
  endEdit: () => void
  setHover: (id: string | null) => void
}

/**
 * Ephemeral UI state, deliberately kept out of the persisted page store so a
 * refresh never restores a half-finished text edit.
 */
export const useEditing = create<EditingState>((set) => ({
  editingId: null,
  editingField: 'text',
  hoverId: null,
  beginEdit: (id, field = 'text') => set({ editingId: id, editingField: field }),
  endEdit: () => set({ editingId: null }),
  setHover: (id) => set({ hoverId: id }),
}))
