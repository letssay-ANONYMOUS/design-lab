# Design Lab

A local playground for practising web design — layout, storytelling, conversion
psychology, and the parts of a page that do emotional work. Start from one of
twelve realistic client pages, then reshape it: swap hero archetypes, cycle
section layouts, retune the type scale, change the voice of the copy, blur the
whole thing to check the hierarchy still reads, and save snapshots so you can
put two directions side by side.

It runs entirely in the browser. Nothing is uploaded anywhere.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually <http://localhost:5173>).

For the fixed local URL used by the persistent Mac service, run:

```bash
npm run start:local
```

Design Lab will be available at <http://localhost:5173>. The server is pinned to
port 5173 and exits instead of silently moving to another port.

| Script | What it does |
| --- | --- |
| `npm run dev` | The app |
| `npm run build` | Typecheck and production build |
| `npm run typecheck` | Types only |
| `npm run lint` | oxlint |
| `npm run smoke` | Mounts the app in jsdom, exercises every feature, fails on any console error or warning |
| `npm run check:export` | Generates JSX for every preset and typechecks the output as standalone React |

---

## A tour

### The canvas

The middle column is the page. Hover a section and its chrome appears: a drag
handle on the left, and on the right the layout cycler, a loud/calm toggle, the
component tray, duplicate and delete. Drag the handle to reorder; the other
sections animate out of the way rather than jumping.

Click any element inside a section — a heading, a button, an image — and a small
toolbar floats above it with actions that make sense for that element. Buttons
get an emphasis cycle, images get aspect ratio and a placeholder cycle, star
ratings get a rating cycle. **Double-click text to edit it in place.** Escape
reverts, Enter or clicking away commits.

`Backspace` deletes the selected element. `⌘Z` / `⇧⌘Z` undo and redo — including
layout changes, remixes and snapshot restores.

The desktop and phone icons beside the page name switch the editing viewport.
Phone mode is a real 390px responsive reflow rather than a scaled screenshot:
two-column layouts stack, bento stories become full-width chapters, typography
and spacing retune, and the same inline editing controls remain available.

### The template strategy library

Open the current page name in the top bar to enter the strategy library. Every
template includes a visual preview, conversion thesis, psychological principles,
emotional arc, story sequence, scroll intention, strengths, trade-offs, and an
honest note about when another system is more effective.

Select **Compare** on any two templates for a head-to-head view of trust, warmth,
urgency, clarity, and drama. The comparison is intentionally contextual: it
explains which system wins for which customer doubt instead of pretending there
is one universally best landing page.

The expanded collection covers care, hospitality, design commerce, enterprise
technology, creative services, and public-good fundraising. The Signature tier
adds Orison One, Kestrel R1, and Field C1: launch systems built around a single
hero object, progressive disclosure, a sticky story rail, published proof, and
controlled motion. Seven directions ship with art-directed, project-local
campaign imagery that remains available in the live canvas and exported JSX.

**Arrange** in the toolbar turns the whole page into a drag surface: pick up any
element and drop it somewhere else, including into a different section. A blue
line shows exactly where it will land before you let go.

Anywhere two things share a card or a row, the divider between them is
draggable. Bento cards have one between the image and the copy — drag it down to
give the photo more of the card, drag it past the top to remove the image
entirely. Two-column heroes have one in the gutter between the columns.

### Heroes

Six archetypes: split, centered, full-bleed, editorial, collage, minimal. Cycle
them with the arrows in the section chrome.

Click an image slot to upload a real photo — it is stored in IndexedDB, so it
survives a refresh without bloating localStorage. Until you upload something,
slots render a gradient derived from the current palette, so an unfinished page
still looks composed. The section toolbar also carries swap-sides and the
overlay controls for full-bleed heroes.

### The token panel (right)

Sixteen palettes, five font pairings, a radius scale with snap stops, a spacing
multiplier and a modular type scale with a live ladder underneath it. Every
control writes a CSS custom property on the canvas root, so changes land
instantly across the whole page — and the exported file uses exactly the same
variables.

### The pacing rail (left)

Each section is a band: height tracks its weight, fill shows whether it is loud
or calm. Three or more sections at the same register in a row get an amber dot —
that is where a reader's attention flatlines. Click a band to flip its register
and jump to it.

### The toolbar (top)

- **Squint** — blurs the page. If you cannot tell what matters with it on, the
  hierarchy is not doing its job.
- **Grid** — 8pt baseline plus a 12-column overlay.
- **Pacing** — shows or hides the left rail.
- **Arrange** — drag-to-rearrange mode, described above.
- **Trust** — a density slider for proof. Elements carry a tier, so at low
  settings you keep only the strongest evidence and at high settings the page
  fills with logos, stats and testimonials. Drag it to zero to find out whether
  the copy persuades on its own.
- **Motion** — stagger, fade distance and hero parallax, plus **Play the
  scroll**, which glides the whole page past the viewport so you can watch the
  choreography as a sequence instead of scrolling past it by hand.
- **Voice** — every preset string ships in three tones. *Authority* leads with
  credentials, *Warm* leads with the person, *Urgent* leads with the next step.
  Switching rewrites the entire page.
- **Remix** — re-rolls variants and tokens inside curated bounds. It cannot
  produce mud: colours come from the palette list, radius snaps to seven stops,
  and the opener and closing ask stay loud while the middle stays calm.
- **Export** — see below.

Controls whose names are jargon carry a small eye. Click it for what the control
does, why it matters, and one thing to try. Both side panels are resized by
dragging their inner edge, so you can widen the canvas without ⌘+ scaling the
tool along with it; double-click an edge to reset it.

### Snapshots (bottom)

**Save snapshot** captures the page as JSON with a rendered thumbnail. Restore
is exact, not approximate. Rename inline; delete on hover.

**Compare** lets you pick two snapshots and puts them behind a draggable
divider. Both panes render at full width and scroll together, so you are
comparing the same content at the same measure rather than two squeezed
half-width layouts.

### Export

Produces a single self-contained `.tsx` — Tailwind classes, no runtime
dependencies, one function component per section. Copy it or download it.

Design tokens are emitted once as a `tokens` object on the root element rather
than inlined as literals throughout, so the file drops into any Tailwind project
with no config while the palette and scale stay editable in one place. The
current voice and trust density are baked in: what you exported is what you were
looking at.

---

## How it is put together

```
src/
  types.ts          every shape in the app; all JSON-serialisable
  lib/
    tokens.ts       palettes, font pairs, tokensToVars() — the styling source of truth
    registry.ts     section types and their variants
    factory.ts      blueprints for new sections and components
    content.ts      tone resolution and trust-density filtering
    images.ts       IndexedDB blob store
    remix.ts        the curated randomiser
    export.ts       the JSX generator
  store/
    useLab.ts       page, view, snapshots, undo/redo, persistence
    useEditing.ts   ephemeral inline-edit state
  presets/          twelve complete page systems, real copy, three voices each
  sections/         one file per section type, all variants inside
  components/
    canvas/         editing chrome, selection, inline editing, atoms
    chrome/         top bar, token panel, pacing rail, snapshots, compare, modals
    ui/             the small dark-UI kit
```

A `Page` is an ordered list of `Section`s; a `Section` has a type, a variant, a
mood, some meta and a list of `Component`s. That is the whole data model, and
because it is plain JSON, a snapshot is literally a saved `Page` and the exporter
is a pure function over one.

See `PROGRESS.md` for the decisions behind the architecture and the known rough
edges.
