import type { ComponentType, Mood, SectionType } from '@/types'

export interface SectionDef {
  type: SectionType
  label: string
  /** Short line shown in the section picker. */
  blurb: string
  variants: { id: string; label: string }[]
  defaultMood: Mood
}

/**
 * The variant registry. Adding a layout is: add an id here, handle it in the
 * section component. Everything else (cycling, remix, export) reads this list.
 */
export const SECTION_DEFS: SectionDef[] = [
  {
    type: 'hero',
    label: 'Hero',
    blurb: 'Six archetypes, image slots, overlay control',
    defaultMood: 'loud',
    variants: [
      { id: 'split', label: 'Split' },
      { id: 'centered', label: 'Centered' },
      { id: 'fullBleed', label: 'Full-bleed' },
      { id: 'editorial', label: 'Editorial' },
      { id: 'collage', label: 'Collage' },
      { id: 'minimal', label: 'Minimal' },
    ],
  },
  {
    type: 'logoBar',
    label: 'Logo bar',
    blurb: 'Social proof strip',
    defaultMood: 'calm',
    variants: [
      { id: 'inline', label: 'Inline' },
      { id: 'boxed', label: 'Boxed' },
      { id: 'marquee', label: 'Marquee' },
      { id: 'stacked', label: 'Stacked' },
    ],
  },
  {
    type: 'featureGrid',
    label: 'Feature grid',
    blurb: 'What you actually do',
    defaultMood: 'calm',
    variants: [
      { id: 'cards', label: 'Cards' },
      { id: 'alternating', label: 'Alternating' },
      { id: 'iconList', label: 'Icon list' },
      { id: 'bordered', label: 'Bordered' },
    ],
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    blurb: 'Quotes, faces, ratings',
    defaultMood: 'calm',
    variants: [
      { id: 'cards', label: 'Cards' },
      { id: 'single', label: 'Single' },
      { id: 'grid', label: 'Grid' },
      { id: 'marquee', label: 'Marquee' },
    ],
  },
  {
    type: 'pricing',
    label: 'Pricing',
    blurb: 'Plans and packages',
    defaultMood: 'calm',
    variants: [
      { id: 'columns', label: 'Columns' },
      { id: 'featured', label: 'Featured' },
      { id: 'compact', label: 'Compact' },
      { id: 'list', label: 'List' },
    ],
  },
  {
    type: 'faq',
    label: 'FAQ',
    blurb: 'Objection handling',
    defaultMood: 'calm',
    variants: [
      { id: 'accordion', label: 'Accordion' },
      { id: 'twoCol', label: 'Two column' },
      { id: 'boxed', label: 'Boxed' },
    ],
  },
  {
    type: 'bento',
    label: 'Bento grid',
    blurb: 'Resizable 12-col cards',
    defaultMood: 'loud',
    variants: [
      { id: 'soft', label: 'Soft' },
      { id: 'outline', label: 'Outline' },
      { id: 'contrast', label: 'Contrast' },
      { id: 'storyRail', label: 'Story rail' },
    ],
  },
  {
    type: 'ctaBanner',
    label: 'CTA banner',
    blurb: 'The ask',
    defaultMood: 'loud',
    variants: [
      { id: 'centered', label: 'Centered' },
      { id: 'split', label: 'Split' },
      { id: 'panel', label: 'Panel' },
      { id: 'ribbon', label: 'Ribbon' },
    ],
  },
  {
    type: 'footer',
    label: 'Footer',
    blurb: 'Close it out',
    defaultMood: 'calm',
    variants: [
      { id: 'columns', label: 'Columns' },
      { id: 'minimal', label: 'Minimal' },
      { id: 'big', label: 'Big' },
    ],
  },
]

export function sectionDef(type: SectionType): SectionDef {
  return SECTION_DEFS.find((d) => d.type === type) ?? SECTION_DEFS[0]!
}

export function nextVariant(type: SectionType, current: string, dir = 1): string {
  const list = sectionDef(type).variants
  const index = list.findIndex((v) => v.id === current)
  const next = (index + dir + list.length) % list.length
  return list[next]!.id
}

export function variantLabel(type: SectionType, id: string): string {
  return sectionDef(type).variants.find((v) => v.id === id)?.label ?? id
}

/** Components the tray offers, grouped so the menu reads sensibly. */
export const COMPONENT_TRAY: { type: ComponentType; label: string; group: string }[] = [
  { type: 'badge', label: 'Badge', group: 'Text' },
  { type: 'heading', label: 'Heading', group: 'Text' },
  { type: 'subheading', label: 'Subheading', group: 'Text' },
  { type: 'paragraph', label: 'Paragraph', group: 'Text' },
  { type: 'quote', label: 'Quote', group: 'Text' },
  { type: 'listItem', label: 'List item', group: 'Text' },
  { type: 'button', label: 'Button', group: 'Action' },
  { type: 'priceTag', label: 'Price tag', group: 'Action' },
  { type: 'stat', label: 'Stat', group: 'Proof' },
  { type: 'starRating', label: 'Star rating', group: 'Proof' },
  { type: 'avatar', label: 'Avatar', group: 'Proof' },
  { type: 'logoRow', label: 'Logo row', group: 'Proof' },
  { type: 'imageSlot', label: 'Image slot', group: 'Media' },
  { type: 'iconFeature', label: 'Icon feature', group: 'Media' },
  { type: 'divider', label: 'Divider', group: 'Media' },
]
