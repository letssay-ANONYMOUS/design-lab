import { Modal } from '@/components/ui/primitives'
import { SECTION_DEFS } from '@/lib/registry'
import { useLab } from '@/store/useLab'
import { Volume2, Moon } from 'lucide-react'

/** Adds a section to the end of the page. Variants are cycled on the canvas. */
export function SectionPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addSection = useLab((s) => s.addSection)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a section"
      subtitle="Every type ships with three to six layouts — cycle them on the canvas."
      width={680}
    >
      <div className="grid grid-cols-3 gap-2 p-5">
        {SECTION_DEFS.map((def) => (
          <button
            key={def.type}
            type="button"
            onClick={() => {
              addSection(def.type)
              onClose()
            }}
            className="group flex cursor-pointer flex-col gap-2 rounded-xl border border-ui-750 bg-ui-850/60 p-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-brand/60 hover:bg-ui-850"
          >
            <SectionGlyph type={def.type} />
            <div>
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ui-100">
                {def.label}
                {def.defaultMood === 'loud' ? (
                  <Volume2 size={11} className="text-amber-400/80" />
                ) : (
                  <Moon size={11} className="text-ui-600" />
                )}
              </span>
              <span className="mt-0.5 block text-[10px] leading-snug text-ui-500">{def.blurb}</span>
              <span className="mt-1 block text-[10px] text-ui-600">
                {def.variants.length} layouts
              </span>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  )
}

/** Tiny wireframe so the picker reads visually, not as a list of words. */
function SectionGlyph({ type }: { type: string }) {
  const bar = 'rounded-[2px] bg-ui-600 transition-colors group-hover:bg-brand/70'
  const box = 'rounded-[3px] bg-ui-700 transition-colors group-hover:bg-brand/35'

  return (
    <div className="flex h-[52px] flex-col justify-center gap-1 rounded-lg bg-ui-900 px-2.5 py-2">
      {type === 'hero' && (
        <div className="flex h-full gap-1.5">
          <div className="flex flex-1 flex-col justify-center gap-1">
            <div className={`${bar} h-1.5 w-full`} />
            <div className={`${bar} h-1 w-3/4 opacity-60`} />
            <div className={`${bar} h-1.5 w-1/3`} />
          </div>
          <div className={`${box} h-full w-[38%]`} />
        </div>
      )}
      {type === 'logoBar' && (
        <div className="flex items-center justify-between gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`${bar} h-1.5 flex-1 opacity-70`} />
          ))}
        </div>
      )}
      {type === 'featureGrid' && (
        <div className="grid h-full grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${box} h-full`} />
          ))}
        </div>
      )}
      {type === 'testimonials' && (
        <div className="flex h-full items-center gap-1.5">
          <div className={`${box} h-6 w-6 !rounded-full`} />
          <div className="flex flex-1 flex-col gap-1">
            <div className={`${bar} h-1 w-full opacity-60`} />
            <div className={`${bar} h-1 w-4/5 opacity-60`} />
            <div className={`${bar} h-1 w-1/3`} />
          </div>
        </div>
      )}
      {type === 'pricing' && (
        <div className="grid h-full grid-cols-3 gap-1.5">
          <div className={`${box} h-full`} />
          <div className={`${box} h-full !bg-brand/45`} />
          <div className={`${box} h-full`} />
        </div>
      )}
      {type === 'faq' && (
        <div className="flex flex-col gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${bar} h-2 w-full`} style={{ opacity: i === 0 ? 1 : 0.5 }} />
          ))}
        </div>
      )}
      {type === 'bento' && (
        <div className="grid h-full grid-cols-3 grid-rows-2 gap-1">
          <div className={`${box} col-span-2 row-span-2`} />
          <div className={box} />
          <div className={box} />
        </div>
      )}
      {type === 'ctaBanner' && (
        <div className="flex h-full flex-col items-center justify-center gap-1.5 rounded-md bg-ui-800">
          <div className={`${bar} h-1.5 w-1/2`} />
          <div className={`${box} h-2 w-1/4 !bg-brand/60`} />
        </div>
      )}
      {type === 'footer' && (
        <div className="grid h-full grid-cols-4 gap-1.5 opacity-70">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className={`${bar} h-1 w-full`} />
              <div className={`${bar} h-1 w-2/3 opacity-50`} />
              <div className={`${bar} h-1 w-2/3 opacity-50`} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
