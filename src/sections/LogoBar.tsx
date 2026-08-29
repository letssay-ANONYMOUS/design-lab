import { CLogos, CText } from '@/components/canvas/atoms'
import { Reveal, motion } from '@/components/canvas/Reveal'
import { scaleCount } from '@/lib/content'
import { useLab } from '@/store/useLab'
import type { Component, Section } from '@/types'
import { CONTAINER, byType, sectionPad, surface } from './parts'

interface Props {
  section: Section
  comps: Component[]
}

export function LogoBar({ section, comps }: Props) {
  const density = useLab((s) => s.view.trustDensity)
  const p = byType(comps)
  const loud = section.mood === 'loud'
  const variant = section.variant

  /* Trust density scales the wordmark count continuously — the row grows and
   * shrinks rather than popping whole logos in and out at a threshold. */
  const count = (c: Component) => scaleCount(density, 3, Math.max(3, c.props.logos?.length ?? 6))

  if (variant === 'marquee') {
    const logos = p.logoRows[0]
    return (
      <div
        style={{
          ...surface(loud),
          paddingTop: 'calc(var(--dl-pad-y) * 0.45)',
          paddingBottom: 'calc(var(--dl-pad-y) * 0.45)',
          overflow: 'hidden',
        }}
      >
        {p.subheadings[0] && (
          <div style={{ ...CONTAINER, paddingInline: 'var(--dl-pad-x)' }}>
            <Reveal>
              <CText
                c={p.subheadings[0]}
                as="p"
                size="sm"
                weight={650}
                color={loud ? 'loud' : 'muted'}
                className="text-center"
                style={{
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--dl-gap)',
                }}
              />
            </Reveal>
          </div>
        )}
        {logos && (
          <motion.div
            className="flex w-max"
            style={{ gap: 'var(--dl-gap-lg)' }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0" style={{ gap: 'var(--dl-gap-lg)' }}>
                <CLogos c={logos} count={count(logos)} loud={loud} size="lg" />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    )
  }

  const boxed = variant === 'boxed'
  const stacked = variant === 'stacked'

  return (
    <div
      style={{
        ...surface(loud),
        ...sectionPad({
          paddingTop: 'calc(var(--dl-pad-y) * 0.5)',
          paddingBottom: 'calc(var(--dl-pad-y) * 0.5)',
        }),
      }}
    >
      <div
        style={{
          ...CONTAINER,
          ...(boxed
            ? {
                border: '1px solid var(--dl-border)',
                borderRadius: 'var(--dl-radius-lg)',
                background: 'var(--dl-surface)',
                padding: 'var(--dl-gap-lg)',
              }
            : {}),
        }}
        className={stacked ? 'flex flex-col items-center' : 'flex flex-col'}
      >
        {p.subheadings[0] && (
          <Reveal>
            <CText
              c={p.subheadings[0]}
              as="p"
              size="sm"
              weight={650}
              color={loud ? 'loud' : 'muted'}
              className="text-center"
              style={{
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 'var(--dl-gap)',
              }}
            />
          </Reveal>
        )}
        {p.logoRows.map((c, i) => (
          <Reveal key={c.id} index={i + 1} style={{ width: '100%' }}>
            <CLogos c={c} count={count(c)} loud={loud} size={stacked ? 'h3' : 'base'} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
