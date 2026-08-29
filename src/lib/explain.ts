/**
 * Plain-English notes for every control that uses jargon.
 *
 * Each one answers three things in order: what the control literally does, what
 * it does to the *feeling* of the page, and when to reach for it. The design
 * vocabulary is the point of this app, so the explanations teach rather than
 * just label — a tooltip saying "sets the stagger" would be useless.
 */

export interface Explanation {
  title: string
  /** One sentence: what it physically does. */
  what: string
  /** Why it matters to the design. */
  why: string
  /** A concrete starting point. */
  tip: string
}

export const EXPLAIN = {
  stagger: {
    title: 'Stagger',
    what: 'The delay between one element appearing and the next one appearing. At 0 they all arrive together; at 200ms they arrive one after another like dominoes.',
    why: 'Staggering tells the eye what order to read in. Everything arriving at once is a wall, and the reader picks their own path — usually the wrong one. A stagger hands them the sequence you intended.',
    tip: 'Around 60–90ms feels intentional. Past ~150ms it starts feeling slow and the reader gets ahead of the animation.',
  },
  distance: {
    title: 'Fade distance',
    what: 'How far an element slides while it fades in. 0 means it fades on the spot; 80px means it travels a long way up.',
    why: 'Movement draws the eye harder than a fade alone. More distance reads as more energetic; less reads as calm and expensive.',
    tip: '20–30px is the sweet spot for most work. Big travel suits bold consumer pages, near-zero suits clinics, banks and anything that should feel steady.',
  },
  parallax: {
    title: 'Hero parallax',
    what: 'Makes the hero image drift at a different speed from the text as you scroll.',
    why: 'The speed difference fakes depth — the image reads as sitting behind the page rather than glued to it. It is the cheapest way to make a flat hero feel three-dimensional.',
    tip: 'Keep it under ~40%. Strong parallax is the fastest way to make a page feel like a 2014 template.',
  },
  trustDensity: {
    title: 'Trust density',
    what: 'How much proof the page shows: ratings, stats, client logos, testimonials. Low settings keep only the strongest evidence; high settings show everything.',
    why: 'Proof buys belief but costs attention. Too little and a stranger has no reason to trust you; too much and the page reads as insecure, like someone over-explaining.',
    tip: 'Drag it to 0 and read the page. If the copy alone does not persuade, more logos will not save it — fix the words first.',
  },
  radius: {
    title: 'Corner radius',
    what: 'How rounded every corner is — cards, buttons, images, inputs.',
    why: 'Radius carries more personality than almost any other token. Sharp corners read as serious, technical, editorial. Soft corners read as friendly and approachable. It is one of the first things a viewer feels and the last thing they can name.',
    tip: 'Pick one and commit. Mixed radii across a page is the single most common amateur tell.',
  },
  spacing: {
    title: 'Spacing',
    what: 'A multiplier on all the padding and gaps at once.',
    why: 'Space is what makes a design feel expensive. Cramped layouts feel cheap and anxious no matter how good the type is; generous space reads as confidence — you are willing to let the page breathe.',
    tip: 'When something feels wrong and you cannot say why, push this up before you change anything else. It fixes more than you would expect.',
  },
  typeScale: {
    title: 'Type scale',
    what: 'The ratio between one text size and the next. 1.2 means each step is 20% bigger than the last.',
    why: 'This is the hierarchy dial. A small ratio makes headings and body text similar, which reads as calm and editorial but risks flatness. A large ratio makes headings tower, which reads as bold and marketing-led.',
    tip: 'Use Squint to test it. If the heading does not clearly win with the page blurred, raise the ratio.',
  },
  baseSize: {
    title: 'Base size',
    what: 'The body text size in pixels. Every other size is derived from it through the type scale.',
    why: 'Body size sets reading comfort, and because the scale multiplies it, nudging this moves the entire page at once.',
    tip: '16–17px suits most sites. Going below 15px costs you older readers and anyone on a laptop leaning back.',
  },
  squint: {
    title: 'Squint test',
    what: 'Blurs the whole page so you only see shapes, weight and contrast.',
    why: 'It is the oldest trick in design. Blurring strips away the words you already know and leaves the raw hierarchy — you see what a stranger sees in their first half-second.',
    tip: 'Turn it on and ask: what do I look at first, second, third? If that order is wrong, the layout is wrong, and no amount of copy editing will fix it.',
  },
  grid: {
    title: 'Grid overlay',
    what: 'Draws the 12-column layout grid over the page.',
    why: 'Edges that almost line up are worse than edges that obviously do not — the eye catches the near-miss and the page feels sloppy without anyone knowing why.',
    tip: 'Use it to check that headings, images and buttons start on the same column rather than merely looking close.',
  },
  minimap: {
    title: 'Pacing rail',
    what: 'The strip on the left. Each band is a section: its height shows the section weight, its fill shows whether it is loud or calm.',
    why: 'A good page alternates. Three loud sections in a row is exhausting and three calm ones is boring — either way attention flatlines, and the rail marks those runs with an amber dot.',
    tip: 'Click any band to flip it between loud and calm and jump to it.',
  },
  tone: {
    title: 'Voice',
    what: 'Rewrites every string on the page in one of three registers. Authority leads with credentials, Warm leads with the person, Urgent leads with the next step.',
    why: 'Same layout, different voice, completely different business. Seeing your design carry all three tells you whether it is genuinely flexible or quietly built for one kind of client.',
    tip: 'Design in Authority, then flip to Urgent. If the layout falls apart, your hierarchy was leaning on long sentences to fill space.',
  },
  arrange: {
    title: 'Arrange mode',
    what: 'Turns every element on the page into something you can pick up and drop somewhere else — inside its section or into a different one.',
    why: 'Order is the argument. Moving a testimonial above the pricing, or the badge below the heading, changes what the reader believes and when. Being able to try that in two seconds is the whole point.',
    tip: 'Drag onto another element to drop next to it. The blue line shows exactly where it will land.',
  },
  mediaShare: {
    title: 'Image share',
    what: 'How much of a card the image takes versus the text, dragged from the divider between them.',
    why: 'This ratio decides whether a card is a picture with a caption or a piece of writing with a thumbnail. Same content, same size, entirely different weight on the page.',
    tip: 'Try the extremes before you settle. The obvious 50/50 is rarely the best answer.',
  },
  splitRatio: {
    title: 'Column split',
    what: 'The balance between the copy column and the image column, dragged from the divider between them.',
    why: 'An even split is neutral and safe. Pushing the image wider makes the page feel like a brand campaign; pushing the copy wider makes it feel like a product that has something to say.',
    tip: 'Off-balance splits are usually more interesting than 50/50 — try 40/60 in both directions.',
  },
} as const satisfies Record<string, Explanation>

export type ExplainKey = keyof typeof EXPLAIN
