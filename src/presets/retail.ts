import { uid } from '@/lib/id'
import type { Page } from '@/types'
import { comp, sec, t } from './helpers'

/**
 * Ashgrove Supply Co. — a single-product retail page.
 * Editorial hero, alternating proof, hard commercial close.
 */
export function retailPage(): Page {
  return {
    id: uid('page'),
    name: 'Ashgrove — The Weekender',
    tokens: {
      paletteId: 'ink',
      fontPairId: 'technical',
      radius: 6,
      spacing: 1.1,
      typeScale: 1.34,
      baseSize: 16,
    },
    sections: [
      sec(
        'hero',
        'editorial',
        'loud',
        { swapSides: true, overlay: false, overlayIntensity: 30 },
        [
          comp('badge', {
            tones: t('Third edition', 'Made to be lived in', 'Restock — 40 units'),
          }),
          comp('heading', {
            tones: t(
              'The Weekender. Waxed canvas, brass hardware, forty years.',
              'The bag you stop thinking about',
              'Back in stock. It went in nine days last time.',
            ),
          }),
          comp('paragraph', {
            tones: t(
              '18oz British waxed canvas over a riveted brass frame, stitched in a workshop of eleven people. Rated to 22kg. Guaranteed for forty years, repaired free for life.',
              'It gets better the more you use it. The canvas softens, the leather darkens, and the dent from that one airport carousel becomes part of it.',
              'Forty units in this run. The last three restocks sold out inside two weeks and we do not do pre-orders.',
            ),
          }),
          comp('priceTag', { text: 'AED 1,240', sub: 'free shipping, 60-day returns' }),
          comp('button', {
            emphasis: 'primary',
            tones: t('Add to bag', 'Take one home', 'Buy before it goes'),
          }),
          comp('button', {
            emphasis: 'ghost',
            tones: t('Full specification', 'See it in daylight', 'Check stock'),
          }),
          comp('imageSlot', { ratio: '4/5', placeholder: 7 }),
          comp('imageSlot', { ratio: '1/1', placeholder: 8, proofTier: 2 }),
          comp('starRating', { rating: 5, sub: '4.9 from 2,180 verified buyers', proofTier: 1 }),
        ],
      ),

      sec('logoBar', 'marquee', 'calm', { eyebrow: 'Press' }, [
        comp('subheading', {
          tones: t('As specified in', 'People have said nice things', 'Everyone is writing about it'),
        }),
        comp('logoRow', {
          logos: [
            'Monocle',
            'Gear Patrol',
            'The Grade',
            'Carryology',
            'Field Notes',
            'Esquire ME',
            'Hodinkee',
            'Uncrate',
          ],
          proofTier: 1,
        }),
      ]),

      sec('featureGrid', 'alternating', 'calm', { eyebrow: 'Construction' }, [
        comp('subheading', { tones: t('Materials', 'The bits that matter', 'Built to outlast the trend') }),
        comp('heading', {
          tones: t(
            'Every component chosen because it can be replaced',
            'Made by people whose names we can tell you',
            'Nothing in this bag will fail before you do',
          ),
        }),
        comp('iconFeature', {
          icon: 'Layers',
          tones: t('18oz waxed canvas', 'Softens with every trip', 'Weatherproof from day one'),
          sub: 'Milled in Lancashire, dry-waxed rather than oiled, so it will not mark the seat of your car.',
        }),
        comp('iconFeature', {
          icon: 'Wrench',
          tones: t('Field-repairable hardware', 'We fix it, free, forever', 'Zero-cost repairs for life'),
          sub: 'Solid brass buckles on removable rivets. Send it back and we replace them at no charge, however old it is.',
        }),
        comp('iconFeature', {
          icon: 'Ruler',
          tones: t('Cabin-legal, 42 litres', 'Fits a weekend, easily', 'Never check a bag again'),
          sub: '55 × 35 × 22cm — inside the limit for Emirates, Etihad, BA, and Lufthansa cabins.',
        }),
        comp('iconFeature', {
          icon: 'Recycle',
          tones: t('Buy-back programme', 'Pass it on one day', 'Trade in, get 30% off'),
          sub: 'Return any Ashgrove bag at any age for 30% off the next one. We refurbish and resell it as Second Life.',
          proofTier: 2,
        }),
      ]),

      sec('bento', 'contrast', 'loud', { eyebrow: 'In use', rows: 3 }, [
        comp('heading', {
          tones: t(
            'Photographed after three years of use',
            'This is what yours will look like',
            'Second-hand ones resell for 80% of retail',
          ),
        }),
        comp('bentoCard', {
          tones: t('Year three patina', 'Better than new', 'Holds its value'),
          sub: 'No conditioner, no special care. Just three years of airports, back seats, and rain.',
          span: { col: 8, row: 2 },
          placeholder: 9,
        }),
        comp('bentoCard', {
          tones: t('22kg load rated', 'Carries more than you think', 'Tested to destruction'),
          sub: 'Independently drop-tested at full load, 500 cycles.',
          span: { col: 4, row: 1 },
          placeholder: 10,
        }),
        comp('bentoCard', {
          tones: t('Eleven-person workshop', 'Made by hand', 'Only 40 per run'),
          sub: 'Each bag carries the initials of the person who stitched it.',
          span: { col: 4, row: 1 },
          placeholder: 11,
        }),
        comp('bentoCard', {
          tones: t('Six colourways', 'Pick your favourite', 'Two already sold out'),
          sub: 'Field green, ink, sand, oxblood, slate, and natural.',
          span: { col: 12, row: 1 },
          placeholder: 12,
          proofTier: 2,
        }),
      ]),

      sec('testimonials', 'grid', 'calm', { eyebrow: 'Owners' }, [
        comp('subheading', { tones: t('Verified buyers', 'What owners say', '2,180 reviews and counting') }),
        comp('heading', {
          tones: t(
            'Reviews from people who have owned it over a year',
            'The reviews we are most proud of',
            'They all say the same thing: buy it sooner',
          ),
        }),
        comp('quote', {
          tones: t(
            'Four years, sixty-odd flights, one free buckle replacement. The cost per use is now trivial.',
            'It is the only bag I own that I would actually be sad to lose.',
            'Bought it after hesitating for a year. The hesitating was the mistake.',
          ),
          sub: 'Owned since 2022 · Verified',
          proofTier: 1,
        }),
        comp('quote', {
          tones: t(
            'The dimensions are honest. It has never once been challenged at a gate.',
            'It has picked up scuffs in all the right places. Looks better than the day it arrived.',
            'Ordered Thursday, had it Saturday, used it that weekend.',
          ),
          sub: 'Owned since 2023 · Verified',
          proofTier: 1,
        }),
        comp('quote', {
          tones: t(
            'I sent it back for a repair with no receipt and they fixed it anyway. That is the guarantee working.',
            'My father has the first edition. Mine will outlive me too, apparently.',
            'Sold my old bag for nothing. This one is already worth more than I paid.',
          ),
          sub: 'Owned since 2021 · Verified',
          proofTier: 2,
        }),
        comp('stat', { text: '2,180', sub: 'verified reviews', proofTier: 1 }),
        comp('stat', { text: '1.4%', sub: 'return rate', proofTier: 2 }),
        comp('stat', { text: '40 yr', sub: 'guarantee, transferable', proofTier: 2 }),
        comp('stat', { text: '80%', sub: 'resale value at three years', proofTier: 3 }),
      ]),

      sec('faq', 'boxed', 'calm', { eyebrow: 'Buying it' }, [
        comp('heading', {
          tones: t(
            'Shipping, returns, and the guarantee',
            'Anything you might be wondering',
            'Order today, wear it this weekend',
          ),
        }),
        comp('faqItem', {
          text: 'How long does delivery take?',
          sub: 'UAE next working day, GCC in three days, worldwide in seven. Everything ships tracked and duty-paid.',
        }),
        comp('faqItem', {
          text: 'What does the forty-year guarantee actually cover?',
          sub: 'Any failure of stitching, hardware, or canvas that is not deliberate damage. We repair first, replace if we cannot. Transferable if you sell it.',
        }),
        comp('faqItem', {
          text: 'Can I return it if I change my mind?',
          sub: 'Sixty days, used or unused, no questions. We pay the return shipping. Bags that come back go into Second Life at a discount.',
        }),
        comp('faqItem', {
          text: 'Will you restock the sold-out colours?',
          sub: 'Field green and oxblood return in the fourth edition. Join the list and you get twelve hours of early access before it opens publicly.',
        }),
      ]),

      sec('ctaBanner', 'centered', 'loud', {}, [
        comp('badge', { tones: t('Third edition', 'Ready when you are', '40 units remaining') }),
        comp('heading', {
          tones: t(
            'Forty years of use, sixty days to change your mind',
            'Try it for a season. Send it back if it is not for you.',
            'Forty left. The last run went in nine days.',
          ),
        }),
        comp('paragraph', {
          tones: t(
            'Free worldwide shipping, free repairs for life, and 30% back whenever you decide to trade it in.',
            'It arrives in a cotton dust bag with a repair card and the name of whoever made it.',
            'We do not do pre-orders and we do not do waiting lists for stock. When it is gone it is gone.',
          ),
        }),
        comp('button', {
          emphasis: 'primary',
          tones: t('Add to bag — AED 1,240', 'Take one home', 'Buy now, 40 left'),
        }),
      ]),

      sec('footer', 'big', 'calm', {}, [
        comp('heading', { text: 'Ashgrove Supply Co.' }),
        comp('paragraph', {
          text: 'Made in Lancashire. Shipped from Dubai. Repaired anywhere, forever.',
        }),
        comp('listItem', { text: 'The Weekender' }),
        comp('listItem', { text: 'Second Life' }),
        comp('listItem', { text: 'Repairs' }),
        comp('listItem', { text: 'Guarantee' }),
        comp('listItem', { text: 'Stockists' }),
        comp('listItem', { text: 'Contact' }),
      ]),
    ],
  }
}
