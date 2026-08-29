import { Popover, Segmented, Slider, ToolButton, Toggle } from '@/components/ui/primitives'
import { remixPage } from '@/lib/remix'
import { PRESETS } from '@/presets'
import { useLab } from '@/store/useLab'
import { TONES, type Tone } from '@/types'
import {
  Code2,
  Eye,
  Grid3x3,
  LayoutTemplate,
  Play,
  Redo2,
  ShieldCheck,
  Shuffle,
  Undo2,
  Waves,
} from 'lucide-react'

const TONE_OPTIONS = TONES.map((tone) => ({
  value: tone,
  label: tone[0]!.toUpperCase() + tone.slice(1),
}))

const TONE_HINT: Record<Tone, string> = {
  authority: 'Credentials first. Calm, specific, evidence-led.',
  warm: 'Person first. Softer verbs, plain words, reassurance.',
  urgent: 'Now first. Short lines, scarcity, a clear next step.',
}

/**
 * Button labels collapse to icons on narrower windows. The toolbar is dense
 * enough that at 1280px the alternative is either a horizontal scrollbar or
 * controls sliding off the edge, and both are worse than a tooltip.
 */
function Label({ children }: { children: string }) {
  return <span className="hidden xl:inline">{children}</span>
}

/** The emotional-engineering toolbar: everything that changes how a page feels. */
export function TopBar({ onExport }: { onExport: () => void }) {
  const page = useLab((s) => s.page)
  const presetId = useLab((s) => s.presetId)
  const view = useLab((s) => s.view)
  const loadPreset = useLab((s) => s.loadPreset)
  const renamePage = useLab((s) => s.renamePage)
  const setView = useLab((s) => s.setView)
  const setTone = useLab((s) => s.setTone)
  const setChoreo = useLab((s) => s.setChoreo)
  const playPreview = useLab((s) => s.playPreview)
  const replacePage = useLab((s) => s.replacePage)
  const undo = useLab((s) => s.undo)
  const redo = useLab((s) => s.redo)
  const canUndo = useLab((s) => s.past.length > 0)
  const canRedo = useLab((s) => s.future.length > 0)

  return (
    <header className="z-[100] flex h-13 shrink-0 items-center gap-2 border-b border-ui-800 bg-ui-900 px-3">
      <div className="flex items-center gap-2 pr-1">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-brand text-[11px] font-bold text-white">
          DL
        </span>
        <span className="text-xs font-semibold tracking-tight text-ui-100">Design&nbsp;Lab</span>
      </div>

      <span className="h-5 w-px bg-ui-800" />

      {/* Preset + page name ------------------------------------------------ */}
      <Popover
        width={272}
        trigger={({ open, toggle }) => (
          <ToolButton active={open} onClick={toggle} icon={<LayoutTemplate size={14} />}>
            <span className="max-w-[168px] truncate">{page.name}</span>
          </ToolButton>
        )}
      >
        <p className="m-0 mb-2 text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase">
          Load a preset
        </p>
        <div className="flex flex-col gap-1">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => loadPreset(preset.id)}
              className={`cursor-pointer rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-ui-800 ${
                preset.id === presetId ? 'bg-brand/12 shadow-[inset_0_0_0_1px_rgba(124,108,255,.32)]' : ''
              }`}
            >
              <span className="block text-[12px] font-medium text-ui-100">{preset.name}</span>
              <span className="block text-[10px] text-ui-500">{preset.vertical}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 mb-1.5 text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase">
          Page name
        </p>
        <input
          value={page.name}
          onChange={(event) => renamePage(event.target.value)}
          className="w-full rounded-lg border border-ui-700 bg-ui-850 px-2.5 py-1.5 text-[12px] text-ui-100 outline-none focus:border-brand"
        />
      </Popover>

      <span className="h-5 w-px bg-ui-800" />

      {/* Diagnostics ------------------------------------------------------- */}
      <ToolButton
        active={view.squint}
        onClick={() => setView({ squint: !view.squint })}
        title="Squint test — blur everything to check the hierarchy survives"
        icon={<Eye size={14} />}
      >
        <Label>Squint</Label>
      </ToolButton>
      <ToolButton
        active={view.grid}
        onClick={() => setView({ grid: !view.grid })}
        title="8pt baseline + 12-column overlay"
        icon={<Grid3x3 size={14} />}
      >
        <Label>Grid</Label>
      </ToolButton>
      <ToolButton
        active={view.minimap}
        onClick={() => setView({ minimap: !view.minimap })}
        title="Contrast-pacing minimap"
        icon={<Waves size={14} />}
      >
        <Label>Pacing</Label>
      </ToolButton>

      {/* Trust density ----------------------------------------------------- */}
      <Popover
        width={252}
        trigger={({ open, toggle }) => (
          <ToolButton active={open} onClick={toggle} icon={<ShieldCheck size={14} />}>
            Trust {view.trustDensity}
          </ToolButton>
        )}
      >
        <Slider
          label="Trust density"
          value={view.trustDensity}
          min={0}
          max={100}
          display={`${view.trustDensity}%`}
          onChange={(trustDensity) => setView({ trustDensity })}
        />
        <p className="m-0 mt-2 text-[10px] leading-relaxed text-ui-500">
          Reveals proof in tiers — ratings and stats first, then logos, then long-form
          testimonials. Drag to zero to see whether the page still persuades on copy alone.
        </p>
      </Popover>

      {/* Motion ------------------------------------------------------------ */}
      <Popover
        width={252}
        trigger={({ open, toggle }) => (
          <ToolButton active={open} onClick={toggle} title="Scroll choreography" icon={<Play size={14} />}>
            <Label>Motion</Label>
          </ToolButton>
        )}
      >
        <div className="flex flex-col gap-3">
          <Slider
            label="Stagger"
            value={view.choreo.stagger}
            min={0}
            max={0.3}
            step={0.01}
            display={`${Math.round(view.choreo.stagger * 1000)}ms`}
            onChange={(stagger) => setChoreo({ stagger })}
          />
          <Slider
            label="Fade distance"
            value={view.choreo.distance}
            min={0}
            max={80}
            display={`${view.choreo.distance}px`}
            onChange={(distance) => setChoreo({ distance })}
          />
          <Slider
            label="Hero parallax"
            value={view.choreo.parallax}
            min={0}
            max={100}
            display={`${view.choreo.parallax}%`}
            onChange={(parallax) => setChoreo({ parallax })}
          />
          <ToolButton variant="solid" onClick={playPreview} icon={<Play size={13} />}>
            Play the scroll
          </ToolButton>
        </div>
      </Popover>

      <span className="h-5 w-px bg-ui-800" />

      {/* Voice ------------------------------------------------------------- */}
      <div className="flex items-center gap-1.5" title={TONE_HINT[view.tone]}>
        <span className="hidden text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase 2xl:inline">
          Voice
        </span>
        <Segmented value={view.tone} options={TONE_OPTIONS} onChange={setTone} className="w-[186px]" />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ToolButton disabled={!canUndo} onClick={undo} title="Undo (⌘Z)" icon={<Undo2 size={14} />} />
        <ToolButton
          disabled={!canRedo}
          onClick={redo}
          title="Redo (⇧⌘Z)"
          icon={<Redo2 size={14} />}
        />
        <span className="mx-0.5 h-5 w-px bg-ui-800" />
        <ToolButton
          variant="outline"
          onClick={() => replacePage(remixPage(page))}
          title="Randomise variants and tokens inside curated bounds"
          icon={<Shuffle size={14} />}
        >
          Remix
        </ToolButton>
        <ToolButton variant="solid" onClick={onExport} icon={<Code2 size={14} />}>
          Export
        </ToolButton>
      </div>
    </header>
  )
}

/** Split out so the right panel can reuse the same choreography controls. */
export function ChoreoControls() {
  const choreo = useLab((s) => s.view.choreo)
  const setChoreo = useLab((s) => s.setChoreo)
  const playPreview = useLab((s) => s.playPreview)
  const squint = useLab((s) => s.view.squint)
  const setView = useLab((s) => s.setView)

  return (
    <div className="flex flex-col gap-3">
      <Slider
        label="Stagger"
        value={choreo.stagger}
        min={0}
        max={0.3}
        step={0.01}
        display={`${Math.round(choreo.stagger * 1000)}ms`}
        onChange={(stagger) => setChoreo({ stagger })}
      />
      <Slider
        label="Fade distance"
        value={choreo.distance}
        min={0}
        max={80}
        display={`${choreo.distance}px`}
        onChange={(distance) => setChoreo({ distance })}
      />
      <Slider
        label="Hero parallax"
        value={choreo.parallax}
        min={0}
        max={100}
        display={`${choreo.parallax}%`}
        onChange={(parallax) => setChoreo({ parallax })}
      />
      <Toggle
        checked={squint}
        onChange={(squint) => setView({ squint })}
        label="Squint test"
        hint="Blur the page to judge hierarchy"
      />
      <ToolButton variant="solid" onClick={playPreview} icon={<Play size={13} />}>
        Play the scroll
      </ToolButton>
    </div>
  )
}
