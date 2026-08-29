import { uid } from '@/lib/id'
import { sectionDef } from '@/lib/registry'
import type { Component, ComponentProps, ComponentType, Section, SectionType } from '@/types'

export function comp(type: ComponentType, props: ComponentProps = {}): Component {
  return { id: uid('c'), type, props }
}

/** Three-voice copy helper — keeps the preset files readable. */
export function t(authority: string, warm: string, urgent: string) {
  return { authority, warm, urgent }
}

const DEFAULTS: Record<ComponentType, ComponentProps> = {
  badge: { tones: t('Accredited practice', 'Nice to meet you', 'Booking now') },
  heading: {
    tones: t(
      'A standard of care you can measure',
      'Care that feels like it was made for you',
      'Get seen this week — not next month',
    ),
  },
  subheading: { tones: t('How it works', 'Here is the easy part', 'Three steps, today') },
  paragraph: {
    tones: t(
      'Every plan is reviewed by two clinicians before it reaches you, and the outcome data is published each quarter.',
      'We take our time with you. No rushing, no jargon — just a plan that fits the life you actually live.',
      'Same-week appointments are going fast. Reserve your slot before the schedule fills.',
    ),
  },
  quote: {
    tones: t(
      'They gave me a written plan with timelines. Nobody had done that before.',
      'I stopped dreading appointments. That is the honest review.',
      'Called Monday, treated Wednesday. That never happens.',
    ),
    sub: 'Verified client',
    proofTier: 1,
  },
  listItem: { tones: t('Documented outcomes', 'A friendly check-in', 'Same-week slots') },
  button: { tones: t('Book a consultation', 'Say hello', 'Claim your slot'), emphasis: 'primary' },
  priceTag: { text: '$180', sub: 'per session' },
  stat: { text: '98%', sub: 'would recommend us', proofTier: 1 },
  starRating: { rating: 5, sub: '4.9 from 312 reviews', proofTier: 1 },
  avatar: { text: 'Dr. Amina Rahal', sub: 'Clinical lead', proofTier: 2 },
  logoRow: {
    logos: ['Northgate', 'Verity Health', 'Ardent', 'Blue Meridian', 'Fold & Co', 'Halden'],
    proofTier: 1,
  },
  imageSlot: { ratio: '4/3', placeholder: 0 },
  iconFeature: {
    icon: 'ShieldCheck',
    tones: t('Clinically supervised', 'Always someone to call', 'Answers within the hour'),
    sub: 'Every plan is signed off before it starts.',
  },
  divider: {},
  faqItem: {
    text: 'Do I need a referral?',
    sub: 'No. You can book directly, and we will request your records with your consent.',
  },
  bentoCard: {
    tones: t('Measured results', 'Made for you', 'Starts this week'),
    sub: 'Tap to edit this card.',
    span: { col: 4, row: 1 },
  },
}

export function newComponent(type: ComponentType): Component {
  return comp(type, structuredClone(DEFAULTS[type]))
}

/** Deep-copies a component with fresh ids so duplicates stay independent. */
export function cloneComponent(component: Component): Component {
  return { ...structuredClone(component), id: uid('c') }
}

export function cloneSection(section: Section): Section {
  return {
    ...structuredClone(section),
    id: uid('s'),
    components: section.components.map(cloneComponent),
  }
}

const SECTION_BLUEPRINTS: Record<SectionType, ComponentType[]> = {
  hero: ['badge', 'heading', 'paragraph', 'button', 'imageSlot', 'starRating'],
  logoBar: ['subheading', 'logoRow'],
  featureGrid: ['subheading', 'heading', 'iconFeature', 'iconFeature', 'iconFeature'],
  testimonials: ['subheading', 'heading', 'quote', 'quote', 'quote'],
  pricing: ['subheading', 'heading', 'priceTag', 'priceTag', 'priceTag'],
  faq: ['subheading', 'heading', 'faqItem', 'faqItem', 'faqItem'],
  bento: ['heading', 'bentoCard', 'bentoCard', 'bentoCard', 'bentoCard'],
  ctaBanner: ['heading', 'paragraph', 'button'],
  footer: ['heading', 'listItem', 'listItem', 'listItem'],
}

/** A brand-new section that already looks like something. Never empty. */
export function newSection(type: SectionType, variant?: string): Section {
  const def = sectionDef(type)
  const components = SECTION_BLUEPRINTS[type].map(newComponent)

  if (type === 'pricing') {
    const labels = [
      { name: 'Starter', price: '$120', featured: false },
      { name: 'Standard', price: '$180', featured: true },
      { name: 'Complete', price: '$260', featured: false },
    ]
    let i = 0
    for (const c of components) {
      if (c.type !== 'priceTag') continue
      const spec = labels[i++]!
      c.props = {
        text: spec.price,
        sub: 'per session',
        featured: spec.featured,
        bullets: ['Initial assessment', 'Written plan', 'Follow-up call'],
      }
      c.props.tones = t(spec.name, spec.name, spec.name)
    }
  }

  if (type === 'bento') {
    const spans = [
      { col: 7, row: 2 },
      { col: 5, row: 1 },
      { col: 5, row: 1 },
      { col: 12, row: 1 },
    ]
    let i = 0
    for (const c of components) {
      if (c.type !== 'bentoCard') continue
      c.props.span = spans[i++] ?? { col: 4, row: 1 }
    }
  }

  return {
    id: uid('s'),
    type,
    variant: variant ?? def.variants[0]!.id,
    mood: def.defaultMood,
    meta: {
      swapSides: false,
      overlay: type === 'hero',
      overlayIntensity: 45,
      eyebrow: def.label,
      rows: type === 'bento' ? 3 : undefined,
    },
    components,
  }
}
