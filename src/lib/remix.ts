import { sectionDef } from '@/lib/registry'
import { FONT_PAIRS, PALETTES } from '@/lib/tokens'
import type { Page, Section, Tokens } from '@/types'

function pick<T>(list: readonly T[], exclude?: T): T {
  const pool = exclude === undefined ? list : list.filter((item) => item !== exclude)
  const source = pool.length > 0 ? pool : list
  return source[Math.floor(Math.random() * source.length)]!
}

function between(min: number, max: number, step: number): number {
  const steps = Math.round((max - min) / step)
  return Number((min + Math.floor(Math.random() * (steps + 1)) * step).toFixed(2))
}

/**
 * Radius is snapped to a handful of intentional values rather than any integer
 * 0–32. A 7px radius is the kind of thing that makes a page look accidental,
 * and the whole promise of this button is that it never produces garbage.
 */
const RADIUS_STOPS = [0, 2, 6, 10, 14, 20, 28]

/** Types that can carry a dark, high-contrast treatment without looking odd. */
const CAN_BE_LOUD = new Set(['hero', 'ctaBanner', 'bento'])

function remixTokens(current: Tokens): Tokens {
  return {
    paletteId: pick(
      PALETTES.map((p) => p.id),
      current.paletteId,
    ),
    fontPairId: pick(
      FONT_PAIRS.map((f) => f.id),
      current.fontPairId,
    ),
    radius: pick(RADIUS_STOPS, current.radius),
    spacing: between(0.85, 1.3, 0.05),
    typeScale: between(1.18, 1.38, 0.02),
    baseSize: pick([16, 17]),
  }
}

function remixSection(section: Section, index: number, total: number): Section {
  const variants = sectionDef(section.type).variants.map((v) => v.id)

  /* Narrative rhythm is preserved deliberately: the opener and the closing ask
   * stay loud, the middle stays calm. Randomising mood freely produced pages
   * that were all shouting, which is exactly the failure the contrast-pacing
   * minimap exists to catch. */
  const isOpener = index === 0
  const isCloser = index >= total - 2 && section.type === 'ctaBanner'
  const mood =
    isOpener || isCloser
      ? 'loud'
      : CAN_BE_LOUD.has(section.type) && Math.random() < 0.3
        ? 'loud'
        : 'calm'

  return {
    ...section,
    variant: pick(variants, section.variant),
    mood,
    meta: {
      ...section.meta,
      swapSides: Math.random() < 0.5,
      overlayIntensity: Math.round(between(34, 62, 2)),
      overlay: section.type === 'hero' ? section.meta.overlay !== false : section.meta.overlay,
    },
  }
}

/** Randomises variants and tokens inside curated bounds. Never off-brand. */
export function remixPage(page: Page): Page {
  return {
    ...page,
    tokens: remixTokens(page.tokens),
    sections: page.sections.map((section, i) => remixSection(section, i, page.sections.length)),
  }
}

/** Variants only — useful when you like the palette and want new layouts. */
export function remixLayoutsOnly(page: Page): Page {
  return {
    ...page,
    sections: page.sections.map((section, i) => remixSection(section, i, page.sections.length)),
  }
}
