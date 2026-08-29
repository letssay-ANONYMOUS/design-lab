import { Modal, ToolButton } from '@/components/ui/primitives'
import { generatePageJsx } from '@/lib/export'
import { useLab } from '@/store/useLab'
import { Check, Copy, Download } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const slug = (name: string) =>
  name
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'page'

/** Feature 10 — a self-contained Tailwind + React file for the current page. */
export function ExportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const page = useLab((s) => s.page)
  const view = useLab((s) => s.view)
  const [copied, setCopied] = useState(false)

  /* Generated lazily: this walks every section and is pointless work while the
   * modal is shut. */
  const code = useMemo(() => (open ? generatePageJsx(page, view) : ''), [open, page, view])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  const download = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${slug(page.name)}.tsx`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const lines = code ? code.split('\n').length : 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export page"
      subtitle={`${page.sections.length} sections · ${lines} lines · Tailwind classes, no runtime dependencies`}
      width={880}
      footer={
        <>
          <span className="mr-auto text-[11px] text-ui-500">
            Tokens ship as CSS variables on the root, so the palette stays editable in one object.
          </span>
          <ToolButton variant="outline" onClick={download} icon={<Download size={13} />}>
            Download .tsx
          </ToolButton>
          <ToolButton
            variant="solid"
            onClick={() => {
              void navigator.clipboard.writeText(code).then(() => setCopied(true))
            }}
            icon={copied ? <Check size={13} /> : <Copy size={13} />}
          >
            {copied ? 'Copied' : 'Copy code'}
          </ToolButton>
        </>
      }
    >
      <pre className="m-0 max-h-[58vh] overflow-auto bg-ui-950 px-5 py-4 font-mono text-[11px] leading-[1.65] text-ui-300">
        <code>{code}</code>
      </pre>
    </Modal>
  )
}
