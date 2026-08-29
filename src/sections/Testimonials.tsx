import { CAvatar, CQuote, CStars, CStat } from '@/components/canvas/atoms'
import { Reveal } from '@/components/canvas/Reveal'
import type { Component, Section } from '@/types'
import { motion } from 'framer-motion'
import { CONTAINER, NARROW, byType, sectionPad, surface } from './parts'
import { SectionHeader } from './SectionHeader'

interface Props {
  section: Section
  comps: Component[]
}

export function Testimonials({ section, comps }: Props) {
  const p = byType(comps)
  const loud = section.mood === 'loud'
  const variant = section.variant

  const stats = p.stats.length > 0 && (
    <Reveal index={p.quotes.length}>
      <div
        className="grid"
        style={{
          marginTop: 'var(--dl-gap-lg)',
          paddingTop: 'var(--dl-gap-lg)',
          borderTop: '1px solid',
          borderColor: loud
            ? 'color-mix(in oklab, var(--dl-loud-text) 18%, transparent)'
            : 'var(--dl-border)',
          gridTemplateColumns: `repeat(${p.stats.length}, minmax(0,1fr))`,
          gap: 'var(--dl-gap)',
        }}
      >
        {p.stats.map((c) => (
          <CStat key={c.id} c={c} loud={loud} />
        ))}
      </div>
    </Reveal>
  )

  if (variant === 'single') {
    const first = p.quotes[0]
    return (
      <div style={{ ...surface(loud), ...sectionPad() }}>
        <div style={{ ...CONTAINER, display: 'flex', flexDirection: 'column' }}>
          <SectionHeader
            subheadings={p.subheadings}
            headings={p.headings}
            align="center"
            loud={loud}
          />
          {first && (
            <Reveal index={1} style={NARROW}>
              <div className="flex flex-col items-center text-center" style={{ gap: 'var(--dl-gap)' }}>
                <CQuote c={first} loud={loud} size="h3" />
                {p.avatars[0] && <CAvatar c={p.avatars[0]} loud={loud} />}
                {p.stars[0] && <CStars c={p.stars[0]} loud={loud} />}
              </div>
            </Reveal>
          )}
          {stats}
        </div>
      </div>
    )
  }

  if (variant === 'marquee') {
    return (
      <div
        style={{
          ...surface(loud),
          paddingTop: 'var(--dl-pad-y)',
          paddingBottom: 'var(--dl-pad-y)',
          overflow: 'hidden',
        }}
      >
        <div style={{ ...CONTAINER, paddingInline: 'var(--dl-pad-x)' }}>
          <SectionHeader subheadings={p.subheadings} headings={p.headings} loud={loud} />
        </div>
        <motion.div
          className="flex w-max"
          style={{ gap: 'var(--dl-gap)', paddingInline: 'var(--dl-gap)' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" style={{ gap: 'var(--dl-gap)' }}>
              {p.quotes.map((c) => (
                <div key={`${copy}-${c.id}`} style={{ width: 380, flexShrink: 0 }}>
                  <CQuote c={c} loud={loud} size="base" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
        {p.stars.length > 0 && (
          <div
            style={{ ...CONTAINER, paddingInline: 'var(--dl-pad-x)', marginTop: 'var(--dl-gap-lg)' }}
            className="flex justify-center"
          >
            {p.stars.map((c) => (
              <CStars key={c.id} c={c} loud={loud} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const columns = variant === 'grid' ? 2 : Math.min(3, Math.max(1, p.quotes.length))

  return (
    <div style={{ ...surface(loud), ...sectionPad() }}>
      <div style={CONTAINER}>
        <SectionHeader
          subheadings={p.subheadings}
          headings={p.headings}
          align={variant === 'cards' ? 'center' : 'left'}
          loud={loud}
        />
        <div
          className="grid items-start"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
            gap: 'var(--dl-gap)',
          }}
        >
          {p.quotes.map((c, i) => (
            <Reveal key={c.id} index={i}>
              <CQuote c={c} loud={loud} size={variant === 'grid' ? 'lg' : 'base'} />
            </Reveal>
          ))}
        </div>
        {p.avatars.length > 0 && (
          <Reveal index={p.quotes.length}>
            <div
              className="flex flex-wrap"
              style={{ gap: 'var(--dl-gap-lg)', marginTop: 'var(--dl-gap)' }}
            >
              {p.avatars.map((c) => (
                <CAvatar key={c.id} c={c} loud={loud} />
              ))}
            </div>
          </Reveal>
        )}
        {stats}
      </div>
    </div>
  )
}
