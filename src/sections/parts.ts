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

export const CONTAINER: CSSProperties = {
  maxWidth: 1180,
  marginInline: 'auto',
  width: '100%',
}

export const NARROW: CSSProperties = {
  maxWidth: 760,
  marginInline: 'auto',
  width: '100%',
}
