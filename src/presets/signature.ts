import { uid } from '@/lib/id'
import type { Page } from '@/types'
import { comp, sec, t } from './helpers'

/** Signature templates use one object, one claim, and a slow proof sequence. */

export function orisonPage(): Page {
  return {
    id: uid('page'),
    name: 'Orison One',
    tokens: {
      paletteId: 'orison',
      fontPairId: 'product',
      radius: 18,
      spacing: 1.18,
      typeScale: 1.28,
      baseSize: 17,
    },
    sections: [
      sec('hero', 'split', 'calm', { splitRatio: 58 }, [
        comp('badge', { tones: t('Orison One · Spatial audio', 'One room. Every seat.', 'First edition ships 14 November') }),
        comp('heading', { tones: t('Sound that maps the room', 'The room disappears. The music stays.', 'Hear the first edition in your room') }),
        comp('paragraph', { text: 'A single aluminium loudspeaker with twelve individually driven emitters, room-scale phase correction, and no microphone recordings stored or sent.' }),
        comp('button', { emphasis: 'primary', tones: t('Listen to the design', 'See how it feels at home', 'Reserve the first edition') }),
        comp('button', { emphasis: 'ghost', text: 'Read the acoustic paper' }),
        comp('priceTag', { text: 'AED 4,850', sub: 'delivery and in-room calibration included' }),
        comp('imageSlot', { ratio: '4/5', assetSrc: '/generated/orison-one.jpg', placeholder: 3 }),
      ]),

      sec('bento', 'storyRail', 'calm', { eyebrow: 'The listening sequence' }, [
        comp('subheading', { text: 'Four decisions, heard in order' }),
        comp('heading', { text: 'The technology recedes one chapter at a time' }),
        comp('paragraph', { text: 'Instead of presenting every specification at once, the page reveals only the engineering needed to explain the next felt difference.' }),
        comp('bentoCard', { text: 'First, the room becomes part of the instrument', sub: 'A six-second low-volume sweep measures reflections and builds a local acoustic map. The map stays on the speaker.' }),
        comp('bentoCard', { text: 'Then, twelve emitters behave as one source', sub: 'Each driver corrects phase independently, so voices remain anchored when you move across the room.' }),
        comp('bentoCard', { text: 'At night, detail survives without volume', sub: 'A dedicated low-level contour preserves bass shape and dialogue texture below conversation level.' }),
        comp('bentoCard', { text: 'When the music stops, the object goes quiet too', sub: 'No light ring. No idle screen. The control seam disappears into the aluminium skin.' }),
      ]),

      sec('featureGrid', 'bordered', 'calm', { eyebrow: 'Material facts' }, [
        comp('subheading', { text: 'Precision without theatre' }),
        comp('heading', { text: 'Every visible choice has an acoustic job' }),
        comp('iconFeature', { icon: 'AudioLines', text: '12 emitters', sub: 'Eight full-range, three low-frequency, one upward spatial channel.' }),
        comp('iconFeature', { icon: 'Rewind', text: '0.7 ms correction', sub: 'Per-driver timing updated whenever the speaker moves rooms.' }),
        comp('iconFeature', { icon: 'Recycle', text: '84% recycled aluminium', sub: 'One replaceable acoustic core; the shell is designed to outlive it.' }),
      ]),

      sec('testimonials', 'single', 'loud', { eyebrow: 'Listening room 06' }, [
        comp('subheading', { text: 'Proof described in position, not superlatives' }),
        comp('quote', { text: 'I walked from the desk to the kitchen and the voice stayed exactly where the singer had been standing. That was the demonstration.', sub: 'Amal Reyes · recording engineer', proofTier: 1 }),
        comp('stat', { text: '±1.2 dB', sub: 'seat-to-seat variation across a 34 m² room', proofTier: 2 }),
      ]),

      sec('pricing', 'list', 'calm', { eyebrow: 'First edition' }, [
        comp('subheading', { text: 'One object. Everything included.' }),
        comp('heading', { text: 'No stands, hubs, subscriptions, or calibration fee' }),
        comp('priceTag', { text: 'AED 4,850', tones: t('Orison One', 'The complete object', 'First edition'), sub: 'ships 14 November', bullets: ['In-room calibration', 'Five-year acoustic-core cover', 'Sixty-day home trial'] }),
        comp('button', { emphasis: 'primary', text: 'Reserve Orison One' }),
      ]),

      sec('faq', 'twoCol', 'calm', { eyebrow: 'Before it enters the room' }, [
        comp('heading', { text: 'The questions that deserve an exact answer' }),
        comp('faqItem', { text: 'Does it record conversations?', sub: 'No. The calibration microphones switch off after the room sweep. Raw measurements are discarded after the local room map is calculated.' }),
        comp('faqItem', { text: 'Which services work?', sub: 'AirPlay, Spotify Connect, Tidal Connect, UPnP, HDMI eARC, optical, and USB-C audio. Local playback works without an account.' }),
        comp('faqItem', { text: 'Can two speakers pair?', sub: 'Yes. A second unit can run as a true left-right pair while each speaker retains its own room correction.' }),
        comp('faqItem', { text: 'What happens when the electronics age?', sub: 'The acoustic core slides out as one serviceable module. The aluminium shell, base, and perforated skin remain.' }),
      ]),

      sec('ctaBanner', 'panel', 'loud', {}, [
        comp('badge', { text: 'First edition · 480 units' }),
        comp('heading', { text: 'Live with it for sixty nights' }),
        comp('paragraph', { text: 'We calibrate it in your room. If it never becomes the system you reach for, collection and return are on us.' }),
        comp('button', { emphasis: 'primary', text: 'Reserve for AED 485' }),
      ]),

      sec('footer', 'minimal', 'calm', {}, [
        comp('heading', { text: 'Orison' }),
        comp('paragraph', { text: 'Objects for close listening.' }),
        comp('listItem', { text: 'Design' }),
        comp('listItem', { text: 'Acoustics' }),
        comp('listItem', { text: 'Privacy' }),
        comp('listItem', { text: 'Service' }),
      ]),
    ],
  }
}

export function kestrelPage(): Page {
  return {
    id: uid('page'),
    name: 'Kestrel R1',
    tokens: {
      paletteId: 'kestrel',
      fontPairId: 'technical',
      radius: 2,
      spacing: 1.08,
      typeScale: 1.3,
      baseSize: 16,
    },
    sections: [
      sec('hero', 'fullBleed', 'loud', { overlay: true, overlayIntensity: 52 }, [
        comp('badge', { tones: t('Kestrel R1 · Electric road machine', 'Built around the first corner', 'Founders series · 90 machines') }),
        comp('heading', { tones: t('Mass where grip needs it. Nothing where it does not.', 'Silent at the light. Alive through the corner.', 'Configure one of ninety founders-series machines') }),
        comp('paragraph', { text: 'A 168 kg road machine with a structural battery, 118 kW peak output, and geometry developed around mountain roads rather than launch-control numbers.' }),
        comp('button', { emphasis: 'primary', tones: t('Study the chassis', 'See the road programme', 'Configure R1') }),
        comp('button', { emphasis: 'ghost', text: 'Read the test report' }),
        comp('imageSlot', { ratio: '16/9', assetSrc: '/generated/kestrel-r1.jpg', placeholder: 7 }),
      ]),

      sec('bento', 'storyRail', 'calm', { eyebrow: 'Built from the contact patch up' }, [
        comp('subheading', { text: 'The engineering story' }),
        comp('heading', { text: 'Performance explained as consequence, not theatre' }),
        comp('bentoCard', { text: 'The battery carries the chassis load', sub: 'Machined rails key directly into the pack enclosure, removing a conventional cradle and lowering torsional mass.' }),
        comp('bentoCard', { text: 'Cooling follows the cells that work hardest', sub: 'Three independent circuits balance temperature across the pack during repeated mountain descents and fast charging.' }),
        comp('bentoCard', { text: 'Regeneration is tuned at the lever', sub: 'Four levels, adjustable while riding. The strongest setting produces 0.28 g without touching the hydraulic brakes.' }),
        comp('bentoCard', { text: 'Range is quoted at the pace it was measured', sub: '218 km mixed road, 146 km sustained motorway, 112 km mountain test loop. Conditions published in full.' }),
      ]),

      sec('bento', 'contrast', 'loud', { eyebrow: 'R1 in numbers', rows: 2 }, [
        comp('subheading', { text: 'No simulated performance' }),
        comp('heading', { text: 'The figures that change the ride' }),
        comp('bentoCard', { text: '168 kg', sub: 'wet mass, including 14.2 kWh pack', span: { col: 7, row: 2 } }),
        comp('bentoCard', { text: '118 kW', sub: 'peak · 74 kW continuous', span: { col: 5, row: 1 } }),
        comp('bentoCard', { text: '218 km', sub: 'independently witnessed mixed-road range', span: { col: 5, row: 1 } }),
        comp('bentoCard', { text: '23 min', sub: '10–80% at 180 kW', span: { col: 4, row: 1 } }),
        comp('bentoCard', { text: '1.48°', sub: 'maximum measured chassis twist under load', span: { col: 8, row: 1 } }),
      ]),

      sec('testimonials', 'single', 'calm', { eyebrow: 'Independent road test' }, [
        comp('subheading', { text: 'Describe the corner, not the category' }),
        comp('quote', { text: 'The surprising number is not 118 kilowatts. It is 168 kilograms. The R1 changes direction before your electric-motorcycle expectations arrive.', sub: 'Elena Varga · vehicle dynamics editor', proofTier: 1 }),
        comp('stat', { text: '1:47.6', sub: 'Jebel Hafeet closed-course reference lap', proofTier: 2 }),
      ]),

      sec('pricing', 'list', 'loud', { eyebrow: 'Founders series' }, [
        comp('subheading', { text: 'Ninety machines, built in three groups' }),
        comp('heading', { text: 'Configure the contact points. The chassis stays fixed.' }),
        comp('priceTag', { text: 'AED 78,000', tones: t('Kestrel R1', 'Your road setup', 'Founders series'), sub: 'AED 7,800 refundable configuration deposit', bullets: ['Road or low clip-on cockpit', 'Two seat heights', 'Graphite or raw aluminium rails', 'Five-year battery floor'] }),
        comp('button', { emphasis: 'primary', text: 'Begin configuration' }),
      ]),

      sec('faq', 'accordion', 'calm', { eyebrow: 'Ownership' }, [
        comp('heading', { text: 'Performance is only useful if the machine remains usable' }),
        comp('faqItem', { text: 'Where is it serviced?', sub: 'Dubai and Abu Dhabi launch first, with mobile technicians for routine work. The complete service schedule is published before deposit.' }),
        comp('faqItem', { text: 'What does the battery guarantee mean?', sub: 'At least 82% measured usable capacity after five years or 80,000 km. Below that floor, the affected module is replaced.' }),
        comp('faqItem', { text: 'Can it use public DC chargers?', sub: 'Yes. CCS2 up to 180 kW and AC Type 2 up to 11 kW. The navigation system filters stations by verified uptime.' }),
        comp('faqItem', { text: 'When are deliveries?', sub: 'Group one in March, group two in May, group three in July. Your group is confirmed before the configuration deposit becomes non-refundable.' }),
      ]),

      sec('ctaBanner', 'ribbon', 'loud', {}, [
        comp('heading', { text: 'Ninety frames. One geometry.' }),
        comp('paragraph', { text: 'Configuration begins with your reach, inseam, and the roads you ride most. Deposit remains refundable until the final specification call.' }),
        comp('button', { emphasis: 'primary', text: 'Configure Kestrel R1' }),
      ]),

      sec('footer', 'big', 'loud', {}, [
        comp('heading', { text: 'Kestrel' }),
        comp('paragraph', { text: 'Electric road machines, developed around mass and grip.' }),
        comp('listItem', { text: 'R1' }),
        comp('listItem', { text: 'Engineering' }),
        comp('listItem', { text: 'Range method' }),
        comp('listItem', { text: 'Service' }),
      ]),
    ],
  }
}

export function fieldPage(): Page {
  return {
    id: uid('page'),
    name: 'Field C1',
    tokens: {
      paletteId: 'field',
      fontPairId: 'technical',
      radius: 6,
      spacing: 1.12,
      typeScale: 1.28,
      baseSize: 16,
    },
    sections: [
      sec('hero', 'split', 'calm', { splitRatio: 58, swapSides: true }, [
        comp('badge', { tones: t('Field C1 · 8K cinema system', 'A smaller camera for longer days', 'Production units ship in six weeks') }),
        comp('heading', { tones: t('The image pipeline, without the rig around it', 'Carry less. Keep the latitude.', 'Build the camera your next production needs') }),
        comp('paragraph', { text: 'A 980 g full-frame cinema body with 16.4 stops of measured latitude, internal 8K RAW, and a modular side grip that holds the controls your hand actually reaches.' }),
        comp('button', { emphasis: 'primary', tones: t('Inspect the pipeline', 'See the field build', 'Configure C1') }),
        comp('button', { emphasis: 'ghost', text: 'Download ungraded footage' }),
        comp('imageSlot', { ratio: '16/10', assetSrc: '/generated/field-c1.jpg', placeholder: 4 }),
        comp('stat', { text: '980 g', sub: 'body with recording media', proofTier: 1 }),
      ]),

      sec('bento', 'storyRail', 'calm', { eyebrow: 'From light to archive' }, [
        comp('subheading', { text: 'One pipeline, shown end to end' }),
        comp('heading', { text: 'Professional trust comes from what remains unhidden' }),
        comp('bentoCard', { text: 'The sensor is read twice before the image is combined', sub: 'Dual-gain capture preserves highlight colour while keeping the lower mid-tones clean at base ISO 640.' }),
        comp('bentoCard', { text: 'RAW is compressed by visible, reversible rules', sub: 'Three ratios, all wavelet-based, with decode source published for long-term archive access.' }),
        comp('bentoCard', { text: 'Colour starts from spectral measurements', sub: 'The included transform is built from 126 illuminants and delivered as editable matrices, not a baked look.' }),
        comp('bentoCard', { text: 'Every take leaves with its checksums attached', sub: 'Camera-generated xxHash and SHA-256 manifests travel with the clip from card to archive.' }),
      ]),

      sec('featureGrid', 'iconList', 'loud', { eyebrow: 'Field design' }, [
        comp('subheading', { text: 'Built around the operator' }),
        comp('heading', { text: 'The body stays small without moving work into menus' }),
        comp('iconFeature', { icon: 'Aperture', text: 'Six assignable controls', sub: 'ND, frame rate, white balance, shutter, monitoring, and record remain reachable with the eye at the finder.' }),
        comp('iconFeature', { icon: 'HardDrive', text: 'Dual CFexpress Type B', sub: 'Simultaneous proxy, overflow, or verified mirror with independent card health reporting.' }),
        comp('iconFeature', { icon: 'Thermometer', text: '45°C continuous record', sub: 'Internal 8K RAW for 112 minutes in a sealed thermal chamber, test log published.' }),
        comp('iconFeature', { icon: 'Plug', text: 'Open power and timecode', sub: 'Locking 12V input, USB-C PD, full-size BNC timecode, and no proprietary battery requirement.' }),
      ]),

      sec('testimonials', 'marquee', 'calm', { eyebrow: 'Production notes' }, [
        comp('subheading', { text: 'The useful compliments are about work that disappeared' }),
        comp('quote', { text: 'We built it, balanced it, and then stopped discussing the camera for the remaining twenty-three days.', sub: 'Noor Ikeda · director of photography', proofTier: 1 }),
        comp('quote', { text: 'The daylight exterior and sodium-vapour interior cut together before the grade. That is the latitude claim I care about.', sub: 'Harris Cole · colourist', proofTier: 1 }),
        comp('quote', { text: 'A full cinema body under a kilo meant the same shoulder build went straight onto the gimbal. We lost an entire case.', sub: 'Sara Mensah · camera operator', proofTier: 2 }),
      ]),

      sec('pricing', 'list', 'calm', { eyebrow: 'System' }, [
        comp('subheading', { text: 'Own the body. Choose the interfaces.' }),
        comp('heading', { text: 'The base camera records a complete image without an accessory tax' }),
        comp('priceTag', { text: 'AED 24,900', tones: t('Field C1 body', 'The complete camera', 'Production configuration'), sub: 'body, side grip, media reader, 24-month cover', bullets: ['8K RAW internal', 'Electronic variable ND', 'Full-size timecode', 'One colour pipeline licence'] }),
        comp('button', { emphasis: 'primary', text: 'Configure Field C1' }),
      ]),

      sec('faq', 'twoCol', 'loud', { eyebrow: 'Pipeline questions' }, [
        comp('heading', { text: 'A professional tool should answer the unglamorous questions first' }),
        comp('faqItem', { text: 'Which lens mounts?', sub: 'Locking LPL ships standard. User-swappable PL and active E mounts retain flange-depth calibration in the body.' }),
        comp('faqItem', { text: 'What is the crop at 8K 120?', sub: '1.22× horizontal crop. Full-width 8K records to 72 fps; full-width 4K records to 144 fps.' }),
        comp('faqItem', { text: 'Can production use its own media?', sub: 'Yes. Approved CFexpress cards from four manufacturers are listed by sustained write speed, not brand partnership.' }),
        comp('faqItem', { text: 'How are repairs handled?', sub: 'The I/O board, sensor block, power board, and fan module are replaced independently. Loan bodies ship before yours is collected.' }),
      ]),

      sec('ctaBanner', 'panel', 'loud', {}, [
        comp('heading', { text: 'Download the image before you believe the page' }),
        comp('paragraph', { text: 'Six scenes, camera originals, lens metadata, checksums, and the exact transforms used for the reference grade.' }),
        comp('button', { emphasis: 'primary', text: 'Get the 42 GB footage set' }),
      ]),

      sec('footer', 'minimal', 'calm', {}, [
        comp('heading', { text: 'Field' }),
        comp('paragraph', { text: 'Cinema tools that preserve the image and get out of the way.' }),
        comp('listItem', { text: 'C1' }),
        comp('listItem', { text: 'Pipeline' }),
        comp('listItem', { text: 'Footage' }),
        comp('listItem', { text: 'Service' }),
      ]),
    ],
  }
}
