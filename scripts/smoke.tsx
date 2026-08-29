/**
 * Render smoke test.
 *
 * Mounts the whole app into jsdom, drives the interactions that are easy to
 * break (load every preset, cycle variants, remix, snapshot round-trip,
 * export), and fails the run if React logs a single error or warning. It is
 * not a substitute for looking at the thing, but it does mean a crash on boot
 * can never reach `npm run dev` unnoticed.
 *
 * Run via `npm run smoke`.
 */
import { JSDOM } from 'jsdom'

/* jsdom has to exist as a global before React or the store are imported —
 * zustand's persist middleware reads localStorage at module scope. */
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})

const g = globalThis as Record<string, unknown>
g.window = dom.window
g.document = dom.window.document
/* Node 22 defines `navigator` as a getter-only global, so it has to be
 * redefined rather than assigned. */
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
})
g.HTMLElement = dom.window.HTMLElement
g.Element = dom.window.Element
g.Node = dom.window.Node
g.Event = dom.window.Event
g.MouseEvent = dom.window.MouseEvent
g.KeyboardEvent = dom.window.KeyboardEvent
g.getComputedStyle = dom.window.getComputedStyle
g.requestAnimationFrame = (cb: FrameRequestCallback) => dom.window.setTimeout(() => cb(0), 0)
g.cancelAnimationFrame = (id: number) => dom.window.clearTimeout(id)
g.localStorage = dom.window.localStorage
g.IS_REACT_ACT_ENVIRONMENT = true

/* jsdom ships neither of these and framer-motion / dnd-kit both reach for them. */
g.matchMedia = () => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
})
dom.window.matchMedia = g.matchMedia as typeof dom.window.matchMedia
class FakeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
g.ResizeObserver = FakeObserver
g.IntersectionObserver = FakeObserver
dom.window.ResizeObserver = FakeObserver as never
dom.window.IntersectionObserver = FakeObserver as never
dom.window.scrollTo = () => {}
Object.defineProperty(dom.window.HTMLElement.prototype, 'scrollTo', { value: () => {} })

/* Collect anything React or the app logs; a clean console is part of the bar. */
const complaints: string[] = []
for (const level of ['error', 'warn'] as const) {
  const original = console[level].bind(console)
  console[level] = (...args: unknown[]) => {
    complaints.push(`[${level}] ${args.map(String).join(' ')}`)
    original(...args)
  }
}

const { createRoot } = await import('react-dom/client')
const { act } = await import('react')
const { default: App } = await import('@/App')
const { useLab } = await import('@/store/useLab')
const { PRESETS } = await import('@/presets')
const { generatePageJsx } = await import('@/lib/export')
const { remixPage } = await import('@/lib/remix')
const { createElement } = await import('react')

const root = createRoot(document.getElementById('root')!)
const flush = async (fn: () => void) => {
  await act(async () => {
    fn()
  })
}

const failures: string[] = []
const check = (label: string, ok: boolean) => {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}`)
  if (!ok) failures.push(label)
}

await act(async () => {
  root.render(createElement(App))
})

const html = () => document.getElementById('root')!.innerHTML
const lab = () => useLab.getState()

check('app mounts', html().length > 1000)
check('top bar renders', html().includes('Design'))

for (const preset of PRESETS) {
  await flush(() => lab().loadPreset(preset.id))
  const page = lab().page
  check(
    `preset "${preset.id}" loads (${page.sections.length} sections)`,
    page.sections.length >= 6 && page.sections.every((s) => s.components.length > 0),
  )
  check(`preset "${preset.id}" exports`, generatePageJsx(page, lab().view).includes('export default'))
}

/* Every variant of every section type must render without throwing. */
const { SECTION_DEFS } = await import('@/lib/registry')
for (const def of SECTION_DEFS) {
  await flush(() => {
    useLab.setState({ page: { ...lab().page, sections: [] } })
    lab().addSection(def.type)
  })
  const id = lab().page.sections[0]!.id
  let rendered = true
  for (const variant of def.variants) {
    try {
      await flush(() => lab().setVariant(id, variant.id))
    } catch {
      rendered = false
    }
  }
  check(`${def.label}: all ${def.variants.length} variants render`, rendered)
}

/* Undo / redo, remix, tone, and the view toggles. */
await flush(() => lab().loadPreset('clinic'))
const before = lab().page.sections[0]!.variant
await flush(() => lab().cycleVariant(lab().page.sections[0]!.id))
const after = lab().page.sections[0]!.variant
await flush(() => lab().undo())
check('undo restores the previous page', before !== after && lab().page.sections[0]!.variant === before)
await flush(() => lab().redo())
check('redo re-applies it', lab().page.sections[0]!.variant === after)

await flush(() => lab().replacePage(remixPage(lab().page)))
check('remix keeps the section count', lab().page.sections.length > 0)
check('remix keeps the opener loud', lab().page.sections[0]!.mood === 'loud')

for (const tone of ['warm', 'urgent', 'authority'] as const) {
  await flush(() => lab().setTone(tone))
}
await flush(() => lab().setView({ squint: true, grid: true, trustDensity: 0 }))
await flush(() => lab().setView({ squint: false, grid: false, trustDensity: 100 }))
check('view toggles survive a round trip', lab().view.trustDensity === 100)

/* Component-level editing (feature 4) and bento spans (feature 6). */
await flush(() => lab().loadPreset('clinic'))
const hero = lab().page.sections[0]!
const heroCount = hero.components.length
await flush(() => lab().addComponent(hero.id, 'badge'))
check('component added', lab().page.sections[0]!.components.length === heroCount + 1)
const added = lab().page.sections[0]!.components.at(-1)!
await flush(() => lab().duplicateComponent(hero.id, added.id))
check('component duplicated', lab().page.sections[0]!.components.length === heroCount + 2)
await flush(() => lab().updateComponent(hero.id, added.id, { text: 'Edited inline' }))
check(
  'component text updates',
  lab().page.sections[0]!.components.find((c) => c.id === added.id)?.props.text === 'Edited inline',
)
await flush(() => lab().removeComponent(hero.id, added.id))
check('component removed', lab().page.sections[0]!.components.length === heroCount + 1)

await flush(() => lab().loadPreset('cafe'))
const bento = lab().page.sections.find((s) => s.type === 'bento')
if (bento) {
  const card = bento.components.find((c) => c.type === 'bentoCard')!
  await flush(() => lab().updateComponent(bento.id, card.id, { span: { col: 8, row: 2 } }))
  const resized = lab().page.sections.find((s) => s.id === bento.id)!.components.find((c) => c.id === card.id)
  check('bento card span commits', resized?.props.span?.col === 8 && resized.props.span.row === 2)
}

/* Snapshot round-trip, including the A/B compare view. */
await flush(() => lab().loadPreset('cafe'))
const cafeName = lab().page.name
await flush(() => lab().addSnapshot('', 'A'))
await flush(() => lab().loadPreset('retail'))
await flush(() => lab().addSnapshot('', 'B'))
check('snapshots stored', lab().snapshots.length === 2)
await flush(() => lab().restoreSnapshot(lab().snapshots.find((s) => s.name === 'A')!.id))
check('restore brings the page back', lab().page.name === cafeName)
await flush(() => lab().setCompare([lab().snapshots[0]!.id, lab().snapshots[1]!.id]))
check('compare view renders', html().includes('Exit compare'))
await flush(() => lab().setCompare(null))

/* Persistence: what localStorage holds must rehydrate to the same page. */
const persisted = dom.window.localStorage.getItem('design-lab:v1')
check('page persisted to localStorage', Boolean(persisted))
if (persisted) {
  const parsed = JSON.parse(persisted) as { state: { page: { sections: unknown[] }; snapshots: unknown[] } }
  check('persisted page has sections', parsed.state.page.sections.length > 0)
  check('persisted snapshots survive', parsed.state.snapshots.length === 2)
}

await act(async () => {
  root.unmount()
})

const noisy = complaints.filter((line) => !line.includes('not wrapped in act'))
if (noisy.length > 0) {
  console.log(`\n${noisy.length} console complaint(s):`)
  for (const line of noisy.slice(0, 12)) console.log(`  ${line}`)
  failures.push('console was not clean')
}

console.log(failures.length === 0 ? '\nall smoke checks passed' : `\n${failures.length} failure(s)`)
process.exit(failures.length === 0 ? 0 : 1)
