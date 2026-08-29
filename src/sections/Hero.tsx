import { CBadge, CButton, CImage, CStars, CStat, CText } from '@/components/canvas/atoms'
import { Reveal, motion, useParallaxY } from '@/components/canvas/Reveal'
import { useLab } from '@/store/useLab'
import type { Component, Section } from '@/types'
import { useRef } from 'react'
import { CONTAINER, NARROW, byType, sectionPad } from './parts'

interface HeroProps {
  section: Section
  comps: Component[]
}

/**
 * Six hero archetypes sharing one component pool. Swapping variants never
 * loses content — each layout simply decides how much of the pool it shows.
 */
export function Hero({ section, comps }: HeroProps) {
  switch (section.variant) {
    case 'centered':
      return <HeroCentered section={section} comps={comps} />
    case 'fullBleed':
      return <HeroFullBleed section={section} comps={comps} />
    case 'editorial':
      return <HeroEditorial section={section} comps={comps} />
    case 'collage':
      return <HeroCollage section={section} comps={comps} />
    case 'minimal':
      return <HeroMinimal section={section} comps={comps} />
    default:
      return <HeroSplit section={section} comps={comps} />
  }
}

/** Shared copy block: badge → heading → paragraph → buttons → proof. */
function CopyStack({
  comps,
  loud = false,
  align = 'left',
  headingSize = 'h1',
  startIndex = 0,
}: {
  comps: Component[]
  loud?: boolean
  align?: 'left' | 'center'
  headingSize?: 'h1' | 'h2'
  startIndex?: number
}) {
  const p = byType(comps)
  const centered = align === 'center'
  let i = startIndex

  return (
    <div
      className={centered ? 'flex flex-col items-center text-center' : 'flex flex-col items-start'}
      style={{ gap: 'var(--dl-gap)' }}
    >
      {p.badges.map((c) => (
        <Reveal key={c.id} index={i++}>
          <CBadge c={c} loud={loud} />
        </Reveal>
      ))}

      {p.headings.map((c) => (
        <Reveal key={c.id} index={i++} style={{ width: '100%' }}>
          <CText
            c={c}
            as="h1"
            size={headingSize}
            heading
            weight={720}
            balance
            color={loud ? 'loud' : 'text'}
          />
        </Reveal>
      ))}

      {p.paragraphs.map((c) => (
        <Reveal key={c.id} index={i++} style={{ width: '100%', maxWidth: 560 }}>
          <CText
            c={c}
            size="lg"
            color={loud ? 'loud' : 'muted'}
            style={loud ? { opacity: 0.85 } : undefined}
          />
        </Reveal>
      ))}

      {p.buttons.length > 0 && (
        <Reveal index={i++}>
          <div
            className={centered ? 'flex flex-wrap justify-center' : 'flex flex-wrap'}
            style={{ gap: 'var(--dl-gap-sm)' }}
          >
            {p.buttons.map((c) => (
              <CButton key={c.id} c={c} loud={loud} />
            ))}
          </div>
        </Reveal>
      )}

      {p.prices.length > 0 && (
        <Reveal index={i++}>
          <div className="flex flex-wrap items-baseline" style={{ gap: 'var(--dl-gap)' }}>
            {p.prices.map((c) => (
              <CText key={c.id} c={c} as="span" size="h3" heading color={loud ? 'loud' : 'text'} />
            ))}
          </div>
        </Reveal>
      )}

      {(p.stars.length > 0 || p.stats.length > 0) && (
        <Reveal index={i++}>
          <div
            className={centered ? 'flex flex-wrap justify-center' : 'flex flex-wrap'}
            style={{ gap: 'var(--dl-gap-lg)', alignItems: 'center' }}
          >
            {p.stars.map((c) => (
              <CStars key={c.id} c={c} loud={loud} />
            ))}
            {p.stats.map((c) => (
              <CStat key={c.id} c={c} loud={loud} align={centered ? 'center' : 'left'} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  )
}

function useHeroParallax(ref: React.RefObject<HTMLElement | null>) {
  const intensity = useLab((s) => s.view.choreo.parallax)
  return { y: useParallaxY(ref, intensity), active: intensity > 0 }
}

/* ---------------------------------- split --------------------------------- */

function HeroSplit({ section, comps }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { y, active } = useHeroParallax(ref)
  const p = byType(comps)
  const hero = p.images[0]
  const swap = section.meta.swapSides

  return (
    <div ref={ref} style={sectionPad()}>
      <div
        className="grid items-center"
        style={{
          ...CONTAINER,
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 'calc(var(--dl-gap-lg) * 1.4)',
        }}
      >
        <div style={{ order: swap ? 2 : 1 }}>
          <CopyStack comps={comps} />
        </div>
        {hero && (
          <motion.div style={{ order: swap ? 1 : 2, y: active ? y : 0 }}>
            <Reveal index={1}>
              <CImage c={hero} ratio={hero.props.ratio ?? '4/5'} />
            </Reveal>
          </motion.div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------- centered -------------------------------- */

function HeroCentered({ comps }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { y, active } = useHeroParallax(ref)
  const p = byType(comps)
  const hero = p.images[0]

  return (
    <div ref={ref} style={sectionPad()}>
      <div style={CONTAINER} className="flex flex-col">
        <div style={NARROW}>
          <CopyStack comps={comps} align="center" />
        </div>
        {hero && (
          <motion.div style={{ y: active ? y : 0, marginTop: 'var(--dl-pad-y)' }}>
            <Reveal index={2}>
              <CImage c={hero} ratio={hero.props.ratio ?? '16/9'} />
            </Reveal>
          </motion.div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------- fullBleed ------------------------------- */

function HeroFullBleed({ section, comps }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { y, active } = useHeroParallax(ref)
  const p = byType(comps)
  const hero = p.images[0]
  const overlay = section.meta.overlay !== false
  const alpha = ((section.meta.overlayIntensity ?? 45) / 100) * 0.88

  return (
    <div ref={ref} className="relative isolate overflow-hidden">
      {hero && (
        <motion.div className="absolute inset-0 -z-20" style={{ y: active ? y : 0, scale: 1.12 }}>
          <CImage c={hero} rounded="none" className="h-full w-full" style={{ aspectRatio: 'auto' }} />
        </motion.div>
      )}
      {overlay && (
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,${Math.min(0.95, alpha + 0.18)}) 0%, rgba(0,0,0,${alpha}) 45%, rgba(0,0,0,${alpha * 0.55}) 100%)`,
          }}
        />
      )}
      <div style={sectionPad({ minHeight: '72vh', display: 'flex', alignItems: 'flex-end' })}>
        <div style={CONTAINER}>
          <div style={{ maxWidth: 680 }}>
            <CopyStack comps={comps} loud />
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------- editorial ------------------------------- */

function HeroEditorial({ section, comps }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { y, active } = useHeroParallax(ref)
  const p = byType(comps)
  const hero = p.images[0]
  const swap = section.meta.swapSides

  return (
    <div ref={ref} style={sectionPad()}>
      <div style={CONTAINER}>
        {p.badges[0] && (
          <Reveal>
            <div
              className="flex items-center"
              style={{
                gap: 'var(--dl-gap)',
                paddingBottom: 'var(--dl-gap)',
                borderBottom: '1px solid var(--dl-border)',
              }}
            >
              <CBadge c={p.badges[0]} />
            </div>
          </Reveal>
        )}

        {p.headings[0] && (
          <Reveal index={1}>
            <CText
              c={p.headings[0]}
              as="h1"
              size="h1"
              heading
              weight={600}
              balance
              style={{ marginTop: 'var(--dl-gap-lg)', maxWidth: '15ch' }}
            />
          </Reveal>
        )}

        <div
          className="grid"
          style={{
            marginTop: 'var(--dl-pad-y)',
            gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)',
            gap: 'calc(var(--dl-gap-lg) * 1.2)',
            alignItems: 'start',
          }}
        >
          <div
            className="flex flex-col"
            style={{ gap: 'var(--dl-gap)', order: swap ? 2 : 1, paddingTop: 'var(--dl-gap-sm)' }}
          >
            {p.paragraphs.map((c, n) => (
              <Reveal key={c.id} index={2 + n}>
                <CText c={c} size="lg" color="muted" />
              </Reveal>
            ))}
            {p.prices[0] && (
              <Reveal index={3}>
                <CText c={p.prices[0]} as="span" size="h3" heading />
              </Reveal>
            )}
            {p.buttons.length > 0 && (
              <Reveal index={4}>
                <div className="flex flex-wrap" style={{ gap: 'var(--dl-gap-sm)' }}>
                  {p.buttons.map((c) => (
                    <CButton key={c.id} c={c} />
                  ))}
                </div>
              </Reveal>
            )}
            {p.stars.map((c) => (
              <Reveal key={c.id} index={5}>
                <CStars c={c} />
              </Reveal>
            ))}
          </div>

          {hero && (
            <motion.div style={{ order: swap ? 1 : 2, y: active ? y : 0 }}>
              <Reveal index={2}>
                <CImage c={hero} ratio={hero.props.ratio ?? '5/4'} />
              </Reveal>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- collage -------------------------------- */

function HeroCollage({ comps }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { y, active } = useHeroParallax(ref)
  const p = byType(comps)
  const [first, second, third] = p.images

  return (
    <div ref={ref} style={sectionPad()}>
      <div
        className="grid items-center"
        style={{
          ...CONTAINER,
          gridTemplateColumns: 'minmax(0,6fr) minmax(0,6fr)',
          gap: 'calc(var(--dl-gap-lg) * 1.3)',
        }}
      >
        <CopyStack comps={comps} />

        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: 'var(--dl-gap-sm)' }}
        >
          {first && (
            <motion.div style={{ gridColumn: 'span 4', y: active ? y : 0 }}>
              <Reveal index={1}>
                <CImage c={first} ratio="4/5" />
              </Reveal>
            </motion.div>
          )}
          {second && (
            <motion.div
              style={{
                gridColumn: 'span 2',
                alignSelf: 'end',
                y: active ? y : 0,
                marginBottom: 'calc(var(--dl-gap) * -1)',
              }}
            >
              <Reveal index={2}>
                <CImage c={second} ratio="3/4" rounded="md" />
              </Reveal>
            </motion.div>
          )}
          {third ? (
            <motion.div style={{ gridColumn: 'span 6', y: active ? y : 0 }}>
              <Reveal index={3}>
                <CImage c={third} ratio="16/7" rounded="md" />
              </Reveal>
            </motion.div>
          ) : (
            first && (
              <Reveal index={3} style={{ gridColumn: 'span 6' }}>
                <div
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: 'color-mix(in oklab, var(--dl-primary) 30%, transparent)',
                  }}
                />
              </Reveal>
            )
          )}
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- minimal -------------------------------- */

function HeroMinimal({ comps }: HeroProps) {
  const p = byType(comps)

  return (
    <div style={sectionPad({ paddingTop: 'calc(var(--dl-pad-y) * 1.6)', paddingBottom: 'calc(var(--dl-pad-y) * 1.6)' })}>
      <div style={CONTAINER} className="flex flex-col" >
        {p.badges[0] && (
          <Reveal>
            <CText
              c={p.badges[0]}
              as="span"
              size="sm"
              color="muted"
              weight={600}
              style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}
            />
          </Reveal>
        )}
        {p.headings[0] && (
          <Reveal index={1}>
            <CText
              c={p.headings[0]}
              as="h1"
              size="h1"
              heading
              weight={700}
              balance
              style={{ marginTop: 'var(--dl-gap-lg)', maxWidth: '18ch' }}
            />
          </Reveal>
        )}
        <div
          className="flex flex-wrap items-end justify-between"
          style={{
            marginTop: 'calc(var(--dl-pad-y) * 0.7)',
            gap: 'var(--dl-gap-lg)',
            paddingTop: 'var(--dl-gap)',
            borderTop: '1px solid var(--dl-border)',
          }}
        >
          {p.paragraphs[0] && (
            <Reveal index={2} style={{ maxWidth: 480 }}>
              <CText c={p.paragraphs[0]} size="base" color="muted" />
            </Reveal>
          )}
          {p.buttons[0] && (
            <Reveal index={3}>
              <CButton c={p.buttons[0]} />
            </Reveal>
          )}
        </div>
      </div>
    </div>
  )
}
