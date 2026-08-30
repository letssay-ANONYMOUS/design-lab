import { Canvas } from '@/components/canvas/Canvas'
import { CompareView } from '@/components/chrome/CompareView'
import { ExportModal } from '@/components/chrome/ExportModal'
import { Minimap } from '@/components/chrome/Minimap'
import { PanelResizer } from '@/components/chrome/PanelResizer'
import { RightPanel } from '@/components/chrome/RightPanel'
import { SectionPicker } from '@/components/chrome/SectionPicker'
import { SnapshotStrip } from '@/components/chrome/SnapshotStrip'
import { TopBar } from '@/components/chrome/TopBar'
import { useLab } from '@/store/useLab'
import { useEditing } from '@/store/useEditing'
import { useEffect, useState } from 'react'

/** True when focus is somewhere text is being typed. */
function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  return (
    el.isContentEditable ||
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT'
  )
}

export default function App() {
  const [picker, setPicker] = useState(false)
  const [exporting, setExporting] = useState(false)

  const minimapOn = useLab((s) => s.view.minimap)
  const comparing = useLab((s) => s.view.compare !== null)
  const rightOpen = useLab((s) => s.view.rightWidth > 0)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey
      const lab = useLab.getState()

      if (meta && event.key.toLowerCase() === 'z') {
        if (isTyping(event.target)) return
        event.preventDefault()
        if (event.shiftKey) lab.redo()
        else lab.undo()
        return
      }

      if (event.key === 'Escape') {
        useEditing.getState().endEdit()
        lab.select(null)
        return
      }

      /* Destructive shortcuts stay off while text is being edited — otherwise
       * Backspace at the start of a heading would delete the heading. */
      if (isTyping(event.target)) return
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const { selection } = lab
        if (!selection) return
        event.preventDefault()
        lab.removeComponent(selection.sectionId, selection.componentId)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-[100dvh] w-screen flex-col overflow-hidden bg-ui-950 text-ui-200">
      <TopBar onExport={() => setExporting(true)} />

      <div className="flex min-h-0 flex-1">
        {minimapOn && !comparing && (
          <>
            <Minimap />
            <PanelResizer side="left" />
          </>
        )}
        {comparing ? <CompareView /> : <Canvas onOpenPicker={() => setPicker(true)} />}
        {rightOpen && <PanelResizer side="right" />}
        {rightOpen && <RightPanel />}
      </div>

      <SnapshotStrip />

      <SectionPicker open={picker} onClose={() => setPicker(false)} />
      <ExportModal open={exporting} onClose={() => setExporting(false)} />
    </div>
  )
}
