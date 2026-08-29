import { uid } from '@/lib/id'
import type { Page } from '@/types'
import { comp, sec, t } from './helpers'

/**
 * Meridian Physiotherapy — a booking-led clinic page.
 * Narrative: loud hero → calm proof → calm explanation → loud ask.
 */
export function clinicPage(): Page {
  return {
    id: uid('page'),
    name: 'Meridian Physiotherapy',
    tokens: {
      paletteId: 'clinical',
      fontPairId: 'neutral',
      radius: 14,
      spacing: 1,
      typeScale: 1.26,
      baseSize: 16,
    },
    sections: [
      sec(
        'hero',
        'split',
        'loud',
        { swapSides: false, overlay: false, overlayIntensity: 40 },
        [
          comp('badge', {
            tones: t(
              'DHA-licensed practice',
              'Twelve years on Khalifa Street',
              'Same-week appointments',
            ),
          }),
          comp('heading', {
            tones: t(
              'Rehabilitation with a plan you can hold in your hand',
              'Get moving again, at a pace that actually suits you',
              'Stop guessing about that pain. Get seen this week.',
            ),
          }),
          comp('paragraph', {
            tones: t(
              'Every patient leaves the first session with a written twelve-week plan, measurable goals, and the name of the physiotherapist accountable for them.',
              'We start by listening. Then we build something realistic around your job, your family, and the sport you are not ready to give up.',
              'Injuries get harder to fix the longer you wait. We hold a small number of assessment slots each week — book one before it goes.',
            ),
          }),
          comp('button', {
            emphasis: 'primary',
            tones: t('Book an assessment', 'Come in for a chat', 'Claim a slot this week'),
          }),
          comp('button', {
            emphasis: 'ghost',
            tones: t('See our outcome data', 'Meet the team', 'Call us now'),
          }),
          comp('imageSlot', { ratio: '4/5', placeholder: 0 }),
          comp('starRating', {
            rating: 5,
            sub: '4.9 average from 312 patient reviews',
            proofTier: 1,
          }),
          comp('stat', { text: '11 days', sub: 'average time to measurable improvement', proofTier: 2 }),
        ],
      ),

      sec('logoBar', 'inline', 'calm', { eyebrow: 'Referral partners' }, [
        comp('subheading', {
          tones: t(
            'Referred by clinicians at',
            'We work alongside',
            'Trusted by teams who need people back fast',
          ),
        }),
        comp('logoRow', {
          logos: [
            'Oasis Orthopaedics',
            'Al Jimi Sports Med',
            'Northgate GP',
            'Verity Health',
            'Falcon FC',
            'Emirates Rowing',
            'Halden Clinic',
            'Ardent Group',
          ],
          proofTier: 1,
        }),
      ]),

      sec('featureGrid', 'cards', 'calm', { eyebrow: 'How it works' }, [
        comp('subheading', { tones: t('The process', 'What to expect', 'Three steps, starting today') }),
        comp('heading', {
          tones: t(
            'Assessment, plan, proof — in that order',
            'No mystery. You will always know what comes next.',
            'From first call to first session in under 72 hours',
          ),
        }),
        comp('iconFeature', {
          icon: 'ClipboardList',
          tones: t(
            '60-minute assessment',
            'A proper first conversation',
            'Assessed within 72 hours',
          ),
          sub: 'Movement screening, strength testing, and a written baseline you can compare against later.',
        }),
        comp('iconFeature', {
          icon: 'Route',
          tones: t('A twelve-week plan', 'A plan that fits your week', 'Start treatment immediately'),
          sub: 'Session frequency, home exercises, and the specific milestone we are aiming at each month.',
        }),
        comp('iconFeature', {
          icon: 'LineChart',
          tones: t('Re-tested every six weeks', 'We check in properly', 'See progress inside a month'),
          sub: 'The same tests, repeated. If the numbers are not moving, the plan changes — not the deadline.',
        }),
        comp('iconFeature', {
          icon: 'ShieldCheck',
          tones: t('Insurance handled', 'We do the paperwork', 'Direct billing, no waiting'),
          sub: 'Direct billing with Daman, Thiqa, and most international providers. We submit, you do not chase.',
          proofTier: 2,
        }),
      ]),

      sec('testimonials', 'cards', 'calm', { eyebrow: 'Patient stories' }, [
        comp('subheading', { tones: t('Outcomes', 'In their words', 'Real people, recent results') }),
        comp('heading', {
          tones: t(
            'What measurable recovery looks like',
            'The part we are quietly proud of',
            'They waited too long. You do not have to.',
          ),
        }),
        comp('quote', {
          tones: t(
            'They handed me a printed plan with dates on it. Eleven years of back pain and nobody had ever done that.',
            'I finally felt listened to. Not rushed, not dismissed — just properly heard.',
            'Two weeks in and I was sleeping through the night again. I should have called months earlier.',
          ),
          sub: 'Rashid A. · Lower back, 14 weeks',
          proofTier: 1,
        }),
        comp('quote', {
          tones: t(
            'The six-week re-test showed a 40% strength gain on my left side. I had the numbers, not just a feeling.',
            'My physio remembered my daughter’s name every single visit. That is the whole review.',
            'Back on the pitch in seven weeks when I was told it would be five months.',
          ),
          sub: 'Leila M. · ACL rehabilitation',
          proofTier: 1,
        }),
        comp('quote', {
          tones: t(
            'They coordinated directly with my surgeon. I never had to explain my own case twice.',
            'Warm, unhurried, and genuinely encouraging on the days I wanted to quit.',
            'Called on a Monday, treated on Wednesday. That simply does not happen elsewhere.',
          ),
          sub: 'Tomas K. · Post-operative shoulder',
          proofTier: 2,
        }),
        comp('stat', { text: '312', sub: 'patients treated last year', proofTier: 2 }),
        comp('stat', { text: '94%', sub: 'completed their full plan', proofTier: 3 }),
        comp('stat', { text: '0', sub: 'referrals we could not schedule within a week', proofTier: 3 }),
      ]),

      sec('pricing', 'featured', 'calm', { eyebrow: 'Packages' }, [
        comp('subheading', { tones: t('Fees', 'What it costs', 'Book before rates change') }),
        comp('heading', {
          tones: t(
            'Transparent pricing, published up front',
            'No surprises on the invoice',
            'Lock this year’s rate by booking now',
          ),
        }),
        comp('priceTag', {
          tones: t('Assessment', 'First visit', 'Start here'),
          text: 'AED 350',
          sub: 'one-off, 60 minutes',
          bullets: ['Full movement screen', 'Written baseline report', 'Plan proposal'],
        }),
        comp('priceTag', {
          tones: t('Recovery plan', 'The usual choice', 'Most requested'),
          text: 'AED 2,900',
          sub: '10 sessions, valid 6 months',
          featured: true,
          bullets: [
            'Everything in Assessment',
            'Six-week re-testing',
            'Home programme in the app',
            'Direct insurance billing',
          ],
        }),
        comp('priceTag', {
          tones: t('Return to sport', 'For the competitive ones', 'Fastest route back'),
          text: 'AED 4,600',
          sub: '16 sessions + testing',
          bullets: [
            'Everything in Recovery',
            'Force-plate testing',
            'Coach and surgeon liaison',
            'Discharge clearance letter',
          ],
        }),
      ]),

      sec('faq', 'accordion', 'calm', { eyebrow: 'Before you book' }, [
        comp('subheading', { tones: t('Common questions', 'Things people ask', 'Quick answers') }),
        comp('heading', {
          tones: t(
            'The questions we are asked most',
            'Anything you are wondering about',
            'Everything you need before you call',
          ),
        }),
        comp('faqItem', {
          text: 'Do I need a referral from my doctor?',
          sub: 'No. You can book directly. If you would like us to coordinate with your GP or surgeon, we will request your records with your written consent.',
        }),
        comp('faqItem', {
          text: 'Will my insurance cover this?',
          sub: 'We bill Daman, Thiqa, and most international providers directly. Send us your card before the visit and we will confirm your cover in writing beforehand.',
        }),
        comp('faqItem', {
          text: 'What if the plan is not working?',
          sub: 'We re-test at six weeks using the same measures as your baseline. If the numbers have not moved, we change the plan and you are not charged for the review session.',
        }),
        comp('faqItem', {
          text: 'How long is a typical recovery?',
          sub: 'Most soft-tissue cases resolve in eight to fourteen weeks. Post-surgical rehabilitation runs longer. We will give you an honest range at the assessment, not a sales figure.',
        }),
        comp('faqItem', {
          text: 'Can I be seen outside working hours?',
          sub: 'Yes. We hold early-morning slots from 6:30am and evening slots until 9pm on weekdays.',
          proofTier: 2,
        }),
      ]),

      sec('ctaBanner', 'split', 'loud', {}, [
        comp('heading', {
          tones: t(
            'Book an assessment and start with a number, not a guess',
            'Come in, have a proper conversation, and see how it feels',
            'This week’s assessment slots are nearly gone',
          ),
        }),
        comp('paragraph', {
          tones: t(
            'Sixty minutes, a written baseline, and a plan you can take to any clinician for a second opinion.',
            'Bring your questions and whatever you are worried about. There is no obligation to book a plan afterwards.',
            'We keep six assessment slots open each week. When they are gone, the next opening is a fortnight out.',
          ),
        }),
        comp('button', {
          emphasis: 'primary',
          tones: t('Book an assessment', 'Come and say hello', 'Take the last slot'),
        }),
        comp('button', { emphasis: 'ghost', tones: t('Call the clinic', 'Call us', 'Call now') }),
      ]),

      sec('footer', 'columns', 'calm', {}, [
        comp('heading', { text: 'Meridian Physiotherapy' }),
        comp('paragraph', {
          text: 'Khalifa Street, Al Ain · Open 6:30am–9pm, Sunday to Friday',
        }),
        comp('listItem', { text: 'Assessments' }),
        comp('listItem', { text: 'Sports rehabilitation' }),
        comp('listItem', { text: 'Post-operative care' }),
        comp('listItem', { text: 'Insurance and billing' }),
        comp('listItem', { text: 'Careers' }),
        comp('listItem', { text: 'Privacy notice' }),
      ]),
    ],
  }
}
