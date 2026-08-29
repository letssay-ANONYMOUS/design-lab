/**
 * The whole app is this file's shapes plus functions over them.
 * Everything here is JSON-serializable — a snapshot is literally a `Page`.
 */

export type Tone = 'authority' | 'warm' | 'urgent'
export const TONES: Tone[] = ['authority', 'warm', 'urgent']

/** Copy that ships in all three voices. Rendered via `resolveTone`. */
export interface ToneText {
  authority: string
  warm: string
  urgent: string
}

export type ComponentType =
  | 'badge'
  | 'heading'
  | 'subheading'
  | 'paragraph'
  | 'stat'
  | 'avatar'
  | 'button'
  | 'imageSlot'
  | 'logoRow'
  | 'starRating'
  | 'divider'
  | 'listItem'
  | 'priceTag'
  | 'iconFeature'
  | 'quote'
  | 'faqItem'
  | 'bentoCard'

export interface ComponentProps {
  /** Single-voice text. Ignored when `tones` is present. */
  text?: string
  /** Three-voice copy. Takes precedence over `text`. */
  tones?: ToneText
  /** Secondary line — supporting copy, attribution, price cadence. */
  sub?: string
  subTones?: ToneText
  /** lucide-react icon name, for `iconFeature` / `button`. */
  icon?: string
  /** Visual weight for buttons and badges. */
  emphasis?: 'primary' | 'secondary' | 'ghost'
  /** IndexedDB key for an uploaded image (see lib/images.ts). */
  imageId?: string
  /** Fallback gradient index used until an image is uploaded. */
  placeholder?: number
  /** Aspect ratio for image slots, e.g. "4/5". */
  ratio?: string
  /** 0–5, supports halves. */
  rating?: number
  /** Wordmarks for a logoRow. */
  logos?: string[]
  /** Bento / grid placement. */
  span?: { col: number; row: number }
  /** Higher tier = only shown at higher trust-density settings. */
  proofTier?: 1 | 2 | 3
  /** Marks price tables' recommended column. */
  featured?: boolean
  /** Bullet lines for pricing / feature cards. */
  bullets?: string[]
}

export interface Component {
  id: string
  type: ComponentType
  props: ComponentProps
}

export type SectionType =
  | 'hero'
  | 'logoBar'
  | 'featureGrid'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'ctaBanner'
  | 'bento'
  | 'footer'

/** Narrative weight, drives the contrast-pacing minimap. */
export type Mood = 'loud' | 'calm'

export interface SectionMeta {
  /** Hero: mirror the image/copy columns. */
  swapSides?: boolean
  /** Hero: darken the image behind the copy. */
  overlay?: boolean
  /** Hero: 0–100. */
  overlayIntensity?: number
  /** Section eyebrow shown above the heading in most variants. */
  eyebrow?: string
  /** Bento: number of rows in the grid. */
  rows?: number
}

export interface Section {
  id: string
  type: SectionType
  variant: string
  mood: Mood
  meta: SectionMeta
  tokensOverride?: Partial<Tokens>
  components: Component[]
}

export interface Palette {
  id: string
  name: string
  bg: string
  surface: string
  text: string
  muted: string
  primary: string
  primaryFg: string
  accent: string
  border: string
  /** Used by the minimap to render a section's loud/calm swatch. */
  loudBg: string
  loudText: string
}

export interface FontPair {
  id: string
  name: string
  heading: string
  body: string
  /** Heading tracking, e.g. "-0.03em". */
  tracking: string
}

export interface Tokens {
  paletteId: string
  fontPairId: string
  /** Base corner radius in px, 0–32. */
  radius: number
  /** Multiplier on section padding + gaps, 0.7–1.5. */
  spacing: number
  /** Modular scale ratio for type, 1.12–1.42. */
  typeScale: number
  /** Body size in px, 15–19. */
  baseSize: number
}

export interface Choreography {
  /** Seconds between sibling reveals, 0–0.3. */
  stagger: number
  /** px the element travels on entry, 0–80. */
  distance: number
  /** 0–100, scales the hero image parallax. */
  parallax: number
}

export interface Page {
  id: string
  name: string
  tokens: Tokens
  sections: Section[]
}

export interface Snapshot {
  id: string
  name: string
  createdAt: number
  /** data-url PNG from html-to-image. */
  thumb: string
  page: Page
}

/** Which inner component the mini-toolbar is anchored to. */
export interface Selection {
  sectionId: string
  componentId: string
}

export interface LabView {
  squint: boolean
  grid: boolean
  minimap: boolean
  /** 0–100. Scales how many proof elements render. */
  trustDensity: number
  tone: Tone
  choreo: Choreography
  /** Replay counter — bumping it remounts the canvas to re-run reveals. */
  previewNonce: number
  /** Snapshot ids for A/B compare, or null. */
  compare: [string, string] | null
  /** Pacing rail width in px. Dragged from its inner edge. */
  leftWidth: number
  /** Token panel width in px. 0 when collapsed. */
  rightWidth: number
  /** Drag-to-rearrange mode: every component becomes pick-up-able. */
  arrange: boolean
}
