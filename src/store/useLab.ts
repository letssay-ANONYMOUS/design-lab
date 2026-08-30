import { cloneComponent, cloneSection, newComponent, newSection } from '@/lib/factory'
import { uid } from '@/lib/id'
import { nextVariant } from '@/lib/registry'
import { DEFAULT_TOKENS } from '@/lib/tokens'
import { PRESETS, buildPreset } from '@/presets'
import type {
  Component,
  ComponentProps,
  ComponentType,
  LabView,
  Page,
  Section,
  SectionMeta,
  SectionType,
  Selection,
  Snapshot,
  Tokens,
  Tone,
} from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const HISTORY_LIMIT = 60

const DEFAULT_VIEW: LabView = {
  viewport: 'desktop',
  squint: false,
  grid: false,
  minimap: true,
  trustDensity: 55,
  tone: 'authority',
  choreo: { stagger: 0.07, distance: 26, parallax: 30 },
  previewNonce: 0,
  compare: null,
  leftWidth: 132,
  rightWidth: 268,
  arrange: false,
}

/** Drag bounds for the two side panels. Below the minimum they snap shut. */
export const PANEL_LIMITS = {
  left: { min: 96, max: 280, default: 132 },
  right: { min: 216, max: 460, default: 268 },
} as const

interface LabState {
  page: Page
  presetId: string
  snapshots: Snapshot[]
  view: LabView
  selection: Selection | null
  activeSectionId: string | null
  past: Page[]
  future: Page[]

  // page-level
  loadPreset: (id: string) => void
  renamePage: (name: string) => void
  setTokens: (patch: Partial<Tokens>) => void
  replacePage: (page: Page) => void

  // sections
  addSection: (type: SectionType, index?: number) => void
  removeSection: (id: string) => void
  duplicateSection: (id: string) => void
  reorderSections: (from: number, to: number) => void
  cycleVariant: (id: string, dir?: number) => void
  setVariant: (id: string, variant: string) => void
  setSectionMeta: (id: string, patch: Partial<SectionMeta>) => void
  setSectionMood: (id: string, mood: Section['mood']) => void
  setActiveSection: (id: string | null) => void

  // components
  addComponent: (sectionId: string, type: ComponentType, afterId?: string) => void
  removeComponent: (sectionId: string, componentId: string) => void
  duplicateComponent: (sectionId: string, componentId: string) => void
  updateComponent: (sectionId: string, componentId: string, patch: Partial<ComponentProps>) => void
  reorderComponents: (sectionId: string, from: number, to: number) => void
  /** Drag-and-drop landing. Works within a section and across two. */
  moveComponent: (
    fromSectionId: string,
    componentId: string,
    toSectionId: string,
    toIndex: number,
  ) => void
  select: (selection: Selection | null) => void

  // view
  setView: (patch: Partial<LabView>) => void
  setChoreo: (patch: Partial<LabView['choreo']>) => void
  setTone: (tone: Tone) => void
  playPreview: () => void

  // snapshots
  addSnapshot: (thumb: string, name?: string) => void
  removeSnapshot: (id: string) => void
  renameSnapshot: (id: string, name: string) => void
  restoreSnapshot: (id: string) => void
  setCompare: (pair: [string, string] | null) => void

  // history
  undo: () => void
  redo: () => void
  commit: () => void
}

function findSection(page: Page, id: string): Section | undefined {
  return page.sections.find((s) => s.id === id)
}

function move<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice()
  const [item] = next.splice(from, 1)
  if (item === undefined) return list
  next.splice(to, 0, item)
  return next
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPersistedPage(value: unknown): value is Page {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string') {
    return false
  }
  if (!isRecord(value.tokens) || !Array.isArray(value.sections) || value.sections.length === 0) {
    return false
  }
  return value.sections.every(
    (section) =>
      isRecord(section) &&
      typeof section.id === 'string' &&
      typeof section.type === 'string' &&
      typeof section.variant === 'string' &&
      Array.isArray(section.components),
  )
}

function isPersistedSnapshot(value: unknown): value is Snapshot {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.createdAt === 'number' &&
    typeof value.thumb === 'string' &&
    isPersistedPage(value.page)
  )
}

export const useLab = create<LabState>()(
  persist(
    (set, get) => {
      /**
       * Every page mutation funnels through here so undo/redo is free and
       * nothing can forget to snapshot history.
       */
      const mutate = (fn: (page: Page) => Page) =>
        set((state) => {
          const nextPage = fn(structuredClone(state.page))
          return {
            page: nextPage,
            past: [...state.past, state.page].slice(-HISTORY_LIMIT),
            future: [],
          }
        })

      const mutateSection = (id: string, fn: (section: Section) => void) =>
        mutate((page) => {
          const section = findSection(page, id)
          if (section) fn(section)
          return page
        })

      const mutateComponent = (
        sectionId: string,
        componentId: string,
        fn: (component: Component, section: Section) => void,
      ) =>
        mutateSection(sectionId, (section) => {
          const component = section.components.find((c) => c.id === componentId)
          if (component) fn(component, section)
        })

      return {
        page: buildPreset(PRESETS[0]!.id),
        presetId: PRESETS[0]!.id,
        snapshots: [],
        view: DEFAULT_VIEW,
        selection: null,
        activeSectionId: null,
        past: [],
        future: [],

        loadPreset: (id) => {
          const page = buildPreset(id)
          set((state) => ({
            page,
            presetId: id,
            selection: null,
            activeSectionId: null,
            past: [...state.past, state.page].slice(-HISTORY_LIMIT),
            future: [],
          }))
        },

        renamePage: (name) => mutate((page) => ({ ...page, name })),

        setTokens: (patch) => mutate((page) => ({ ...page, tokens: { ...page.tokens, ...patch } })),

        replacePage: (page) =>
          set((state) => ({
            page: structuredClone(page),
            selection: null,
            activeSectionId: null,
            past: [...state.past, state.page].slice(-HISTORY_LIMIT),
            future: [],
          })),

        addSection: (type, index) =>
          mutate((page) => {
            const section = newSection(type)
            const at = index ?? page.sections.length
            page.sections.splice(at, 0, section)
            return page
          }),

        removeSection: (id) =>
          mutate((page) => ({
            ...page,
            sections: page.sections.filter((s) => s.id !== id),
          })),

        duplicateSection: (id) =>
          mutate((page) => {
            const index = page.sections.findIndex((s) => s.id === id)
            if (index === -1) return page
            page.sections.splice(index + 1, 0, cloneSection(page.sections[index]!))
            return page
          }),

        reorderSections: (from, to) =>
          mutate((page) => ({ ...page, sections: move(page.sections, from, to) })),

        cycleVariant: (id, dir = 1) =>
          mutateSection(id, (section) => {
            section.variant = nextVariant(section.type, section.variant, dir)
          }),

        setVariant: (id, variant) =>
          mutateSection(id, (section) => {
            section.variant = variant
          }),

        setSectionMeta: (id, patch) =>
          mutateSection(id, (section) => {
            section.meta = { ...section.meta, ...patch }
          }),

        setSectionMood: (id, mood) =>
          mutateSection(id, (section) => {
            section.mood = mood
          }),

        setActiveSection: (id) => set({ activeSectionId: id }),

        addComponent: (sectionId, type, afterId) =>
          mutateSection(sectionId, (section) => {
            const component = newComponent(type)
            const index = afterId ? section.components.findIndex((c) => c.id === afterId) : -1
            if (index === -1) section.components.push(component)
            else section.components.splice(index + 1, 0, component)
          }),

        removeComponent: (sectionId, componentId) => {
          mutateSection(sectionId, (section) => {
            section.components = section.components.filter((c) => c.id !== componentId)
          })
          if (get().selection?.componentId === componentId) set({ selection: null })
        },

        duplicateComponent: (sectionId, componentId) =>
          mutateSection(sectionId, (section) => {
            const index = section.components.findIndex((c) => c.id === componentId)
            if (index === -1) return
            section.components.splice(index + 1, 0, cloneComponent(section.components[index]!))
          }),

        updateComponent: (sectionId, componentId, patch) =>
          mutateComponent(sectionId, componentId, (component) => {
            component.props = { ...component.props, ...patch }
          }),

        reorderComponents: (sectionId, from, to) =>
          mutateSection(sectionId, (section) => {
            section.components = move(section.components, from, to)
          }),

        moveComponent: (fromSectionId, componentId, toSectionId, toIndex) =>
          mutate((page) => {
            const from = findSection(page, fromSectionId)
            const to = findSection(page, toSectionId)
            if (!from || !to) return page

            const at = from.components.findIndex((c) => c.id === componentId)
            if (at === -1) return page
            const [item] = from.components.splice(at, 1)
            if (!item) return page

            /* Removing the item first shifts every later index down by one, so
             * a same-section move past the original position has to compensate
             * or the element lands one slot short of where it was dropped. */
            const adjusted =
              fromSectionId === toSectionId && toIndex > at ? toIndex - 1 : toIndex
            to.components.splice(Math.max(0, Math.min(to.components.length, adjusted)), 0, item)
            return page
          }),

        select: (selection) => set({ selection }),

        setView: (patch) => set((state) => ({ view: { ...state.view, ...patch } })),

        setChoreo: (patch) =>
          set((state) => ({ view: { ...state.view, choreo: { ...state.view.choreo, ...patch } } })),

        setTone: (tone) => set((state) => ({ view: { ...state.view, tone } })),

        playPreview: () =>
          set((state) => ({ view: { ...state.view, previewNonce: state.view.previewNonce + 1 } })),

        addSnapshot: (thumb, name) =>
          set((state) => ({
            snapshots: [
              {
                id: uid('snap'),
                name: name ?? `${state.page.name} · ${state.snapshots.length + 1}`,
                createdAt: Date.now(),
                thumb,
                page: structuredClone(state.page),
              },
              ...state.snapshots,
            ].slice(0, 24),
          })),

        removeSnapshot: (id) =>
          set((state) => ({
            snapshots: state.snapshots.filter((s) => s.id !== id),
            view: {
              ...state.view,
              compare: state.view.compare?.includes(id) ? null : state.view.compare,
            },
          })),

        renameSnapshot: (id, name) =>
          set((state) => ({
            snapshots: state.snapshots.map((s) => (s.id === id ? { ...s, name } : s)),
          })),

        restoreSnapshot: (id) => {
          const snapshot = get().snapshots.find((s) => s.id === id)
          if (snapshot) get().replacePage(snapshot.page)
        },

        setCompare: (pair) => set((state) => ({ view: { ...state.view, compare: pair } })),

        undo: () =>
          set((state) => {
            const previous = state.past.at(-1)
            if (!previous) return state
            return {
              page: previous,
              past: state.past.slice(0, -1),
              future: [state.page, ...state.future].slice(0, HISTORY_LIMIT),
              selection: null,
            }
          }),

        redo: () =>
          set((state) => {
            const next = state.future[0]
            if (!next) return state
            return {
              page: next,
              past: [...state.past, state.page].slice(-HISTORY_LIMIT),
              future: state.future.slice(1),
              selection: null,
            }
          }),

        /** Marks a history point without changing anything (drag start, etc.). */
        commit: () =>
          set((state) => ({
            past: [...state.past, state.page].slice(-HISTORY_LIMIT),
            future: [],
          })),
      }
    },
    {
      name: 'design-lab:v1',
      version: 1,
      partialize: (state) => ({
        page: state.page,
        presetId: state.presetId,
        snapshots: state.snapshots,
        view: state.view,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<LabState> | undefined
        if (!saved) return current
        const savedView: Record<string, unknown> = isRecord(saved.view) ? saved.view : {}
        const savedChoreo: Record<string, unknown> = isRecord(savedView.choreo)
          ? savedView.choreo
          : {}
        const page = isPersistedPage(saved.page)
          ? { ...saved.page, tokens: { ...DEFAULT_TOKENS, ...saved.page.tokens } }
          : current.page
        const snapshots = Array.isArray(saved.snapshots)
          ? saved.snapshots.filter(isPersistedSnapshot)
          : current.snapshots
        const presetId =
          typeof saved.presetId === 'string' && PRESETS.some((preset) => preset.id === saved.presetId)
            ? saved.presetId
            : current.presetId
        return {
          ...current,
          // View gained fields across versions; fill the gaps rather than
          // shipping `undefined` into a slider.
          view: {
            ...DEFAULT_VIEW,
            ...savedView,
            choreo: { ...DEFAULT_VIEW.choreo, ...savedChoreo },
            previewNonce: 0,
            compare: null,
          },
          page,
          presetId,
          snapshots,
          past: [],
          future: [],
          selection: null,
          activeSectionId: null,
        }
      },
    },
  ),
)

export { DEFAULT_VIEW }
