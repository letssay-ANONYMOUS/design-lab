import { PRESETS, type PresetDef } from '@/presets'
import { SCORE_LABELS, type TemplateScores } from '@/presets/strategy'
import { useLab } from '@/store/useLab'
import {
  ArrowRight,
  Check,
  MagnifyingGlass,
  Scales,
  X,
} from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const CATEGORIES = ['All', 'Signature', ...new Set(PRESETS.map((preset) => preset.strategy.category))]
type DetailTab = 'rationale' | 'story' | 'compare'

export function TemplateLibrary({ open, onClose }: { open: boolean; onClose: () => void }) {
  const presetId = useLab((state) => state.presetId)
  const pageName = useLab((state) => state.page.name)
  const loadPreset = useLab((state) => state.loadPreset)
  const renamePage = useLab((state) => state.renamePage)
  const [selectedId, setSelectedId] = useState(presetId)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<DetailTab>('rationale')
  const [compareIds, setCompareIds] = useState<string[]>([])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return PRESETS.filter((preset) => {
      const inCategory =
        category === 'All' ||
        (category === 'Signature'
          ? preset.strategy.tier === 'Signature'
          : preset.strategy.category === category)
      const haystack = `${preset.name} ${preset.vertical} ${preset.strategy.outcome} ${preset.strategy.bestFor}`.toLowerCase()
      return inCategory && (!needle || haystack.includes(needle))
    })
  }, [category, query])

  const selected = PRESETS.find((preset) => preset.id === selectedId) ?? PRESETS[0]!
  const compared = compareIds
    .map((id) => PRESETS.find((preset) => preset.id === id))
    .filter((preset): preset is PresetDef => Boolean(preset))

  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      return current.length < 2 ? [...current, id] : [current[1]!, id]
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-0 top-13 z-[180] flex flex-col overflow-hidden bg-ui-950/98 text-ui-100 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Template strategy library"
        >
          <div className="flex shrink-0 items-center gap-5 border-b border-ui-800 px-6 py-4">
            <div>
              <p className="m-0 text-[10px] font-semibold tracking-[0.16em] text-ui-500 uppercase">
                {PRESETS.length} conversion systems
              </p>
              <h2 className="m-0 mt-1 text-[20px] font-semibold tracking-[-0.025em] text-ui-100">
                Choose the feeling before the layout
              </h2>
            </div>
            <p className="m-0 hidden max-w-[58ch] text-[12px] leading-relaxed text-ui-400 xl:block">
              Each direction makes a different argument. Inspect the psychology, story order,
              motion, and trade-offs before you load it into the canvas.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-ui-700 bg-ui-850 text-ui-300 transition-colors hover:border-ui-500 hover:text-white active:scale-[0.98]"
              aria-label="Close template library"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_390px]">
            <main className="min-h-0 overflow-y-auto px-6 py-5">
              <div className="sticky top-0 z-10 -mx-2 mb-5 flex flex-wrap items-center gap-2 bg-ui-950/92 px-2 pb-3 backdrop-blur-xl">
                <label className="relative mr-2 block min-w-[230px] flex-1 lg:max-w-[330px]">
                  <MagnifyingGlass
                    size={15}
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ui-500"
                  />
                  <span className="sr-only">Search templates</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by customer or outcome"
                    className="h-9 w-full rounded-lg border border-ui-700 bg-ui-900 pr-3 pl-9 text-[12px] text-ui-100 outline-none transition-colors placeholder:text-ui-500 focus:border-brand"
                  />
                </label>
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`h-8 cursor-pointer rounded-full border px-3 text-[11px] font-medium transition-colors active:scale-[0.98] ${
                      category === item
                        ? 'border-ui-500 bg-ui-100 text-ui-950'
                        : 'border-ui-750 bg-ui-900 text-ui-400 hover:border-ui-600 hover:text-ui-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {filtered.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.055 } } }}
                >
                  {filtered.map((preset) => (
                    <TemplateCard
                      key={preset.id}
                      preset={preset}
                      active={preset.id === selected.id}
                      current={preset.id === presetId}
                      comparing={compareIds.includes(preset.id)}
                      onSelect={() => {
                        setSelectedId(preset.id)
                        if (tab === 'compare' && compareIds.length < 2) setTab('rationale')
                      }}
                      onCompare={() => {
                        toggleCompare(preset.id)
                        if (!compareIds.includes(preset.id) && compareIds.length === 1) setTab('compare')
                      }}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="grid min-h-[420px] place-items-center border-t border-ui-800">
                  <div className="max-w-sm text-center">
                    <p className="m-0 text-[15px] font-semibold text-ui-200">No system matches that search.</p>
                    <p className="m-0 mt-2 text-[12px] leading-relaxed text-ui-500">
                      Clear the search or choose All to return to the complete collection.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('')
                        setCategory('All')
                      }}
                      className="mt-4 cursor-pointer rounded-lg border border-ui-700 bg-ui-850 px-3 py-2 text-[11px] font-medium text-ui-200 active:translate-y-px"
                    >
                      Show all templates
                    </button>
                  </div>
                </div>
              )}
            </main>

            <aside className="flex min-h-0 flex-col border-l border-ui-800 bg-ui-900/75">
              <div className="border-b border-ui-800 px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="m-0 text-[10px] font-semibold tracking-[0.14em] text-ui-500 uppercase">
                      {selected.strategy.tier ? `${selected.strategy.tier} · ` : ''}
                      {selected.strategy.category} · {selected.strategy.outcome}
                    </p>
                    <h3 className="m-0 mt-2 text-[22px] font-semibold tracking-[-0.035em] text-white">
                      {selected.name}
                    </h3>
                  </div>
                  {selected.id === presetId && (
                    <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] text-brand-soft uppercase">
                      On canvas
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-1 rounded-xl border border-ui-750 bg-ui-950 p-1">
                  {([
                    ['rationale', 'Why it works'],
                    ['story', 'Story & scroll'],
                    ['compare', `Compare ${compareIds.length}/2`],
                  ] as [DetailTab, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTab(value)}
                      className={`cursor-pointer rounded-lg px-2 py-2 text-[10px] font-medium transition-colors ${
                        tab === value ? 'bg-ui-750 text-white' : 'text-ui-500 hover:text-ui-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                {tab === 'rationale' && <Rationale preset={selected} />}
                {tab === 'story' && <Story preset={selected} />}
                {tab === 'compare' && (
                  <ComparePanel
                    presets={compared}
                    onRemove={(id) => toggleCompare(id)}
                    onUse={(id) => {
                      loadPreset(id)
                      onClose()
                    }}
                  />
                )}
              </div>

              <div className="border-t border-ui-800 bg-ui-900 px-5 py-4">
                <label className="block">
                  <span className="mb-1.5 block text-[9px] font-semibold tracking-[0.12em] text-ui-500 uppercase">
                    Working page name
                  </span>
                  <input
                    value={pageName}
                    onChange={(event) => renamePage(event.target.value)}
                    className="h-9 w-full rounded-lg border border-ui-700 bg-ui-850 px-3 text-[11px] text-ui-100 outline-none focus:border-brand"
                  />
                </label>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loadPreset(selected.id)
                      onClose()
                    }}
                    className="flex h-10 cursor-pointer items-center justify-between rounded-lg bg-ui-100 px-3.5 text-[11px] font-semibold text-ui-950 transition-transform active:translate-y-px"
                  >
                    Use {selected.name}
                    <ArrowRight size={15} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      toggleCompare(selected.id)
                      setTab('compare')
                    }}
                    className={`grid h-10 w-10 cursor-pointer place-items-center rounded-lg border transition-colors active:scale-[0.98] ${
                      compareIds.includes(selected.id)
                        ? 'border-brand bg-brand/15 text-brand-soft'
                        : 'border-ui-700 bg-ui-850 text-ui-400 hover:text-ui-100'
                    }`}
                    aria-label={compareIds.includes(selected.id) ? 'Remove from comparison' : 'Add to comparison'}
                    title={compareIds.includes(selected.id) ? 'Remove from comparison' : 'Add to comparison'}
                  >
                    {compareIds.includes(selected.id) ? <Check size={16} weight="bold" /> : <Scales size={16} />}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TemplateCard({
  preset,
  active,
  current,
  comparing,
  onSelect,
  onCompare,
}: {
  preset: PresetDef
  active: boolean
  current: boolean
  comparing: boolean
  onSelect: () => void
  onCompare: () => void
}) {
  const preview = preset.strategy.preview
  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
      className={`group overflow-hidden rounded-2xl border bg-ui-900 transition-colors ${
        active ? 'border-ui-400' : 'border-ui-800 hover:border-ui-650'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="relative block aspect-[16/10] w-full cursor-pointer overflow-hidden border-0 p-0 text-left"
        style={{ background: preview.background, color: preview.foreground }}
        aria-pressed={active}
      >
        {preview.asset && (
          <span
            className="absolute inset-0 bg-cover transition-transform duration-700 group-hover:scale-[1.025]"
            style={{ backgroundImage: `url(${preview.asset})`, backgroundPosition: preview.assetPosition ?? 'center' }}
          />
        )}
        <span
          className="absolute inset-0"
          style={{
            background: preview.asset
              ? `linear-gradient(90deg, ${preview.background}f2 0%, ${preview.background}a8 45%, ${preview.background}12 76%)`
              : `linear-gradient(145deg, ${preview.background} 35%, color-mix(in oklab, ${preview.accent} 18%, ${preview.background}))`,
          }}
        />
        <span className="absolute inset-0 flex flex-col justify-between p-5">
          <span className="flex items-center justify-between gap-3">
            <span className="text-[8px] font-semibold tracking-[0.16em] uppercase opacity-70">
              {preview.eyebrow}
            </span>
            <span className="h-1.5 w-7" style={{ background: preview.accent }} />
          </span>
          <span className="block max-w-[72%] text-[25px] leading-[0.98] font-semibold tracking-[-0.055em]">
            {preview.headline}
          </span>
          <span className="flex items-center gap-2 text-[8px] font-semibold tracking-[0.12em] uppercase opacity-65">
            {preset.strategy.emotionalArc.entry}
            <span className="h-px w-7 bg-current opacity-40" />
            {preset.strategy.emotionalArc.close}
          </span>
        </span>
      </button>
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="m-0 truncate text-[12px] font-semibold text-ui-100">{preset.name}</h3>
            {preset.strategy.tier && (
              <span className="rounded-full border border-ui-700 px-1.5 py-0.5 text-[7px] font-semibold tracking-[0.1em] text-ui-500 uppercase">
                {preset.strategy.tier}
              </span>
            )}
            {current && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" title="On canvas" />}
          </div>
          <p className="m-0 mt-1 truncate text-[10px] text-ui-500">{preset.vertical}</p>
        </div>
        <button
          type="button"
          onClick={onCompare}
          className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-[9px] font-semibold transition-colors active:scale-[0.98] ${
            comparing
              ? 'border-brand/50 bg-brand/12 text-brand-soft'
              : 'border-ui-750 bg-ui-850 text-ui-500 hover:text-ui-200'
          }`}
        >
          {comparing ? <Check size={12} weight="bold" /> : <Scales size={12} />}
          Compare
        </button>
      </div>
    </motion.article>
  )
}

function Rationale({ preset }: { preset: PresetDef }) {
  const { strategy } = preset
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-ui-750 bg-ui-850 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
        <p className="m-0 text-[9px] font-semibold tracking-[0.14em] text-ui-500 uppercase">
          Conversion thesis
        </p>
        <p className="m-0 mt-2 text-[13px] leading-relaxed text-ui-100">
          {strategy.conversionThesis}
        </p>
      </section>

      <section>
        <SectionLabel>Psychology at work</SectionLabel>
        <div className="mt-3 divide-y divide-ui-800 border-y border-ui-800">
          {strategy.psychology.map((item, index) => (
            <div key={item.principle} className="grid grid-cols-[24px_1fr] gap-3 py-3.5">
              <span className="font-mono text-[9px] text-ui-600">0{index + 1}</span>
              <div>
                <p className="m-0 text-[11px] font-semibold text-ui-200">{item.principle}</p>
                <p className="m-0 mt-1 text-[11px] leading-relaxed text-ui-500">{item.effect}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3">
        <FitBlock label="Most effective for" value={strategy.bestFor} positive />
        <FitBlock label="Choose another system when" value={strategy.avoidWhen} />
      </section>

      <section>
        <SectionLabel>Emotional profile</SectionLabel>
        <ScoreBars scores={strategy.scores} />
      </section>
    </div>
  )
}

function Story({ preset }: { preset: PresetDef }) {
  const { strategy } = preset
  return (
    <div className="flex flex-col gap-5">
      <section>
        <SectionLabel>Emotion engineered across the page</SectionLabel>
        <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-ui-750 bg-ui-750">
          {([
            ['Entry', strategy.emotionalArc.entry],
            ['Middle', strategy.emotionalArc.middle],
            ['Close', strategy.emotionalArc.close],
          ] as const).map(([label, value]) => (
            <div key={label} className="min-h-24 bg-ui-850 p-3">
              <p className="m-0 text-[8px] font-semibold tracking-[0.13em] text-ui-600 uppercase">{label}</p>
              <p className="m-0 mt-2 text-[10px] leading-relaxed text-ui-200">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Story sequence</SectionLabel>
        <ol className="m-0 mt-3 list-none border-l border-ui-700 p-0 pl-4">
          {strategy.story.map((item, index) => (
            <li key={item.beat} className="relative pb-4 last:pb-0">
              <span className="absolute top-1 -left-[21px] h-2.5 w-2.5 rounded-full border-2 border-ui-900 bg-ui-500" />
              <p className="m-0 text-[10px] font-semibold text-ui-200">
                {index + 1}. {item.beat}
              </p>
              <p className="m-0 mt-1 text-[10px] leading-relaxed text-ui-500">{item.job}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-ui-750 bg-ui-850 p-4">
        <SectionLabel>Scroll feeling</SectionLabel>
        <p className="m-0 mt-3 text-[11px] font-semibold leading-relaxed text-ui-200">{strategy.motion.pattern}</p>
        <p className="m-0 mt-2 text-[11px] leading-relaxed text-ui-500">It makes the customer feel: {strategy.motion.feeling}</p>
        <div className="mt-3 border-t border-ui-750 pt-3">
          <p className="m-0 text-[9px] font-semibold tracking-[0.12em] text-ui-600 uppercase">Restraint</p>
          <p className="m-0 mt-1 text-[10px] leading-relaxed text-ui-400">{strategy.motion.caution}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <ListBlock label="Strengths" items={strategy.strengths} />
        <ListBlock label="Trade-offs" items={strategy.tradeoffs} />
      </section>
    </div>
  )
}

function ComparePanel({
  presets,
  onRemove,
  onUse,
}: {
  presets: PresetDef[]
  onRemove: (id: string) => void
  onUse: (id: string) => void
}) {
  if (presets.length < 2) {
    return (
      <div className="grid min-h-[360px] place-items-center text-center">
        <div>
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-ui-700 bg-ui-850 text-ui-400">
            <Scales size={20} />
          </span>
          <p className="m-0 mt-4 text-[13px] font-semibold text-ui-200">Choose two systems</p>
          <p className="m-0 mt-2 max-w-[28ch] text-[11px] leading-relaxed text-ui-500">
            Add templates from the gallery. The second choice opens a direct psychological and emotional comparison.
          </p>
        </div>
      </div>
    )
  }

  const [a, b] = presets as [PresetDef, PresetDef]
  const dimensions = Object.keys(SCORE_LABELS) as (keyof TemplateScores)[]
  const biggest = dimensions
    .map((key) => ({ key, gap: Math.abs(a.strategy.scores[key] - b.strategy.scores[key]) }))
    .sort((left, right) => right.gap - left.gap)[0]!
  const leader = a.strategy.scores[biggest.key] >= b.strategy.scores[biggest.key] ? a : b

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-ui-750 bg-ui-850 p-4">
        <p className="m-0 text-[9px] font-semibold tracking-[0.14em] text-ui-500 uppercase">Largest difference</p>
        <p className="m-0 mt-2 text-[13px] leading-relaxed text-ui-100">
          <span className="font-semibold text-white">{leader.name}</span> is markedly stronger on{' '}
          {SCORE_LABELS[biggest.key].toLowerCase()}. That matters when this dimension is the main barrier to action.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        {[a, b].map((preset) => (
          <article key={preset.id} className="rounded-xl border border-ui-750 bg-ui-900 p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="m-0 text-[11px] font-semibold text-ui-100">{preset.name}</p>
                <p className="m-0 mt-1 text-[9px] text-ui-600">{preset.strategy.category}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(preset.id)}
                className="grid h-6 w-6 cursor-pointer place-items-center rounded-full text-ui-600 hover:bg-ui-800 hover:text-ui-200"
                aria-label={`Remove ${preset.name} from comparison`}
              >
                <X size={11} weight="bold" />
              </button>
            </div>
            <p className="m-0 mt-3 text-[10px] leading-relaxed text-ui-400">{preset.strategy.compareEdge}</p>
            <button
              type="button"
              onClick={() => onUse(preset.id)}
              className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-lg border border-ui-700 bg-ui-850 px-2.5 py-2 text-[9px] font-semibold text-ui-200 active:translate-y-px"
            >
              Use this system
              <ArrowRight size={12} weight="bold" />
            </button>
          </article>
        ))}
      </div>

      <section>
        <SectionLabel>Head-to-head emotional profile</SectionLabel>
        <div className="mt-3 divide-y divide-ui-800 border-y border-ui-800">
          {dimensions.map((key) => {
            const aScore = a.strategy.scores[key]
            const bScore = b.strategy.scores[key]
            return (
              <div key={key} className="py-3">
                <div className="mb-2 flex items-center justify-between text-[9px] font-semibold text-ui-500">
                  <span>{SCORE_LABELS[key]}</span>
                  <span className="font-mono">{aScore} / {bScore}</span>
                </div>
                <div className="grid gap-1.5">
                  <div className="h-1.5 overflow-hidden rounded-full bg-ui-800">
                    <div className="h-full rounded-full bg-brand-soft" style={{ width: `${aScore}%` }} />
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ui-800">
                    <div className="h-full rounded-full bg-[#c69259]" style={{ width: `${bScore}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[9px] text-ui-500">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-4 rounded-full bg-brand-soft" />{a.name}</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-4 rounded-full bg-[#c69259]" />{b.name}</span>
        </div>
      </section>

      <section className="border-t border-ui-800 pt-4">
        <p className="m-0 text-[10px] font-semibold text-ui-300">The honest decision</p>
        <p className="m-0 mt-2 text-[10px] leading-relaxed text-ui-500">
          There is no universal winner. Choose the system whose strongest dimension answers the customer’s largest unresolved doubt.
        </p>
      </section>
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return <p className="m-0 text-[9px] font-semibold tracking-[0.14em] text-ui-500 uppercase">{children}</p>
}

function FitBlock({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="border-l-2 pl-3" style={{ borderColor: positive ? '#7c6cff' : '#4a4a58' }}>
      <p className="m-0 text-[9px] font-semibold tracking-[0.12em] text-ui-600 uppercase">{label}</p>
      <p className="m-0 mt-1.5 text-[10px] leading-relaxed text-ui-300">{value}</p>
    </div>
  )
}

function ScoreBars({ scores }: { scores: TemplateScores }) {
  return (
    <div className="mt-3 grid gap-2.5">
      {(Object.keys(SCORE_LABELS) as (keyof TemplateScores)[]).map((key) => (
        <div key={key} className="grid grid-cols-[54px_1fr_24px] items-center gap-2">
          <span className="text-[9px] text-ui-500">{SCORE_LABELS[key]}</span>
          <span className="h-1.5 overflow-hidden rounded-full bg-ui-800">
            <span className="block h-full rounded-full bg-ui-300" style={{ width: `${scores[key]}%` }} />
          </span>
          <span className="text-right font-mono text-[9px] text-ui-500">{scores[key]}</span>
        </div>
      ))}
    </div>
  )
}

function ListBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-ui-800 bg-ui-850/60 p-3">
      <p className="m-0 text-[8px] font-semibold tracking-[0.12em] text-ui-600 uppercase">{label}</p>
      <ul className="m-0 mt-2.5 flex list-none flex-col gap-2 p-0">
        {items.map((item) => (
          <li key={item} className="text-[9px] leading-relaxed text-ui-400">{item}</li>
        ))}
      </ul>
    </div>
  )
}
