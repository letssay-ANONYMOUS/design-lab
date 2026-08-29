import { CText } from '@/components/canvas/atoms'
import { Reveal } from '@/components/canvas/Reveal'
import type { Component } from '@/types'
import { NARROW } from './parts'

/**
 * The eyebrow + heading pair almost every non-hero section opens with.
 * Keeping it in one place is what makes vertical rhythm consistent across
 * variants — the thing squint-test mode is meant to reveal.
 */
export function SectionHeader({
  subheadings,
  headings,
  paragraphs = [],
  align = 'left',
  loud = false,
  size = 'h2',
}: {
  subheadings: Component[]
  headings: Component[]
  paragraphs?: Component[]
  align?: 'left' | 'center'
  loud?: boolean
  size?: 'h2' | 'h3'
}) {
  if (subheadings.length === 0 && headings.length === 0 && paragraphs.length === 0) return null
  const centered = align === 'center'

  return (
    <div
      className={centered ? 'flex flex-col items-center text-center' : 'flex flex-col items-start'}
      style={{
        gap: 'var(--dl-gap-sm)',
        marginBottom: 'var(--dl-gap-lg)',
        ...(centered ? NARROW : { maxWidth: 720 }),
      }}
    >
      {subheadings.map((c) => (
        <Reveal key={c.id}>
          <CText
            c={c}
            as="span"
            size="sm"
            weight={650}
            color={loud ? 'loud' : 'primary'}
            style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}
          />
        </Reveal>
      ))}
      {headings.map((c) => (
        <Reveal key={c.id} index={1} style={{ width: '100%' }}>
          <CText
            c={c}
            as="h2"
            size={size}
            heading
            weight={700}
            balance
            color={loud ? 'loud' : 'text'}
          />
        </Reveal>
      ))}
      {paragraphs.map((c, i) => (
        <Reveal key={c.id} index={2 + i} style={{ width: '100%' }}>
          <CText
            c={c}
            size="lg"
            color={loud ? 'loud' : 'muted'}
            style={{ marginTop: '4px', ...(loud ? { opacity: 0.85 } : {}) }}
          />
        </Reveal>
      ))}
    </div>
  )
}
