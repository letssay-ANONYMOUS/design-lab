import { CIconFeature, CImage, CText } from '@/components/canvas/atoms'
import { Reveal } from '@/components/canvas/Reveal'
import type { Component, Section } from '@/types'
import { CONTAINER, byType, sectionPad, surface } from './parts'
import { SectionHeader } from './SectionHeader'

interface Props {
  section: Section
  comps: Component[]
}

export function FeatureGrid({ section, comps }: Props) {
  const p = byType(comps)
  const loud = section.mood === 'loud'
  const variant = section.variant

  const header = (align: 'left' | 'center' = 'left') => (
    <SectionHeader
      subheadings={p.subheadings}
      headings={p.headings}
      paragraphs={p.paragraphs}
      align={align}
      loud={loud}
    />
  )

  if (variant === 'alternating') {
    return (
      <div style={{ ...surface(loud), ...sectionPad() }}>
        <div style={CONTAINER}>
          {header()}
          <div className="flex flex-col" style={{ gap: 'calc(var(--dl-gap-lg) * 1.4)' }}>
            {p.features.map((c, i) => {
              const image = p.images[i]
              const flipped = i % 2 === 1
              return (
                <Reveal key={c.id} index={i}>
                  <div
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
                      gap: 'calc(var(--dl-gap-lg) * 1.2)',
                    }}
                  >
                    <div style={{ order: flipped ? 2 : 1 }}>
                      <CIconFeature c={c} loud={loud} />
                    </div>
                    <div style={{ order: flipped ? 1 : 2 }}>
                      {image ? (
                        <CImage c={image} ratio="4/3" />
                      ) : (
                        <div
                          style={{
                            aspectRatio: '4/3',
                            borderRadius: 'var(--dl-radius-lg)',
                            background: 'var(--dl-surface)',
                            border: '1px solid var(--dl-border)',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'iconList') {
    return (
      <div style={{ ...surface(loud), ...sectionPad() }}>
        <div
          style={{
            ...CONTAINER,
            display: 'grid',
            gridTemplateColumns: 'minmax(0,4fr) minmax(0,7fr)',
            gap: 'calc(var(--dl-gap-lg) * 1.2)',
            alignItems: 'start',
          }}
        >
          <div style={{ position: 'sticky', top: 32 }}>{header()}</div>
          <div className="flex flex-col" style={{ gap: 'var(--dl-gap-lg)' }}>
            {p.features.map((c, i) => (
              <Reveal key={c.id} index={i}>
                <div
                  style={{
                    paddingBottom: 'var(--dl-gap-lg)',
                    borderBottom:
                      i === p.features.length - 1 ? 'none' : '1px solid var(--dl-border)',
                  }}
                >
                  <CIconFeature c={c} loud={loud} layout="row" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const bordered = variant === 'bordered'

  return (
    <div style={{ ...surface(loud), ...sectionPad() }}>
      <div style={CONTAINER}>
        {header(bordered ? 'left' : 'center')}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${Math.min(3, Math.max(1, p.features.length))}, minmax(0,1fr))`,
            gap: bordered ? '0' : 'var(--dl-gap)',
            ...(bordered
              ? {
                  border: '1px solid var(--dl-border)',
                  borderRadius: 'var(--dl-radius-lg)',
                  overflow: 'hidden',
                }
              : {}),
          }}
        >
          {p.features.map((c, i) => (
            <Reveal key={c.id} index={i}>
              <div
                style={{
                  height: '100%',
                  padding: 'var(--dl-gap)',
                  borderRadius: bordered ? 0 : 'var(--dl-radius)',
                  background: bordered
                    ? 'transparent'
                    : loud
                      ? 'color-mix(in oklab, var(--dl-loud-text) 7%, transparent)'
                      : 'var(--dl-surface)',
                  border: bordered ? 'none' : '1px solid',
                  borderColor: loud
                    ? 'color-mix(in oklab, var(--dl-loud-text) 14%, transparent)'
                    : 'var(--dl-border)',
                  borderLeft: bordered && i > 0 ? '1px solid var(--dl-border)' : undefined,
                }}
              >
                <CIconFeature c={c} loud={loud} />
              </div>
            </Reveal>
          ))}
        </div>

        {p.stats.length > 0 && (
          <Reveal index={p.features.length}>
            <div
              className="grid"
              style={{
                marginTop: 'var(--dl-gap-lg)',
                gridTemplateColumns: `repeat(${p.stats.length}, minmax(0,1fr))`,
                gap: 'var(--dl-gap)',
              }}
            >
              {p.stats.map((c) => (
                <CText key={c.id} c={c} as="span" size="h3" heading color="primary" />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )
}
