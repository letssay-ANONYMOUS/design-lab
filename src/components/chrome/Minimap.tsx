import { cn } from '@/lib/cn'
import { sectionDef } from '@/lib/registry'
import { getPalette } from '@/lib/tokens'
import { useLab } from '@/store/useLab'
import type { Section } from '@/types'
import { motion } from 'framer-motion'

/**
 * Contrast pacing.
 *
 * A page that never changes register is exhausting, and a page that shouts on
 * every section is worse. This rail draws each section as a band whose height
 * tracks its content weight and whose fill is its loud/calm mood, so the
 * rhythm of the whole page is legible in one glance. Runs of three or more
 * identical moods are flagged — that's where attention flatlines.
 */
export function Minimap() {
  const sections = useLab((s) => s.page.sections)
  const tokens = useLab((s) => s.page.tokens)
  const activeSectionId = useLab((s) => s.activeSectionId)
  const setSectionMood = useLab((s) => s.setSectionMood)
  const setActiveSection = useLab((s) => s.setActiveSection)
  const palette = getPalette(tokens.paletteId)

  const flags = flatlines(sections)

  return (
    <aside className="flex w-[132px] shrink-0 flex-col border-r border-ui-800 bg-ui-900">
      <div className="px-3 pt-3 pb-2">
        <h2 className="m-0 text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase">
          Pacing
        </h2>
        <p className="m-0 mt-1 text-[10px] leading-snug text-ui-600">
          Click a band to flip its register.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2.5 pb-3">
        {sections.map((section, index) => {
          const loud = section.mood === 'loud'
          const flagged = flags.has(index)
          return (
            <button
              key={section.id}
              type="button"
              onMouseEnter={() => setActiveSection(section.id)}
              onMouseLeave={() => setActiveSection(null)}
              onClick={() => {
                setSectionMood(section.id, loud ? 'calm' : 'loud')
                document
                  .querySelector(`[data-dl-section="${section.id}"]`)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }}
              title={`${sectionDef(section.type).label} — ${section.mood}${
                flagged ? ' (three in a row at this register)' : ''
              }`}
              className={cn(
                'relative w-full cursor-pointer overflow-hidden rounded-md border text-left transition-all duration-150',
                activeSectionId === section.id
                  ? 'border-brand ring-1 ring-brand/40'
                  : 'border-ui-800 hover:border-ui-600',
              )}
              style={{
                height: weight(section) * 13 + 20,
                background: loud ? palette.loudBg : palette.surface,
              }}
            >
              <span
                className="absolute inset-x-1.5 top-1.5 truncate text-[9px] font-semibold tracking-wide uppercase"
                style={{ color: loud ? palette.loudText : palette.muted }}
              >
                {sectionDef(section.type).label}
              </span>
              {flagged && (
                <motion.span
                  layout
                  className="absolute right-1 bottom-1 h-1.5 w-1.5 rounded-full bg-amber-400"
                  title="Flatline"
                />
              )}
            </button>
          )
        })}

        {sections.length === 0 && (
          <p className="px-1 py-4 text-center text-[10px] text-ui-600">No sections yet.</p>
        )}
      </div>
    </aside>
  )
}

/** Rough visual weight — more components means a taller band. */
function weight(section: Section): number {
  const base = section.type === 'hero' ? 3 : section.type === 'footer' ? 1 : 2
  return Math.min(7, base + Math.round(section.components.length / 3))
}

/** Indices belonging to a run of 3+ sections sharing one mood. */
function flatlines(sections: Section[]): Set<number> {
  const flagged = new Set<number>()
  let runStart = 0
  for (let i = 1; i <= sections.length; i += 1) {
    if (i === sections.length || sections[i]!.mood !== sections[runStart]!.mood) {
      if (i - runStart >= 3) for (let j = runStart; j < i; j += 1) flagged.add(j)
      runStart = i
    }
  }
  return flagged
}
