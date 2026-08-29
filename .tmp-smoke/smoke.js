import { JSDOM } from "jsdom";
//#region scripts/smoke.tsx
/**
* Render smoke test.
*
* Mounts the whole app into jsdom, drives the interactions that are easy to
* break (load every preset, cycle variants, remix, snapshot round-trip,
* export), and fails the run if React logs a single error or warning. It is
* not a substitute for looking at the thing, but it does mean a crash on boot
* can never reach `npm run dev` unnoticed.
*
* Run via `npm run smoke`.
*/
var dom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
	url: "http://localhost/",
	pretendToBeVisual: true
});
var g = globalThis;
g.window = dom.window;
g.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", {
	value: dom.window.navigator,
	configurable: true
});
g.HTMLElement = dom.window.HTMLElement;
g.Element = dom.window.Element;
g.Node = dom.window.Node;
g.Event = dom.window.Event;
g.MouseEvent = dom.window.MouseEvent;
g.KeyboardEvent = dom.window.KeyboardEvent;
g.getComputedStyle = dom.window.getComputedStyle;
g.requestAnimationFrame = (cb) => dom.window.setTimeout(() => cb(0), 0);
g.cancelAnimationFrame = (id) => dom.window.clearTimeout(id);
g.localStorage = dom.window.localStorage;
g.IS_REACT_ACT_ENVIRONMENT = true;
g.matchMedia = () => ({
	matches: false,
	addEventListener() {},
	removeEventListener() {},
	addListener() {},
	removeListener() {}
});
dom.window.matchMedia = g.matchMedia;
var FakeObserver = class {
	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords() {
		return [];
	}
};
g.ResizeObserver = FakeObserver;
g.IntersectionObserver = FakeObserver;
dom.window.ResizeObserver = FakeObserver;
dom.window.IntersectionObserver = FakeObserver;
dom.window.scrollTo = () => {};
Object.defineProperty(dom.window.HTMLElement.prototype, "scrollTo", { value: () => {} });
var complaints = [];
for (const level of ["error", "warn"]) {
	const original = console[level].bind(console);
	console[level] = (...args) => {
		complaints.push(`[${level}] ${args.map(String).join(" ")}`);
		original(...args);
	};
}
var { createRoot } = await import("react-dom/client");
var { act } = await import("react");
var { default: App } = await import("./assets/App--EIMKCPm.js");
var { useLab } = await import("./assets/useLab-s02HeIHa.js");
var { PRESETS } = await import("./assets/presets-BLWcWEZs.js");
var { generatePageJsx } = await import("./assets/export-Bw-EwBqY.js");
var { remixPage } = await import("./assets/remix-CdHUG1kR.js");
var { createElement } = await import("react");
var root = createRoot(document.getElementById("root"));
var flush = async (fn) => {
	await act(async () => {
		fn();
	});
};
var failures = [];
var check = (label, ok) => {
	console.log(`${ok ? "  ok  " : " FAIL "} ${label}`);
	if (!ok) failures.push(label);
};
await act(async () => {
	root.render(createElement(App));
});
var html = () => document.getElementById("root").innerHTML;
var lab = () => useLab.getState();
check("app mounts", html().length > 1e3);
check("top bar renders", html().includes("Design"));
for (const preset of PRESETS) {
	await flush(() => lab().loadPreset(preset.id));
	const page = lab().page;
	check(`preset "${preset.id}" loads (${page.sections.length} sections)`, page.sections.length >= 6 && page.sections.every((s) => s.components.length > 0));
	check(`preset "${preset.id}" exports`, generatePageJsx(page, lab().view).includes("export default"));
}
var { SECTION_DEFS } = await import("./assets/registry-BdvVJqJl.js");
for (const def of SECTION_DEFS) {
	await flush(() => {
		useLab.setState({ page: {
			...lab().page,
			sections: []
		} });
		lab().addSection(def.type);
	});
	const id = lab().page.sections[0].id;
	let rendered = true;
	for (const variant of def.variants) try {
		await flush(() => lab().setVariant(id, variant.id));
	} catch {
		rendered = false;
	}
	check(`${def.label}: all ${def.variants.length} variants render`, rendered);
}
await flush(() => lab().loadPreset("clinic"));
var before = lab().page.sections[0].variant;
await flush(() => lab().cycleVariant(lab().page.sections[0].id));
var after = lab().page.sections[0].variant;
await flush(() => lab().undo());
check("undo restores the previous page", before !== after && lab().page.sections[0].variant === before);
await flush(() => lab().redo());
check("redo re-applies it", lab().page.sections[0].variant === after);
await flush(() => lab().replacePage(remixPage(lab().page)));
check("remix keeps the section count", lab().page.sections.length > 0);
check("remix keeps the opener loud", lab().page.sections[0].mood === "loud");
for (const tone of [
	"warm",
	"urgent",
	"authority"
]) await flush(() => lab().setTone(tone));
await flush(() => lab().setView({
	squint: true,
	grid: true,
	trustDensity: 0
}));
await flush(() => lab().setView({
	squint: false,
	grid: false,
	trustDensity: 100
}));
check("view toggles survive a round trip", lab().view.trustDensity === 100);
await flush(() => lab().loadPreset("cafe"));
var cafeName = lab().page.name;
await flush(() => lab().addSnapshot("", "A"));
await flush(() => lab().loadPreset("retail"));
await flush(() => lab().addSnapshot("", "B"));
check("snapshots stored", lab().snapshots.length === 2);
await flush(() => lab().restoreSnapshot(lab().snapshots.find((s) => s.name === "A").id));
check("restore brings the page back", lab().page.name === cafeName);
await flush(() => lab().setCompare([lab().snapshots[0].id, lab().snapshots[1].id]));
check("compare view renders", html().includes("Exit compare"));
await flush(() => lab().setCompare(null));
var persisted = dom.window.localStorage.getItem("design-lab:v1");
check("page persisted to localStorage", Boolean(persisted));
if (persisted) {
	const parsed = JSON.parse(persisted);
	check("persisted page has sections", parsed.state.page.sections.length > 0);
	check("persisted snapshots survive", parsed.state.snapshots.length === 2);
}
await act(async () => {
	root.unmount();
});
var noisy = complaints.filter((line) => !line.includes("not wrapped in act"));
if (noisy.length > 0) {
	console.log(`\n${noisy.length} console complaint(s):`);
	for (const line of noisy.slice(0, 12)) console.log(`  ${line}`);
	failures.push("console was not clean");
}
console.log(failures.length === 0 ? "\nall smoke checks passed" : `\n${failures.length} failure(s)`);
process.exit(failures.length === 0 ? 0 : 1);
//#endregion
export {};
