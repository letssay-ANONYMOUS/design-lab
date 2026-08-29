import { SectionContext } from '@/components/canvas/SectionContext'
import { visibleComponents } from '@/lib/content'
import { effectiveTokens, tokensToVars } from '@/lib/tokens'
import { useLab } from '@/store/useLab'
import type { Section, Tokens } from '@/types'
import type { CSSProperties } from 'react'
import { Bento } from './Bento'
import { CtaBanner } from './CtaBanner'
import { Faq } from './Faq'
import { FeatureGrid } from './FeatureGrid'
import { Footer } from './Footer'
import { Hero } from './Hero'
import { LogoBar } from './LogoBar'
import { Pricing } from './Pricing'
import { Testimonials } from './Testimonials'

/**
 * Renders one section's artwork. Deliberately knows nothing about editing
 * chrome — the same component is used for the live canvas, the snapshot
 * thumbnail pass, and the A/B compare panes.
 */
export function SectionRenderer({ section, tokens }: { section: Section; tokens?: Tokens }) {
  const density = useLab((s) => s.view.trustDensity)
  const livePageTokens = useLab((s) => s.page.tokens)
  /* Compare panes render a snapshot's own tokens rather than the live page's. */
  const pageTokens = tokens ?? livePageTokens

  const comps = visibleComponents(section, density)
  const vars = tokensToVars(effectiveTokens(pageTokens, section.tokensOverride))

  return (
    <SectionContext.Provider value={section.id}>
      <div style={vars as CSSProperties}>
        <Body section={section} comps={comps} />
      </div>
    </SectionContext.Provider>
  )
}

function Body({ section, comps }: { section: Section; comps: ReturnType<typeof visibleComponents> }) {
  switch (section.type) {
    case 'hero':
      return <Hero section={section} comps={comps} />
    case 'logoBar':
      return <LogoBar section={section} comps={comps} />
    case 'featureGrid':
      return <FeatureGrid section={section} comps={comps} />
    case 'testimonials':
      return <Testimonials section={section} comps={comps} />
    case 'pricing':
      return <Pricing section={section} comps={comps} />
    case 'faq':
      return <Faq section={section} comps={comps} />
    case 'bento':
      return <Bento section={section} comps={comps} />
    case 'ctaBanner':
      return <CtaBanner section={section} comps={comps} />
    case 'footer':
      return <Footer section={section} comps={comps} />
  }
}
