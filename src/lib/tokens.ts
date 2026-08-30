import type { FontPair, Palette, Tokens } from '@/types'

/**
 * Curated palettes only. The remix button picks from this list, which is why
 * it can't produce mud — there is no random colour anywhere in the app.
 */
export const PALETTES: Palette[] = [
  {
    id: 'clinical',
    name: 'Clinical Calm',
    bg: '#ffffff',
    surface: '#f2f6fb',
    text: '#0e1a2b',
    muted: '#5b6b80',
    primary: '#1668d6',
    primaryFg: '#ffffff',
    accent: '#16b3a6',
    border: '#dde6f2',
    loudBg: '#0e1a2b',
    loudText: '#eaf2ff',
  },
  {
    id: 'roast',
    name: 'Warm Roast',
    bg: '#fbf7f1',
    surface: '#f3ebe0',
    text: '#231a13',
    muted: '#7a6a5b',
    primary: '#a4552b',
    primaryFg: '#fff8f2',
    accent: '#d99b3f',
    border: '#e8dccb',
    loudBg: '#2c1e15',
    loudText: '#f7ece0',
  },
  {
    id: 'ink',
    name: 'Retail Ink',
    bg: '#ffffff',
    surface: '#f4f4f5',
    text: '#09090b',
    muted: '#6c6c78',
    primary: '#111114',
    primaryFg: '#ffffff',
    accent: '#e0ff4f',
    border: '#e4e4e9',
    loudBg: '#09090b',
    loudText: '#fafafa',
  },
  {
    id: 'sage',
    name: 'Sage Studio',
    bg: '#f8faf7',
    surface: '#eef3ea',
    text: '#182018',
    muted: '#5f6f5e',
    primary: '#2f6b46',
    primaryFg: '#f4fbf5',
    accent: '#c2d96b',
    border: '#dde6d8',
    loudBg: '#17291d',
    loudText: '#e9f3e6',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    bg: '#fdf8f5',
    surface: '#f6e9e1',
    text: '#2a1712',
    muted: '#84645a',
    primary: '#b4442e',
    primaryFg: '#fff6f2',
    accent: '#e8a03c',
    border: '#eeddd3',
    loudBg: '#3a1c14',
    loudText: '#fbeae0',
  },
  {
    id: 'indigo',
    name: 'Indigo Night',
    bg: '#ffffff',
    surface: '#f1f0fe',
    text: '#14122b',
    muted: '#615e83',
    primary: '#4b3ce0',
    primaryFg: '#ffffff',
    accent: '#ff9ec4',
    border: '#e3e1fb',
    loudBg: '#14122b',
    loudText: '#eeecff',
  },
  {
    id: 'coastal',
    name: 'Coastal',
    bg: '#fcfcfa',
    surface: '#eaf1f2',
    text: '#101f24',
    muted: '#5a7078',
    primary: '#0f6f80',
    primaryFg: '#f2fbfc',
    accent: '#f0b429',
    border: '#dbe7e9',
    loudBg: '#0c2129',
    loudText: '#e6f4f6',
  },
  {
    id: 'dusk',
    name: 'Desert Dusk',
    bg: '#f2eee7',
    surface: '#e5ddd2',
    text: '#1b1917',
    muted: '#71685f',
    primary: '#7b402b',
    primaryFg: '#fffaf3',
    accent: '#bc8b59',
    border: '#d5cabe',
    loudBg: '#151c24',
    loudText: '#f3ede5',
  },
  {
    id: 'object',
    name: 'Object Study',
    bg: '#f3f0ea',
    surface: '#e6e1d9',
    text: '#1b1c1e',
    muted: '#696967',
    primary: '#9e452f',
    primaryFg: '#fff9f3',
    accent: '#b88957',
    border: '#d4cec5',
    loudBg: '#1b1c1f',
    loudText: '#f2eee7',
  },
  {
    id: 'instrument',
    name: 'Dark Instrument',
    bg: '#121416',
    surface: '#1b1e21',
    text: '#ece9e2',
    muted: '#9c9a94',
    primary: '#c17a2f',
    primaryFg: '#15130f',
    accent: '#d39a56',
    border: '#303438',
    loudBg: '#e8e2d7',
    loudText: '#151719',
  },
  {
    id: 'mineral',
    name: 'Mineral Sage',
    bg: '#f4f0e7',
    surface: '#e8e4d7',
    text: '#263026',
    muted: '#687064',
    primary: '#526b50',
    primaryFg: '#f9f7f0',
    accent: '#a16b3e',
    border: '#d4d1c5',
    loudBg: '#263028',
    loudText: '#f1eee5',
  },
  {
    id: 'signal',
    name: 'Signal Red',
    bg: '#f2f0eb',
    surface: '#e4e1da',
    text: '#171719',
    muted: '#676468',
    primary: '#b83e2f',
    primaryFg: '#fff8f4',
    accent: '#d2a23c',
    border: '#d1cdc5',
    loudBg: '#181719',
    loudText: '#f5f1ea',
  },
  {
    id: 'civic',
    name: 'Civic Shade',
    bg: '#fbf5e8',
    surface: '#ece5d4',
    text: '#17322c',
    muted: '#5d716a',
    primary: '#16725e',
    primaryFg: '#f7fff9',
    accent: '#d39c35',
    border: '#d8d0bc',
    loudBg: '#163c34',
    loudText: '#fbf5e8',
  },
  {
    id: 'orison',
    name: 'Orison White',
    bg: '#f5f3ef',
    surface: '#e8e5df',
    text: '#191919',
    muted: '#686764',
    primary: '#b54b2c',
    primaryFg: '#fffaf5',
    accent: '#c98155',
    border: '#d4d0c9',
    loudBg: '#1b1b1b',
    loudText: '#f5f3ef',
  },
  {
    id: 'kestrel',
    name: 'Kestrel Graphite',
    bg: '#101214',
    surface: '#191c1f',
    text: '#f0efeb',
    muted: '#999b9b',
    primary: '#b96f3f',
    primaryFg: '#15110e',
    accent: '#d09a67',
    border: '#303438',
    loudBg: '#e8e5de',
    loudText: '#151719',
  },
  {
    id: 'field',
    name: 'Field Daylight',
    bg: '#f1eee8',
    surface: '#e2ded6',
    text: '#1d1f20',
    muted: '#666a6b',
    primary: '#6d5943',
    primaryFg: '#fbf8f2',
    accent: '#b58d61',
    border: '#cfcbc2',
    loudBg: '#202326',
    loudText: '#f2eee7',
  },
]

export const FONT_PAIRS: FontPair[] = [
  {
    id: 'neutral',
    name: 'DM Sans / DM Sans',
    heading: "'DM Sans', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif",
    tracking: '-0.025em',
  },
  {
    id: 'editorial',
    name: 'Fraunces / DM Sans',
    heading: "'Fraunces', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
    tracking: '-0.015em',
  },
  {
    id: 'technical',
    name: 'Space Grotesk / DM Sans',
    heading: "'Space Grotesk', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif",
    tracking: '-0.02em',
  },
  {
    id: 'luxury',
    name: 'Playfair / DM Sans',
    heading: "'Playfair Display', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
    tracking: '-0.01em',
  },
  {
    id: 'product',
    name: 'Sora / DM Sans',
    heading: "'Sora', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif",
    tracking: '-0.03em',
  },
]

export const DEFAULT_TOKENS: Tokens = {
  paletteId: 'clinical',
  fontPairId: 'neutral',
  radius: 14,
  spacing: 1,
  typeScale: 1.25,
  baseSize: 16,
}

/** Bounds the token sliders — and the remix generator — share. */
export const TOKEN_LIMITS = {
  radius: { min: 0, max: 32, step: 1 },
  spacing: { min: 0.7, max: 1.5, step: 0.05 },
  typeScale: { min: 1.12, max: 1.42, step: 0.01 },
  baseSize: { min: 15, max: 19, step: 1 },
} as const

export function getPalette(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0]!
}

export function getFontPair(id: string): FontPair {
  return FONT_PAIRS.find((f) => f.id === id) ?? FONT_PAIRS[0]!
}

const round = (n: number) => Math.round(n * 10) / 10

/**
 * Modular type scale. Exponents are tuned so that a hero H1 lands somewhere
 * between 28px and 96px across the full ratio range — small enough to stay
 * sane, large enough to actually feel like a hero.
 */
export function typeSteps(base: number, ratio: number) {
  const at = (exp: number) => round(base * ratio ** exp)
  return {
    sm: at(-0.75),
    base: base,
    lg: at(0.9),
    h3: at(2),
    h2: at(3.4),
    h1: Math.min(96, Math.max(28, at(5))),
  }
}

/**
 * The single source of truth for how tokens become CSS. Both the live canvas
 * and the JSX exporter read from this, so what you see is what ships.
 */
export function tokensToVars(tokens: Tokens): Record<string, string> {
  const palette = getPalette(tokens.paletteId)
  const font = getFontPair(tokens.fontPairId)
  const type = typeSteps(tokens.baseSize, tokens.typeScale)
  const s = tokens.spacing

  return {
    '--dl-bg': palette.bg,
    '--dl-surface': palette.surface,
    '--dl-text': palette.text,
    '--dl-muted': palette.muted,
    '--dl-primary': palette.primary,
    '--dl-primary-fg': palette.primaryFg,
    '--dl-accent': palette.accent,
    '--dl-border': palette.border,
    '--dl-loud-bg': palette.loudBg,
    '--dl-loud-text': palette.loudText,

    '--dl-radius': `${tokens.radius}px`,
    '--dl-radius-sm': `${round(tokens.radius * 0.55)}px`,
    '--dl-radius-lg': `${round(tokens.radius * 1.7)}px`,
    '--dl-radius-pill': `${Math.max(999 * Math.sign(tokens.radius), 0)}px`,

    '--dl-gap': `${round(24 * s)}px`,
    '--dl-gap-sm': `${round(12 * s)}px`,
    '--dl-gap-lg': `${round(40 * s)}px`,
    '--dl-pad-y': `${round(96 * s)}px`,
    '--dl-pad-x': `${round(48 * s)}px`,

    '--dl-font-heading': font.heading,
    '--dl-font-body': font.body,
    '--dl-tracking-h': font.tracking,

    '--dl-size-sm': `${type.sm}px`,
    '--dl-size-base': `${type.base}px`,
    '--dl-size-lg': `${type.lg}px`,
    '--dl-size-h3': `${type.h3}px`,
    '--dl-size-h2': `${type.h2}px`,
    '--dl-size-h1': `${type.h1}px`,
  }
}

/** Merges a section's local override on top of the page tokens. */
export function effectiveTokens(page: Tokens, override?: Partial<Tokens>): Tokens {
  return override ? { ...page, ...override } : page
}
