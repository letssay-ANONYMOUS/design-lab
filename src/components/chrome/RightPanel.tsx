import { ChoreoControls } from '@/components/chrome/TopBar'
import { PanelSection, Slider, ToolButton } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'
import { remixLayoutsOnly } from '@/lib/remix'
import {
  DEFAULT_TOKENS,
  FONT_PAIRS,
  PALETTES,
  TOKEN_LIMITS,
  getFontPair,
  typeSteps,
} from '@/lib/tokens'
import { useLab } from '@/store/useLab'
import { RotateCcw, Shuffle } from 'lucide-react'

/**
 * The token panel. Every control here writes one number or id into the page's
 * `tokens`, which becomes a `--dl-*` custom property on the canvas root — so
 * changes are instant and the exported file inherits exactly the same values.
 */
export function RightPanel() {
  const tokens = useLab((s) => s.page.tokens)
  const page = useLab((s) => s.page)
  const setTokens = useLab((s) => s.setTokens)
  const replacePage = useLab((s) => s.replacePage)

  const font = getFontPair(tokens.fontPairId)
  const steps = typeSteps(tokens.baseSize, tokens.typeScale)

  return (
    <aside className="flex w-[268px] shrink-0 flex-col overflow-y-auto border-l border-ui-800 bg-ui-900">
      <PanelSection
        title="Palette"
        action={
          <ToolButton
            size="sm"
            onClick={() => setTokens(DEFAULT_TOKENS)}
            title="Reset all tokens"
            icon={<RotateCcw size={12} />}
          />
        }
      >
        <div className="grid grid-cols-2 gap-1.5">
          {PALETTES.map((palette) => {
            const active = palette.id === tokens.paletteId
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => setTokens({ paletteId: palette.id })}
                className={cn(
                  'cursor-pointer overflow-hidden rounded-lg border p-1.5 text-left transition-all duration-150',
                  active
                    ? 'border-brand ring-1 ring-brand/40'
                    : 'border-ui-750 hover:border-ui-600 hover:bg-ui-850',
                )}
              >
                <span className="flex h-5 overflow-hidden rounded-[5px]">
                  {[palette.bg, palette.surface, palette.primary, palette.accent, palette.loudBg].map(
                    (color) => (
                      <span key={color} className="flex-1" style={{ background: color }} />
                    ),
                  )}
                </span>
                <span
                  className={cn(
                    'mt-1 block truncate text-[10px] font-medium',
                    active ? 'text-ui-100' : 'text-ui-400',
                  )}
                >
                  {palette.name}
                </span>
              </button>
            )
          })}
        </div>
      </PanelSection>

      <PanelSection title="Type">
        <div className="flex flex-col gap-1">
          {FONT_PAIRS.map((pair) => {
            const active = pair.id === tokens.fontPairId
            return (
              <button
                key={pair.id}
                type="button"
                onClick={() => setTokens({ fontPairId: pair.id })}
                className={cn(
                  'flex cursor-pointer items-baseline justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-all duration-150',
                  active
                    ? 'border-brand bg-brand/10'
                    : 'border-transparent hover:border-ui-750 hover:bg-ui-850',
                )}
              >
                <span
                  className={cn('text-[15px] leading-none', active ? 'text-ui-100' : 'text-ui-300')}
                  style={{ fontFamily: pair.heading, letterSpacing: pair.tracking }}
                >
                  Ag
                </span>
                <span className="text-[10px] text-ui-500">{pair.name}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-1 flex flex-col gap-2.5">
          <Slider
            label="Base size"
            value={tokens.baseSize}
            {...TOKEN_LIMITS.baseSize}
            display={`${tokens.baseSize}px`}
            onChange={(baseSize) => setTokens({ baseSize })}
          />
          <Slider
            label="Scale ratio"
            value={tokens.typeScale}
            {...TOKEN_LIMITS.typeScale}
            display={tokens.typeScale.toFixed(2)}
            onChange={(typeScale) => setTokens({ typeScale })}
          />
        </div>

        {/* Live ladder — the fastest way to feel whether a ratio is working. */}
        <div
          className="mt-1 overflow-hidden rounded-lg bg-ui-850 px-2.5 py-2"
          style={{ fontFamily: font.heading, letterSpacing: font.tracking }}
        >
          {(['h1', 'h2', 'h3', 'base'] as const).map((key) => (
            <div key={key} className="flex items-baseline justify-between gap-2">
              <span
                className="truncate text-ui-200"
                style={{ fontSize: Math.min(30, steps[key]), lineHeight: 1.25 }}
              >
                Booking that feels calm
              </span>
              <span className="shrink-0 font-mono text-[9px] text-ui-600 tabular-nums">
                {steps[key]}
              </span>
            </div>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Shape & rhythm">
        <Slider
          label="Corner radius"
          value={tokens.radius}
          {...TOKEN_LIMITS.radius}
          display={`${tokens.radius}px`}
          onChange={(radius) => setTokens({ radius })}
        />
        <div className="flex gap-1.5">
          {[0, 2, 6, 10, 14, 20, 28].map((stop) => (
            <button
              key={stop}
              type="button"
              onClick={() => setTokens({ radius: stop })}
              title={`${stop}px`}
              className={cn(
                'h-7 flex-1 cursor-pointer border transition-colors',
                tokens.radius === stop
                  ? 'border-brand bg-brand/15'
                  : 'border-ui-750 hover:border-ui-600',
              )}
              style={{ borderRadius: Math.min(stop, 12) }}
            />
          ))}
        </div>
        <Slider
          label="Spacing"
          value={tokens.spacing}
          {...TOKEN_LIMITS.spacing}
          display={`${tokens.spacing.toFixed(2)}×`}
          onChange={(spacing) => setTokens({ spacing })}
        />
        <p className="m-0 text-[10px] leading-snug text-ui-600">
          Scales section padding and every gap together, so the page breathes as one system
          instead of drifting apart.
        </p>
      </PanelSection>

      <PanelSection title="Motion">
        <ChoreoControls />
      </PanelSection>

      <PanelSection title="Layout">
        <ToolButton
          variant="outline"
          onClick={() => replacePage(remixLayoutsOnly(page))}
          icon={<Shuffle size={13} />}
        >
          Shuffle layouts only
        </ToolButton>
        <p className="m-0 text-[10px] leading-snug text-ui-600">
          Keeps the palette and type you chose, and re-rolls every section's variant.
        </p>
      </PanelSection>
    </aside>
  )
}
