import { CButton, CText } from '@/components/canvas/atoms'
import { Reveal } from '@/components/canvas/Reveal'
import type { Component, Section } from '@/types'
import { Check } from 'lucide-react'
import { CONTAINER, byType, sectionPad, surface } from './parts'
import { SectionHeader } from './SectionHeader'

interface Props {
  section: Section
  comps: Component[]
}

export function Pricing({ section, comps }: Props) {
  const p = byType(comps)
  const loud = section.mood === 'loud'
  const variant = section.variant
  const compact = variant === 'compact'
  const list = variant === 'list'
  const useFeature = variant === 'featured'

  return (
    <div style={{ ...surface(loud), ...sectionPad() }}>
      <div style={CONTAINER}>
        <SectionHeader
          subheadings={p.subheadings}
          headings={p.headings}
          paragraphs={p.paragraphs}
          align={list ? 'left' : 'center'}
          loud={loud}
        />

        <div
          className={list ? 'flex flex-col' : 'grid items-stretch'}
          style={
            list
              ? { gap: 'var(--dl-gap-sm)' }
              : {
                  gridTemplateColumns: `repeat(${Math.min(3, Math.max(1, p.prices.length))}, minmax(0,1fr))`,
                  gap: 'var(--dl-gap)',
                }
          }
        >
          {p.prices.map((c, i) => {
            const featured = useFeature && c.props.featured
            return (
              <Reveal key={c.id} index={i}>
                <PlanCard
                  c={c}
                  loud={loud}
                  featured={Boolean(featured)}
                  compact={compact}
                  list={list}
                  cta={p.buttons[i] ?? p.buttons[0]}
                />
              </Reveal>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function PlanCard({
  c,
  loud,
  featured,
  compact,
  list,
  cta,
}: {
  c: Component
  loud: boolean
  featured: boolean
  compact: boolean
  list: boolean
  cta?: Component
}) {
  const bullets = c.props.bullets ?? []

  return (
    <div
      className={list ? 'flex flex-wrap items-center justify-between' : 'flex h-full flex-col'}
      style={{
        gap: 'var(--dl-gap)',
        padding: compact ? 'var(--dl-gap)' : 'var(--dl-gap-lg)',
        borderRadius: 'var(--dl-radius-lg)',
        background: featured
          ? 'var(--dl-loud-bg)'
          : loud
            ? 'color-mix(in oklab, var(--dl-loud-text) 7%, transparent)'
            : 'var(--dl-surface)',
        color: featured ? 'var(--dl-loud-text)' : undefined,
        border: '1px solid',
        borderColor: featured
          ? 'transparent'
          : loud
            ? 'color-mix(in oklab, var(--dl-loud-text) 15%, transparent)'
            : 'var(--dl-border)',
        boxShadow: featured ? '0 24px 60px -30px rgba(0,0,0,.55)' : undefined,
        transform: featured && !compact && !list ? 'translateY(-10px)' : undefined,
      }}
    >
      <div className="flex flex-col" style={{ gap: '10px' }}>
        <CText
          c={c}
          as="span"
          size="base"
          weight={650}
          color={featured || loud ? 'loud' : 'muted'}
          style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}
        />
        <div className="flex items-baseline" style={{ gap: '8px' }}>
          <CText
            c={c}
            field="plain"
            as="span"
            size="h2"
            heading
            weight={700}
            color={featured || loud ? 'loud' : 'text'}
            style={{ lineHeight: 1 }}
          />
        </div>
        <CText c={c} field="sub" as="span" size="sm" color={featured || loud ? 'loud' : 'muted'} />
      </div>

      {!list && bullets.length > 0 && (
        <ul
          className="flex list-none flex-col p-0"
          style={{ gap: '10px', margin: 0, flexGrow: 1 }}
        >
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start"
              style={{
                gap: '10px',
                fontSize: 'var(--dl-size-base)',
                fontFamily: 'var(--dl-font-body)',
                color: featured || loud ? 'var(--dl-loud-text)' : 'var(--dl-muted)',
              }}
            >
              <Check
                size={17}
                strokeWidth={2.4}
                style={{
                  marginTop: 3,
                  flexShrink: 0,
                  color: featured ? 'var(--dl-accent)' : 'var(--dl-primary)',
                }}
              />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {cta && (
        <div style={{ marginTop: list ? 0 : 'auto' }}>
          <CButton c={cta} loud={featured} block={!list && !compact} />
        </div>
      )}
    </div>
  )
}
