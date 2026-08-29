import { uid } from '@/lib/id'
import type { Component, Mood, Section, SectionMeta, SectionType } from '@/types'

export { comp, t } from '@/lib/factory'

export function sec(
  type: SectionType,
  variant: string,
  mood: Mood,
  meta: SectionMeta,
  components: Component[],
): Section {
  return { id: uid('s'), type, variant, mood, meta, components }
}
