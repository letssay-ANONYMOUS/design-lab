import { uid } from '@/lib/id'
import type { Page } from '@/types'
import { comp, sec, t } from './helpers'

/**
 * Lantern Coffee Roasters — menu-and-loyalty page.
 * Leans on the bento grid for the menu and a ribbon CTA for the loyalty hook.
 */
export function cafePage(): Page {
  return {
    id: uid('page'),
    name: 'Lantern Coffee Roasters',
    tokens: {
      paletteId: 'roast',
      fontPairId: 'editorial',
      radius: 18,
      spacing: 1.05,
      typeScale: 1.3,
      baseSize: 17,
    },
    sections: [
      sec(
        'hero',
        'fullBleed',
        'loud',
        { swapSides: false, overlay: true, overlayIntensity: 52 },
        [
          comp('badge', {
            tones: t('Roasting since 2016', 'Your corner table is ready', 'Fresh roast lands Friday'),
          }),
          comp('heading', {
            tones: t(
              'Single-origin coffee, roasted eleven metres from your cup',
              'The good kind of morning, every morning',
              'This week’s roast sells out by Sunday',
            ),
          }),
          comp('paragraph', {
            tones: t(
              'We buy directly from four farms, roast in twelve-kilo batches, and print the roast date on every bag. Nothing sits on our shelf longer than nine days.',
              'Come for the flat white, stay because someone remembered how you take it. That is genuinely the whole plan.',
              'Friday’s Yirgacheffe batch is 40kg and it has gone by Sunday lunchtime every week this year. Order ahead.',
            ),
          }),
          comp('button', {
            emphasis: 'primary',
            tones: t('View the menu', 'Come visit us', 'Reserve this week’s bag'),
          }),
          comp('button', {
            emphasis: 'ghost',
            tones: t('Our sourcing', 'Find us', 'Join the loyalty list'),
          }),
          comp('imageSlot', { ratio: '16/9', placeholder: 1 }),
          comp('starRating', { rating: 5, sub: '4.8 on Google · 1,204 reviews', proofTier: 1 }),
        ],
      ),

      sec('bento', 'soft', 'loud', { eyebrow: 'The menu', rows: 3 }, [
        comp('subheading', { tones: t('Menu', 'What we make', 'Order ahead') }),
        comp('heading', {
          tones: t(
            'A short menu, done properly',
            'Everything we love to make, and nothing we do not',
            'Today’s board — while it lasts',
          ),
        }),
        comp('bentoCard', {
          tones: t('Espresso programme', 'The daily ritual', 'Ready in 90 seconds'),
          sub: 'Flat white, cortado, long black. House blend is 70% Brazil, 30% Ethiopia — chocolate, orange peel, no bitterness.',
          span: { col: 7, row: 2 },
          placeholder: 2,
        }),
        comp('bentoCard', {
          tones: t('Filter bar', 'Slow and worth it', 'Six-minute pour'),
          sub: 'Two rotating single origins on V60, brewed to a published recipe.',
          span: { col: 5, row: 1 },
          placeholder: 3,
        }),
        comp('bentoCard', {
          tones: t('Bakery, 7am daily', 'Still warm at opening', 'Gone by 11am'),
          sub: 'Cardamom buns, spinach börek, and a laminated pastry that changes weekly.',
          span: { col: 5, row: 1 },
          placeholder: 4,
        }),
        comp('bentoCard', {
          tones: t('Retail beans', 'Take some home', 'Roast date on every bag'),
          sub: '250g and 1kg. Ground to order for your brewer, or whole bean if you know what you are doing.',
          span: { col: 4, row: 1 },
          placeholder: 5,
        }),
        comp('bentoCard', {
          tones: t('Brew classes', 'Learn with us', 'Four seats left'),
          sub: 'Saturdays, 90 minutes, six people. You leave with a dialled-in recipe for your own grinder.',
          span: { col: 8, row: 1 },
          placeholder: 6,
          proofTier: 2,
        }),
      ]),

      sec('featureGrid', 'alternating', 'calm', { eyebrow: 'Sourcing' }, [
        comp('subheading', { tones: t('Provenance', 'Where it comes from', 'Fresh, always') }),
        comp('heading', {
          tones: t(
            'Four farms, named prices, published dates',
            'We know the people who grow this',
            'Nine days from roaster to your cup',
          ),
        }),
        comp('iconFeature', {
          icon: 'Sprout',
          tones: t('Direct trade, four farms', 'We visit every harvest', 'Landed this month'),
          sub: 'We publish what we paid per kilo. It is between 2.4x and 3.1x the commodity price, and we would rather you knew.',
        }),
        comp('iconFeature', {
          icon: 'Flame',
          tones: t('Twelve-kilo batches', 'Small enough to care', 'Roasted Thursday, sold Friday'),
          sub: 'Small batches mean we can adjust the profile as beans age instead of running one curve for a year.',
        }),
        comp('iconFeature', {
          icon: 'CalendarDays',
          tones: t('Roast date on the bag', 'No mystery coffee', 'Nothing older than nine days'),
          sub: 'If a bag passes nine days on our shelf it goes to staff or the local shelter. It never goes to a customer.',
        }),
      ]),

      sec('testimonials', 'marquee', 'calm', { eyebrow: 'Regulars' }, [
        comp('subheading', { tones: t('Reviews', 'From our regulars', 'Why people keep coming back') }),
        comp('quote', {
          tones: t(
            'The only place in the city that will tell you the farm, the altitude, and what they paid.',
            'They know my order and they ask about my mother. I am not leaving.',
            'Get there before nine or the cardamom buns are gone. Learned that the hard way.',
          ),
          sub: 'Noura S.',
          proofTier: 1,
        }),
        comp('quote', {
          tones: t(
            'I have bought beans from twenty roasters. Lantern is the only one where the roast date is never older than a week.',
            'My laptop-and-coffee spot for three years now. They have never once rushed me out.',
            'Bought a bag on Friday, it was roasted Thursday. That is unheard of.',
          ),
          sub: 'Daniel O.',
          proofTier: 1,
        }),
        comp('quote', {
          tones: t(
            'The brew class changed how I make coffee at home. Genuinely worth the money.',
            'Warmest staff in Al Ain, and I have tested that claim thoroughly.',
            'Signed up for the loyalty tier and the free bag paid it back in a month.',
          ),
          sub: 'Priya R.',
          proofTier: 2,
        }),
        comp('starRating', { rating: 5, sub: '4.8 · 1,204 Google reviews', proofTier: 2 }),
      ]),

      sec('ctaBanner', 'ribbon', 'loud', {}, [
        comp('badge', { tones: t('Lantern Club', 'Join the club', 'Free bag on your tenth') }),
        comp('heading', {
          tones: t(
            'Ten coffees, one free bag of beans. No app required.',
            'Join the Lantern Club — it is just a card and a smile',
            'Start your card today and the tenth is on us',
          ),
        }),
        comp('paragraph', {
          tones: t(
            'A paper card, stamped at the counter. Members also get first refusal on limited micro-lots before they go on the shelf.',
            'No sign-up form, no notifications, nothing to download. Just tell us at the till and we will start you off.',
            'Members get first pick of every micro-lot. The last one sold out in four hours.',
          ),
        }),
        comp('button', {
          emphasis: 'primary',
          tones: t('Join at the counter', 'Come get your card', 'Start my card'),
        }),
      ]),

      sec('faq', 'twoCol', 'calm', { eyebrow: 'Good to know' }, [
        comp('heading', {
          tones: t('Practical details', 'A few useful things', 'Before you head over') },
        ),
        comp('faqItem', {
          text: 'Do you take bookings?',
          sub: 'Not for tables — first come, first served. The brew classes are bookable and usually fill a week ahead.',
        }),
        comp('faqItem', {
          text: 'Is there somewhere to work?',
          sub: 'Yes. Eight seats with power, fast wifi, and no time limit before 11am or after 3pm. We ask for laptops away during the lunch rush.',
        }),
        comp('faqItem', {
          text: 'Can I order beans for delivery?',
          sub: 'Within Al Ain, next-day, free over AED 150. Everywhere else in the UAE ships in two working days.',
        }),
        comp('faqItem', {
          text: 'Do you do decaf properly?',
          sub: 'Sugarcane-process Colombian, roasted on the same schedule as everything else. It is genuinely good, and we will not talk you out of it.',
        }),
      ]),

      sec('footer', 'minimal', 'calm', {}, [
        comp('heading', { text: 'Lantern Coffee Roasters' }),
        comp('paragraph', { text: 'Open 6:30am–8pm daily · Al Muwaiji, Al Ain' }),
        comp('listItem', { text: 'Menu' }),
        comp('listItem', { text: 'Beans' }),
        comp('listItem', { text: 'Brew classes' }),
        comp('listItem', { text: 'Wholesale' }),
      ]),
    ],
  }
}
