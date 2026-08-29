import { CText } from '@/components/canvas/atoms'
import { Reveal } from '@/components/canvas/Reveal'
import { useNode } from '@/components/canvas/useNode'
import type { Component, Section } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { CONTAINER, byType, sectionPad, surface } from './parts'
import { SectionHeader } from './SectionHeader'

interface Props {
  section: Section
  comps: Component[]
}

export function Faq({ section, comps }: Props) {
  const p = byType(comps)
  const loud = section.mood === 'loud'
  const variant = section.variant
  /* First row opens by default so the section never reads as an empty stack. */
  const [open, setOpen] = useState<string | null>(p.faqs[0]?.id ?? null)

  if (variant === 'twoCol') {
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
          <div style={{ position: 'sticky', top: 32 }}>
            <SectionHeader
              subheadings={p.subheadings}
              headings={p.headings}
              paragraphs={p.paragraphs}
              loud={loud}
            />
          </div>
          <div className="flex flex-col" style={{ gap: 'var(--dl-gap)' }}>
            {p.faqs.map((c, i) => (
              <Reveal key={c.id} index={i}>
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <CText c={c} as="h3" size="lg" heading weight={650} color={loud ? 'loud' : 'text'} />
                  <CText c={c} field="sub" size="base" color={loud ? 'loud' : 'muted'} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const boxed = variant === 'boxed'

  return (
    <div style={{ ...surface(loud), ...sectionPad() }}>
      <div style={{ ...CONTAINER, maxWidth: boxed ? 1180 : 860 }}>
        <SectionHeader
          subheadings={p.subheadings}
          headings={p.headings}
          paragraphs={p.paragraphs}
          align={boxed ? 'center' : 'left'}
          loud={loud}
        />
        <div
          className={boxed ? 'grid' : 'flex flex-col'}
          style={
            boxed
              ? { gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 'var(--dl-gap-sm)' }
              : {
                  borderTop: '1px solid',
                  borderColor: loud
                    ? 'color-mix(in oklab, var(--dl-loud-text) 16%, transparent)'
                    : 'var(--dl-border)',
                }
          }
        >
          {p.faqs.map((c, i) => (
            <Reveal key={c.id} index={i}>
              <FaqRow
                c={c}
                loud={loud}
                boxed={boxed}
                open={open === c.id}
                onToggle={() => setOpen(open === c.id ? null : c.id)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

function FaqRow({
  c,
  loud,
  boxed,
  open,
  onToggle,
}: {
  c: Component
  loud: boolean
  boxed: boolean
  open: boolean
  onToggle: () => void
}) {
  const node = useNode(c.id)
  const border = loud
    ? 'color-mix(in oklab, var(--dl-loud-text) 16%, transparent)'
    : 'var(--dl-border)'

  return (
    <div
      {...node}
      style={{
        borderBottom: boxed ? 'none' : `1px solid ${border}`,
        border: boxed ? `1px solid ${border}` : undefined,
        borderRadius: boxed ? 'var(--dl-radius)' : undefined,
        background: boxed ? (loud ? 'transparent' : 'var(--dl-surface)') : undefined,
        padding: boxed ? 'var(--dl-gap)' : 'var(--dl-gap) 0',
      }}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onToggle()
        }}
        className="flex w-full cursor-pointer items-start justify-between border-0 bg-transparent p-0 text-left"
        style={{ gap: 'var(--dl-gap)' }}
        aria-expanded={open}
      >
        <CText c={c} as="span" size="lg" heading weight={620} color={loud ? 'loud' : 'text'} />
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ color: loud ? 'var(--dl-loud-text)' : 'var(--dl-primary)', flexShrink: 0 }}
        >
          <Plus size={20} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: 'var(--dl-gap-sm)', maxWidth: '68ch' }}>
              <CText c={c} field="sub" size="base" color={loud ? 'loud' : 'muted'} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
