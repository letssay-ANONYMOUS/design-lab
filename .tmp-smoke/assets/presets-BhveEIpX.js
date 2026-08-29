import { i as sectionDef } from "./registry-BCIIPLiT.js";
//#region src/lib/id.ts
/** Short, collision-safe enough for a local design tool. */
function uid(prefix = "x") {
	return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}
//#endregion
//#region src/lib/factory.ts
function comp(type, props = {}) {
	return {
		id: uid("c"),
		type,
		props
	};
}
/** Three-voice copy helper — keeps the preset files readable. */
function t(authority, warm, urgent) {
	return {
		authority,
		warm,
		urgent
	};
}
var DEFAULTS = {
	badge: { tones: t("Accredited practice", "Nice to meet you", "Booking now") },
	heading: { tones: t("A standard of care you can measure", "Care that feels like it was made for you", "Get seen this week — not next month") },
	subheading: { tones: t("How it works", "Here is the easy part", "Three steps, today") },
	paragraph: { tones: t("Every plan is reviewed by two clinicians before it reaches you, and the outcome data is published each quarter.", "We take our time with you. No rushing, no jargon — just a plan that fits the life you actually live.", "Same-week appointments are going fast. Reserve your slot before the schedule fills.") },
	quote: {
		tones: t("They gave me a written plan with timelines. Nobody had done that before.", "I stopped dreading appointments. That is the honest review.", "Called Monday, treated Wednesday. That never happens."),
		sub: "Verified client",
		proofTier: 1
	},
	listItem: { tones: t("Documented outcomes", "A friendly check-in", "Same-week slots") },
	button: {
		tones: t("Book a consultation", "Say hello", "Claim your slot"),
		emphasis: "primary"
	},
	priceTag: {
		text: "$180",
		sub: "per session"
	},
	stat: {
		text: "98%",
		sub: "would recommend us",
		proofTier: 1
	},
	starRating: {
		rating: 5,
		sub: "4.9 from 312 reviews",
		proofTier: 1
	},
	avatar: {
		text: "Dr. Amina Rahal",
		sub: "Clinical lead",
		proofTier: 2
	},
	logoRow: {
		logos: [
			"Northgate",
			"Verity Health",
			"Ardent",
			"Blue Meridian",
			"Fold & Co",
			"Halden"
		],
		proofTier: 1
	},
	imageSlot: {
		ratio: "4/3",
		placeholder: 0
	},
	iconFeature: {
		icon: "ShieldCheck",
		tones: t("Clinically supervised", "Always someone to call", "Answers within the hour"),
		sub: "Every plan is signed off before it starts."
	},
	divider: {},
	faqItem: {
		text: "Do I need a referral?",
		sub: "No. You can book directly, and we will request your records with your consent."
	},
	bentoCard: {
		tones: t("Measured results", "Made for you", "Starts this week"),
		sub: "Tap to edit this card.",
		span: {
			col: 4,
			row: 1
		}
	}
};
function newComponent(type) {
	return comp(type, structuredClone(DEFAULTS[type]));
}
/** Deep-copies a component with fresh ids so duplicates stay independent. */
function cloneComponent(component) {
	return {
		...structuredClone(component),
		id: uid("c")
	};
}
function cloneSection(section) {
	return {
		...structuredClone(section),
		id: uid("s"),
		components: section.components.map(cloneComponent)
	};
}
var SECTION_BLUEPRINTS = {
	hero: [
		"badge",
		"heading",
		"paragraph",
		"button",
		"imageSlot",
		"starRating"
	],
	logoBar: ["subheading", "logoRow"],
	featureGrid: [
		"subheading",
		"heading",
		"iconFeature",
		"iconFeature",
		"iconFeature"
	],
	testimonials: [
		"subheading",
		"heading",
		"quote",
		"quote",
		"quote"
	],
	pricing: [
		"subheading",
		"heading",
		"priceTag",
		"priceTag",
		"priceTag"
	],
	faq: [
		"subheading",
		"heading",
		"faqItem",
		"faqItem",
		"faqItem"
	],
	bento: [
		"heading",
		"bentoCard",
		"bentoCard",
		"bentoCard",
		"bentoCard"
	],
	ctaBanner: [
		"heading",
		"paragraph",
		"button"
	],
	footer: [
		"heading",
		"listItem",
		"listItem",
		"listItem"
	]
};
/** A brand-new section that already looks like something. Never empty. */
function newSection(type, variant) {
	const def = sectionDef(type);
	const components = SECTION_BLUEPRINTS[type].map(newComponent);
	if (type === "pricing") {
		const labels = [
			{
				name: "Starter",
				price: "$120",
				featured: false
			},
			{
				name: "Standard",
				price: "$180",
				featured: true
			},
			{
				name: "Complete",
				price: "$260",
				featured: false
			}
		];
		let i = 0;
		for (const c of components) {
			if (c.type !== "priceTag") continue;
			const spec = labels[i++];
			c.props = {
				text: spec.price,
				sub: "per session",
				featured: spec.featured,
				bullets: [
					"Initial assessment",
					"Written plan",
					"Follow-up call"
				]
			};
			c.props.tones = t(spec.name, spec.name, spec.name);
		}
	}
	if (type === "bento") {
		const spans = [
			{
				col: 7,
				row: 2
			},
			{
				col: 5,
				row: 1
			},
			{
				col: 5,
				row: 1
			},
			{
				col: 12,
				row: 1
			}
		];
		let i = 0;
		for (const c of components) {
			if (c.type !== "bentoCard") continue;
			c.props.span = spans[i++] ?? {
				col: 4,
				row: 1
			};
		}
	}
	return {
		id: uid("s"),
		type,
		variant: variant ?? def.variants[0].id,
		mood: def.defaultMood,
		meta: {
			swapSides: false,
			overlay: type === "hero",
			overlayIntensity: 45,
			eyebrow: def.label,
			rows: type === "bento" ? 3 : void 0
		},
		components
	};
}
//#endregion
//#region src/presets/helpers.ts
function sec(type, variant, mood, meta, components) {
	return {
		id: uid("s"),
		type,
		variant,
		mood,
		meta,
		components
	};
}
//#endregion
//#region src/presets/cafe.ts
/**
* Lantern Coffee Roasters — menu-and-loyalty page.
* Leans on the bento grid for the menu and a ribbon CTA for the loyalty hook.
*/
function cafePage() {
	return {
		id: uid("page"),
		name: "Lantern Coffee Roasters",
		tokens: {
			paletteId: "roast",
			fontPairId: "editorial",
			radius: 18,
			spacing: 1.05,
			typeScale: 1.3,
			baseSize: 17
		},
		sections: [
			sec("hero", "fullBleed", "loud", {
				swapSides: false,
				overlay: true,
				overlayIntensity: 52
			}, [
				comp("badge", { tones: t("Roasting since 2016", "Your corner table is ready", "Fresh roast lands Friday") }),
				comp("heading", { tones: t("Single-origin coffee, roasted eleven metres from your cup", "The good kind of morning, every morning", "This week’s roast sells out by Sunday") }),
				comp("paragraph", { tones: t("We buy directly from four farms, roast in twelve-kilo batches, and print the roast date on every bag. Nothing sits on our shelf longer than nine days.", "Come for the flat white, stay because someone remembered how you take it. That is genuinely the whole plan.", "Friday’s Yirgacheffe batch is 40kg and it has gone by Sunday lunchtime every week this year. Order ahead.") }),
				comp("button", {
					emphasis: "primary",
					tones: t("View the menu", "Come visit us", "Reserve this week’s bag")
				}),
				comp("button", {
					emphasis: "ghost",
					tones: t("Our sourcing", "Find us", "Join the loyalty list")
				}),
				comp("imageSlot", {
					ratio: "16/9",
					placeholder: 1
				}),
				comp("starRating", {
					rating: 5,
					sub: "4.8 on Google · 1,204 reviews",
					proofTier: 1
				})
			]),
			sec("bento", "soft", "loud", {
				eyebrow: "The menu",
				rows: 3
			}, [
				comp("subheading", { tones: t("Menu", "What we make", "Order ahead") }),
				comp("heading", { tones: t("A short menu, done properly", "Everything we love to make, and nothing we do not", "Today’s board — while it lasts") }),
				comp("bentoCard", {
					tones: t("Espresso programme", "The daily ritual", "Ready in 90 seconds"),
					sub: "Flat white, cortado, long black. House blend is 70% Brazil, 30% Ethiopia — chocolate, orange peel, no bitterness.",
					span: {
						col: 7,
						row: 2
					},
					placeholder: 2
				}),
				comp("bentoCard", {
					tones: t("Filter bar", "Slow and worth it", "Six-minute pour"),
					sub: "Two rotating single origins on V60, brewed to a published recipe.",
					span: {
						col: 5,
						row: 1
					},
					placeholder: 3
				}),
				comp("bentoCard", {
					tones: t("Bakery, 7am daily", "Still warm at opening", "Gone by 11am"),
					sub: "Cardamom buns, spinach börek, and a laminated pastry that changes weekly.",
					span: {
						col: 5,
						row: 1
					},
					placeholder: 4
				}),
				comp("bentoCard", {
					tones: t("Retail beans", "Take some home", "Roast date on every bag"),
					sub: "250g and 1kg. Ground to order for your brewer, or whole bean if you know what you are doing.",
					span: {
						col: 4,
						row: 1
					},
					placeholder: 5
				}),
				comp("bentoCard", {
					tones: t("Brew classes", "Learn with us", "Four seats left"),
					sub: "Saturdays, 90 minutes, six people. You leave with a dialled-in recipe for your own grinder.",
					span: {
						col: 8,
						row: 1
					},
					placeholder: 6,
					proofTier: 2
				})
			]),
			sec("featureGrid", "alternating", "calm", { eyebrow: "Sourcing" }, [
				comp("subheading", { tones: t("Provenance", "Where it comes from", "Fresh, always") }),
				comp("heading", { tones: t("Four farms, named prices, published dates", "We know the people who grow this", "Nine days from roaster to your cup") }),
				comp("iconFeature", {
					icon: "Sprout",
					tones: t("Direct trade, four farms", "We visit every harvest", "Landed this month"),
					sub: "We publish what we paid per kilo. It is between 2.4x and 3.1x the commodity price, and we would rather you knew."
				}),
				comp("iconFeature", {
					icon: "Flame",
					tones: t("Twelve-kilo batches", "Small enough to care", "Roasted Thursday, sold Friday"),
					sub: "Small batches mean we can adjust the profile as beans age instead of running one curve for a year."
				}),
				comp("iconFeature", {
					icon: "CalendarDays",
					tones: t("Roast date on the bag", "No mystery coffee", "Nothing older than nine days"),
					sub: "If a bag passes nine days on our shelf it goes to staff or the local shelter. It never goes to a customer."
				})
			]),
			sec("testimonials", "marquee", "calm", { eyebrow: "Regulars" }, [
				comp("subheading", { tones: t("Reviews", "From our regulars", "Why people keep coming back") }),
				comp("quote", {
					tones: t("The only place in the city that will tell you the farm, the altitude, and what they paid.", "They know my order and they ask about my mother. I am not leaving.", "Get there before nine or the cardamom buns are gone. Learned that the hard way."),
					sub: "Noura S.",
					proofTier: 1
				}),
				comp("quote", {
					tones: t("I have bought beans from twenty roasters. Lantern is the only one where the roast date is never older than a week.", "My laptop-and-coffee spot for three years now. They have never once rushed me out.", "Bought a bag on Friday, it was roasted Thursday. That is unheard of."),
					sub: "Daniel O.",
					proofTier: 1
				}),
				comp("quote", {
					tones: t("The brew class changed how I make coffee at home. Genuinely worth the money.", "Warmest staff in Al Ain, and I have tested that claim thoroughly.", "Signed up for the loyalty tier and the free bag paid it back in a month."),
					sub: "Priya R.",
					proofTier: 2
				}),
				comp("starRating", {
					rating: 5,
					sub: "4.8 · 1,204 Google reviews",
					proofTier: 2
				})
			]),
			sec("ctaBanner", "ribbon", "loud", {}, [
				comp("badge", { tones: t("Lantern Club", "Join the club", "Free bag on your tenth") }),
				comp("heading", { tones: t("Ten coffees, one free bag of beans. No app required.", "Join the Lantern Club — it is just a card and a smile", "Start your card today and the tenth is on us") }),
				comp("paragraph", { tones: t("A paper card, stamped at the counter. Members also get first refusal on limited micro-lots before they go on the shelf.", "No sign-up form, no notifications, nothing to download. Just tell us at the till and we will start you off.", "Members get first pick of every micro-lot. The last one sold out in four hours.") }),
				comp("button", {
					emphasis: "primary",
					tones: t("Join at the counter", "Come get your card", "Start my card")
				})
			]),
			sec("faq", "twoCol", "calm", { eyebrow: "Good to know" }, [
				comp("heading", { tones: t("Practical details", "A few useful things", "Before you head over") }),
				comp("faqItem", {
					text: "Do you take bookings?",
					sub: "Not for tables — first come, first served. The brew classes are bookable and usually fill a week ahead."
				}),
				comp("faqItem", {
					text: "Is there somewhere to work?",
					sub: "Yes. Eight seats with power, fast wifi, and no time limit before 11am or after 3pm. We ask for laptops away during the lunch rush."
				}),
				comp("faqItem", {
					text: "Can I order beans for delivery?",
					sub: "Within Al Ain, next-day, free over AED 150. Everywhere else in the UAE ships in two working days."
				}),
				comp("faqItem", {
					text: "Do you do decaf properly?",
					sub: "Sugarcane-process Colombian, roasted on the same schedule as everything else. It is genuinely good, and we will not talk you out of it."
				})
			]),
			sec("footer", "minimal", "calm", {}, [
				comp("heading", { text: "Lantern Coffee Roasters" }),
				comp("paragraph", { text: "Open 6:30am–8pm daily · Al Muwaiji, Al Ain" }),
				comp("listItem", { text: "Menu" }),
				comp("listItem", { text: "Beans" }),
				comp("listItem", { text: "Brew classes" }),
				comp("listItem", { text: "Wholesale" })
			])
		]
	};
}
//#endregion
//#region src/presets/clinic.ts
/**
* Meridian Physiotherapy — a booking-led clinic page.
* Narrative: loud hero → calm proof → calm explanation → loud ask.
*/
function clinicPage() {
	return {
		id: uid("page"),
		name: "Meridian Physiotherapy",
		tokens: {
			paletteId: "clinical",
			fontPairId: "neutral",
			radius: 14,
			spacing: 1,
			typeScale: 1.26,
			baseSize: 16
		},
		sections: [
			sec("hero", "split", "loud", {
				swapSides: false,
				overlay: false,
				overlayIntensity: 40
			}, [
				comp("badge", { tones: t("DHA-licensed practice", "Twelve years on Khalifa Street", "Same-week appointments") }),
				comp("heading", { tones: t("Rehabilitation with a plan you can hold in your hand", "Get moving again, at a pace that actually suits you", "Stop guessing about that pain. Get seen this week.") }),
				comp("paragraph", { tones: t("Every patient leaves the first session with a written twelve-week plan, measurable goals, and the name of the physiotherapist accountable for them.", "We start by listening. Then we build something realistic around your job, your family, and the sport you are not ready to give up.", "Injuries get harder to fix the longer you wait. We hold a small number of assessment slots each week — book one before it goes.") }),
				comp("button", {
					emphasis: "primary",
					tones: t("Book an assessment", "Come in for a chat", "Claim a slot this week")
				}),
				comp("button", {
					emphasis: "ghost",
					tones: t("See our outcome data", "Meet the team", "Call us now")
				}),
				comp("imageSlot", {
					ratio: "4/5",
					placeholder: 0
				}),
				comp("starRating", {
					rating: 5,
					sub: "4.9 average from 312 patient reviews",
					proofTier: 1
				}),
				comp("stat", {
					text: "11 days",
					sub: "average time to measurable improvement",
					proofTier: 2
				})
			]),
			sec("logoBar", "inline", "calm", { eyebrow: "Referral partners" }, [comp("subheading", { tones: t("Referred by clinicians at", "We work alongside", "Trusted by teams who need people back fast") }), comp("logoRow", {
				logos: [
					"Oasis Orthopaedics",
					"Al Jimi Sports Med",
					"Northgate GP",
					"Verity Health",
					"Falcon FC",
					"Emirates Rowing",
					"Halden Clinic",
					"Ardent Group"
				],
				proofTier: 1
			})]),
			sec("featureGrid", "cards", "calm", { eyebrow: "How it works" }, [
				comp("subheading", { tones: t("The process", "What to expect", "Three steps, starting today") }),
				comp("heading", { tones: t("Assessment, plan, proof — in that order", "No mystery. You will always know what comes next.", "From first call to first session in under 72 hours") }),
				comp("iconFeature", {
					icon: "ClipboardList",
					tones: t("60-minute assessment", "A proper first conversation", "Assessed within 72 hours"),
					sub: "Movement screening, strength testing, and a written baseline you can compare against later."
				}),
				comp("iconFeature", {
					icon: "Route",
					tones: t("A twelve-week plan", "A plan that fits your week", "Start treatment immediately"),
					sub: "Session frequency, home exercises, and the specific milestone we are aiming at each month."
				}),
				comp("iconFeature", {
					icon: "LineChart",
					tones: t("Re-tested every six weeks", "We check in properly", "See progress inside a month"),
					sub: "The same tests, repeated. If the numbers are not moving, the plan changes — not the deadline."
				}),
				comp("iconFeature", {
					icon: "ShieldCheck",
					tones: t("Insurance handled", "We do the paperwork", "Direct billing, no waiting"),
					sub: "Direct billing with Daman, Thiqa, and most international providers. We submit, you do not chase.",
					proofTier: 2
				})
			]),
			sec("testimonials", "cards", "calm", { eyebrow: "Patient stories" }, [
				comp("subheading", { tones: t("Outcomes", "In their words", "Real people, recent results") }),
				comp("heading", { tones: t("What measurable recovery looks like", "The part we are quietly proud of", "They waited too long. You do not have to.") }),
				comp("quote", {
					tones: t("They handed me a printed plan with dates on it. Eleven years of back pain and nobody had ever done that.", "I finally felt listened to. Not rushed, not dismissed — just properly heard.", "Two weeks in and I was sleeping through the night again. I should have called months earlier."),
					sub: "Rashid A. · Lower back, 14 weeks",
					proofTier: 1
				}),
				comp("quote", {
					tones: t("The six-week re-test showed a 40% strength gain on my left side. I had the numbers, not just a feeling.", "My physio remembered my daughter’s name every single visit. That is the whole review.", "Back on the pitch in seven weeks when I was told it would be five months."),
					sub: "Leila M. · ACL rehabilitation",
					proofTier: 1
				}),
				comp("quote", {
					tones: t("They coordinated directly with my surgeon. I never had to explain my own case twice.", "Warm, unhurried, and genuinely encouraging on the days I wanted to quit.", "Called on a Monday, treated on Wednesday. That simply does not happen elsewhere."),
					sub: "Tomas K. · Post-operative shoulder",
					proofTier: 2
				}),
				comp("stat", {
					text: "312",
					sub: "patients treated last year",
					proofTier: 2
				}),
				comp("stat", {
					text: "94%",
					sub: "completed their full plan",
					proofTier: 3
				}),
				comp("stat", {
					text: "0",
					sub: "referrals we could not schedule within a week",
					proofTier: 3
				})
			]),
			sec("pricing", "featured", "calm", { eyebrow: "Packages" }, [
				comp("subheading", { tones: t("Fees", "What it costs", "Book before rates change") }),
				comp("heading", { tones: t("Transparent pricing, published up front", "No surprises on the invoice", "Lock this year’s rate by booking now") }),
				comp("priceTag", {
					tones: t("Assessment", "First visit", "Start here"),
					text: "AED 350",
					sub: "one-off, 60 minutes",
					bullets: [
						"Full movement screen",
						"Written baseline report",
						"Plan proposal"
					]
				}),
				comp("priceTag", {
					tones: t("Recovery plan", "The usual choice", "Most requested"),
					text: "AED 2,900",
					sub: "10 sessions, valid 6 months",
					featured: true,
					bullets: [
						"Everything in Assessment",
						"Six-week re-testing",
						"Home programme in the app",
						"Direct insurance billing"
					]
				}),
				comp("priceTag", {
					tones: t("Return to sport", "For the competitive ones", "Fastest route back"),
					text: "AED 4,600",
					sub: "16 sessions + testing",
					bullets: [
						"Everything in Recovery",
						"Force-plate testing",
						"Coach and surgeon liaison",
						"Discharge clearance letter"
					]
				})
			]),
			sec("faq", "accordion", "calm", { eyebrow: "Before you book" }, [
				comp("subheading", { tones: t("Common questions", "Things people ask", "Quick answers") }),
				comp("heading", { tones: t("The questions we are asked most", "Anything you are wondering about", "Everything you need before you call") }),
				comp("faqItem", {
					text: "Do I need a referral from my doctor?",
					sub: "No. You can book directly. If you would like us to coordinate with your GP or surgeon, we will request your records with your written consent."
				}),
				comp("faqItem", {
					text: "Will my insurance cover this?",
					sub: "We bill Daman, Thiqa, and most international providers directly. Send us your card before the visit and we will confirm your cover in writing beforehand."
				}),
				comp("faqItem", {
					text: "What if the plan is not working?",
					sub: "We re-test at six weeks using the same measures as your baseline. If the numbers have not moved, we change the plan and you are not charged for the review session."
				}),
				comp("faqItem", {
					text: "How long is a typical recovery?",
					sub: "Most soft-tissue cases resolve in eight to fourteen weeks. Post-surgical rehabilitation runs longer. We will give you an honest range at the assessment, not a sales figure."
				}),
				comp("faqItem", {
					text: "Can I be seen outside working hours?",
					sub: "Yes. We hold early-morning slots from 6:30am and evening slots until 9pm on weekdays.",
					proofTier: 2
				})
			]),
			sec("ctaBanner", "split", "loud", {}, [
				comp("heading", { tones: t("Book an assessment and start with a number, not a guess", "Come in, have a proper conversation, and see how it feels", "This week’s assessment slots are nearly gone") }),
				comp("paragraph", { tones: t("Sixty minutes, a written baseline, and a plan you can take to any clinician for a second opinion.", "Bring your questions and whatever you are worried about. There is no obligation to book a plan afterwards.", "We keep six assessment slots open each week. When they are gone, the next opening is a fortnight out.") }),
				comp("button", {
					emphasis: "primary",
					tones: t("Book an assessment", "Come and say hello", "Take the last slot")
				}),
				comp("button", {
					emphasis: "ghost",
					tones: t("Call the clinic", "Call us", "Call now")
				})
			]),
			sec("footer", "columns", "calm", {}, [
				comp("heading", { text: "Meridian Physiotherapy" }),
				comp("paragraph", { text: "Khalifa Street, Al Ain · Open 6:30am–9pm, Sunday to Friday" }),
				comp("listItem", { text: "Assessments" }),
				comp("listItem", { text: "Sports rehabilitation" }),
				comp("listItem", { text: "Post-operative care" }),
				comp("listItem", { text: "Insurance and billing" }),
				comp("listItem", { text: "Careers" }),
				comp("listItem", { text: "Privacy notice" })
			])
		]
	};
}
//#endregion
//#region src/presets/retail.ts
/**
* Ashgrove Supply Co. — a single-product retail page.
* Editorial hero, alternating proof, hard commercial close.
*/
function retailPage() {
	return {
		id: uid("page"),
		name: "Ashgrove — The Weekender",
		tokens: {
			paletteId: "ink",
			fontPairId: "technical",
			radius: 6,
			spacing: 1.1,
			typeScale: 1.34,
			baseSize: 16
		},
		sections: [
			sec("hero", "editorial", "loud", {
				swapSides: true,
				overlay: false,
				overlayIntensity: 30
			}, [
				comp("badge", { tones: t("Third edition", "Made to be lived in", "Restock — 40 units") }),
				comp("heading", { tones: t("The Weekender. Waxed canvas, brass hardware, forty years.", "The bag you stop thinking about", "Back in stock. It went in nine days last time.") }),
				comp("paragraph", { tones: t("18oz British waxed canvas over a riveted brass frame, stitched in a workshop of eleven people. Rated to 22kg. Guaranteed for forty years, repaired free for life.", "It gets better the more you use it. The canvas softens, the leather darkens, and the dent from that one airport carousel becomes part of it.", "Forty units in this run. The last three restocks sold out inside two weeks and we do not do pre-orders.") }),
				comp("priceTag", {
					text: "AED 1,240",
					sub: "free shipping, 60-day returns"
				}),
				comp("button", {
					emphasis: "primary",
					tones: t("Add to bag", "Take one home", "Buy before it goes")
				}),
				comp("button", {
					emphasis: "ghost",
					tones: t("Full specification", "See it in daylight", "Check stock")
				}),
				comp("imageSlot", {
					ratio: "4/5",
					placeholder: 7
				}),
				comp("imageSlot", {
					ratio: "1/1",
					placeholder: 8,
					proofTier: 2
				}),
				comp("starRating", {
					rating: 5,
					sub: "4.9 from 2,180 verified buyers",
					proofTier: 1
				})
			]),
			sec("logoBar", "marquee", "calm", { eyebrow: "Press" }, [comp("subheading", { tones: t("As specified in", "People have said nice things", "Everyone is writing about it") }), comp("logoRow", {
				logos: [
					"Monocle",
					"Gear Patrol",
					"The Grade",
					"Carryology",
					"Field Notes",
					"Esquire ME",
					"Hodinkee",
					"Uncrate"
				],
				proofTier: 1
			})]),
			sec("featureGrid", "alternating", "calm", { eyebrow: "Construction" }, [
				comp("subheading", { tones: t("Materials", "The bits that matter", "Built to outlast the trend") }),
				comp("heading", { tones: t("Every component chosen because it can be replaced", "Made by people whose names we can tell you", "Nothing in this bag will fail before you do") }),
				comp("iconFeature", {
					icon: "Layers",
					tones: t("18oz waxed canvas", "Softens with every trip", "Weatherproof from day one"),
					sub: "Milled in Lancashire, dry-waxed rather than oiled, so it will not mark the seat of your car."
				}),
				comp("iconFeature", {
					icon: "Wrench",
					tones: t("Field-repairable hardware", "We fix it, free, forever", "Zero-cost repairs for life"),
					sub: "Solid brass buckles on removable rivets. Send it back and we replace them at no charge, however old it is."
				}),
				comp("iconFeature", {
					icon: "Ruler",
					tones: t("Cabin-legal, 42 litres", "Fits a weekend, easily", "Never check a bag again"),
					sub: "55 × 35 × 22cm — inside the limit for Emirates, Etihad, BA, and Lufthansa cabins."
				}),
				comp("iconFeature", {
					icon: "Recycle",
					tones: t("Buy-back programme", "Pass it on one day", "Trade in, get 30% off"),
					sub: "Return any Ashgrove bag at any age for 30% off the next one. We refurbish and resell it as Second Life.",
					proofTier: 2
				})
			]),
			sec("bento", "contrast", "loud", {
				eyebrow: "In use",
				rows: 3
			}, [
				comp("heading", { tones: t("Photographed after three years of use", "This is what yours will look like", "Second-hand ones resell for 80% of retail") }),
				comp("bentoCard", {
					tones: t("Year three patina", "Better than new", "Holds its value"),
					sub: "No conditioner, no special care. Just three years of airports, back seats, and rain.",
					span: {
						col: 8,
						row: 2
					},
					placeholder: 9
				}),
				comp("bentoCard", {
					tones: t("22kg load rated", "Carries more than you think", "Tested to destruction"),
					sub: "Independently drop-tested at full load, 500 cycles.",
					span: {
						col: 4,
						row: 1
					},
					placeholder: 10
				}),
				comp("bentoCard", {
					tones: t("Eleven-person workshop", "Made by hand", "Only 40 per run"),
					sub: "Each bag carries the initials of the person who stitched it.",
					span: {
						col: 4,
						row: 1
					},
					placeholder: 11
				}),
				comp("bentoCard", {
					tones: t("Six colourways", "Pick your favourite", "Two already sold out"),
					sub: "Field green, ink, sand, oxblood, slate, and natural.",
					span: {
						col: 12,
						row: 1
					},
					placeholder: 12,
					proofTier: 2
				})
			]),
			sec("testimonials", "grid", "calm", { eyebrow: "Owners" }, [
				comp("subheading", { tones: t("Verified buyers", "What owners say", "2,180 reviews and counting") }),
				comp("heading", { tones: t("Reviews from people who have owned it over a year", "The reviews we are most proud of", "They all say the same thing: buy it sooner") }),
				comp("quote", {
					tones: t("Four years, sixty-odd flights, one free buckle replacement. The cost per use is now trivial.", "It is the only bag I own that I would actually be sad to lose.", "Bought it after hesitating for a year. The hesitating was the mistake."),
					sub: "Owned since 2022 · Verified",
					proofTier: 1
				}),
				comp("quote", {
					tones: t("The dimensions are honest. It has never once been challenged at a gate.", "It has picked up scuffs in all the right places. Looks better than the day it arrived.", "Ordered Thursday, had it Saturday, used it that weekend."),
					sub: "Owned since 2023 · Verified",
					proofTier: 1
				}),
				comp("quote", {
					tones: t("I sent it back for a repair with no receipt and they fixed it anyway. That is the guarantee working.", "My father has the first edition. Mine will outlive me too, apparently.", "Sold my old bag for nothing. This one is already worth more than I paid."),
					sub: "Owned since 2021 · Verified",
					proofTier: 2
				}),
				comp("stat", {
					text: "2,180",
					sub: "verified reviews",
					proofTier: 1
				}),
				comp("stat", {
					text: "1.4%",
					sub: "return rate",
					proofTier: 2
				}),
				comp("stat", {
					text: "40 yr",
					sub: "guarantee, transferable",
					proofTier: 2
				}),
				comp("stat", {
					text: "80%",
					sub: "resale value at three years",
					proofTier: 3
				})
			]),
			sec("faq", "boxed", "calm", { eyebrow: "Buying it" }, [
				comp("heading", { tones: t("Shipping, returns, and the guarantee", "Anything you might be wondering", "Order today, wear it this weekend") }),
				comp("faqItem", {
					text: "How long does delivery take?",
					sub: "UAE next working day, GCC in three days, worldwide in seven. Everything ships tracked and duty-paid."
				}),
				comp("faqItem", {
					text: "What does the forty-year guarantee actually cover?",
					sub: "Any failure of stitching, hardware, or canvas that is not deliberate damage. We repair first, replace if we cannot. Transferable if you sell it."
				}),
				comp("faqItem", {
					text: "Can I return it if I change my mind?",
					sub: "Sixty days, used or unused, no questions. We pay the return shipping. Bags that come back go into Second Life at a discount."
				}),
				comp("faqItem", {
					text: "Will you restock the sold-out colours?",
					sub: "Field green and oxblood return in the fourth edition. Join the list and you get twelve hours of early access before it opens publicly."
				})
			]),
			sec("ctaBanner", "centered", "loud", {}, [
				comp("badge", { tones: t("Third edition", "Ready when you are", "40 units remaining") }),
				comp("heading", { tones: t("Forty years of use, sixty days to change your mind", "Try it for a season. Send it back if it is not for you.", "Forty left. The last run went in nine days.") }),
				comp("paragraph", { tones: t("Free worldwide shipping, free repairs for life, and 30% back whenever you decide to trade it in.", "It arrives in a cotton dust bag with a repair card and the name of whoever made it.", "We do not do pre-orders and we do not do waiting lists for stock. When it is gone it is gone.") }),
				comp("button", {
					emphasis: "primary",
					tones: t("Add to bag — AED 1,240", "Take one home", "Buy now, 40 left")
				})
			]),
			sec("footer", "big", "calm", {}, [
				comp("heading", { text: "Ashgrove Supply Co." }),
				comp("paragraph", { text: "Made in Lancashire. Shipped from Dubai. Repaired anywhere, forever." }),
				comp("listItem", { text: "The Weekender" }),
				comp("listItem", { text: "Second Life" }),
				comp("listItem", { text: "Repairs" }),
				comp("listItem", { text: "Guarantee" }),
				comp("listItem", { text: "Stockists" }),
				comp("listItem", { text: "Contact" })
			])
		]
	};
}
//#endregion
//#region src/presets/index.ts
var PRESETS = [
	{
		id: "clinic",
		name: "Meridian Physiotherapy",
		vertical: "Clinic · booking",
		build: clinicPage
	},
	{
		id: "cafe",
		name: "Lantern Coffee",
		vertical: "Café · menu & loyalty",
		build: cafePage
	},
	{
		id: "retail",
		name: "Ashgrove Supply",
		vertical: "Retail · product",
		build: retailPage
	}
];
function buildPreset(id) {
	return (PRESETS.find((p) => p.id === id) ?? PRESETS[0]).build();
}
//#endregion
export { newComponent as a, cloneSection as i, buildPreset as n, newSection as o, cloneComponent as r, uid as s, PRESETS as t };
