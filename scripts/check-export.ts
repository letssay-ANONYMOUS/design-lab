/**
 * Smoke check for the JSX exporter.
 *
 * Generates a file for every preset and writes it to `.export-check/`, so the
 * output can be typechecked as real source rather than eyeballed as a string.
 * Run via `npm run check:export`.
 */
import { generatePageJsx } from '@/lib/export'
import { PRESETS, buildPreset } from '@/presets'
import { DEFAULT_VIEW } from '@/store/useLab'
import { mkdirSync, writeFileSync } from 'node:fs'

mkdirSync('.export-check', { recursive: true })

for (const preset of PRESETS) {
  const code = generatePageJsx(buildPreset(preset.id), DEFAULT_VIEW)
  writeFileSync(`.export-check/${preset.id}.tsx`, code)
  console.log(`${preset.id}: ${code.split('\n').length} lines`)
}
