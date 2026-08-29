# Design Lab — build log

## Done

**1. Page canvas** — sections in an ordered list, dragged to reorder via
`@dnd-kit` with framer-motion handling the FLIP. Add, delete, duplicate from the
per-section chrome. Drag activation has 6px of slop so a click-to-select never
starts a drag by accident.

**2. Hero Lab** — six archetypes (split, centered, full-bleed, editorial,
collage, minimal). Image slots open a file picker and store the blob in
IndexedDB; only the key goes into the page JSON. Swap-sides, overlay on/off and
overlay intensity live in section meta. Variants cycle from the section toolbar.

**3. Section library** — logo bar (4), feature grid (4), testimonials (4),
pricing (4), FAQ (3), bento (3), CTA banner (4), footer (3). Every variant is
registered in `lib/registry.ts`, which is what cycling, remix and export all
read from.

**4. Component-level editing** — click any inner component to get a floating
mini-toolbar (move, duplicate, delete, plus contextual actions: button emphasis,
image ratio and placeholder, star rating, sync voices). Double-click text to
edit it inline. The component tray inserts new elements into a section.

**5. Token panel** — 7 palettes, 5 font pairings, radius with snap stops,
spacing multiplier, modular type scale with a live ladder. Everything writes
`--dl-*` custom properties on the canvas root.

**6. Bento grid** — 12 columns, drag the corner handle to resize col/row span.
Spans snap to whole columns and the grid reflows with a layout animation.

**7. Snapshots** — thumbnail via `html-to-image`, restore, rename, delete, and
A/B compare with a draggable divider and mirrored scroll. Snapshots and the
current page persist to localStorage and survive a refresh.

**8. Remix** — randomises variants and tokens inside curated bounds. There is no
random colour anywhere in the app: palettes come from a hand-picked list and
radius snaps to seven stops.

**9. Emotional engineering toolbar** — squint blur, 8pt + 12-column overlay,
contrast-pacing minimap, trust-density slider, three-voice copy swapper, and a
choreography panel (stagger, fade distance, parallax) with scroll playback.

**10. Export** — a self-contained `.tsx` with copy and download.

## Decisions worth knowing

**Selection is wrapper-free.** `useNode` hangs a `data-dl-node` attribute and
handlers on the element a section already renders. Wrapping components in a
selection div would change flex and grid geometry the moment you clicked
something, which makes judging a layout impossible. The ring is pure CSS under
`.dl-editing`, and the toolbar is a portal that measures the live node.

**Tokens are CSS variables, not props.** `tokensToVars()` is the single source
of truth and is read by the live canvas *and* the exporter, so what you see is
what ships. The export keeps the variable layer rather than inlining hex — the
file still drops into any Tailwind project with no config, but the palette stays
editable in one object.

**Every mutation funnels through `mutate()`** in the store, so undo/redo is free
and no action can forget to record history. Bento resizing keeps a local draft
during the drag and commits once on pointer-up, so a resize is one undo step
rather than one per pixel.

**Copy ships in three voices.** Every preset string is an
`{ authority, warm, urgent }` triple resolved at render. An inline edit writes
only the voice you are looking at; the toolbar has an explicit "sync voices"
action for when you want it everywhere.

**Trust density is tiered, not a filter.** Proof elements carry a tier (1/2/3)
and appear at 0/40/75. Logo rows additionally scale their count continuously, so
the slider reads as a dimmer rather than three hard steps.

**Export indentation is derived, not written.** Section emitters compose strings
at whatever depth was convenient; a `reindent()` pass recomputes nesting from
the tag structure. Hand-maintained depths drifted the moment a variant nested
one level deeper.

**Two verification scripts, because the browser is the one thing I could not
check by hand.** `npm run smoke` mounts the app in jsdom and fails on any
console error or warning — it caught all three warnings that existed at the time
it was written. `npm run check:export` typechecks generated JSX as real source.

## Known issues

- **Production bundle is ~1.17 MB** (326 KB gzipped). Cause is identified:
  `lucide-react@1` re-exports `import * as index from './icons/index.mjs'` as a
  namespace, and the bundler will not shake a namespace object, so all ~1,600
  icons ship. It does not affect `npm run dev`, which is how this tool is used.
  The fix, if it ever matters, is deep imports from
  `lucide-react/dist/esm/icons/<name>.mjs`.
- **`oxlint` reports 6 warnings, 0 errors.** Two are `set-state-in-effect` on
  deliberate post-layout DOM measurement (`SelectionLayer`, `useImageUrl`); four
  are `only-export-components` fast-refresh nits on `Reveal.tsx`, which exports
  a context and two hooks alongside a component.
- **Snapshot thumbnails can come back blank** if `html-to-image` hits a tainted
  canvas. The snapshot is still saved and still restores correctly — only the
  preview image is missing, and the card says so.
- **The uploaded-image store is never garbage collected.** Deleting a section
  that owns an image leaves the blob in IndexedDB. Harmless locally; would need
  a sweep before this was ever more than a personal tool.

## Next, if this gets picked back up

- Section-level token overrides are in the data model (`tokensOverride`) and
  respected by the renderer and exporter, but nothing in the UI sets them yet.
- Responsive preview widths (phone / tablet / desktop) on the canvas.
- Export a full page including a `<head>` with the Google Fonts link, rather
  than a comment telling you to add it.
