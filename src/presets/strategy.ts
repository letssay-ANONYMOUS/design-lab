export type TemplateCategory =
  | 'Care'
  | 'Hospitality'
  | 'Commerce'
  | 'Technology'
  | 'Services'
  | 'Cause'

export interface TemplateScores {
  trust: number
  warmth: number
  urgency: number
  clarity: number
  drama: number
}

export interface TemplateStrategy {
  tier?: 'Signature'
  category: TemplateCategory
  outcome: string
  conversionThesis: string
  bestFor: string
  avoidWhen: string
  compareEdge: string
  psychology: { principle: string; effect: string }[]
  emotionalArc: { entry: string; middle: string; close: string }
  story: { beat: string; job: string }[]
  motion: { pattern: string; feeling: string; caution: string }
  strengths: string[]
  tradeoffs: string[]
  scores: TemplateScores
  preview: {
    eyebrow: string
    headline: string
    background: string
    foreground: string
    accent: string
    asset?: string
    assetPosition?: string
  }
}

export const TEMPLATE_STRATEGIES: Record<string, TemplateStrategy> = {
  clinic: {
    category: 'Care',
    outcome: 'Book a considered first appointment',
    conversionThesis: 'Reduce medical uncertainty with a visible process, measurable proof, and pricing before asking for commitment.',
    bestFor: 'Clinics, specialist practices, and services where competence must arrive before personality.',
    avoidWhen: 'The decision is primarily aspirational or the offer depends on sensory desire rather than evidence.',
    compareEdge: 'Beats warmer lifestyle templates when the buyer is anxious about risk, legitimacy, or hidden cost.',
    psychology: [
      { principle: 'Uncertainty reduction', effect: 'A written twelve-week plan turns an invisible service into something concrete the patient can evaluate.' },
      { principle: 'Authority without intimidation', effect: 'Credentials lead, but plain language and published prices prevent expertise from feeling distant.' },
      { principle: 'Specific social proof', effect: 'Named recovery situations and measured gains are easier to believe than general five-star praise.' },
    ],
    emotionalArc: { entry: 'Concern becomes orientation', middle: 'Orientation becomes confidence', close: 'Confidence becomes a safe first step' },
    story: [
      { beat: 'Promise', job: 'Name the plan and accountable practitioner.' },
      { beat: 'Method', job: 'Show assessment, treatment, and re-testing in order.' },
      { beat: 'Proof', job: 'Use outcomes and patient language to validate the method.' },
      { beat: 'Risk removal', job: 'Publish fees and answer insurance objections.' },
      { beat: 'Ask', job: 'Sell the assessment, not the entire recovery programme.' },
    ],
    motion: { pattern: 'Short upward reveals with a restrained hero drift.', feeling: 'Steady forward progress without visual instability.', caution: 'Strong parallax would undermine the clinical sense of control.' },
    strengths: ['High trust', 'Clear next step', 'Strong objection handling'],
    tradeoffs: ['Less distinctive for luxury offers', 'Evidence-heavy pages need real numbers'],
    scores: { trust: 96, warmth: 61, urgency: 48, clarity: 93, drama: 46 },
    preview: { eyebrow: 'DHA-licensed practice', headline: 'Recovery with a plan', background: '#f7f9fc', foreground: '#102038', accent: '#2874d7' },
  },
  cafe: {
    category: 'Hospitality',
    outcome: 'Create appetite, place attachment, and a repeat visit',
    conversionThesis: 'Lead with sensory immediacy, then make craft and ritual specific enough to justify habit and loyalty.',
    bestFor: 'Cafés, bakeries, restaurants, and local venues where frequency matters more than one large purchase.',
    avoidWhen: 'The buyer needs procurement evidence, compliance, or a long rational evaluation.',
    compareEdge: 'Beats clinical and technical templates when memory, smell, taste, and belonging drive the decision.',
    psychology: [
      { principle: 'Sensory simulation', effect: 'Roast dates, warm pastry, and named flavour notes let the reader rehearse the visit.' },
      { principle: 'Familiarity', effect: 'Regulars and small rituals create the feeling of joining an existing place rather than trying a product.' },
      { principle: 'Honest scarcity', effect: 'Small batches make urgency believable because the production constraint is visible.' },
    ],
    emotionalArc: { entry: 'Curiosity becomes appetite', middle: 'Appetite becomes belonging', close: 'Belonging becomes a small ritual' },
    story: [
      { beat: 'Atmosphere', job: 'Open with the place and the sensory promise.' },
      { beat: 'Menu', job: 'Turn desire into concrete choices.' },
      { beat: 'Provenance', job: 'Give craft a credible backbone.' },
      { beat: 'Regulars', job: 'Show that the venue already has a social life.' },
      { beat: 'Habit', job: 'Convert the visit into a loyalty loop.' },
    ],
    motion: { pattern: 'Full-bleed parallax, menu-card cascade, and slow testimonial marquee.', feeling: 'A living room already in motion before the reader arrives.', caution: 'Too much speed would make hospitality feel transactional.' },
    strengths: ['High warmth', 'Strong local identity', 'Natural repeat-purchase loop'],
    tradeoffs: ['Lower authority', 'Sensory copy must be genuinely specific'],
    scores: { trust: 72, warmth: 94, urgency: 67, clarity: 78, drama: 82 },
    preview: { eyebrow: 'Roasted eleven metres away', headline: 'A better kind of morning', background: '#2c1e15', foreground: '#f8eee1', accent: '#d99b3f' },
  },
  retail: {
    category: 'Commerce',
    outcome: 'Convert desire into a confident product purchase',
    conversionThesis: 'Pair a strong product position with material proof, risk reversal, and credible scarcity.',
    bestFor: 'Durable goods, premium accessories, and limited-edition product businesses.',
    avoidWhen: 'The catalogue is broad, price-led, or depends on rapid comparison across many SKUs.',
    compareEdge: 'Beats hospitality templates when the reader needs to justify ownership, durability, and price.',
    psychology: [
      { principle: 'Endowment', effect: 'Usage scenes help the reader imagine the product already travelling with them.' },
      { principle: 'Price justification', effect: 'Construction, repair, and materials create reasons that remain after the first visual reaction.' },
      { principle: 'Risk reversal', effect: 'A long guarantee and easy return make a premium decision feel recoverable.' },
    ],
    emotionalArc: { entry: 'Interest becomes desire', middle: 'Desire becomes justification', close: 'Justification meets scarcity' },
    story: [
      { beat: 'Object', job: 'Establish a singular product and point of view.' },
      { beat: 'Use', job: 'Show how the product fits a real life.' },
      { beat: 'Construction', job: 'Explain why it costs what it costs.' },
      { beat: 'Guarantee', job: 'Remove ownership risk.' },
      { beat: 'Availability', job: 'Make the decision timely without manufacturing panic.' },
    ],
    motion: { pattern: 'Editorial hero, restrained object reveals, and a sticky product narrative.', feeling: 'Deliberate inspection rather than fast shopping.', caution: 'Aggressive motion competes with the object and lowers perceived durability.' },
    strengths: ['Premium justification', 'Clear product focus', 'Strong risk reversal'],
    tradeoffs: ['Not suited to large catalogues', 'Requires excellent product photography'],
    scores: { trust: 84, warmth: 58, urgency: 76, clarity: 86, drama: 74 },
    preview: { eyebrow: 'Third edition', headline: 'Built for forty years', background: '#0d0d10', foreground: '#f8f8f5', accent: '#d9f05c' },
  },
  aster: {
    category: 'Hospitality',
    outcome: 'Turn atmosphere into a high-consideration reservation',
    conversionThesis: 'Let cinematic stillness create desire, then introduce just enough specificity to make the dream bookable.',
    bestFor: 'Boutique hotels, destination retreats, architecture-led stays, and private experiences.',
    avoidWhen: 'Guests choose primarily on amenities, deal comparison, or immediate functional convenience.',
    compareEdge: 'Beats the café template for rare, high-ticket stays because it protects mystery and uses space as a luxury signal.',
    psychology: [
      { principle: 'Aspirational projection', effect: 'Negative space gives the reader room to place themselves inside the scene.' },
      { principle: 'Processing fluency', effect: 'A short promise and slow pacing make the property feel calm before any feature is read.' },
      { principle: 'Selective proof', effect: 'One remembered guest feeling preserves exclusivity better than a wall of ratings.' },
    ],
    emotionalArc: { entry: 'Noise becomes stillness', middle: 'Stillness becomes private longing', close: 'Longing becomes a chosen date' },
    story: [
      { beat: 'Transport', job: 'Move the reader out of their current environment.' },
      { beat: 'Ritual', job: 'Make the stay tactile through water, dinner, shade, and walking.' },
      { beat: 'Memory', job: 'Prove the emotional outcome with one vivid account.' },
      { beat: 'Logistics', job: 'Answer practical questions without leading with them.' },
      { beat: 'Date', job: 'Turn a vague wish into a specific window.' },
    ],
    motion: { pattern: 'Slow image drift, long section rests, and quiet staggered copy.', feeling: 'The page appears to breathe more slowly than the reader.', caution: 'Fast carousels or bouncing controls would destroy the promise of retreat.' },
    strengths: ['Exceptional emotional pull', 'High perceived value', 'Memorable sense of place'],
    tradeoffs: ['Lower information density', 'Photography carries significant weight'],
    scores: { trust: 73, warmth: 74, urgency: 54, clarity: 66, drama: 97 },
    preview: { eyebrow: 'Twenty-four rooms · Liwa', headline: 'The desert, with nothing added', background: '#151c24', foreground: '#f3ede5', accent: '#bc8b59', asset: '/generated/aster-house-hero.jpg', assetPosition: 'center' },
  },
  northline: {
    category: 'Commerce',
    outcome: 'Sell a collectible object without behaving like a promotion',
    conversionThesis: 'Museum-like restraint creates desire; visible engineering and a repair promise make the price intellectually defensible.',
    bestFor: 'Furniture, lighting, watches, craft, and limited editions with genuine material depth.',
    avoidWhen: 'The product is impulse-priced, frequently discounted, or visually interchangeable.',
    compareEdge: 'Beats conventional retail when the buyer wants cultural and design value, not just utility.',
    psychology: [
      { principle: 'Scarcity with provenance', effect: 'A numbered edition feels credible because production, authorship, and closure are explicit.' },
      { principle: 'Effort heuristic', effect: 'Visible construction details let the buyer infer care from labour rather than luxury adjectives.' },
      { principle: 'Temporal framing', effect: 'Repairability shifts the price comparison from this month to the second decade.' },
    ],
    emotionalArc: { entry: 'Curiosity becomes admiration', middle: 'Admiration becomes rational permission', close: 'Permission meets a finite edition' },
    story: [
      { beat: 'Silhouette', job: 'Make the object visually singular.' },
      { beat: 'Construction', job: 'Reveal the intelligence inside the form.' },
      { beat: 'Longevity', job: 'Reframe price through repair and time.' },
      { beat: 'Owners', job: 'Show how discerning people describe the difference.' },
      { beat: 'Number', job: 'Turn availability into personal ownership.' },
    ],
    motion: { pattern: 'Asymmetric editorial reveals and a measured image-to-detail progression.', feeling: 'Handling an object slowly in a gallery.', caution: 'Perpetual motion would make the product look decorative rather than engineered.' },
    strengths: ['Highest premium signalling', 'Excellent price defence', 'Credible scarcity'],
    tradeoffs: ['Needs a truly differentiated object', 'Deliberately slower conversion rhythm'],
    scores: { trust: 85, warmth: 46, urgency: 71, clarity: 82, drama: 88 },
    preview: { eyebrow: 'Edition 04 · 120 pieces', headline: 'Light, reduced to structure', background: '#f3f0ea', foreground: '#1b1c1e', accent: '#9e452f', asset: '/generated/northline-lamp.jpg', assetPosition: '62% 68%' },
  },
  interval: {
    category: 'Technology',
    outcome: 'Earn a serious operating review from a finance leader',
    conversionThesis: 'Make complexity feel controlled, prove the operating result, and sell diagnosis before software.',
    bestFor: 'B2B software, finance infrastructure, security, and enterprise tools with a multi-stakeholder sale.',
    avoidWhen: 'The product is self-serve, playful, consumer-led, or purchased primarily on brand affinity.',
    compareEdge: 'Beats warmer SaaS templates when the buyer is accountable for control, evidence, and internal consensus.',
    psychology: [
      { principle: 'Cognitive containment', effect: 'A dark, disciplined visual system makes a complex operating surface feel bounded and governed.' },
      { principle: 'Outcome substitution', effect: 'Time saved at month-end is easier to value than a list of integrations.' },
      { principle: 'Commitment ladder', effect: 'The ask is an operating review, which feels proportionate to an enterprise decision.' },
    ],
    emotionalArc: { entry: 'Complexity becomes control', middle: 'Control becomes organisational confidence', close: 'Confidence becomes a diagnostic conversation' },
    story: [
      { beat: 'System', job: 'Visualise discipline before describing features.' },
      { beat: 'Sequence', job: 'Map the daily control loop.' },
      { beat: 'Interface consequence', job: 'Organise information by what needs action.' },
      { beat: 'Operator proof', job: 'Show a changed meeting, not software satisfaction.' },
      { beat: 'Review', job: 'Offer a concrete, low-friction next step.' },
    ],
    motion: { pattern: 'Precise stagger, slow rotational hero parallax, and restrained data-stream movement.', feeling: 'A machine settling into alignment.', caution: 'Decorative animation would read as concealment in a trust-sensitive sale.' },
    strengths: ['Enterprise credibility', 'Strong outcome clarity', 'Good for committee buying'],
    tradeoffs: ['Low emotional warmth', 'Requires credible operating evidence'],
    scores: { trust: 94, warmth: 32, urgency: 58, clarity: 91, drama: 83 },
    preview: { eyebrow: 'Multi-entity treasury', headline: 'Context restored', background: '#121416', foreground: '#ece9e2', accent: '#c17a2f', asset: '/generated/interval-system.jpg', assetPosition: '68% center' },
  },
  lumen: {
    category: 'Care',
    outcome: 'Book a long-form consultation with an anxious, sceptical client',
    conversionThesis: 'Replace miracle language with calm observation, respectful boundaries, and a plan that feels lighter than the reader expects.',
    bestFor: 'Wellness, skin, therapy, and expert-led services where people may feel blamed or overwhelmed.',
    avoidWhen: 'The purchase is urgent, price-led, or needs hard performance energy.',
    compareEdge: 'Beats the clinic template when emotional safety and being understood matter as much as credentials.',
    psychology: [
      { principle: 'Cognitive relief', effect: 'A reduce-before-adding method directly counters the overwhelm many clients bring.' },
      { principle: 'Non-coercive trust', effect: 'Clear referral boundaries and no same-day package pressure lower defensiveness.' },
      { principle: 'Self-recognition', effect: 'Stories begin with confusion and relief, letting the reader feel seen before seeing results.' },
    ],
    emotionalArc: { entry: 'Frustration becomes recognition', middle: 'Recognition becomes relief', close: 'Relief becomes a gentle first appointment' },
    story: [
      { beat: 'Pattern', job: 'Name the reader’s repeated frustration without blaming them.' },
      { beat: 'Method', job: 'Show a patient sequence of observation and reduction.' },
      { beat: 'Diary', job: 'Prove emotional and visible progress.' },
      { beat: 'Boundary', job: 'Show what the service will not claim or sell.' },
      { beat: 'Time', job: 'Invite one unhurried consultation.' },
    ],
    motion: { pattern: 'Soft reveals, low travel distance, and minimal parallax.', feeling: 'Nothing on the page rushes or corners the reader.', caution: 'Scarcity timers would contradict the care promise.' },
    strengths: ['High emotional safety', 'Strong trust boundaries', 'Excellent for sceptical audiences'],
    tradeoffs: ['Low urgency', 'Soft tone needs disciplined hierarchy'],
    scores: { trust: 91, warmth: 96, urgency: 29, clarity: 84, drama: 69 },
    preview: { eyebrow: 'Clinical skin studio', headline: 'Treat the pattern', background: '#f4f0e7', foreground: '#263026', accent: '#526b50', asset: '/generated/lumen-serum.jpg', assetPosition: '40% 76%' },
  },
  signal: {
    category: 'Services',
    outcome: 'Attract fewer, better-fit strategic enquiries',
    conversionThesis: 'Use a sharp point of view, selective proof, and explicit boundaries to make self-selection do the qualifying.',
    bestFor: 'Creative studios, consultants, architects, and small senior teams selling judgement.',
    avoidWhen: 'The service is commoditised, volume-led, or needs a broad “we do everything” message.',
    compareEdge: 'Beats proof-heavy templates when the buyer is choosing taste, judgement, and a working relationship.',
    psychology: [
      { principle: 'Identity signalling', effect: 'A strong verbal and visual stance lets prospects choose the kind of partner they want to be seen choosing.' },
      { principle: 'Selective disclosure', effect: 'Three cases suggest confidence and curation instead of a desperate inventory of work.' },
      { principle: 'Boundary trust', effect: 'Price and fit language reduce ambiguity and increase the seriousness of enquiries.' },
    ],
    emotionalArc: { entry: 'Ambiguity becomes recognition', middle: 'Recognition becomes intellectual excitement', close: 'Excitement becomes a well-framed note' },
    story: [
      { beat: 'Point of view', job: 'State the decision the studio helps clients make.' },
      { beat: 'Range', job: 'Show different problems solved through one disciplined lens.' },
      { beat: 'Method', job: 'Explain how judgement becomes a system.' },
      { beat: 'Aftermath', job: 'Prove organisational change after launch.' },
      { beat: 'Fit', job: 'Invite only the enquiries the studio can serve well.' },
    ],
    motion: { pattern: 'Kinetic type pacing, sharp section contrast, and slow horizontal case movement.', feeling: 'A sequence of editorial decisions rather than a soft sales funnel.', caution: 'Visual cleverness must never obscure case outcomes or fit.' },
    strengths: ['Strong differentiation', 'High-quality lead filtering', 'Memorable voice'],
    tradeoffs: ['Polarising by design', 'Lower reassurance for conservative buyers'],
    scores: { trust: 77, warmth: 42, urgency: 62, clarity: 79, drama: 94 },
    preview: { eyebrow: 'Independent brand practice', headline: 'Make the decision visible', background: '#181719', foreground: '#f5f1ea', accent: '#b83e2f' },
  },
  orison: {
    tier: 'Signature',
    category: 'Commerce',
    outcome: 'Turn an unfamiliar premium object into a confident reservation',
    conversionThesis: 'Let one product dominate the visual field, then earn the price through a slow sequence from felt difference to acoustic proof, privacy, and reversible ownership.',
    bestFor: 'Premium consumer hardware with one hero product and defensible engineering.',
    avoidWhen: 'The offer is a broad catalogue, discount-led, or visually ordinary.',
    compareEdge: 'Beats ordinary ecommerce because it makes the object feel inevitable before asking the reader to compare specifications.',
    psychology: [
      { principle: 'Attentional isolation', effect: 'One object and one claim prevent the launch from competing with itself.' },
      { principle: 'Progressive disclosure', effect: 'Each scroll chapter answers the next doubt only after the desired feeling is established.' },
      { principle: 'Reversible commitment', effect: 'Calibration, serviceability, and a home trial reduce the danger of an unfamiliar premium purchase.' },
    ],
    emotionalArc: { entry: 'Curiosity becomes concentration', middle: 'Concentration becomes technical belief', close: 'Belief becomes a home trial' },
    story: [
      { beat: 'Object', job: 'Create immediate material desire.' },
      { beat: 'Experience', job: 'Name what changes in the room.' },
      { beat: 'Mechanism', job: 'Reveal only the engineering that explains the effect.' },
      { beat: 'Trust', job: 'Answer privacy, compatibility, and longevity.' },
      { beat: 'Trial', job: 'Make ownership feel reversible.' },
    ],
    motion: { pattern: 'Slow editorial object reveal followed by a sticky four-chapter engineering rail.', feeling: 'The product is being understood, not advertised.', caution: 'Fast carousels or multiple product renders would collapse the concentration.' },
    strengths: ['Exceptional product focus', 'Premium price defence', 'Controlled launch pacing'],
    tradeoffs: ['Demands a genuinely distinctive object', 'Intentionally poor for catalogue browsing'],
    scores: { trust: 91, warmth: 52, urgency: 58, clarity: 90, drama: 95 },
    preview: { eyebrow: 'Signature · Spatial audio', headline: 'Sound that maps the room', background: '#f5f3ef', foreground: '#191919', accent: '#b54b2c', asset: '/generated/orison-one.jpg', assetPosition: '72% 58%' },
  },
  kestrel: {
    tier: 'Signature',
    category: 'Commerce',
    outcome: 'Convert performance fascination into a high-value configuration deposit',
    conversionThesis: 'Use cinematic tension to create desire, then replace spectacle with published mass, range method, thermal evidence, and ownership commitments.',
    bestFor: 'Performance vehicles, mobility hardware, and engineered products with long consideration cycles.',
    avoidWhen: 'The brand cannot publish test conditions or support the ownership promise after launch.',
    compareEdge: 'Beats lifestyle automotive pages because every emotional claim is followed by a measurable consequence.',
    psychology: [
      { principle: 'Competence signal', effect: 'Exact test methods and unflattering range cases communicate engineering confidence.' },
      { principle: 'Costly evidence', effect: 'Publishing thermal, mass, and battery-floor details is hard to imitate without a real product.' },
      { principle: 'Finite configuration', effect: 'A numbered series creates urgency while keeping the decision about fit rather than status alone.' },
    ],
    emotionalArc: { entry: 'Stillness becomes tension', middle: 'Tension becomes mechanical confidence', close: 'Confidence becomes personal configuration' },
    story: [
      { beat: 'Machine', job: 'Establish stance and intent.' },
      { beat: 'Chassis', job: 'Explain the design from mass and grip.' },
      { beat: 'Numbers', job: 'Publish the figures that change riding.' },
      { beat: 'Road proof', job: 'Let an independent description carry the feeling.' },
      { beat: 'Ownership', job: 'Make service and battery risk explicit.' },
    ],
    motion: { pattern: 'Full-bleed entrance, sticky engineering chapters, then a dense performance-spec pulse.', feeling: 'A held breath that resolves into control.', caution: 'Speed effects would be obvious; the page should communicate performance through restraint.' },
    strengths: ['High cinematic impact', 'Credible engineering proof', 'Strong configuration funnel'],
    tradeoffs: ['Needs published test evidence', 'Dark presentation is intentionally severe'],
    scores: { trust: 90, warmth: 31, urgency: 76, clarity: 85, drama: 98 },
    preview: { eyebrow: 'Signature · Electric road machine', headline: 'Mass where grip needs it', background: '#101214', foreground: '#f0efeb', accent: '#b96f3f', asset: '/generated/kestrel-r1.jpg', assetPosition: '66% center' },
  },
  field: {
    tier: 'Signature',
    category: 'Commerce',
    outcome: 'Earn a production-tool configuration from a sceptical professional',
    conversionThesis: 'Treat transparency as the premium signal: show the image pipeline, publish the edge cases, and let downloadable originals prove the claim.',
    bestFor: 'Professional creative tools, cameras, instruments, and equipment purchased by expert operators.',
    avoidWhen: 'The audience cannot inspect output quality or the company needs to hide compatibility limits.',
    compareEdge: 'Beats glossy hardware launches when professional buyers care more about workflow friction and evidence than lifestyle association.',
    psychology: [
      { principle: 'Epistemic trust', effect: 'Downloadable originals and visible limits let experts verify rather than merely believe.' },
      { principle: 'Operator recognition', effect: 'Controls, heat, media, checksums, and repairs show that the product understands the real working day.' },
      { principle: 'Accessory-tax removal', effect: 'A complete base system prevents price anxiety from reappearing after the hero claim.' },
    ],
    emotionalArc: { entry: 'Interest becomes scrutiny', middle: 'Scrutiny becomes professional trust', close: 'Trust becomes configuration' },
    story: [
      { beat: 'Tool', job: 'Present a compact, credible working object.' },
      { beat: 'Pipeline', job: 'Trace light through recording and archive.' },
      { beat: 'Operator', job: 'Show which daily frictions disappear.' },
      { beat: 'Evidence', job: 'Offer footage and precise limitations.' },
      { beat: 'System', job: 'Price the complete usable configuration.' },
    ],
    motion: { pattern: 'Daylight object reveal, four-part pipeline rail, and slow production-note marquee.', feeling: 'A technical conversation with nothing held back.', caution: 'Cinematic decoration must never outrun the footage and workflow evidence.' },
    strengths: ['Expert-level trust', 'Excellent workflow specificity', 'Powerful evidence handoff'],
    tradeoffs: ['Dense for casual audiences', 'Requires real downloadable proof'],
    scores: { trust: 98, warmth: 38, urgency: 47, clarity: 94, drama: 82 },
    preview: { eyebrow: 'Signature · Cinema system', headline: 'The pipeline, without the rig', background: '#f1eee8', foreground: '#1d1f20', accent: '#6d5943', asset: '/generated/field-c1.jpg', assetPosition: '34% center' },
  },
  common: {
    category: 'Cause',
    outcome: 'Turn abstract concern into a concrete contribution',
    conversionThesis: 'Begin with one lived consequence, prove the delivery system, and let donors fund an outcome they can picture.',
    bestFor: 'Non-profits, civic initiatives, community campaigns, and measurable public-good projects.',
    avoidWhen: 'The organisation cannot connect contributions to visible delivery or maintain transparent reporting.',
    compareEdge: 'Beats emotional charity templates when donors need to trust execution as much as they feel the need.',
    psychology: [
      { principle: 'Identifiable effect', effect: 'One ordinary walk is more imaginable than an abstract climate statistic.' },
      { principle: 'Efficacy', effect: 'Permit-ready routes and completion metrics show that a contribution can actually finish something.' },
      { principle: 'Mental accounting', effect: 'Concrete amounts tied to maintenance, doorways, and crossings make giving easier to picture.' },
    ],
    emotionalArc: { entry: 'Concern becomes empathy', middle: 'Empathy becomes efficacy', close: 'Efficacy becomes contribution' },
    story: [
      { beat: 'Person', job: 'Show one daily life changed by the issue.' },
      { beat: 'System', job: 'Explain how residents choose and maintain the work.' },
      { beat: 'Receipt', job: 'Prove completed kilometres, temperature change, and cost flow.' },
      { beat: 'Unit', job: 'Offer concrete contribution sizes.' },
      { beat: 'Finish line', job: 'Name the exact funded route still waiting.' },
    ],
    motion: { pattern: 'A restrained human opening followed by progressively denser progress reveals.', feeling: 'Emotion gathers evidence instead of being replaced by it.', caution: 'Overly cinematic motion can make a public-good project feel like money spent on marketing.' },
    strengths: ['High donor efficacy', 'Transparent proof', 'Concrete contribution ladder'],
    tradeoffs: ['Needs excellent reporting', 'Less suited to unrestricted general fundraising'],
    scores: { trust: 93, warmth: 88, urgency: 73, clarity: 90, drama: 57 },
    preview: { eyebrow: 'Neighbourhood cooling fund', headline: 'Shade is public infrastructure', background: '#163c34', foreground: '#fbf5e8', accent: '#d39c35' },
  },
}

export const SCORE_LABELS: Record<keyof TemplateScores, string> = {
  trust: 'Trust',
  warmth: 'Warmth',
  urgency: 'Urgency',
  clarity: 'Clarity',
  drama: 'Drama',
}
