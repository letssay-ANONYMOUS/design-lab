import type { Page } from '@/types'
import { cafePage } from './cafe'
import { clinicPage } from './clinic'
import { retailPage } from './retail'

export interface PresetDef {
  id: string
  name: string
  vertical: string
  build: () => Page
}

export const PRESETS: PresetDef[] = [
  { id: 'clinic', name: 'Meridian Physiotherapy', vertical: 'Clinic · booking', build: clinicPage },
  { id: 'cafe', name: 'Lantern Coffee', vertical: 'Café · menu & loyalty', build: cafePage },
  { id: 'retail', name: 'Ashgrove Supply', vertical: 'Retail · product', build: retailPage },
]

export function buildPreset(id: string): Page {
  const preset = PRESETS.find((p) => p.id === id) ?? PRESETS[0]!
  return preset.build()
}
