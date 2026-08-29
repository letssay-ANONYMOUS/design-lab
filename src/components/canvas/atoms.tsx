import { Editable } from '@/components/canvas/Editable'
import { useIsStatic, useSectionId } from '@/components/canvas/SectionContext'
import { useEditableNode, useNode } from '@/components/canvas/useNode'
import { cn } from '@/lib/cn'
import { resolveTone } from '@/lib/content'
import { pickImage, useImageUrl } from '@/lib/images'
import { useLab } from '@/store/useLab'
import type { Component } from '@/types'
import * as Icons from 'lucide-react'
import { Star } from 'lucide-react'
import type { CSSProperties, ElementType } from 'react'

/* ------------------------------------------------------------------ *
 * Shared plumbing
 * ------------------------------------------------------------------ */

export type Size = 'sm' | 'base' | 'lg' | 'h3' | 'h2' | 'h1'

const SIZE_VAR: Record<Size, string> = {
  sm: 'var(--dl-size-sm)',
  base: 'var(--dl-size-base)',
  lg: 'var(--dl-size-lg)',
  h3: 'var(--dl-size-h3)',
  h2: 'var(--dl-size-h2)',
  h1: 'var(--dl-size-h1)',
}

const LEADING: Record<Size, string> = {
  sm: '1.5',
  base: '1.6',
  lg: '1.55',
  h3: '1.3',
  h2: '1.15',
  h1: '1.03',
}

type ColorRole = 'text' | 'muted' | 'primary' | 'accent' | 'inherit' | 'loud'

const COLOR_VAR: Record<ColorRole, string | undefined> = {
  text: 'var(--dl-text)',
  muted: 'var(--dl-muted)',
  primary: 'var(--dl-primary)',
  accent: 'var(--dl-accent)',
  loud: 'var(--dl-loud-text)',
  inherit: undefined,
}

/**
 * Which string an atom is showing.
 *  `text`  — the tone-aware headline (three voices when the preset supplies them)
 *  `sub`   — the tone-aware supporting line
 *  `plain` — `props.text` verbatim, never tone-swapped. Used where a component
 *            carries both a name and a literal value, like a price tag whose
 *            three voices name the plan while `text` holds "AED 2,900".
 */
export type CopyField = 'text' | 'sub' | 'plain'

/** Reads the right voice for a component, honouring the global tone swapper. */
function useCopy(component: Component, field: CopyField = 'text'): string {
  const tone = useLab((s) => s.view.tone)
  if (field === 'plain') return component.props.text ?? ''
  if (field === 'sub') {
    return resolveTone(tone, component.props.subTones, component.props.sub)
  }
  return resolveTone(tone, component.props.tones, component.props.text)
}

/**
 * Writes an inline edit back into the model.
 *
 * When a component ships three voices we only overwrite the one on screen —
 * silently rewriting all three would destroy the copy the preset author wrote,
 * and the mini-toolbar offers an explicit "sync voices" action for that.
 */
function useCommitCopy(component: Component, field: CopyField = 'text') {
  const sectionId = useSectionId()
  const tone = useLab((s) => s.view.tone)
  const update = useLab((s) => s.updateComponent)

  return (next: string) => {
    if (field === 'plain') {
      update(sectionId, component.id, { text: next })
      return
    }
    const tonesKey = field === 'sub' ? 'subTones' : 'tones'
    const plainKey = field === 'sub' ? 'sub' : 'text'
    const existing = field === 'sub' ? component.props.subTones : component.props.tones
    if (existing) {
      update(sectionId, component.id, { [tonesKey]: { ...existing, [tone]: next } })
    } else {
      update(sectionId, component.id, { [plainKey]: next })
    }
  }
}

/* ------------------------------------------------------------------ *
 * Text
 * ------------------------------------------------------------------ */

interface CTextProps {
  c: Component
  as?: ElementType
  size?: Size
  color?: ColorRole
  weight?: number
  field?: CopyField
  className?: string
  style?: CSSProperties
  heading?: boolean
  balance?: boolean
}

export function CText({
  c,
  as = 'p',
  size = 'base',
  color = 'text',
  weight,
  field = 'text',
  className,
  style,
  heading = false,
  balance = false,
}: CTextProps) {
  const value = useCopy(c, field)
  const commit = useCommitCopy(c, field)
  const { node, editing } = useEditableNode(c.id, field)

  return (
    <Editable
      as={as}
      value={value}
      editing={editing}
      onCommit={commit}
      className={cn('m-0', className)}
      nodeProps={node}
      style={{
        fontFamily: heading ? 'var(--dl-font-heading)' : 'var(--dl-font-body)',
        fontSize: SIZE_VAR[size],
        lineHeight: LEADING[size],
        letterSpacing: heading ? 'var(--dl-tracking-h)' : undefined,
        fontWeight: weight ?? (heading ? 700 : 400),
        color: COLOR_VAR[color],
        textWrap: balance ? 'balance' : undefined,
        ...style,
      }}
    />
  )
}

export function CBadge({ c, loud = false }: { c: Component; loud?: boolean }) {
  const value = useCopy(c)
  const commit = useCommitCopy(c)
  const { node, editing } = useEditableNode(c.id)

  return (
    <Editable
      as="span"
      value={value}
      editing={editing}
      onCommit={commit}
      nodeProps={node}
      className="inline-flex w-fit items-center"
      style={{
        fontFamily: 'var(--dl-font-body)',
        fontSize: 'var(--dl-size-sm)',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        padding: '6px 12px',
        borderRadius: 'var(--dl-radius-pill)',
        border: '1px solid',
        borderColor: loud
          ? 'color-mix(in oklab, var(--dl-loud-text) 30%, transparent)'
          : 'color-mix(in oklab, var(--dl-primary) 28%, transparent)',
        background: loud
          ? 'color-mix(in oklab, var(--dl-loud-text) 12%, transparent)'
          : 'color-mix(in oklab, var(--dl-primary) 8%, transparent)',
        color: loud ? 'var(--dl-loud-text)' : 'var(--dl-primary)',
      }}
    />
  )
}

/* ------------------------------------------------------------------ *
 * Actions
 * ------------------------------------------------------------------ */

export function CButton({
  c,
  loud = false,
  block = false,
}: {
  c: Component
  loud?: boolean
  block?: boolean
}) {
  const value = useCopy(c)
  const commit = useCommitCopy(c)
  const { node, editing } = useEditableNode(c.id)
  const emphasis = c.props.emphasis ?? 'primary'

  const base: CSSProperties = {
    fontFamily: 'var(--dl-font-body)',
    fontSize: 'var(--dl-size-base)',
    fontWeight: 600,
    padding: '13px 24px',
    borderRadius: 'var(--dl-radius)',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s, background .18s',
    width: block ? '100%' : undefined,
    textAlign: 'center',
  }

  const skin: CSSProperties =
    emphasis === 'primary'
      ? {
          background: loud ? 'var(--dl-loud-text)' : 'var(--dl-primary)',
          color: loud ? 'var(--dl-loud-bg)' : 'var(--dl-primary-fg)',
          boxShadow: '0 1px 2px rgba(0,0,0,.12), 0 8px 22px -12px rgba(0,0,0,.45)',
        }
      : emphasis === 'secondary'
        ? {
            background: loud ? 'transparent' : 'var(--dl-surface)',
            color: loud ? 'var(--dl-loud-text)' : 'var(--dl-text)',
            borderColor: loud
              ? 'color-mix(in oklab, var(--dl-loud-text) 35%, transparent)'
              : 'var(--dl-border)',
          }
        : {
            background: 'transparent',
            color: loud ? 'var(--dl-loud-text)' : 'var(--dl-primary)',
            borderColor: loud
              ? 'color-mix(in oklab, var(--dl-loud-text) 28%, transparent)'
              : 'color-mix(in oklab, var(--dl-primary) 25%, transparent)',
          }

  return (
    <Editable
      as="span"
      value={value}
      editing={editing}
      onCommit={commit}
      nodeProps={node}
      className="dl-btn inline-flex items-center justify-center select-none"
      style={{ ...base, ...skin }}
    />
  )
}

export function CPriceTag({ c, loud = false }: { c: Component; loud?: boolean }) {
  const node = useNode(c.id)
  return (
    <div {...node} className="flex items-baseline" style={{ gap: '8px' }}>
      <CText
        c={c}
        as="span"
        size="h2"
        heading
        color={loud ? 'loud' : 'text'}
        style={{ lineHeight: 1 }}
      />
      <CText c={c} field="sub" as="span" size="sm" color={loud ? 'loud' : 'muted'} />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Media
 * ------------------------------------------------------------------ */

/**
 * Placeholder fills are mixed from the live palette, so an un-uploaded slot
 * still reads as part of the design instead of a grey hole.
 */
const PLACEHOLDERS = [
  'linear-gradient(135deg, color-mix(in oklab, var(--dl-primary) 82%, black), color-mix(in oklab, var(--dl-accent) 55%, var(--dl-surface)))',
  'linear-gradient(200deg, color-mix(in oklab, var(--dl-accent) 70%, var(--dl-surface)), color-mix(in oklab, var(--dl-primary) 60%, black))',
  'linear-gradient(160deg, color-mix(in oklab, var(--dl-text) 88%, var(--dl-primary)), color-mix(in oklab, var(--dl-primary) 45%, var(--dl-surface)))',
  'linear-gradient(45deg, color-mix(in oklab, var(--dl-surface) 60%, var(--dl-primary)), color-mix(in oklab, var(--dl-accent) 45%, white))',
  'linear-gradient(120deg, color-mix(in oklab, var(--dl-primary) 40%, var(--dl-surface)), color-mix(in oklab, var(--dl-text) 70%, var(--dl-primary)))',
  'radial-gradient(120% 120% at 20% 10%, color-mix(in oklab, var(--dl-accent) 65%, white), color-mix(in oklab, var(--dl-primary) 75%, black))',
  'linear-gradient(180deg, color-mix(in oklab, var(--dl-surface) 70%, var(--dl-accent)), color-mix(in oklab, var(--dl-primary) 55%, var(--dl-text)))',
  'linear-gradient(300deg, color-mix(in oklab, var(--dl-text) 92%, black), color-mix(in oklab, var(--dl-primary) 65%, var(--dl-accent)))',
]

export function CImage({
  c,
  className,
  style,
  ratio,
  rounded = 'lg',
}: {
  c: Component
  className?: string
  style?: CSSProperties
  ratio?: string
  rounded?: 'sm' | 'md' | 'lg' | 'none'
}) {
  const node = useNode(c.id)
  const isStatic = useIsStatic()
  const url = useImageUrl(c.props.imageId)
  const sectionId = useSectionId()
  const update = useLab((s) => s.updateComponent)
  const fill = PLACEHOLDERS[(c.props.placeholder ?? 0) % PLACEHOLDERS.length]!

  const upload = () => {
    void pickImage().then((imageId) => {
      if (imageId) update(sectionId, c.id, { imageId })
    })
  }

  /* An empty slot is a call to action, so one click opens the picker. Once it
   * holds a photo, clicking only selects — re-prompting for a file every time
   * you tried to nudge the layout got old fast. Double-click always replaces. */
  const handlers = isStatic
    ? {}
    : {
        onClick: (event: React.MouseEvent) => {
          node.onClick?.(event)
          if (!c.props.imageId) upload()
        },
        onDoubleClick: (event: React.MouseEvent) => {
          event.stopPropagation()
          upload()
        },
      }
  const radius =
    rounded === 'none'
      ? '0'
      : rounded === 'sm'
        ? 'var(--dl-radius-sm)'
        : rounded === 'md'
          ? 'var(--dl-radius)'
          : 'var(--dl-radius-lg)'

  return (
    <div
      {...node}
      {...handlers}
      className={cn(
        'relative overflow-hidden bg-cover bg-center',
        !isStatic && !c.props.imageId && 'cursor-pointer',
        className,
      )}
      style={{
        aspectRatio: ratio ?? c.props.ratio ?? '4/3',
        borderRadius: radius,
        background: url ? undefined : fill,
        backgroundImage: url ? `url(${url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style,
      }}
    >
      {!url && !isStatic && (
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-center"
          style={{
            fontFamily: 'var(--dl-font-body)',
            fontSize: 'var(--dl-size-sm)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,.72)',
            textShadow: '0 1px 8px rgba(0,0,0,.35)',
          }}
        >
          Click to upload
        </span>
      )}
    </div>
  )
}

export function CIconFeature({
  c,
  loud = false,
  layout = 'stack',
}: {
  c: Component
  loud?: boolean
  layout?: 'stack' | 'row'
}) {
  const node = useNode(c.id)
  const iconName = (c.props.icon ?? 'Sparkles') as keyof typeof Icons
  const Ico = (Icons[iconName] ?? Icons.Sparkles) as typeof Icons.Sparkles

  return (
    <div
      {...node}
      className={cn('flex', layout === 'row' ? 'flex-row items-start' : 'flex-col')}
      style={{ gap: 'var(--dl-gap-sm)' }}
    >
      <span
        className="flex shrink-0 items-center justify-center"
        style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--dl-radius-sm)',
          background: loud
            ? 'color-mix(in oklab, var(--dl-loud-text) 14%, transparent)'
            : 'color-mix(in oklab, var(--dl-primary) 10%, transparent)',
          color: loud ? 'var(--dl-loud-text)' : 'var(--dl-primary)',
        }}
      >
        <Ico size={21} strokeWidth={1.9} />
      </span>
      <div className="flex flex-col" style={{ gap: '6px' }}>
        <CText c={c} as="h3" size="lg" heading weight={650} color={loud ? 'loud' : 'text'} />
        <CText c={c} field="sub" as="p" size="base" color={loud ? 'loud' : 'muted'} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Proof
 * ------------------------------------------------------------------ */

export function CStars({ c, loud = false }: { c: Component; loud?: boolean }) {
  const node = useNode(c.id)
  const rating = c.props.rating ?? 5
  return (
    <div {...node} className="flex items-center" style={{ gap: '10px' }}>
      <span className="flex" style={{ gap: '2px', color: 'var(--dl-accent)' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            strokeWidth={1.5}
            fill={i < Math.round(rating) ? 'currentColor' : 'none'}
            opacity={i < Math.round(rating) ? 1 : 0.35}
          />
        ))}
      </span>
      <CText c={c} field="sub" as="span" size="sm" color={loud ? 'loud' : 'muted'} weight={500} />
    </div>
  )
}

export function CStat({
  c,
  loud = false,
  align = 'left',
}: {
  c: Component
  loud?: boolean
  align?: 'left' | 'center'
}) {
  const node = useNode(c.id)
  return (
    <div
      {...node}
      className={cn('flex flex-col', align === 'center' && 'items-center text-center')}
      style={{ gap: '4px' }}
    >
      <CText
        c={c}
        as="span"
        size="h2"
        heading
        weight={700}
        color={loud ? 'loud' : 'primary'}
        style={{ lineHeight: 1 }}
      />
      <CText c={c} field="sub" as="span" size="sm" color={loud ? 'loud' : 'muted'} />
    </div>
  )
}

export function CAvatar({ c, loud = false }: { c: Component; loud?: boolean }) {
  const node = useNode(c.id)
  const name = useCopy(c)
  const url = useImageUrl(c.props.imageId)
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div {...node} className="flex items-center" style={{ gap: '12px' }}>
      <span
        className="flex shrink-0 items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          width: 42,
          height: 42,
          borderRadius: '999px',
          background: url ? undefined : 'color-mix(in oklab, var(--dl-primary) 18%, transparent)',
          backgroundImage: url ? `url(${url})` : undefined,
          color: 'var(--dl-primary)',
          fontSize: 'var(--dl-size-sm)',
          fontWeight: 700,
          fontFamily: 'var(--dl-font-body)',
        }}
      >
        {!url && initials}
      </span>
      <span className="flex flex-col">
        <CText c={c} as="span" size="base" weight={600} color={loud ? 'loud' : 'text'} />
        <CText c={c} field="sub" as="span" size="sm" color={loud ? 'loud' : 'muted'} />
      </span>
    </div>
  )
}

export function CLogos({
  c,
  count,
  loud = false,
  size = 'base',
}: {
  c: Component
  count: number
  loud?: boolean
  size?: Size
}) {
  const node = useNode(c.id)
  const logos = (c.props.logos ?? []).slice(0, Math.max(2, count))

  return (
    <div
      {...node}
      className="flex flex-wrap items-center justify-center"
      style={{ gap: 'var(--dl-gap-lg)', rowGap: 'var(--dl-gap)' }}
    >
      {logos.map((logo, i) => (
        <span
          key={`${logo}-${i}`}
          style={{
            fontFamily: 'var(--dl-font-heading)',
            fontSize: SIZE_VAR[size],
            fontWeight: 650,
            letterSpacing: '-0.01em',
            color: loud ? 'var(--dl-loud-text)' : 'var(--dl-text)',
            opacity: 0.55,
          }}
        >
          {logo}
        </span>
      ))}
    </div>
  )
}

export function CQuote({
  c,
  loud = false,
  size = 'lg',
}: {
  c: Component
  loud?: boolean
  size?: Size
}) {
  const node = useNode(c.id)
  return (
    <figure
      {...node}
      className="m-0 flex flex-col"
      style={{
        gap: 'var(--dl-gap-sm)',
        padding: 'var(--dl-gap)',
        borderRadius: 'var(--dl-radius)',
        background: loud
          ? 'color-mix(in oklab, var(--dl-loud-text) 8%, transparent)'
          : 'var(--dl-surface)',
        border: '1px solid',
        borderColor: loud
          ? 'color-mix(in oklab, var(--dl-loud-text) 16%, transparent)'
          : 'var(--dl-border)',
      }}
    >
      <CText
        c={c}
        as="blockquote"
        size={size}
        heading
        weight={500}
        color={loud ? 'loud' : 'text'}
        className="m-0"
        style={{ letterSpacing: '-0.01em' }}
      />
      <CText
        c={c}
        field="sub"
        as="figcaption"
        size="sm"
        weight={600}
        color={loud ? 'loud' : 'muted'}
      />
    </figure>
  )
}

export function CDivider({ c }: { c: Component }) {
  const node = useNode(c.id)
  return (
    <hr
      {...node}
      className="w-full border-0"
      style={{ height: 1, background: 'var(--dl-border)', margin: 0 }}
    />
  )
}

export function CListItem({ c, loud = false }: { c: Component; loud?: boolean }) {
  return <CText c={c} as="span" size="base" color={loud ? 'loud' : 'muted'} />
}
