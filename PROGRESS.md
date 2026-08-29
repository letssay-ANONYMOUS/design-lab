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

## Added after the first run

**11. Arrange mode** — toolbar toggle that turns every element on the page into
something you can pick up. A blue line shows where it will land, and elements
can cross section boundaries. Hit-tested rather than wrapped (see below).

**12. Image share on bento cards** — cards hold a real uploaded image, and the
divider between the image and the text is draggable. Past the snap point the
image is removed; a card without one keeps a handle at its top edge so there is
somewhere to pull one out of.

**13. Column split on two-column heroes** — split, editorial and collage share
`SplitLayout`, whose divider sits in the gutter and is dragged. The section
toolbar has a reset back to the variant's own default.

**14. Explainer eyes** — a small eye next to controls whose names are jargon
(stagger, parallax, trust density, squint, image share, column split…). Clicking
one opens a card with what it does, why it matters, and one thing to try. All
the copy is in `lib/explain.ts`.

**15. Draggable side panels** — the pacing rail and the token panel are resized
from their inner edges, so the canvas can be widened without ⌘+ scaling the
whole tool. Double-click an edge to reset; drag a panel shut and the toolbar
toggle brings it back.

## Decisions worth knowing

**Selection is wrapper-free.** `useNode` hangs a `data-dl-node` attribute and
handlers on the element a section already renders. Wrapping components in a
selection div would change flex and grid geometry the moment you clicked
something, which makes judging a layout impossible. The ring is pure CSS under
`.dl-editing`, and the toolbar is a portal that measures the live node.

**Arrange mode hit-tests; it does not use @dnd-kit.** @dnd-kit runs the section
list, but a sortable item needs a wrapper element and the point of the rule
above is that components are never wrapped. So `lib/arrange.ts` finds the drop
target with `document.elementsFromPoint` and the `data-dl-node` /
`data-dl-owner` attributes that already existed. Which side of the hovered
element the line goes is decided by whichever offset from centre is larger once
normalised by the element's own size — that one rule gives a vertical line
between buttons in a row and a horizontal one between stacked paragraphs, with
no per-section configuration. Drag state lives in `useArrange`, outside the undo
history, and the lifted-element styling is set on the DOM directly so a
pointermove does not re-render every node on the canvas.

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

## State at the end of the run

`typecheck`, `lint`, `build`, `smoke` (40 checks) and `check:export` all pass,
with zero lint warnings and a clean console.

## Known issues

- **Production bundle is ~1.17 MB** (326 KB gzipped). Cause is identified:
  `lucide-react@1` re-exports `import * as index from './icons/index.mjs'` as a
  namespace, and the bundler will not shake a namespace object, so all ~1,600
  icons ship. It does not affect `npm run dev`, which is how this tool is used.
  The fix, if it ever matters, is deep imports from
  `lucide-react/dist/esm/icons/<name>.mjs`.
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
