import { passesTrustDensity, resolveTone, scaleCount } from '@/lib/content'
import { getFontPair, getPalette, tokensToVars } from '@/lib/tokens'
import type { Component, LabView, Page, Section } from '@/types'

/**
 * Emits a single self-contained .tsx file for the current page.
 *
 * Design decision: the export keeps the CSS-variable token layer instead of
 * inlining literal hex and pixel values everywhere. Tailwind arbitrary values
 * reference the vars (`text-[var(--dl-text)]`), and the vars themselves are
 * declared once on the root element. The file still drops into any Tailwind
 * project with no config, but the palette and scale stay editable in one place
 * — which is the whole point of having designed it with tokens.
 */

const H1 =
  'font-[family-name:var(--dl-font-heading)] text-[length:var(--dl-size-h1)] leading-[1.03] tracking-[var(--dl-tracking-h)] font-bold text-balance'
const H2 =
  'font-[family-name:var(--dl-font-heading)] text-[length:var(--dl-size-h2)] leading-[1.15] tracking-[var(--dl-tracking-h)] font-bold text-balance'
const H3 =
  'font-[family-name:var(--dl-font-heading)] text-[length:var(--dl-size-h3)] leading-[1.3] tracking-[var(--dl-tracking-h)] font-semibold'
const LEAD = 'text-[length:var(--dl-size-lg)] leading-[1.55]'
const BODY = 'text-[length:var(--dl-size-base)] leading-[1.6]'
const SMALL = 'text-[length:var(--dl-size-sm)] leading-[1.5]'
const EYEBROW = `${SMALL} font-semibold uppercase tracking-[0.12em]`
const SECTION = 'py-[var(--dl-pad-y)] px-[var(--dl-pad-x)]'
const CONTAINER = 'mx-auto w-full max-w-[1180px]'

const s = (value: string) => `{${JSON.stringify(value)}}`

function indent(block: string, depth: number): string {
  const pad = '  '.repeat(depth)
  return block
    .split('\n')
    .map((line) => (line.trim() ? pad + line : line))
    .join('\n')
}

function componentName(section: Section, index: number): string {
  const base = section.type.charAt(0).toUpperCase() + section.type.slice(1)
  return `${base}${index + 1}`
}

interface Ctx {
  view: LabView
  loud: boolean
}

function copy(c: Component, ctx: Ctx, field: 'text' | 'sub' | 'plain' = 'text'): string {
  if (field === 'plain') return c.props.text ?? ''
  if (field === 'sub') return resolveTone(ctx.view.tone, c.props.subTones, c.props.sub)
  return resolveTone(ctx.view.tone, c.props.tones, c.props.text)
}

const textColor = (ctx: Ctx) => (ctx.loud ? 'text-[var(--dl-loud-text)]' : 'text-[var(--dl-text)]')
const mutedColor = (ctx: Ctx) =>
  ctx.loud ? 'text-[var(--dl-loud-text)]/80' : 'text-[var(--dl-muted)]'

/* --------------------------------- atoms --------------------------------- */

function emitBadge(c: Component, ctx: Ctx): string {
  const border = ctx.loud
    ? 'border-[var(--dl-loud-text)]/30 bg-[var(--dl-loud-text)]/10 text-[var(--dl-loud-text)]'
    : 'border-[var(--dl-primary)]/28 bg-[var(--dl-primary)]/8 text-[var(--dl-primary)]'
  return `<span className="inline-flex w-fit items-center rounded-[var(--dl-radius-pill)] border px-3 py-1.5 ${SMALL} font-semibold uppercase tracking-[0.04em] ${border}">
  ${s(copy(c, ctx))}
</span>`
}

function emitHeading(c: Component, ctx: Ctx, level: 1 | 2 | 3 = 1): string {
  const cls = level === 1 ? H1 : level === 2 ? H2 : H3
  const tag = `h${level}`
  return `<${tag} className="${cls} ${textColor(ctx)}">${s(copy(c, ctx))}</${tag}>`
}

function emitParagraph(c: Component, ctx: Ctx, size = LEAD): string {
  return `<p className="${size} ${mutedColor(ctx)} max-w-[62ch]">${s(copy(c, ctx))}</p>`
}

function emitButton(c: Component, ctx: Ctx): string {
  const emphasis = c.props.emphasis ?? 'primary'
  const skin =
    emphasis === 'primary'
      ? ctx.loud
        ? 'bg-[var(--dl-loud-text)] text-[var(--dl-loud-bg)]'
        : 'bg-[var(--dl-primary)] text-[var(--dl-primary-fg)] shadow-[0_8px_22px_-12px_rgba(0,0,0,.45)]'
      : emphasis === 'secondary'
        ? 'bg-[var(--dl-surface)] text-[var(--dl-text)] border border-[var(--dl-border)]'
        : ctx.loud
          ? 'border border-[var(--dl-loud-text)]/30 text-[var(--dl-loud-text)]'
          : 'border border-[var(--dl-primary)]/25 text-[var(--dl-primary)]'
  return `<button type="button" className="inline-flex items-center justify-center rounded-[var(--dl-radius)] px-6 py-3.5 ${BODY} font-semibold transition-transform duration-150 hover:-translate-y-px ${skin}">
  ${s(copy(c, ctx))}
</button>`
}

function emitImage(c: Component, ratio?: string): string {
  const fills = [
    'linear-gradient(135deg, color-mix(in oklab, var(--dl-primary) 82%, black), color-mix(in oklab, var(--dl-accent) 55%, var(--dl-surface)))',
    'linear-gradient(200deg, color-mix(in oklab, var(--dl-accent) 70%, var(--dl-surface)), color-mix(in oklab, var(--dl-primary) 60%, black))',
    'linear-gradient(160deg, color-mix(in oklab, var(--dl-text) 88%, var(--dl-primary)), color-mix(in oklab, var(--dl-primary) 45%, var(--dl-surface)))',
    'linear-gradient(45deg, color-mix(in oklab, var(--dl-surface) 60%, var(--dl-primary)), color-mix(in oklab, var(--dl-accent) 45%, white))',
    'linear-gradient(120deg, color-mix(in oklab, var(--dl-primary) 40%, var(--dl-surface)), color-mix(in oklab, var(--dl-text) 70%, var(--dl-primary)))',
    'radial-gradient(120% 120% at 20% 10%, color-mix(in oklab, var(--dl-accent) 65%, white), color-mix(in oklab, var(--dl-primary) 75%, black))',
    'linear-gradient(180deg, color-mix(in oklab, var(--dl-surface) 70%, var(--dl-accent)), color-mix(in oklab, var(--dl-primary) 55%, var(--dl-text)))',
    'linear-gradient(300deg, color-mix(in oklab, var(--dl-text) 92%, black), color-mix(in oklab, var(--dl-primary) 65%, var(--dl-accent)))',
  ]
  const fill = fills[(c.props.placeholder ?? 0) % fills.length]!
  const aspect = ratio ?? c.props.ratio ?? '4/3'
  return `{/* Swap this for an <img> — aspect ${aspect} */}
<div
  className="w-full overflow-hidden rounded-[var(--dl-radius-lg)]"
  style={{ aspectRatio: ${JSON.stringify(aspect)}, background: ${JSON.stringify(fill)} }}
/>`
}

function emitStars(c: Component, ctx: Ctx): string {
  const filled = Math.round(c.props.rating ?? 5)
  return `<div className="flex items-center gap-2.5">
  <span className="flex gap-0.5 text-[var(--dl-accent)]">
    {Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < ${filled} ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" opacity={i < ${filled} ? 1 : 0.35}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </span>
  <span className="${SMALL} font-medium ${mutedColor(ctx)}">${s(copy(c, ctx, 'sub'))}</span>
</div>`
}

function emitStat(c: Component, ctx: Ctx): string {
  return `<div className="flex flex-col gap-1">
  <span className="${H2} ${ctx.loud ? 'text-[var(--dl-loud-text)]' : 'text-[var(--dl-primary)]'} leading-none">${s(copy(c, ctx))}</span>
  <span className="${SMALL} ${mutedColor(ctx)}">${s(copy(c, ctx, 'sub'))}</span>
</div>`
}

function emitQuote(c: Component, ctx: Ctx): string {
  const skin = ctx.loud
    ? 'bg-[var(--dl-loud-text)]/8 border-[var(--dl-loud-text)]/16'
    : 'bg-[var(--dl-surface)] border-[var(--dl-border)]'
  return `<figure className="m-0 flex flex-col gap-[var(--dl-gap-sm)] rounded-[var(--dl-radius)] border p-[var(--dl-gap)] ${skin}">
  <blockquote className="m-0 ${LEAD} font-[family-name:var(--dl-font-heading)] font-medium tracking-[-0.01em] ${textColor(ctx)}">
    ${s(copy(c, ctx))}
  </blockquote>
  <figcaption className="${SMALL} font-semibold ${mutedColor(ctx)}">${s(copy(c, ctx, 'sub'))}</figcaption>
</figure>`
}

function emitFeature(c: Component, ctx: Ctx): string {
  const chip = ctx.loud
    ? 'bg-[var(--dl-loud-text)]/14 text-[var(--dl-loud-text)]'
    : 'bg-[var(--dl-primary)]/10 text-[var(--dl-primary)]'
  return `<div className="flex flex-col gap-[var(--dl-gap-sm)]">
  <span className="flex h-11 w-11 items-center justify-center rounded-[var(--dl-radius-sm)] ${chip}">
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.1 5.6L20 10l-5.9 1.4L12 17l-2.1-5.6L4 10l5.9-1.4L12 3z" />
    </svg>
  </span>
  <div className="flex flex-col gap-1.5">
    <h3 className="${H3} ${textColor(ctx)}">${s(copy(c, ctx))}</h3>
    <p className="${BODY} ${mutedColor(ctx)}">${s(copy(c, ctx, 'sub'))}</p>
  </div>
</div>`
}

function emitFaq(c: Component, ctx: Ctx): string {
  return `<div className="flex flex-col gap-2 border-b border-[var(--dl-border)] py-[var(--dl-gap)] last:border-b-0">
  <h3 className="${H3} ${textColor(ctx)}">${s(copy(c, ctx))}</h3>
  <p className="${BODY} ${mutedColor(ctx)} max-w-[68ch]">${s(copy(c, ctx, 'sub'))}</p>
</div>`
}

function emitPrice(c: Component, ctx: Ctx): string {
  const featured = c.props.featured
  const skin = featured
    ? 'bg-[var(--dl-loud-bg)] text-[var(--dl-loud-text)] shadow-[0_24px_60px_-30px_rgba(0,0,0,.55)]'
    : 'bg-[var(--dl-surface)] border border-[var(--dl-border)]'
  const bullets = (c.props.bullets ?? [])
    .map(
      (bullet) =>
        `<li className="flex items-start gap-2.5 ${BODY} ${featured ? 'text-[var(--dl-loud-text)]/85' : mutedColor(ctx)}">
  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--dl-accent)]" />
  ${s(bullet)}
</li>`,
    )
    .join('\n')

  return `<div className="flex h-full flex-col gap-[var(--dl-gap)] rounded-[var(--dl-radius-lg)] p-[var(--dl-gap-lg)] ${skin}">
  <div className="flex flex-col gap-2.5">
    <span className="${EYEBROW} ${featured ? 'text-[var(--dl-loud-text)]/70' : mutedColor(ctx)}">${s(copy(c, ctx))}</span>
    <span className="${H2} leading-none ${featured ? 'text-[var(--dl-loud-text)]' : textColor(ctx)}">${s(copy(c, ctx, 'plain'))}</span>
    <span className="${SMALL} ${featured ? 'text-[var(--dl-loud-text)]/70' : mutedColor(ctx)}">${s(copy(c, ctx, 'sub'))}</span>
  </div>
${bullets ? indent(`<ul className="m-0 flex flex-1 list-none flex-col gap-2.5 p-0">\n${indent(bullets, 1)}\n</ul>`, 1) : ''}
</div>`
}

function emitLogos(c: Component, ctx: Ctx, count: number): string {
  const logos = (c.props.logos ?? []).slice(0, Math.max(2, count))
  const items = logos
    .map(
      (logo) =>
        `<span className="font-[family-name:var(--dl-font-heading)] ${BODY} font-semibold opacity-55 ${textColor(ctx)}">${s(logo)}</span>`,
    )
    .join('\n')
  return `<div className="flex flex-wrap items-center justify-center gap-x-[var(--dl-gap-lg)] gap-y-[var(--dl-gap)]">
${indent(items, 1)}
</div>`
}

/* -------------------------------- sections -------------------------------- */

function group(section: Section, view: LabView) {
  const visible = section.components.filter((c) => passesTrustDensity(c, view.trustDensity))
  const of = (type: Component['type']) => visible.filter((c) => c.type === type)
  return {
    badges: of('badge'),
    headings: of('heading'),
    subheadings: of('subheading'),
    paragraphs: of('paragraph'),
    buttons: of('button'),
    images: of('imageSlot'),
    stars: of('starRating'),
    stats: of('stat'),
    logoRows: of('logoRow'),
    quotes: of('quote'),
    features: of('iconFeature'),
    prices: of('priceTag'),
    faqs: of('faqItem'),
    cards: of('bentoCard'),
    listItems: of('listItem'),
  }
}

function join(blocks: string[], depth = 1): string {
  return blocks.filter(Boolean).map((block) => indent(block, depth)).join('\n')
}

function emitHeader(
  g: ReturnType<typeof group>,
  ctx: Ctx,
  align: 'left' | 'center',
): string {
  const parts = [
    ...g.subheadings.map(
      (c) =>
        `<span className="${EYEBROW} ${ctx.loud ? 'text-[var(--dl-loud-text)]/80' : 'text-[var(--dl-primary)]'}">${s(copy(c, ctx))}</span>`,
    ),
    ...g.headings.map((c) => emitHeading(c, ctx, 2)),
    ...g.paragraphs.map((c) => emitParagraph(c, ctx)),
  ]
  if (parts.length === 0) return ''
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto max-w-[760px]' : 'items-start max-w-[720px]'
  return `<div className="mb-[var(--dl-gap-lg)] flex flex-col gap-[var(--dl-gap-sm)] ${alignment}">
${join(parts)}
</div>`
}

function emitSection(section: Section, view: LabView): string {
  const ctx: Ctx = { view, loud: section.mood === 'loud' }
  const g = group(section, view)
  const bg = ctx.loud
    ? 'bg-[var(--dl-loud-bg)] text-[var(--dl-loud-text)]'
    : 'bg-[var(--dl-bg)] text-[var(--dl-text)]'

  const copyStack = (align: 'left' | 'center') =>
    join(
      [
        ...g.badges.map((c) => emitBadge(c, ctx)),
        ...g.headings.map((c) => emitHeading(c, ctx, 1)),
        ...g.paragraphs.map((c) => emitParagraph(c, ctx)),
        g.buttons.length
          ? `<div className="flex flex-wrap gap-[var(--dl-gap-sm)] ${align === 'center' ? 'justify-center' : ''}">
${join(g.buttons.map((c) => emitButton(c, ctx)))}
</div>`
          : '',
        ...g.stars.map((c) => emitStars(c, ctx)),
        g.stats.length
          ? `<div className="flex flex-wrap gap-[var(--dl-gap-lg)]">
${join(g.stats.map((c) => emitStat(c, ctx)))}
</div>`
          : '',
      ],
      2,
    )

  switch (section.type) {
    case 'hero': {
      const image = g.images[0]
      if (section.variant === 'fullBleed') {
        const alpha = ((section.meta.overlayIntensity ?? 45) / 100) * 0.88
        return `<section className="relative isolate overflow-hidden bg-[var(--dl-loud-bg)] text-[var(--dl-loud-text)]">
${image ? indent(`<div className="absolute inset-0 -z-20 scale-110">\n${indent(emitImage(image, 'auto'), 1)}\n</div>`, 1) : ''}
  <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,${(alpha + 0.18).toFixed(2)}), rgba(0,0,0,${alpha.toFixed(2)}))' }} />
  <div className="${SECTION} flex min-h-[72vh] items-end">
    <div className="${CONTAINER}">
      <div className="flex max-w-[680px] flex-col gap-[var(--dl-gap)]">
${copyStack('left')}
      </div>
    </div>
  </div>
</section>`
      }
      if (section.variant === 'centered' || section.variant === 'minimal') {
        return `<section className="${SECTION} ${bg}">
  <div className="${CONTAINER} flex flex-col">
    <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-[var(--dl-gap)] text-center">
${copyStack('center')}
    </div>
${image && section.variant === 'centered' ? indent(`<div className="mt-[var(--dl-pad-y)]">\n${indent(emitImage(image, '16/9'), 1)}\n</div>`, 2) : ''}
  </div>
</section>`
      }
      const swap = section.meta.swapSides
      return `<section className="${SECTION} ${bg}">
  <div className="${CONTAINER} grid items-center gap-[var(--dl-gap-lg)] md:grid-cols-2">
    <div className="flex flex-col items-start gap-[var(--dl-gap)] ${swap ? 'md:order-2' : ''}">
${copyStack('left')}
    </div>
${image ? indent(`<div className="${swap ? 'md:order-1' : ''}">\n${indent(emitImage(image, image.props.ratio ?? '4/5'), 1)}\n</div>`, 2) : ''}
  </div>
</section>`
    }

    case 'logoBar': {
      const row = g.logoRows[0]
      const count = row ? scaleCount(view.trustDensity, 3, row.props.logos?.length ?? 6) : 0
      return `<section className="px-[var(--dl-pad-x)] py-[calc(var(--dl-pad-y)*0.5)] ${bg}">
  <div className="${CONTAINER} flex flex-col">
${g.subheadings[0] ? indent(`<p className="mb-[var(--dl-gap)] text-center ${EYEBROW} ${mutedColor(ctx)}">${s(copy(g.subheadings[0], ctx))}</p>`, 2) : ''}
${row ? indent(emitLogos(row, ctx, count), 2) : ''}
  </div>
</section>`
    }

    case 'featureGrid': {
      const cols = Math.min(3, Math.max(1, g.features.length))
      const centered = section.variant === 'cards'
      return `<section className="${SECTION} ${bg}">
  <div className="${CONTAINER}">
${indent(emitHeader(g, ctx, centered ? 'center' : 'left'), 2)}
    <div className="grid gap-[var(--dl-gap)] md:grid-cols-${cols}">
${join(
  g.features.map(
    (c) =>
      `<div className="h-full rounded-[var(--dl-radius)] border p-[var(--dl-gap)] ${
        ctx.loud
          ? 'border-[var(--dl-loud-text)]/14 bg-[var(--dl-loud-text)]/7'
          : 'border-[var(--dl-border)] bg-[var(--dl-surface)]'
      }">
${indent(emitFeature(c, ctx), 1)}
</div>`,
  ),
  3,
)}
    </div>
  </div>
</section>`
    }

    case 'testimonials': {
      const cols = section.variant === 'grid' ? 2 : Math.min(3, Math.max(1, g.quotes.length))
      return `<section className="${SECTION} ${bg}">
  <div className="${CONTAINER}">
${indent(emitHeader(g, ctx, section.variant === 'cards' ? 'center' : 'left'), 2)}
    <div className="grid items-start gap-[var(--dl-gap)] md:grid-cols-${cols}">
${join(g.quotes.map((c) => emitQuote(c, ctx)), 3)}
    </div>
${
  g.stats.length
    ? indent(
        `<div className="mt-[var(--dl-gap-lg)] grid gap-[var(--dl-gap)] border-t border-[var(--dl-border)] pt-[var(--dl-gap-lg)] md:grid-cols-${g.stats.length}">
${join(g.stats.map((c) => emitStat(c, ctx)), 1)}
</div>`,
        2,
      )
    : ''
}
  </div>
</section>`
    }

    case 'pricing':
      return `<section className="${SECTION} ${bg}">
  <div className="${CONTAINER}">
${indent(emitHeader(g, ctx, 'center'), 2)}
    <div className="grid items-stretch gap-[var(--dl-gap)] md:grid-cols-${Math.min(3, Math.max(1, g.prices.length))}">
${join(g.prices.map((c) => emitPrice(c, ctx)), 3)}
    </div>
  </div>
</section>`

    case 'faq':
      return `<section className="${SECTION} ${bg}">
  <div className="${CONTAINER} max-w-[860px]">
${indent(emitHeader(g, ctx, 'left'), 2)}
    <div className="flex flex-col border-t border-[var(--dl-border)]">
${join(g.faqs.map((c) => emitFaq(c, ctx)), 3)}
    </div>
  </div>
</section>`

    case 'bento':
      return `<section className="${SECTION} ${bg}">
  <div className="${CONTAINER}">
${indent(emitHeader(g, ctx, 'left'), 2)}
    <div className="grid auto-rows-[minmax(148px,auto)] grid-cols-12 gap-[var(--dl-gap-sm)]">
${join(
  g.cards.map((c) => {
    const span = c.props.span ?? { col: 4, row: 1 }
    const skin = ctx.loud
      ? 'border-[var(--dl-loud-text)]/16 bg-[var(--dl-loud-text)]/8'
      : 'border-[var(--dl-border)] bg-[var(--dl-surface)]'
    return `<div className="flex flex-col overflow-hidden rounded-[var(--dl-radius)] border ${skin}" style={{ gridColumn: 'span ${span.col}', gridRow: 'span ${span.row}' }}>
  <div className="flex flex-col gap-1.5 p-[var(--dl-gap)]">
    <h3 className="${H3} ${textColor(ctx)}">${s(copy(c, ctx))}</h3>
    <p className="${BODY} ${mutedColor(ctx)}">${s(copy(c, ctx, 'sub'))}</p>
  </div>
</div>`
  }),
  3,
)}
    </div>
  </div>
</section>`

    case 'ctaBanner': {
      const panel = section.variant === 'panel'
      const inner = join(
        [
          ...g.badges.map((c) => emitBadge(c, ctx)),
          ...g.headings.map((c) => emitHeading(c, ctx, 2)),
          ...g.paragraphs.map((c) => emitParagraph(c, ctx)),
          g.buttons.length
            ? `<div className="mt-[var(--dl-gap-sm)] flex flex-wrap justify-center gap-[var(--dl-gap-sm)]">
${join(g.buttons.map((c) => emitButton(c, ctx)))}
</div>`
            : '',
        ],
        3,
      )
      if (panel) {
        return `<section className="${SECTION} bg-[var(--dl-bg)]">
  <div className="${CONTAINER} flex flex-col items-center gap-[var(--dl-gap-sm)] rounded-[var(--dl-radius-lg)] px-[var(--dl-pad-x)] py-[calc(var(--dl-pad-y)*0.7)] text-center ${
    ctx.loud
      ? 'bg-[var(--dl-loud-bg)] text-[var(--dl-loud-text)]'
      : 'border border-[var(--dl-border)] bg-[var(--dl-surface)]'
  }">
${inner}
  </div>
</section>`
      }
      return `<section className="${SECTION} ${bg}">
  <div className="${CONTAINER} flex flex-col items-center gap-[var(--dl-gap-sm)] text-center">
${inner}
  </div>
</section>`
    }

    case 'footer':
      return `<footer className="${SECTION} ${
        ctx.loud
          ? 'bg-[var(--dl-loud-bg)] text-[var(--dl-loud-text)]'
          : 'bg-[var(--dl-surface)] text-[var(--dl-text)]'
      }">
  <div className="${CONTAINER} grid gap-[var(--dl-gap-lg)] md:grid-cols-2">
    <div className="flex flex-col gap-[var(--dl-gap-sm)]">
${g.headings[0] ? indent(emitHeading(g.headings[0], ctx, 3), 3) : ''}
${join(g.paragraphs.map((c) => emitParagraph(c, ctx, BODY)), 3)}
    </div>
    <nav className="grid content-start gap-2.5 md:grid-cols-3">
${join(
  g.listItems.map((c) => `<span className="${BODY} ${mutedColor(ctx)}">${s(copy(c, ctx))}</span>`),
  3,
)}
    </nav>
  </div>
</footer>`
  }
}

/* ---------------------------------- file ---------------------------------- */

export function generatePageJsx(page: Page, view: LabView): string {
  const palette = getPalette(page.tokens.paletteId)
  const fonts = getFontPair(page.tokens.fontPairId)
  const vars = tokensToVars(page.tokens)

  const varLines = Object.entries(vars)
    .map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)},`)
    .join('\n')

  const bodies = page.sections
    .map((section, i) => {
      const jsx = emitSection(section, view)
      return `function ${componentName(section, i)}() {
  return (
${indent(jsx, 2)}
  )
}`
    })
    .join('\n\n')

  const calls = page.sections
    .map((section, i) => `      <${componentName(section, i)} />`)
    .join('\n')

  return `/**
 * ${page.name}
 * Generated by Design Lab — ${new Date().toISOString().slice(0, 10)}
 *
 * Palette:  ${palette.name}
 * Fonts:    ${fonts.name}
 * Voice:    ${view.tone}
 * Trust:    ${view.trustDensity}/100
 *
 * Self-contained: needs Tailwind and nothing else. Design tokens are declared
 * once on the root element below, so restyling the whole page means editing
 * this one object.
 *
 * Fonts used: ${fonts.heading} / ${fonts.body}
 * Load them from Google Fonts (or swap for your own) before shipping.
 */
import type { CSSProperties } from 'react'

const tokens = {
${varLines}
} as CSSProperties

export default function ${page.name.replace(/[^a-zA-Z0-9]/g, '') || 'GeneratedPage'}Page() {
  return (
    <div style={tokens} className="font-[family-name:var(--dl-font-body)] bg-[var(--dl-bg)] text-[var(--dl-text)] antialiased">
${calls}
    </div>
  )
}

${bodies}
`
}
