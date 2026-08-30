import type { Page } from '@/types'
import { cafePage } from './cafe'
import { clinicPage } from './clinic'
import {
  asterPage,
  commonThreadPage,
  intervalPage,
  lumenPage,
  northlinePage,
  signalPage,
} from './collection'
import { retailPage } from './retail'
import { fieldPage, kestrelPage, orisonPage } from './signature'
import { TEMPLATE_STRATEGIES, type TemplateStrategy } from './strategy'

export interface PresetDef {
  id: string
  name: string
  vertical: string
  strategy: TemplateStrategy
  build: () => Page
}

export const PRESETS: PresetDef[] = [
  { id: 'orison', name: 'Orison One', vertical: 'Signature · spatial audio launch', strategy: TEMPLATE_STRATEGIES.orison!, build: orisonPage },
  { id: 'kestrel', name: 'Kestrel R1', vertical: 'Signature · electric mobility', strategy: TEMPLATE_STRATEGIES.kestrel!, build: kestrelPage },
  { id: 'field', name: 'Field C1', vertical: 'Signature · cinema system', strategy: TEMPLATE_STRATEGIES.field!, build: fieldPage },
  { id: 'aster', name: 'Aster House', vertical: 'Hospitality · reservation', strategy: TEMPLATE_STRATEGIES.aster!, build: asterPage },
  { id: 'interval', name: 'Interval Capital', vertical: 'Fintech · enterprise review', strategy: TEMPLATE_STRATEGIES.interval!, build: intervalPage },
  { id: 'northline', name: 'Northline Objects', vertical: 'Design commerce · edition', strategy: TEMPLATE_STRATEGIES.northline!, build: northlinePage },
  { id: 'lumen', name: 'Lumen Form', vertical: 'Wellness · consultation', strategy: TEMPLATE_STRATEGIES.lumen!, build: lumenPage },
  { id: 'signal', name: 'Signal / Noise', vertical: 'Creative services · enquiry', strategy: TEMPLATE_STRATEGIES.signal!, build: signalPage },
  { id: 'common', name: 'Common Thread', vertical: 'Cause · contribution', strategy: TEMPLATE_STRATEGIES.common!, build: commonThreadPage },
  { id: 'clinic', name: 'Meridian Physiotherapy', vertical: 'Clinic · booking', strategy: TEMPLATE_STRATEGIES.clinic!, build: clinicPage },
  { id: 'cafe', name: 'Lantern Coffee', vertical: 'Café · menu & loyalty', strategy: TEMPLATE_STRATEGIES.cafe!, build: cafePage },
  { id: 'retail', name: 'Ashgrove Supply', vertical: 'Retail · product', strategy: TEMPLATE_STRATEGIES.retail!, build: retailPage },
]

export function buildPreset(id: string): Page {
  const preset = PRESETS.find((p) => p.id === id) ?? PRESETS[0]!
  return preset.build()
}
