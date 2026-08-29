import { i as sectionDef } from "./registry-BCIIPLiT.js";
import { n as FONT_PAIRS, r as PALETTES } from "./tokens-CLCekMxW.js";
//#region src/lib/remix.ts
function pick(list, exclude) {
	const pool = exclude === void 0 ? list : list.filter((item) => item !== exclude);
	const source = pool.length > 0 ? pool : list;
	return source[Math.floor(Math.random() * source.length)];
}
function between(min, max, step) {
	const steps = Math.round((max - min) / step);
	return Number((min + Math.floor(Math.random() * (steps + 1)) * step).toFixed(2));
}
/**
* Radius is snapped to a handful of intentional values rather than any integer
* 0–32. A 7px radius is the kind of thing that makes a page look accidental,
* and the whole promise of this button is that it never produces garbage.
*/
var RADIUS_STOPS = [
	0,
	2,
	6,
	10,
	14,
	20,
	28
];
/** Types that can carry a dark, high-contrast treatment without looking odd. */
var CAN_BE_LOUD = /* @__PURE__ */ new Set([
	"hero",
	"ctaBanner",
	"bento"
]);
function remixTokens(current) {
	return {
		paletteId: pick(PALETTES.map((p) => p.id), current.paletteId),
		fontPairId: pick(FONT_PAIRS.map((f) => f.id), current.fontPairId),
		radius: pick(RADIUS_STOPS, current.radius),
		spacing: between(.85, 1.3, .05),
		typeScale: between(1.18, 1.38, .02),
		baseSize: pick([16, 17])
	};
}
function remixSection(section, index, total) {
	const variants = sectionDef(section.type).variants.map((v) => v.id);
	const isOpener = index === 0;
	const isCloser = index >= total - 2 && section.type === "ctaBanner";
	const mood = isOpener || isCloser ? "loud" : CAN_BE_LOUD.has(section.type) && Math.random() < .3 ? "loud" : "calm";
	return {
		...section,
		variant: pick(variants, section.variant),
		mood,
		meta: {
			...section.meta,
			swapSides: Math.random() < .5,
			overlayIntensity: Math.round(between(34, 62, 2)),
			overlay: section.type === "hero" ? section.meta.overlay !== false : section.meta.overlay
		}
	};
}
/** Randomises variants and tokens inside curated bounds. Never off-brand. */
function remixPage(page) {
	return {
		...page,
		tokens: remixTokens(page.tokens),
		sections: page.sections.map((section, i) => remixSection(section, i, page.sections.length))
	};
}
/** Variants only — useful when you like the palette and want new layouts. */
function remixLayoutsOnly(page) {
	return {
		...page,
		sections: page.sections.map((section, i) => remixSection(section, i, page.sections.length))
	};
}
//#endregion
export { remixPage as n, remixLayoutsOnly as t };
