import { CBadge, CButton, CImage, CText } from '@/components/canvas/atoms'
import { Reveal } from '@/components/canvas/Reveal'
import type { Component, Section } from '@/types'
import { CONTAINER, NARROW, byType, sectionPad } from './parts'

interface Props {
  section: Section
  comps: Component[]
}

/**
 * The ask. Loud by default — this is the section the contrast-pacing minimap
 * expects to see spike at the end of a page.
 */
export function CtaBanner({ section, comps }: Props) {
  const p = byType(comps)
  const loud = section.mood === 'loud'
  const variant = section.variant

  const copy = (align: 'left' | 'center') => (
    <div
      className={
        align === 'center' ? 'flex flex-col items-center text-center' : 'flex flex-col items-start'
      }
      style={{ gap: 'var(--dl-gap-sm)', ...(align === 'center' ? NARROW : {}) }}
    >
      {p.badges.map((c) => (
        <Reveal key={c.id}>
          <CBadge c={c} loud={loud} />
        </Reveal>
      ))}
      {p.headings.map((c) => (
        <Reveal key={c.id} index={1} style={{ width: '100%' }}>
          <CText c={c} as="h2" size="h2" heading weight={700} balance color={loud ? 'loud' : 'text'} />
        </Reveal>
      ))}
      {p.paragraphs.map((c, i) => (
        <Reveal key={c.id} index={2 + i} style={{ width: '100%' }}>
          <CText
            c={c}
            size="lg"
            color={loud ? 'loud' : 'muted'}
            style={{ marginTop: '4px', ...(loud ? { opacity: 0.82 } : {}) }}
          />
        </Reveal>
      ))}
    </div>
  )

  const actions = p.buttons.length > 0 && (
    <Reveal index={3}>
      <div className="flex flex-wrap" style={{ gap: 'var(--dl-gap-sm)' }}>
        {p.buttons.map((c) => (
          <CButton key={c.id} c={c} loud={loud} />
        ))}
      </div>
    </Reveal>
  )

  /* ribbon: edge-to-edge colour band, no inner card. */
  if (variant === 'ribbon') {
    return (
      <div
        style={{
          background: loud ? 'var(--dl-loud-bg)' : 'var(--dl-surface)',
          color: loud ? 'var(--dl-loud-text)' : 'var(--dl-text)',
          ...sectionPad({
            paddingTop: 'calc(var(--dl-pad-y) * 0.75)',
            paddingBottom: 'calc(var(--dl-pad-y) * 0.75)',
          }),
        }}
      >
        <div
          style={CONTAINER}
          className="flex flex-wrap items-center justify-between"
        >
          <div style={{ maxWidth: 620 }}>{copy('left')}</div>
          <div style={{ marginTop: 'var(--dl-gap-sm)' }}>{actions}</div>
        </div>
      </div>
    )
  }

  /* panel: a floating card sitting on the page background. */
  if (variant === 'panel') {
    return (
      <div style={sectionPad()}>
        <div
          style={{
            ...CONTAINER,
            background: loud ? 'var(--dl-loud-bg)' : 'var(--dl-surface)',
            color: loud ? 'var(--dl-loud-text)' : 'var(--dl-text)',
            borderRadius: 'var(--dl-radius-lg)',
            padding: 'calc(var(--dl-pad-y) * 0.7) var(--dl-pad-x)',
            border: loud ? 'none' : '1px solid var(--dl-border)',
            boxShadow: loud ? '0 40px 90px -50px rgba(0,0,0,.7)' : undefined,
          }}
          className="flex flex-col items-center"
        >
          {copy('center')}
          <div style={{ marginTop: 'var(--dl-gap)' }}>{actions}</div>
        </div>
      </div>
    )
  }

  /* split: copy on the left, image or actions on the right. */
  if (variant === 'split') {
    const image = p.images[0]
    return (
      <div
        style={{
          background: loud ? 'var(--dl-loud-bg)' : 'var(--dl-bg)',
          color: loud ? 'var(--dl-loud-text)' : 'var(--dl-text)',
          ...sectionPad(),
        }}
      >
        <div
          className="grid items-center"
          style={{
            ...CONTAINER,
            gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)',
            gap: 'calc(var(--dl-gap-lg) * 1.3)',
          }}
        >
          <div className="flex flex-col" style={{ gap: 'var(--dl-gap)' }}>
            {copy('left')}
            {actions}
          </div>
          {image ? (
            <Reveal index={2}>
              <CImage c={image} ratio="4/3" />
            </Reveal>
          ) : (
            <Reveal index={2}>
              <div
                aria-hidden
                style={{
                  aspectRatio: '4/3',
                  borderRadius: 'var(--dl-radius-lg)',
                  background: loud
                    ? 'color-mix(in oklab, var(--dl-loud-text) 8%, transparent)'
                    : 'var(--dl-surface)',
                  border: '1px solid',
                  borderColor: loud
                    ? 'color-mix(in oklab, var(--dl-loud-text) 16%, transparent)'
                    : 'var(--dl-border)',
                }}
              />
            </Reveal>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: loud ? 'var(--dl-loud-bg)' : 'var(--dl-bg)',
        color: loud ? 'var(--dl-loud-text)' : 'var(--dl-text)',
        ...sectionPad(),
      }}
    >
      <div style={CONTAINER} className="flex flex-col items-center">
        {copy('center')}
        <div style={{ marginTop: 'var(--dl-gap)' }}>{actions}</div>
      </div>
    </div>
  )
}
