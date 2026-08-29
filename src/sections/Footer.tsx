import { CListItem, CLogos, CText } from '@/components/canvas/atoms'
import { Reveal } from '@/components/canvas/Reveal'
import type { Component, Section } from '@/types'
import { CONTAINER, byType, sectionPad } from './parts'

interface Props {
  section: Section
  comps: Component[]
}

export function Footer({ section, comps }: Props) {
  const p = byType(comps)
  const loud = section.mood === 'loud'
  const variant = section.variant

  const base = {
    background: loud ? 'var(--dl-loud-bg)' : 'var(--dl-surface)',
    color: loud ? 'var(--dl-loud-text)' : 'var(--dl-text)',
  }

  if (variant === 'minimal') {
    return (
      <div
        style={{
          ...base,
          ...sectionPad({
            paddingTop: 'calc(var(--dl-pad-y) * 0.5)',
            paddingBottom: 'calc(var(--dl-pad-y) * 0.5)',
          }),
        }}
      >
        <div
          style={CONTAINER}
          className="flex flex-wrap items-center justify-between"
        >
          <div className="flex flex-col" style={{ gap: '4px' }}>
            {p.headings[0] && (
              <CText c={p.headings[0]} as="span" size="lg" heading weight={700} color={loud ? 'loud' : 'text'} />
            )}
            {p.paragraphs[0] && (
              <CText c={p.paragraphs[0]} as="span" size="sm" color={loud ? 'loud' : 'muted'} />
            )}
          </div>
          <nav className="flex flex-wrap" style={{ gap: 'var(--dl-gap)' }}>
            {p.listItems.map((c) => (
              <CListItem key={c.id} c={c} loud={loud} />
            ))}
          </nav>
        </div>
      </div>
    )
  }

  if (variant === 'big') {
    return (
      <div style={{ ...base, ...sectionPad() }}>
        <div style={CONTAINER} className="flex flex-col" >
          {p.headings[0] && (
            <Reveal>
              <CText
                c={p.headings[0]}
                as="h2"
                size="h1"
                heading
                weight={700}
                color={loud ? 'loud' : 'text'}
              />
            </Reveal>
          )}
          {p.paragraphs[0] && (
            <Reveal index={1}>
              <CText
                c={p.paragraphs[0]}
                size="lg"
                color={loud ? 'loud' : 'muted'}
                style={{ marginTop: 'var(--dl-gap-sm)', maxWidth: 620 }}
              />
            </Reveal>
          )}
          <Reveal index={2}>
            <nav
              className="flex flex-wrap"
              style={{
                gap: 'var(--dl-gap)',
                marginTop: 'var(--dl-pad-y)',
                paddingTop: 'var(--dl-gap)',
                borderTop: '1px solid var(--dl-border)',
              }}
            >
              {p.listItems.map((c) => (
                <CListItem key={c.id} c={c} loud={loud} />
              ))}
            </nav>
          </Reveal>
          {p.logoRows[0] && (
            <div style={{ marginTop: 'var(--dl-gap-lg)' }}>
              <CLogos c={p.logoRows[0]} count={p.logoRows[0].props.logos?.length ?? 4} loud={loud} />
            </div>
          )}
        </div>
      </div>
    )
  }

  /* columns — the default: brand block plus a link grid. */
  const columns = Math.max(1, Math.ceil(p.listItems.length / 3))

  return (
    <div style={{ ...base, ...sectionPad() }}>
      <div
        className="grid"
        style={{
          ...CONTAINER,
          gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)',
          gap: 'calc(var(--dl-gap-lg) * 1.2)',
        }}
      >
        <div className="flex flex-col" style={{ gap: 'var(--dl-gap-sm)' }}>
          {p.headings[0] && (
            <CText c={p.headings[0]} as="h2" size="h3" heading weight={700} color={loud ? 'loud' : 'text'} />
          )}
          {p.paragraphs.map((c) => (
            <CText key={c.id} c={c} size="base" color={loud ? 'loud' : 'muted'} />
          ))}
        </div>
        <nav
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${Math.min(3, columns)}, minmax(0,1fr))`,
            gap: 'var(--dl-gap-sm)',
            alignContent: 'start',
          }}
        >
          {p.listItems.map((c) => (
            <CListItem key={c.id} c={c} loud={loud} />
          ))}
        </nav>
      </div>
    </div>
  )
}
