import { EmptyState, ToolButton } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'
import { useLab } from '@/store/useLab'
import { AnimatePresence, motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { Camera, Columns2, Loader2, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'

/**
 * Saved page states, with thumbnails.
 *
 * The page itself is stored as JSON (a `Page` is already serialisable), so a
 * restore is exact rather than approximate. Thumbnails are rasterised once on
 * capture — re-rendering 24 live previews would cost more than the canvas.
 */
export function SnapshotStrip() {
  const snapshots = useLab((s) => s.snapshots)
  const compare = useLab((s) => s.view.compare)
  const addSnapshot = useLab((s) => s.addSnapshot)
  const removeSnapshot = useLab((s) => s.removeSnapshot)
  const renameSnapshot = useLab((s) => s.renameSnapshot)
  const restoreSnapshot = useLab((s) => s.restoreSnapshot)
  const setCompare = useLab((s) => s.setCompare)

  const [busy, setBusy] = useState(false)
  const [picking, setPicking] = useState(false)
  const [pending, setPending] = useState<string | null>(null)

  const capture = async () => {
    const node = document.querySelector<HTMLElement>('.dl-canvas-root')
    if (!node) return
    setBusy(true)
    try {
      const thumb = await toPng(node, {
        pixelRatio: 0.28,
        cacheBust: true,
        /* The editing chrome is diagnostic, not design — keep it out of the
         * thumbnail so snapshots read as the page a client would see. */
        filter: (child) =>
          !(child instanceof HTMLElement) ||
          !(child.dataset.dlChrome === 'true' || child.classList.contains('dl-grid-overlay')),
      })
      addSnapshot(thumb)
    } catch {
      /* html-to-image throws on tainted canvases; a failed thumbnail should
       * never take the app down, so the snapshot is simply skipped. */
      addSnapshot('')
    } finally {
      setBusy(false)
    }
  }

  const onCardClick = (id: string) => {
    if (!picking) return
    if (!pending) {
      setPending(id)
      return
    }
    if (pending === id) {
      setPending(null)
      return
    }
    setCompare([pending, id])
    setPending(null)
    setPicking(false)
  }

  return (
    <footer
      data-dl-chrome="true"
      className="z-[100] flex h-[132px] shrink-0 flex-col border-t border-ui-800 bg-ui-900"
    >
      <div className="flex items-center gap-2 px-3 pt-2.5 pb-1.5">
        <h2 className="text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase">
          Snapshots
        </h2>
        <span className="text-[10px] text-ui-600">{snapshots.length}/24</span>

        <div className="ml-auto flex items-center gap-1">
          {compare && (
            <ToolButton size="sm" variant="outline" onClick={() => setCompare(null)}>
              Close compare
            </ToolButton>
          )}
          <ToolButton
            size="sm"
            active={picking}
            disabled={snapshots.length < 2}
            onClick={() => {
              setPicking((v) => !v)
              setPending(null)
            }}
            title="Pick two snapshots to compare side by side"
            icon={<Columns2 size={13} />}
          >
            {picking ? (pending ? 'Pick the second' : 'Pick the first') : 'Compare'}
          </ToolButton>
          <ToolButton
            size="sm"
            variant="solid"
            disabled={busy}
            onClick={() => void capture()}
            icon={busy ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
          >
            Save snapshot
          </ToolButton>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-stretch gap-2 overflow-x-auto px-3 pb-3">
        {snapshots.length === 0 && (
          <div className="flex w-full items-center justify-center">
            <EmptyState
              title="No snapshots yet"
              hint="Save one before a big change so you can always get back."
            />
          </div>
        )}

        <AnimatePresence initial={false}>
          {snapshots.map((snapshot) => {
            const selectedForCompare = compare?.includes(snapshot.id)
            return (
              <motion.div
                key={snapshot.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onCardClick(snapshot.id)}
                className={cn(
                  'group relative flex w-[148px] shrink-0 flex-col overflow-hidden rounded-lg border bg-ui-850 transition-colors',
                  pending === snapshot.id
                    ? 'border-brand ring-1 ring-brand/50'
                    : selectedForCompare
                      ? 'border-brand/60'
                      : 'border-ui-750 hover:border-ui-600',
                  picking && 'cursor-pointer',
                )}
              >
                <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
                  {snapshot.thumb ? (
                    <img
                      src={snapshot.thumb}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-[10px] text-ui-500">
                      no preview
                    </div>
                  )}

                  {!picking && (
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-ui-950/75 opacity-0 backdrop-blur-[2px] transition-opacity duration-150 group-hover:opacity-100">
                      <ToolButton
                        size="sm"
                        variant="solid"
                        onClick={() => restoreSnapshot(snapshot.id)}
                        icon={<RotateCcw size={12} />}
                      >
                        Restore
                      </ToolButton>
                      <ToolButton
                        size="sm"
                        variant="danger"
                        onClick={() => removeSnapshot(snapshot.id)}
                        aria-label="Delete snapshot"
                        icon={<Trash2 size={12} />}
                      />
                    </div>
                  )}
                </div>

                <input
                  value={snapshot.name}
                  onChange={(event) => renameSnapshot(snapshot.id, event.target.value)}
                  onClick={(event) => event.stopPropagation()}
                  aria-label="Snapshot name"
                  className="w-full truncate border-t border-ui-800 bg-transparent px-2 py-1 text-[10px] text-ui-300 outline-none focus:bg-ui-800 focus:text-ui-100"
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </footer>
  )
}
