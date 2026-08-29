import type { Component, ComponentType, Section } from '@/types'
import type { CSSProperties } from 'react'

/**
 * Section layouts consume components by type rather than by index, so the
 * component tray can insert anything anywhere and the layout still knows what
 * to do with it.
 */
export function byType(components: Component[]) {
  const of = (type: ComponentType) => components.filter((c) => c.type === type)
  return {
    badges: of('badge'),
    headings: of('heading'),
    subheadings: of('subheading'),
    paragraphs: of('paragraph'),
    buttons: of('button'),
    images: of('imageSlot'),
    stars: of('starRating'),
    stats: of('stat'),
    avatars: of('avatar'),
    logoRows: of('logoRow'),
    quotes: of('quote'),
    features: of('iconFeature'),
    prices: of('priceTag'),
    faqs: of('faqItem'),
    cards: of('bentoCard'),
    listItems: of('listItem'),
    dividers: of('divider'),
  }
}

export type Picked = ReturnType<typeof byType>

/** Outer padding shared by every section variant. */
export function sectionPad(extra?: CSSProperties): CSSProperties {
  return {
    paddingTop: 'var(--dl-pad-y)',
    paddingBottom: 'var(--dl-pad-y)',
    paddingLeft: 'var(--dl-pad-x)',
    paddingRight: 'var(--dl-pad-x)',
    ...extra,
  }
}

/** Loud sections invert onto the palette's dark surface. */
export function surface(loud: boolean): CSSProperties {
  return loud
    ? { background: 'var(--dl-loud-bg)', color: 'var(--dl-loud-text)' }
    : { background: 'var(--dl-bg)', color: 'var(--dl-text)' }
}

export function isLoud(section: Section): boolean {
  return section.mood === 'loud'
}

/** Variants built on `SplitLayout`, and so carrying a draggable column divider. */
const SPLIT_VARIANTS: Record<string, readonly string[]> = {
  hero: ['split', 'editorial', 'collage'],
}

export function hasSplitDivider(section: Section): boolean {
  return SPLIT_VARIANTS[section.type]?.includes(section.variant) ?? false
}

export const CONTAINER: CSSProperties = {
  maxWidth: 1180,
  marginInline: 'auto',
  width: '100%',
}

/**
 * Gradient fills for a bento card's image band, used until a photo is
 * uploaded. Lives here rather than in the section so the exporter can emit the
 * same fill the canvas is showing.
 */
export const CARD_FILLS = [
  'linear-gradient(135deg, color-mix(in oklab, var(--dl-primary) 80%, black), color-mix(in oklab, var(--dl-accent) 50%, var(--dl-surface)))',
  'linear-gradient(210deg, color-mix(in oklab, var(--dl-accent) 62%, var(--dl-surface)), color-mix(in oklab, var(--dl-primary) 70%, black))',
  'radial-gradient(110% 110% at 15% 15%, color-mix(in oklab, var(--dl-accent) 60%, white), color-mix(in oklab, var(--dl-primary) 78%, black))',
  'linear-gradient(320deg, color-mix(in oklab, var(--dl-text) 90%, black), color-mix(in oklab, var(--dl-primary) 62%, var(--dl-accent)))',
]

export const NARROW: CSSProperties = {
  maxWidth: 760,
  marginInline: 'auto',
  width: '100%',
}
