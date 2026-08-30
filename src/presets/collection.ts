import { uid } from '@/lib/id'
import type { Page } from '@/types'
import { comp, sec, t } from './helpers'

/**
 * The expanded collection deliberately spans different buying emotions.
 * These are not recolours of one funnel: each page changes the order in which
 * desire, proof, detail, and the ask arrive.
 */

export function asterPage(): Page {
  return {
    id: uid('page'),
    name: 'Aster House',
    tokens: {
      paletteId: 'dusk',
      fontPairId: 'luxury',
      radius: 2,
      spacing: 1.22,
      typeScale: 1.34,
      baseSize: 17,
    },
    sections: [
      sec('hero', 'fullBleed', 'loud', { overlay: true, overlayIntensity: 58 }, [
        comp('badge', { tones: t('Twenty-four rooms · Liwa', 'A quiet house beyond the last road', 'Autumn stays now open') }),
        comp('heading', {
          tones: t(
            'The desert, with nothing added',
            'Come far enough to hear yourself again',
            'Four nights left beneath the October moon',
          ),
        }),
        comp('paragraph', {
          tones: t(
            'A 24-room retreat built around shade, water, and the old routes through Liwa. No programme unless you ask for one.',
            'Sleep late. Swim before breakfast. Let dinner take as long as it takes. We keep the house small so the day can feel wide.',
            'October is the first cool month. The final courtyard rooms are available now, with transfers from Abu Dhabi included.',
          ),
        }),
        comp('button', { emphasis: 'primary', tones: t('Explore the house', 'See where you would stay', 'Check October dates') }),
        comp('button', { emphasis: 'ghost', tones: t('View the field notes', 'Read the story', 'Speak to the house') }),
        comp('imageSlot', { ratio: '16/9', assetSrc: '/generated/aster-house-hero.jpg', placeholder: 7 }),
      ]),

      sec('logoBar', 'stacked', 'calm', { eyebrow: 'Recognition' }, [
        comp('subheading', { text: 'Quietly recognised by' }),
        comp('logoRow', {
          logos: ['Cereal', 'The Modern House', 'Kinfolk', 'Afar', 'Wallpaper', 'Condé Nast Traveller'],
          proofTier: 1,
        }),
      ]),

      sec('featureGrid', 'iconList', 'calm', { eyebrow: 'The stay' }, [
        comp('subheading', { text: 'A slower kind of luxury' }),
        comp('heading', { text: 'Nothing competes for your attention' }),
        comp('paragraph', { text: 'The page moves from atmosphere into exact, tangible rituals so desire does not dissolve into vagueness.' }),
        comp('iconFeature', { icon: 'Moon', text: 'Courtyard rooms', sub: 'Private water, deep shade, linen made for the desert night. No television and no corridor noise.' }),
        comp('iconFeature', { icon: 'Waves', text: 'The water court', sub: 'A mineral pool held between rammed-earth walls, open from first light until the stars come out.' }),
        comp('iconFeature', { icon: 'Utensils', text: 'One table at dusk', sub: 'Dinner follows the harvest and the temperature. There is one sitting, and nobody turns the table.' }),
        comp('iconFeature', { icon: 'Compass', text: 'Walks without spectacle', sub: 'Small routes with people who know the wells, plants, and older names of the dunes.' }),
      ]),

      sec('testimonials', 'single', 'loud', { eyebrow: 'Field note' }, [
        comp('subheading', { text: 'What remained' }),
        comp('heading', { text: 'The proof is a remembered feeling, not a feature count' }),
        comp('quote', { text: 'By the second evening, nobody in our group knew where their phones were. The house made stillness feel generous, never prescribed.', sub: 'Maha Al Nuaimi · four-night stay', proofTier: 1 }),
        comp('starRating', { rating: 5, sub: '4.87 from 186 verified stays', proofTier: 2 }),
        comp('stat', { text: '71%', sub: 'of guests return within two years', proofTier: 3 }),
      ]),

      sec('faq', 'twoCol', 'calm', { eyebrow: 'Before the road' }, [
        comp('heading', { text: 'The practical questions, answered without breaking the spell' }),
        comp('faqItem', { text: 'How do we reach the house?', sub: 'We collect guests in Abu Dhabi at 2pm in a shared electric vehicle. The drive is two hours and forty minutes with one stop.' }),
        comp('faqItem', { text: 'Is there a minimum stay?', sub: 'Three nights. The house is intentionally remote, and a shorter stay tends to feel like more road than rest.' }),
        comp('faqItem', { text: 'Can children stay?', sub: 'Guests aged twelve and over are welcome. The water court is open and the evening rhythm is very quiet.' }),
        comp('faqItem', { text: 'What is included?', sub: 'Transfers, every meal, guided walks, and the hammam are included. There are no resort fees on departure.' }),
      ]),

      sec('ctaBanner', 'ribbon', 'loud', {}, [
        comp('badge', { text: 'October · 4 rooms remain' }),
        comp('heading', { tones: t('Choose a courtyard and a date', 'Come when the evenings turn cool', 'Hold an October room for 24 hours') }),
        comp('paragraph', { text: 'Three nights from AED 8,400, including transfers, meals, and every walk. A 20% deposit holds the room.' }),
        comp('button', { emphasis: 'primary', tones: t('Check availability', 'Plan a stay', 'Hold a room') }),
      ]),

      sec('footer', 'minimal', 'calm', {}, [
        comp('heading', { text: 'Aster House' }),
        comp('paragraph', { text: 'Liwa Oasis · United Arab Emirates' }),
        comp('listItem', { text: 'The house' }),
        comp('listItem', { text: 'Field notes' }),
        comp('listItem', { text: 'Getting here' }),
        comp('listItem', { text: 'Reservations' }),
      ]),
    ],
  }
}

export function northlinePage(): Page {
  return {
    id: uid('page'),
    name: 'Northline Objects',
    tokens: {
      paletteId: 'object',
      fontPairId: 'technical',
      radius: 0,
      spacing: 1.08,
      typeScale: 1.3,
      baseSize: 16,
    },
    sections: [
      sec('hero', 'editorial', 'calm', { splitRatio: 38, swapSides: false }, [
        comp('badge', { tones: t('Edition 04 · 120 pieces', 'Made slowly in Sheffield', 'Edition closes 18 September') }),
        comp('heading', { tones: t('Light, reduced to structure', 'An object that changes the room after dark', 'The fourth edition will not be repeated') }),
        comp('paragraph', { text: 'Fold 04 is cut from two sheets of brushed aluminium, joined without visible fixings, and numbered by the person who finishes it.' }),
        comp('priceTag', { text: 'AED 2,180', sub: 'tax and worldwide delivery included' }),
        comp('button', { emphasis: 'primary', tones: t('Study the object', 'See it in a room', 'Reserve number 04/120') }),
        comp('imageSlot', { ratio: '4/5', assetSrc: '/generated/northline-lamp.jpg', placeholder: 3 }),
      ]),

      sec('bento', 'outline', 'calm', { eyebrow: 'Construction', rows: 3 }, [
        comp('subheading', { text: 'Every decision remains visible' }),
        comp('heading', { text: 'The object earns its price in the details' }),
        comp('bentoCard', { text: 'Two folds', sub: 'The shade and stem begin as one plane. The seam is structural, not decoration.', span: { col: 7, row: 2 }, mediaShare: 52, assetSrc: '/generated/northline-lamp.jpg' }),
        comp('bentoCard', { text: '2700K', sub: 'Warm enough for a bedside, focused enough for a desk.', span: { col: 5, row: 1 } }),
        comp('bentoCard', { text: '1.8 kg', sub: 'A low travertine ballast makes the narrow stance stable.', span: { col: 5, row: 1 } }),
        comp('bentoCard', { text: 'Repairable', sub: 'Driver, cable, and diffuser can each be replaced with one tool.', span: { col: 4, row: 1 } }),
        comp('bentoCard', { text: 'Numbered by hand', sub: 'A maker signs the underside after the final light test.', span: { col: 8, row: 1 } }),
      ]),

      sec('featureGrid', 'bordered', 'calm', { eyebrow: 'Why it lasts' }, [
        comp('subheading', { text: 'No sealed parts' }),
        comp('heading', { text: 'Designed for the second decade, not the unboxing' }),
        comp('iconFeature', { icon: 'Hammer', text: 'Made in one workshop', sub: 'Cut, folded, wired, and tested within thirty metres.' }),
        comp('iconFeature', { icon: 'PackageCheck', text: 'Flat-packed without foam', sub: 'Moulded paper corners and one reusable cotton sleeve.' }),
        comp('iconFeature', { icon: 'ShieldCheck', text: 'Twelve-year repair promise', sub: 'Parts at cost. Labour remains free for the life of the edition.' }),
      ]),

      sec('testimonials', 'grid', 'loud', { eyebrow: 'In use' }, [
        comp('subheading', { text: 'Bought to live with' }),
        comp('heading', { text: 'Specific reactions carry more weight than generic praise' }),
        comp('quote', { text: 'The hinge is the whole thing. You adjust it once, feel the resistance, and understand exactly where the money went.', sub: 'Samar Haddad · architect', proofTier: 1 }),
        comp('quote', { text: 'It is the only object in my bedroom that looks better when it is switched off.', sub: 'Elliot Vane · Edition 02 owner', proofTier: 1 }),
        comp('quote', { text: 'Northline sent the replacement driver with a diagram and a return label. Ten minutes, no landfill.', sub: 'Mina Cho · Edition 01 owner', proofTier: 2 }),
        comp('quote', { text: 'The scale is restrained enough for a desk but the shadow turns an entire wall into part of the object.', sub: 'Omar Serag · gallerist', proofTier: 2 }),
      ]),

      sec('faq', 'accordion', 'calm', { eyebrow: 'Edition notes' }, [
        comp('heading', { text: 'Everything worth checking before you reserve one' }),
        comp('faqItem', { text: 'When does Edition 04 ship?', sub: 'Objects leave the workshop in numbered groups from 4–22 November. You receive your exact date at reservation.' }),
        comp('faqItem', { text: 'Which plug and voltage?', sub: 'The driver accepts 100–240V. We fit the correct plug for your delivery country before testing.' }),
        comp('faqItem', { text: 'Can I return it?', sub: 'Yes. Live with it for thirty days. We collect it at our cost if it does not belong in the room.' }),
        comp('faqItem', { text: 'Will this edition be repeated?', sub: 'No. The tooling is archived after piece 120. Materials may return in a different object, never this form.' }),
      ]),

      sec('ctaBanner', 'panel', 'loud', {}, [
        comp('heading', { tones: t('Edition 04 closes at 120', 'Choose the number that becomes yours', 'Thirty-eight pieces remain') }),
        comp('paragraph', { text: 'AED 2,180. A 25% deposit reserves your number; the balance is due when your object passes its final light test.' }),
        comp('button', { emphasis: 'primary', tones: t('Reserve Fold 04', 'Choose my number', 'Reserve before the edition closes') }),
      ]),

      sec('footer', 'big', 'loud', {}, [
        comp('heading', { text: 'Northline Objects' }),
        comp('paragraph', { text: 'Useful things, reduced until nothing else can leave.' }),
        comp('listItem', { text: 'Current edition' }),
        comp('listItem', { text: 'Archive' }),
        comp('listItem', { text: 'Repairs' }),
        comp('listItem', { text: 'Workshop' }),
      ]),
    ],
  }
}

export function intervalPage(): Page {
  return {
    id: uid('page'),
    name: 'Interval Capital',
    tokens: {
      paletteId: 'instrument',
      fontPairId: 'technical',
      radius: 8,
      spacing: 0.92,
      typeScale: 1.23,
      baseSize: 16,
    },
    sections: [
      sec('hero', 'split', 'loud', { splitRatio: 44, swapSides: false }, [
        comp('badge', { tones: t('Multi-entity treasury', 'A calmer view of every account', 'Close books nine days faster') }),
        comp('heading', { tones: t('Capital decisions, with the missing context restored', 'See what moved, what changed, and what needs you', 'Stop reconciling yesterday. Control today.') }),
        comp('paragraph', { text: 'Interval unifies bank positions, commitments, approvals, and forecast variance for finance teams managing more than one entity.' }),
        comp('button', { emphasis: 'primary', tones: t('Request an operating review', 'See your accounts together', 'Book the 30-minute review') }),
        comp('button', { emphasis: 'ghost', text: 'Inspect the control model' }),
        comp('imageSlot', { ratio: '16/10', assetSrc: '/generated/interval-system.jpg', placeholder: 7 }),
        comp('stat', { text: '9.4 days', sub: 'median month-end saved', proofTier: 1 }),
      ]),

      sec('logoBar', 'marquee', 'calm', { eyebrow: 'Finance teams' }, [
        comp('subheading', { text: 'Used where one spreadsheet is no longer enough' }),
        comp('logoRow', { logos: ['Trellis Energy', 'Rook Aviation', 'Kindred Labs', 'Morrow Foods', 'Norhall', 'Cinder Group'], proofTier: 1 }),
      ]),

      sec('featureGrid', 'iconList', 'calm', { eyebrow: 'Control model' }, [
        comp('subheading', { text: 'From position to decision' }),
        comp('heading', { text: 'One sequence, repeated every morning' }),
        comp('paragraph', { text: 'The layout mirrors the mental model of a finance lead: establish truth, isolate change, assign action, preserve evidence.' }),
        comp('iconFeature', { icon: 'Database', text: 'Establish the position', sub: 'Bank feeds, ERP balances, facilities, and restricted cash reconciled to one timestamp.' }),
        comp('iconFeature', { icon: 'Activity', text: 'Explain the variance', sub: 'Every material change paired with its source transaction and forecast assumption.' }),
        comp('iconFeature', { icon: 'Workflow', text: 'Route the decision', sub: 'Owners, limits, evidence, and approval history travel with the action.' }),
        comp('iconFeature', { icon: 'LockKeyhole', text: 'Preserve the record', sub: 'A complete, exportable control trail with no edits hidden behind sync.' }),
      ]),

      sec('bento', 'contrast', 'loud', { eyebrow: 'Operating view', rows: 2 }, [
        comp('subheading', { text: 'Information by consequence' }),
        comp('heading', { text: 'The screen gets quieter as confidence rises' }),
        comp('bentoCard', { text: 'AED 86.4m', sub: 'consolidated available cash · 07:42 GST', span: { col: 7, row: 2 } }),
        comp('bentoCard', { text: '3 exceptions', sub: 'two stale feeds · one covenant threshold', span: { col: 5, row: 1 } }),
        comp('bentoCard', { text: '+6.8%', sub: 'thirteen-week runway vs plan', span: { col: 5, row: 1 } }),
        comp('bentoCard', { text: '14 minutes', sub: 'median approval time this quarter', span: { col: 4, row: 1 } }),
        comp('bentoCard', { text: '100%', sub: 'material movements with attached evidence', span: { col: 8, row: 1 } }),
      ]),

      sec('testimonials', 'single', 'calm', { eyebrow: 'Operator proof' }, [
        comp('subheading', { text: 'A finance result, not a software compliment' }),
        comp('quote', { text: 'Our Monday treasury meeting fell from ninety minutes to twenty-two. Nobody arrives with their own version of cash anymore.', sub: 'Nadine Forsyth · Group CFO, Rook Aviation', proofTier: 1 }),
        comp('stat', { text: '68%', sub: 'less time assembling weekly cash', proofTier: 2 }),
        comp('stat', { text: '0', sub: 'unattributed material variances in Q2', proofTier: 3 }),
      ]),

      sec('pricing', 'list', 'calm', { eyebrow: 'Engagement' }, [
        comp('subheading', { text: 'Start with the operating model' }),
        comp('heading', { text: 'We map the decision before we configure the system' }),
        comp('priceTag', { text: 'No charge', tones: t('Operating review', 'Working session', '30-minute review'), sub: 'accounts, entities, close rhythm, and approval paths', bullets: ['Current-state map', 'Control gaps', 'Implementation range'] }),
        comp('button', { emphasis: 'primary', text: 'Request the review' }),
      ]),

      sec('ctaBanner', 'ribbon', 'loud', {}, [
        comp('heading', { text: 'Bring the spreadsheet everyone argues about' }),
        comp('paragraph', { text: 'We will map the decisions hiding inside it and show where Interval removes work without removing control.' }),
        comp('button', { emphasis: 'primary', text: 'Book the operating review' }),
      ]),

      sec('footer', 'minimal', 'loud', {}, [
        comp('heading', { text: 'Interval' }),
        comp('paragraph', { text: 'Treasury operations for multi-entity finance teams.' }),
        comp('listItem', { text: 'Security' }),
        comp('listItem', { text: 'Control model' }),
        comp('listItem', { text: 'Customers' }),
        comp('listItem', { text: 'Contact' }),
      ]),
    ],
  }
}

export function lumenPage(): Page {
  return {
    id: uid('page'),
    name: 'Lumen Form',
    tokens: {
      paletteId: 'mineral',
      fontPairId: 'editorial',
      radius: 22,
      spacing: 1.18,
      typeScale: 1.28,
      baseSize: 17,
    },
    sections: [
      sec('hero', 'split', 'calm', { splitRatio: 53, swapSides: true }, [
        comp('badge', { tones: t('Clinical skin studio · Jumeirah', 'A slower appointment for your skin', 'New consultations · September') }),
        comp('heading', { tones: t('Treat the pattern, not this week’s symptom', 'Your skin makes sense when somebody takes the time', 'Start with a 70-minute skin mapping') }),
        comp('paragraph', { text: 'A clinician-led studio for persistent sensitivity, pigmentation, and barrier damage. Every plan begins with imaging, history, and eight quiet weeks.' }),
        comp('button', { emphasis: 'primary', tones: t('Book skin mapping', 'Meet your clinician', 'See September times') }),
        comp('button', { emphasis: 'ghost', text: 'Read the method' }),
        comp('imageSlot', { ratio: '4/5', assetSrc: '/generated/lumen-serum.jpg', placeholder: 6 }),
        comp('starRating', { rating: 5, sub: '4.91 · 428 verified appointments', proofTier: 1 }),
      ]),

      sec('featureGrid', 'iconList', 'calm', { eyebrow: 'The method' }, [
        comp('subheading', { text: 'Observe before intervening' }),
        comp('heading', { text: 'A sequence designed to lower uncertainty' }),
        comp('iconFeature', { icon: 'ScanFace', text: 'Map', sub: 'Polarised imaging, barrier measurements, product history, medication, and the patterns you have already noticed.' }),
        comp('iconFeature', { icon: 'FlaskConical', text: 'Reduce', sub: 'We remove conflicts and irritation before adding actives. The first plan is usually shorter than expected.' }),
        comp('iconFeature', { icon: 'CalendarCheck', text: 'Observe', sub: 'Eight weeks of one controlled change at a time, documented in the same light.' }),
        comp('iconFeature', { icon: 'Leaf', text: 'Build', sub: 'Only then do we address pigment, texture, or age-related goals with the barrier intact.' }),
      ]),

      sec('testimonials', 'cards', 'loud', { eyebrow: 'Patient diaries' }, [
        comp('subheading', { text: 'Relief is the conversion event' }),
        comp('heading', { text: 'The stories focus on feeling understood before looking transformed' }),
        comp('quote', { text: 'For the first time, someone explained why every “gentle” routine still burned. We removed four products and my skin settled in twelve days.', sub: 'Aya M. · sensitivity plan', proofTier: 1 }),
        comp('quote', { text: 'The photographs kept me honest. Week three felt slow; week eight showed a difference I could not argue with.', sub: 'Rina Das · pigmentation plan', proofTier: 1 }),
        comp('quote', { text: 'There was no sales shelf at the end of the appointment. I left with two changes and an actual reason for each one.', sub: 'Camille B. · barrier recovery', proofTier: 2 }),
      ]),

      sec('pricing', 'featured', 'calm', { eyebrow: 'Plans' }, [
        comp('subheading', { text: 'Clear commitments' }),
        comp('heading', { text: 'Enough support to see a pattern, not trap you in a programme' }),
        comp('priceTag', { text: 'AED 520', tones: t('Skin mapping', 'First appointment', 'Start here'), sub: '70 minutes', bullets: ['Polarised imaging', 'Barrier measurements', 'Written 8-week plan'] }),
        comp('priceTag', { text: 'AED 1,480', tones: t('Barrier reset', 'The guided plan', 'Most booked'), sub: 'mapping + 3 reviews', featured: true, bullets: ['Everything in mapping', 'Three review appointments', 'Routine adjustments', 'Repeat imaging'] }),
        comp('priceTag', { text: 'AED 280', tones: t('Review', 'Check-in', 'Existing patients'), sub: '35 minutes', bullets: ['Progress imaging', 'Tolerance review', 'Updated plan'] }),
        comp('button', { emphasis: 'primary', text: 'Choose this plan' }),
      ]),

      sec('faq', 'boxed', 'calm', { eyebrow: 'A gentle boundary' }, [
        comp('heading', { text: 'What we do, what we do not, and when a dermatologist is the right next step' }),
        comp('faqItem', { text: 'Do you prescribe medication?', sub: 'No. We work alongside dermatologists and refer any condition that needs diagnosis or prescription treatment.' }),
        comp('faqItem', { text: 'Will I be asked to buy products?', sub: 'Only when a specific gap exists. We recommend by ingredient and format first, with options at different prices.' }),
        comp('faqItem', { text: 'Can I bring my current routine?', sub: 'Please do. Bring every product, supplement, and prescription you use, even occasionally.' }),
        comp('faqItem', { text: 'Is the plan suitable during pregnancy?', sub: 'Yes. We adapt every ingredient and treatment boundary, and coordinate with your doctor when needed.' }),
      ]),

      sec('ctaBanner', 'panel', 'loud', {}, [
        comp('heading', { tones: t('Start with seventy unhurried minutes', 'Bring the shelf. Bring the questions.', 'September mapping appointments are open') }),
        comp('paragraph', { text: 'You leave with photographs, measurements, and an eight-week plan. No package decision is required on the day.' }),
        comp('button', { emphasis: 'primary', tones: t('Book skin mapping', 'Find a quiet appointment', 'See September times') }),
      ]),

      sec('footer', 'columns', 'calm', {}, [
        comp('heading', { text: 'Lumen Form' }),
        comp('paragraph', { text: 'Clinical skin health, without the clinical rush.' }),
        comp('listItem', { text: 'The method' }),
        comp('listItem', { text: 'Clinicians' }),
        comp('listItem', { text: 'Plans' }),
        comp('listItem', { text: 'Journal' }),
        comp('listItem', { text: 'Book' }),
      ]),
    ],
  }
}

export function signalPage(): Page {
  return {
    id: uid('page'),
    name: 'Signal / Noise Studio',
    tokens: {
      paletteId: 'signal',
      fontPairId: 'technical',
      radius: 0,
      spacing: 1.3,
      typeScale: 1.39,
      baseSize: 16,
    },
    sections: [
      sec('hero', 'minimal', 'loud', {}, [
        comp('badge', { tones: t('Independent brand practice', 'A small studio for consequential launches', 'Two project starts left this quarter') }),
        comp('heading', { tones: t('Make the decision visible', 'Find the idea people will remember', 'Launch with one idea, not forty assets') }),
        comp('paragraph', { text: 'Signal / Noise builds identity systems for organisations at the moment their old story stops being useful.' }),
        comp('button', { emphasis: 'primary', tones: t('Read three case studies', 'See how we work', 'Request a project start') }),
      ]),

      sec('logoBar', 'marquee', 'calm', { eyebrow: 'Selected clients' }, [
        comp('subheading', { text: 'Work that had to change a mind' }),
        comp('logoRow', { logos: ['Rift Records', 'Nahara', 'Public Assembly', 'Tenfold', 'Arbor Works', 'The Listening Room'], proofTier: 1 }),
      ]),

      sec('bento', 'contrast', 'loud', { eyebrow: 'Selected work', rows: 3 }, [
        comp('subheading', { text: 'Three problems, three different structures' }),
        comp('heading', { text: 'A portfolio should prove range without losing a point of view' }),
        comp('bentoCard', { text: 'Rift Records', sub: 'Turning a respected archive into a living label. Identity, campaign, physical editions.', span: { col: 8, row: 2 } }),
        comp('bentoCard', { text: 'Nahara', sub: 'Making climate data legible to the people deciding where to build.', span: { col: 4, row: 1 } }),
        comp('bentoCard', { text: 'Public Assembly', sub: 'A civic platform that had to feel serious without feeling governmental.', span: { col: 4, row: 1 } }),
        comp('bentoCard', { text: '10 weeks', sub: 'from decision to complete identity system', span: { col: 5, row: 1 } }),
        comp('bentoCard', { text: 'One senior team', sub: 'the people in the room are the people making the work', span: { col: 7, row: 1 } }),
      ]),

      sec('featureGrid', 'bordered', 'calm', { eyebrow: 'The practice' }, [
        comp('subheading', { text: 'Strategy that has to survive contact with design' }),
        comp('heading', { text: 'Each stage removes a different kind of noise' }),
        comp('iconFeature', { icon: 'MessageSquare', text: 'Language', sub: 'The sentence only your organisation can say, with evidence behind every word.' }),
        comp('iconFeature', { icon: 'Layers3', text: 'System', sub: 'Type, image, colour, motion, and voice working as one recognisable behaviour.' }),
        comp('iconFeature', { icon: 'Compass', text: 'Launch', sub: 'A sequence that earns attention before it asks for action.' }),
      ]),

      sec('testimonials', 'marquee', 'calm', { eyebrow: 'After launch' }, [
        comp('subheading', { text: 'What changed inside the organisation' }),
        comp('quote', { text: 'The identity ended six months of circular conversation. Everyone could finally see the company we had already become.', sub: 'Ibrahim Noor · founder, Nahara', proofTier: 1 }),
        comp('quote', { text: 'They did not give us a louder campaign. They gave the launch an order, and suddenly every asset had a job.', sub: 'Marta Silvestri · director, Rift Records', proofTier: 1 }),
        comp('quote', { text: 'Our team still uses the decision principles, not just the files. That is the difference.', sub: 'Anika Bose · Public Assembly', proofTier: 2 }),
      ]),

      sec('faq', 'twoCol', 'loud', { eyebrow: 'Fit' }, [
        comp('heading', { text: 'Useful boundaries before either of us books a call' }),
        comp('faqItem', { text: 'What kinds of projects fit?', sub: 'New identities, consequential repositioning, and launches where the story is still the hardest part.' }),
        comp('faqItem', { text: 'How long does it take?', sub: 'Eight to fourteen weeks. We take on two major projects at a time and do not compress the decision stages.' }),
        comp('faqItem', { text: 'Do you work with in-house teams?', sub: 'Yes. The best projects transfer a system and a way of judging work, not dependence on our studio.' }),
        comp('faqItem', { text: 'What does it cost?', sub: 'Identity engagements begin at AED 145,000. After the first call, we send a written range before asking for a workshop.' }),
      ]),

      sec('ctaBanner', 'ribbon', 'loud', {}, [
        comp('heading', { text: 'Tell us what has become difficult to explain' }),
        comp('paragraph', { text: 'A useful first note is five sentences: what changed, who needs to believe it, and what happens if they do not.' }),
        comp('button', { emphasis: 'primary', text: 'Write the first note' }),
      ]),

      sec('footer', 'big', 'loud', {}, [
        comp('heading', { text: 'Signal / Noise' }),
        comp('paragraph', { text: 'Brand systems for moments that cannot afford ambiguity.' }),
        comp('listItem', { text: 'Work' }),
        comp('listItem', { text: 'Practice' }),
        comp('listItem', { text: 'Notes' }),
        comp('listItem', { text: 'Contact' }),
      ]),
    ],
  }
}

export function commonThreadPage(): Page {
  return {
    id: uid('page'),
    name: 'Common Thread',
    tokens: {
      paletteId: 'civic',
      fontPairId: 'neutral',
      radius: 10,
      spacing: 1.05,
      typeScale: 1.27,
      baseSize: 17,
    },
    sections: [
      sec('hero', 'minimal', 'loud', {}, [
        comp('badge', { tones: t('Neighbourhood cooling fund', 'A cooler street starts at one front door', '118 homes before the next heat season') }),
        comp('heading', { tones: t('Shade is public infrastructure', 'Make one ordinary walk feel possible again', 'Fund the next 118 shaded doorways') }),
        comp('paragraph', { text: 'Common Thread funds trees, shade structures, and cooled thresholds on the routes children and older neighbours use every day.' }),
        comp('button', { emphasis: 'primary', tones: t('See the funded routes', 'Find your street', 'Fund one doorway') }),
      ]),

      sec('testimonials', 'single', 'calm', { eyebrow: 'One route' }, [
        comp('subheading', { text: 'Start with a human-sized consequence' }),
        comp('heading', { text: 'At 4:10pm, the walk home changed' }),
        comp('quote', { text: 'My mother used to wait until sunset to visit us. Now she walks the three blocks after asr because there is shade at every crossing.', sub: 'Sameera Ali · Al Muteena resident', proofTier: 1 }),
      ]),

      sec('featureGrid', 'bordered', 'calm', { eyebrow: 'The model' }, [
        comp('subheading', { text: 'From donation to temperature' }),
        comp('heading', { text: 'Every contribution follows a route you can inspect' }),
        comp('iconFeature', { icon: 'Map', text: 'Map the heat', sub: 'Surface readings and resident reports identify the walks people already avoid.' }),
        comp('iconFeature', { icon: 'Users', text: 'Choose together', sub: 'Residents set the priority route, tree species, and the places that need immediate shade.' }),
        comp('iconFeature', { icon: 'Leaf', text: 'Build and maintain', sub: 'Local contractors install; five years of watering and repair are funded up front.' }),
      ]),

      sec('bento', 'soft', 'loud', { eyebrow: 'Live progress', rows: 2 }, [
        comp('subheading', { text: 'Proof before another appeal' }),
        comp('heading', { text: 'The numbers show completion, not intention' }),
        comp('bentoCard', { text: '3.8 km', sub: 'of continuous shaded walking routes completed', span: { col: 7, row: 2 } }),
        comp('bentoCard', { text: '11.6°C', sub: 'median surface-temperature reduction at 4pm', span: { col: 5, row: 1 } }),
        comp('bentoCard', { text: '842', sub: 'doors within a five-minute shaded walk', span: { col: 5, row: 1 } }),
        comp('bentoCard', { text: '93%', sub: 'of every dirham reaches build and maintenance', span: { col: 4, row: 1 } }),
        comp('bentoCard', { text: '118 homes', sub: 'the next route, fully designed and permit-ready', span: { col: 8, row: 1 } }),
      ]),

      sec('pricing', 'list', 'calm', { eyebrow: 'Fund a piece' }, [
        comp('subheading', { text: 'Concrete amounts, concrete outcomes' }),
        comp('heading', { text: 'Choose the scale of change you can picture' }),
        comp('priceTag', { text: 'AED 85', tones: t('Canopy care', 'Keep one tree growing', 'Fund a month of care'), sub: 'one month of water and maintenance', bullets: ['Route-specific receipt'] }),
        comp('priceTag', { text: 'AED 420', tones: t('Doorway shade', 'Cool one threshold', 'Fund one home'), sub: 'fabrication and five-year repair reserve', bullets: ['Named block update'] }),
        comp('priceTag', { text: 'AED 2,600', tones: t('Crossing canopy', 'Shade one crossing', 'Complete one crossing'), sub: 'structure, permit, and maintenance', bullets: ['Installation record', 'Temperature follow-up'] }),
        comp('button', { emphasis: 'primary', text: 'Fund this outcome' }),
      ]),

      sec('ctaBanner', 'centered', 'loud', {}, [
        comp('badge', { text: 'Route 07 · permit ready' }),
        comp('heading', { tones: t('Complete the next 118 doorways', 'Help one ordinary walk stay possible', 'AED 184,000 closes the route') }),
        comp('paragraph', { text: 'The design, permits, contractors, and five-year maintenance reserve are ready. Funding is the final dependency.' }),
        comp('button', { emphasis: 'primary', tones: t('Fund Route 07', 'Help finish the route', 'Contribute now') }),
      ]),

      sec('footer', 'columns', 'loud', {}, [
        comp('heading', { text: 'Common Thread' }),
        comp('paragraph', { text: 'Neighbourhood climate infrastructure, chosen and measured locally.' }),
        comp('listItem', { text: 'Funded routes' }),
        comp('listItem', { text: 'Live data' }),
        comp('listItem', { text: 'Governance' }),
        comp('listItem', { text: 'Receipts' }),
        comp('listItem', { text: 'Contact' }),
      ]),
    ],
  }
}
