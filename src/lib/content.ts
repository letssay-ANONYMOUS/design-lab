import type { Component, Section, Tone, ToneText } from '@/types'

/**
 * Copy resolution. Preset sections ship all three voices; anything the user
 * types by hand collapses to a single voice and stops responding to the tone
 * swapper (which is the honest behaviour — we can't rewrite their words).
 */
export function resolveTone(
  tone: Tone,
  tones: ToneText | undefined,
  fallback: string | undefined,
): string {
  if (tones) return tones[tone]
  return fallback ?? ''
}

export function toneText(text: string): ToneText {
  return { authority: text, warm: text, urgent: text }
}

/**
 * Trust density → which proof elements survive.
 *
 * Every component carries an optional `proofTier`:
 *   tier 1 = core proof, always visible
 *   tier 2 = appears past 40
 *   tier 3 = appears past 75
 * Untagged components are structural and never filtered.
 */
export function passesTrustDensity(component: Component, density: number): boolean {
  const tier = component.props.proofTier
  if (!tier) return true
  if (tier === 1) return true
  if (tier === 2) return density >= 40
  return density >= 75
}

export function visibleComponents(section: Section, density: number): Component[] {
  return section.components.filter((c) => passesTrustDensity(c, density))
}

/** Logo rows and star counts scale continuously rather than popping in. */
export function scaleCount(density: number, min: number, max: number): number {
  return Math.round(min + ((max - min) * density) / 100)
}
