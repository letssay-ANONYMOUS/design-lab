import { ComponentTray } from '@/components/canvas/ComponentTray'
import { Explain, ToolButton } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'
import { sectionDef, variantLabel } from '@/lib/registry'
import { hasSplitDivider } from '@/sections/parts'
import { SectionRenderer } from '@/sections/SectionRenderer'
import { useLab } from '@/store/useLab'
import type { Section } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Columns2,
  Copy,
  GripVertical,
  Moon,
  Trash2,
  Volume2,
} from 'lucide-react'
import { useState } from 'react'

/**
 * Editing chrome around one section: drag handle, variant cycler, mood toggle,
 * component tray, duplicate and delete. All of it lives outside the artwork's
 * own box so nothing here can shift the design being evaluated.
 */
export function SectionShell({ section, index }: { section: Section; index: number }) {
  const [hovered, setHovered] = useState(false)
  const cycleVariant = useLab((s) => s.cycleVariant)
  const duplicateSection = useLab((s) => s.duplicateSection)
  const removeSection = useLab((s) => s.removeSection)
  const setSectionMood = useLab((s) => s.setSectionMood)
  const setSectionMeta = useLab((s) => s.setSectionMeta)
  const setActiveSection = useLab((s) => s.setActiveSection)
  const active = useLab((s) => s.activeSectionId === section.id)
  const phone = useLab((s) => s.view.viewport === 'phone')

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id })

  const def = sectionDef(section.type)
  const showChrome = hovered || active

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 40 : undefined,
        position: 'relative',
      }}
      className={cn('group/section', isDragging && 'opacity-95')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setActiveSection(section.id)}
      data-dl-section={section.id}
    >
      {/* Ring + shadow while dragging, so the section reads as "lifted". */}
      <motion.div
        animate={{
          boxShadow: isDragging
            ? '0 30px 70px -30px rgba(0,0,0,.65), 0 0 0 2px rgba(124,108,255,.85)'
            : showChrome
              ? '0 0 0 1px rgba(124,108,255,.35)'
              : '0 0 0 0px rgba(124,108,255,0)',
          scale: isDragging ? 1.006 : 1,
        }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ borderRadius: 2 }}
      >
        <SectionRenderer section={section} />
      </motion.div>

      <AnimatePresence>
        {showChrome && (
          <>
            {/* Drag handle, hugging the left edge. */}
            <motion.div
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.14 }}
              className="absolute top-3 left-3 z-30"
            >
              <button
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                type="button"
                aria-label={`Reorder ${def.label} section`}
                className="flex h-8 w-7 cursor-grab items-center justify-center rounded-lg border border-ui-700 bg-ui-900/92 text-ui-300 shadow-lg backdrop-blur transition-colors hover:text-white active:cursor-grabbing"
              >
                <GripVertical size={14} />
              </button>
            </motion.div>

            {/* Control cluster, top-right. */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'absolute top-3 right-3 z-30 flex items-center gap-1 rounded-xl border border-ui-700 bg-ui-900/92 p-1 shadow-xl backdrop-blur',
                phone && 'max-w-[calc(100%-58px)] overflow-x-auto',
              )}
              onClick={(event) => event.stopPropagation()}
            >
              {!phone && (
                <span className="px-1.5 text-[10px] font-semibold tracking-wide text-ui-500 uppercase">
                  {index + 1} · {def.label}
                </span>
              )}

              {!phone && <span className="mx-0.5 h-4 w-px bg-ui-750" />}

              <ToolButton
                size="sm"
                onClick={() => cycleVariant(section.id, -1)}
                aria-label="Previous layout"
                icon={<ChevronLeft size={13} />}
              />
              <span className="min-w-[52px] text-center text-[10px] font-medium text-ui-200">
                {variantLabel(section.type, section.variant)}
              </span>
              <ToolButton
                size="sm"
                onClick={() => cycleVariant(section.id, 1)}
                aria-label="Next layout"
                icon={<ChevronRight size={13} />}
              />

              <span className="mx-0.5 h-4 w-px bg-ui-750" />

              <ToolButton
                size="sm"
                active={section.mood === 'loud'}
                onClick={() => setSectionMood(section.id, section.mood === 'loud' ? 'calm' : 'loud')}
                title={section.mood === 'loud' ? 'Loud section' : 'Calm section'}
                icon={section.mood === 'loud' ? <Volume2 size={13} /> : <Moon size={13} />}
              />

              {hasSplitDivider(section) && (
                <>
                  <ToolButton
                    size="sm"
                    disabled={section.meta.splitRatio === undefined}
                    onClick={() => setSectionMeta(section.id, { splitRatio: undefined })}
                    title="Reset the column split — drag the divider between the columns to change it"
                    icon={<Columns2 size={13} />}
                  />
                  <Explain topic="splitRatio" />
                </>
              )}

              <ComponentTray sectionId={section.id} />

              <ToolButton
                size="sm"
                onClick={() => duplicateSection(section.id)}
                title="Duplicate section"
                icon={<Copy size={13} />}
              />
              <ToolButton
                size="sm"
                variant="danger"
                onClick={() => removeSection(section.id)}
                title="Delete section"
                icon={<Trash2 size={13} />}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
