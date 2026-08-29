import { s as uid, t as PRESETS } from "./presets-BhveEIpX.js";
import { a as variantLabel, i as sectionDef, n as SECTION_DEFS, t as COMPONENT_TRAY } from "./registry-BCIIPLiT.js";
import { a as effectiveTokens, c as tokensToVars, i as TOKEN_LIMITS, l as typeSteps, n as FONT_PAIRS, o as getFontPair, r as PALETTES, s as getPalette, t as DEFAULT_TOKENS } from "./tokens-CLCekMxW.js";
import { n as useLab } from "./useLab-B55KIc-2.js";
import { i as visibleComponents, n as resolveTone, r as scaleCount, t as generatePageJsx } from "./export-GRN1ku47.js";
import { n as remixPage, t as remixLayoutsOnly } from "./remix-C1fr0LbH.js";
import { create } from "zustand";
import { AnimatePresence, motion, motion as motion$1, useScroll, useTransform } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import * as Icons from "lucide-react";
import { ArrowDown, ArrowUp, Camera, Check, ChevronLeft, ChevronRight, Code2, Columns2, Copy, Download, Eye, Grid3x3, GripVertical, Image, Languages, LayoutTemplate, Loader2, Moon, Palette, Play, Plus, Ratio, Redo2, RotateCcw, ShieldCheck, Shuffle, Star, Trash2, Undo2, Volume2, Waves, X } from "lucide-react";
import { createPortal } from "react-dom";
import { openDB } from "idb";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { toPng } from "html-to-image";
//#region src/components/canvas/Reveal.tsx
/** The canvas' scroll container — needed so IntersectionObserver watches the
* right box rather than the (never-scrolling) window. */
var ScrollRootContext = createContext(null);
function useScrollRoot() {
	return useContext(ScrollRootContext);
}
/**
* The single entry animation used everywhere on the canvas. Distance, stagger
* and easing all come from the choreography panel so the whole page can be
* retuned from three sliders.
*/
function Reveal({ children, index = 0, className, style }) {
	const stagger = useLab((s) => s.view.choreo.stagger);
	const distance = useLab((s) => s.view.choreo.distance);
	const root = useScrollRoot();
	return /* @__PURE__ */ jsx(motion$1.div, {
		className,
		style,
		initial: {
			opacity: 0,
			y: distance
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: false,
			amount: .2,
			root: root ?? void 0
		},
		transition: {
			duration: .62,
			delay: Math.min(index * stagger, .9),
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		children
	});
}
/**
* Hero image drift. Intensity is 0–100 from the choreography panel; at 0 the
* transform is a no-op rather than a subtly-wrong 1px shift.
*/
function useParallaxY(target, intensity) {
	const root = useScrollRoot();
	const { scrollYProgress } = useScroll({
		target,
		container: root ?? void 0,
		offset: ["start end", "end start"]
	});
	const travel = intensity / 100 * 90;
	return useTransform(scrollYProgress, [0, 1], [travel, -travel]);
}
//#endregion
//#region src/lib/cn.ts
function cn(...parts) {
	return parts.filter(Boolean).join(" ");
}
//#endregion
//#region src/components/ui/primitives.tsx
function ToolButton({ active, variant = "ghost", size = "md", icon, children, className, ...rest }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		...rest,
		className: cn("inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-all duration-150 select-none", "disabled:pointer-events-none disabled:opacity-40", size === "sm" ? "h-7 px-2 text-[11px]" : "h-8 px-2.5 text-xs", variant === "ghost" && (active ? "bg-brand/18 text-brand-soft shadow-[inset_0_0_0_1px_rgba(124,108,255,.4)]" : "text-ui-300 hover:bg-ui-750 hover:text-ui-100"), variant === "solid" && "bg-brand text-white hover:bg-brand/88 active:scale-[.97]", variant === "outline" && "border border-ui-700 text-ui-200 hover:border-ui-600 hover:bg-ui-800", variant === "danger" && "text-ui-300 hover:bg-red-500/15 hover:text-red-300", className),
		children: [icon, children]
	});
}
function Slider({ label, value, min, max, step = 1, display, onChange }) {
	const id = useId();
	const pct = (value - min) / (max - min) * 100;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ jsx("label", {
				htmlFor: id,
				className: "text-[11px] font-medium text-ui-300",
				children: label
			}), /* @__PURE__ */ jsx("span", {
				className: "font-mono text-[11px] text-ui-400 tabular-nums",
				children: display ?? value
			})]
		}), /* @__PURE__ */ jsx("input", {
			id,
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (event) => onChange(Number(event.target.value)),
			className: "dl-slider h-4 w-full cursor-pointer appearance-none bg-transparent",
			style: { "--pct": `${pct}%` }
		})]
	});
}
function Segmented({ value, options, onChange, className }) {
	const groupId = useId();
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex rounded-lg bg-ui-850 p-0.5", className),
		children: options.map((option) => {
			const active = option.value === value;
			return /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => onChange(option.value),
				className: cn("relative flex-1 cursor-pointer rounded-[6px] px-2 py-1.5 text-[11px] font-medium transition-colors duration-150", active ? "text-ui-100" : "text-ui-400 hover:text-ui-200"),
				children: [active && /* @__PURE__ */ jsx(motion.span, {
					layoutId: `seg-${groupId}`,
					className: "absolute inset-0 rounded-[6px] bg-ui-700",
					transition: {
						type: "spring",
						stiffness: 500,
						damping: 40
					}
				}), /* @__PURE__ */ jsx("span", {
					className: "relative z-10",
					children: option.label
				})]
			}, option.value);
		})
	});
}
function Toggle({ checked, onChange, label, hint }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		onClick: () => onChange(!checked),
		className: "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-ui-850",
		children: [/* @__PURE__ */ jsxs("span", {
			className: "flex flex-col",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-[11px] font-medium text-ui-200",
				children: label
			}), hint && /* @__PURE__ */ jsx("span", {
				className: "text-[10px] text-ui-500",
				children: hint
			})]
		}), /* @__PURE__ */ jsx("span", {
			className: cn("relative h-[18px] w-8 shrink-0 rounded-full transition-colors duration-200", checked ? "bg-brand" : "bg-ui-700"),
			children: /* @__PURE__ */ jsx(motion.span, {
				className: "absolute top-[2px] left-[2px] h-[14px] w-[14px] rounded-full bg-white shadow",
				animate: { x: checked ? 14 : 0 },
				transition: {
					type: "spring",
					stiffness: 600,
					damping: 34
				}
			})
		})]
	});
}
function Modal({ open, onClose, title, subtitle, children, footer, width = 720 }) {
	const panelRef = useRef(null);
	useEffect(() => {
		if (!open) return;
		const onKey = (event) => {
			if (event.key === "Escape") {
				event.stopPropagation();
				onClose();
			}
		};
		document.addEventListener("keydown", onKey);
		panelRef.current?.focus();
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	return createPortal(/* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(motion.div, {
		className: "fixed inset-0 z-[200] flex items-center justify-center p-6",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .18 },
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 bg-black/65 backdrop-blur-[3px]",
			onClick: onClose,
			"aria-hidden": true
		}), /* @__PURE__ */ jsxs(motion.div, {
			ref: panelRef,
			tabIndex: -1,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": title,
			className: "relative flex max-h-[86vh] w-full flex-col overflow-hidden rounded-2xl border border-ui-700 bg-ui-900 shadow-2xl outline-none",
			style: { maxWidth: width },
			initial: {
				opacity: 0,
				scale: .96,
				y: 14
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				scale: .97,
				y: 8
			},
			transition: {
				duration: .24,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			children: [
				/* @__PURE__ */ jsxs("header", {
					className: "flex items-start justify-between gap-4 border-b border-ui-800 px-5 py-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "m-0 text-sm font-semibold text-ui-100",
						children: title
					}), subtitle && /* @__PURE__ */ jsx("p", {
						className: "m-0 mt-0.5 text-xs text-ui-400",
						children: subtitle
					})] }), /* @__PURE__ */ jsx(ToolButton, {
						onClick: onClose,
						"aria-label": "Close",
						icon: /* @__PURE__ */ jsx(X, { size: 15 })
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "min-h-0 flex-1 overflow-auto",
					children
				}),
				footer && /* @__PURE__ */ jsx("footer", {
					className: "flex items-center justify-end gap-2 border-t border-ui-800 px-5 py-3",
					children: footer
				})
			]
		})]
	}) }), document.body);
}
/**
* A small anchored panel. Closes on Escape, on outside click, and when the
* canvas scrolls away underneath it — anything else leaves orphaned popovers
* floating over the artwork you are trying to judge.
*/
function Popover({ trigger, children, width = 240, align = "start" }) {
	const [open, setOpen] = useState(false);
	const wrapRef = useRef(null);
	useEffect(() => {
		if (!open) return;
		const onDown = (event) => {
			if (!wrapRef.current?.contains(event.target)) setOpen(false);
		};
		const onKey = (event) => {
			if (event.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);
	return /* @__PURE__ */ jsxs("div", {
		ref: wrapRef,
		className: "relative",
		children: [trigger({
			open,
			toggle: () => setOpen((v) => !v)
		}), /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(motion.div, {
			initial: {
				opacity: 0,
				y: -4,
				scale: .98
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: {
				opacity: 0,
				y: -3,
				scale: .98
			},
			transition: {
				duration: .15,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			className: cn("absolute top-[calc(100%+6px)] z-[150] rounded-xl border border-ui-700 bg-ui-900 p-3 shadow-2xl", align === "end" ? "right-0" : "left-0"),
			style: { width },
			children
		}) })]
	});
}
function PanelSection({ title, children, action }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "flex flex-col gap-2.5 border-b border-ui-850 px-3.5 py-3.5 last:border-b-0",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "m-0 text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase",
				children: title
			}), action]
		}), children]
	});
}
function EmptyState({ title, hint }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center gap-1 px-4 py-8 text-center",
		children: [/* @__PURE__ */ jsx("p", {
			className: "m-0 text-xs font-medium text-ui-300",
			children: title
		}), hint && /* @__PURE__ */ jsx("p", {
			className: "m-0 text-[11px] text-ui-500",
			children: hint
		})]
	});
}
//#endregion
//#region src/components/canvas/ComponentTray.tsx
/**
* Insert-component menu. Anchored inside the section's hover toolbar so a new
* element always lands in a known section rather than "wherever the cursor was".
*/
function ComponentTray({ sectionId }) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	const addComponent = useLab((s) => s.addComponent);
	useEffect(() => {
		if (!open) return;
		const onDown = (event) => {
			if (!ref.current?.contains(event.target)) setOpen(false);
		};
		const onKey = (event) => {
			if (event.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);
	const groups = [...new Set(COMPONENT_TRAY.map((item) => item.group))];
	return /* @__PURE__ */ jsxs("div", {
		ref,
		className: "relative",
		children: [/* @__PURE__ */ jsx(ToolButton, {
			active: open,
			onClick: (event) => {
				event.stopPropagation();
				setOpen((value) => !value);
			},
			icon: /* @__PURE__ */ jsx(Plus, { size: 13 }),
			title: "Add a component to this section",
			children: "Add"
		}), /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(motion.div, {
			initial: {
				opacity: 0,
				y: -6,
				scale: .97
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: {
				opacity: 0,
				y: -4,
				scale: .98
			},
			transition: {
				duration: .16,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			className: "absolute right-0 z-50 mt-1.5 w-52 origin-top-right rounded-xl border border-ui-700 bg-ui-900 p-1.5 shadow-2xl",
			onClick: (event) => event.stopPropagation(),
			children: groups.map((group) => /* @__PURE__ */ jsxs("div", {
				className: "mb-1 last:mb-0",
				children: [/* @__PURE__ */ jsx("p", {
					className: "m-0 px-2 py-1 text-[9px] font-semibold tracking-[0.13em] text-ui-500 uppercase",
					children: group
				}), COMPONENT_TRAY.filter((item) => item.group === group).map((item) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => {
						addComponent(sectionId, item.type);
						setOpen(false);
					},
					className: "flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-left text-[11px] text-ui-200 transition-colors hover:bg-ui-750 hover:text-white",
					children: item.label
				}, item.type))]
			}, group))
		}) })]
	});
}
//#endregion
//#region src/components/canvas/SectionContext.ts
/** Lets every atom know which section it lives in without prop drilling. */
var SectionContext = createContext("");
function useSectionId() {
	return useContext(SectionContext);
}
/** True while rendering into an export/thumbnail pass — disables editing chrome. */
var StaticContext = createContext(false);
function useIsStatic() {
	return useContext(StaticContext);
}
//#endregion
//#region src/store/useEditing.ts
/**
* Ephemeral UI state, deliberately kept out of the persisted page store so a
* refresh never restores a half-finished text edit.
*/
var useEditing = create((set) => ({
	editingId: null,
	editingField: "text",
	hoverId: null,
	beginEdit: (id, field = "text") => set({
		editingId: id,
		editingField: field
	}),
	endEdit: () => set({ editingId: null }),
	setHover: (id) => set({ hoverId: id })
}));
//#endregion
//#region src/components/canvas/Editable.tsx
/**
* Uncontrolled on purpose: React re-rendering a contenteditable's children on
* every keystroke resets the caret to position zero. We seed the DOM once when
* editing opens and read it back on commit.
*/
function Editable({ value, editing, onCommit, as: Tag = "span", className, style, nodeProps }) {
	const ref = useRef(null);
	const endEdit = useEditing((s) => s.endEdit);
	useEffect(() => {
		if (!editing) return;
		const el = ref.current;
		if (!el) return;
		el.textContent = value;
		el.focus();
		const range = document.createRange();
		range.selectNodeContents(el);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	}, [editing, value]);
	const commit = () => {
		const next = ref.current?.textContent?.trim() ?? "";
		endEdit();
		if (next && next !== value) onCommit(next);
		else if (ref.current) ref.current.textContent = value;
	};
	const onKeyDown = (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			commit();
		}
		if (event.key === "Escape") {
			event.preventDefault();
			if (ref.current) ref.current.textContent = value;
			endEdit();
		}
		event.stopPropagation();
	};
	if (editing) return /* @__PURE__ */ jsx(Tag, {
		ref,
		contentEditable: true,
		suppressContentEditableWarning: true,
		spellCheck: false,
		"data-dl-editable": "true",
		className,
		style,
		onBlur: commit,
		onKeyDown,
		...nodeProps
	});
	return /* @__PURE__ */ jsx(Tag, {
		className,
		style,
		...nodeProps,
		children: value
	});
}
//#endregion
//#region src/components/canvas/useNode.ts
/**
* Wires a rendered element into the selection system without wrapping it.
*
* Wrapping every atom in a `<div>` would quietly break the flex and grid
* layouts the section variants depend on, so instead we hang data attributes
* and handlers straight onto the element the layout already renders. The
* selection ring is pure CSS; the floating toolbar measures the element by its
* `data-dl-node` attribute (see SelectionLayer).
*/
function useNode(componentId) {
	const sectionId = useSectionId();
	const isStatic = useIsStatic();
	const select = useLab((s) => s.select);
	const selected = useLab((s) => s.selection?.componentId === componentId && s.selection.sectionId === sectionId);
	const setHover = useEditing((s) => s.setHover);
	if (isStatic) return { "data-dl-node": componentId };
	return {
		"data-dl-node": componentId,
		"data-dl-selected": selected ? "true" : void 0,
		onClick: (event) => {
			event.stopPropagation();
			select({
				sectionId,
				componentId
			});
		},
		onMouseEnter: () => setHover(componentId),
		onMouseLeave: () => setHover(null)
	};
}
/** Adds double-click-to-edit on top of `useNode`, for text-bearing atoms. */
function useEditableNode(componentId, field = "text") {
	const node = useNode(componentId);
	const isStatic = useIsStatic();
	const beginEdit = useEditing((s) => s.beginEdit);
	const editing = useEditing((s) => s.editingId === componentId && s.editingField === field);
	if (isStatic) return {
		node,
		editing: false
	};
	return {
		node: {
			...node,
			onDoubleClick: (event) => {
				event.stopPropagation();
				beginEdit(componentId, field);
			}
		},
		editing
	};
}
//#endregion
//#region src/lib/images.ts
/**
* Uploaded images live in IndexedDB as blobs, not in the zustand-persisted
* page JSON — a couple of hero photos would blow past the localStorage quota
* instantly. Pages only ever store the string key.
*/
var DB_NAME = "design-lab";
var STORE = "images";
var dbPromise = null;
function db() {
	dbPromise ??= openDB(DB_NAME, 1, { upgrade(database) {
		if (!database.objectStoreNames.contains(STORE)) database.createObjectStore(STORE);
	} });
	return dbPromise;
}
/** objectURL cache — revoking eagerly would break every other <img> reusing it. */
var urlCache = /* @__PURE__ */ new Map();
async function putImage(file) {
	const key = uid("img");
	await (await db()).put(STORE, file, key);
	return key;
}
async function getImageUrl(key) {
	const cached = urlCache.get(key);
	if (cached) return cached;
	const blob = await (await db()).get(STORE, key);
	if (!blob) return null;
	const url = URL.createObjectURL(blob);
	urlCache.set(key, url);
	return url;
}
/** Resolves an IndexedDB key to a usable src. Returns null while loading. */
function useImageUrl(key) {
	const [url, setUrl] = useState(() => key ? urlCache.get(key) ?? null : null);
	useEffect(() => {
		if (!key) {
			setUrl(null);
			return;
		}
		const cached = urlCache.get(key);
		if (cached) {
			setUrl(cached);
			return;
		}
		let live = true;
		getImageUrl(key).then((resolved) => {
			if (live) setUrl(resolved);
		});
		return () => {
			live = false;
		};
	}, [key]);
	return url;
}
/** Opens a file picker and returns the stored key, or null if cancelled. */
function pickImage() {
	return new Promise((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) {
				resolve(null);
				return;
			}
			putImage(file).then(resolve);
		};
		input.click();
	});
}
//#endregion
//#region src/components/canvas/atoms.tsx
var SIZE_VAR = {
	sm: "var(--dl-size-sm)",
	base: "var(--dl-size-base)",
	lg: "var(--dl-size-lg)",
	h3: "var(--dl-size-h3)",
	h2: "var(--dl-size-h2)",
	h1: "var(--dl-size-h1)"
};
var LEADING = {
	sm: "1.5",
	base: "1.6",
	lg: "1.55",
	h3: "1.3",
	h2: "1.15",
	h1: "1.03"
};
var COLOR_VAR = {
	text: "var(--dl-text)",
	muted: "var(--dl-muted)",
	primary: "var(--dl-primary)",
	accent: "var(--dl-accent)",
	loud: "var(--dl-loud-text)",
	inherit: void 0
};
/** Reads the right voice for a component, honouring the global tone swapper. */
function useCopy(component, field = "text") {
	const tone = useLab((s) => s.view.tone);
	if (field === "plain") return component.props.text ?? "";
	if (field === "sub") return resolveTone(tone, component.props.subTones, component.props.sub);
	return resolveTone(tone, component.props.tones, component.props.text);
}
/**
* Writes an inline edit back into the model.
*
* When a component ships three voices we only overwrite the one on screen —
* silently rewriting all three would destroy the copy the preset author wrote,
* and the mini-toolbar offers an explicit "sync voices" action for that.
*/
function useCommitCopy(component, field = "text") {
	const sectionId = useSectionId();
	const tone = useLab((s) => s.view.tone);
	const update = useLab((s) => s.updateComponent);
	return (next) => {
		if (field === "plain") {
			update(sectionId, component.id, { text: next });
			return;
		}
		const tonesKey = field === "sub" ? "subTones" : "tones";
		const plainKey = field === "sub" ? "sub" : "text";
		const existing = field === "sub" ? component.props.subTones : component.props.tones;
		if (existing) update(sectionId, component.id, { [tonesKey]: {
			...existing,
			[tone]: next
		} });
		else update(sectionId, component.id, { [plainKey]: next });
	};
}
function CText({ c, as = "p", size = "base", color = "text", weight, field = "text", className, style, heading = false, balance = false }) {
	const value = useCopy(c, field);
	const commit = useCommitCopy(c, field);
	const { node, editing } = useEditableNode(c.id, field);
	return /* @__PURE__ */ jsx(Editable, {
		as,
		value,
		editing,
		onCommit: commit,
		className: cn("m-0", className),
		nodeProps: node,
		style: {
			fontFamily: heading ? "var(--dl-font-heading)" : "var(--dl-font-body)",
			fontSize: SIZE_VAR[size],
			lineHeight: LEADING[size],
			letterSpacing: heading ? "var(--dl-tracking-h)" : void 0,
			fontWeight: weight ?? (heading ? 700 : 400),
			color: COLOR_VAR[color],
			textWrap: balance ? "balance" : void 0,
			...style
		}
	});
}
function CBadge({ c, loud = false }) {
	const value = useCopy(c);
	const commit = useCommitCopy(c);
	const { node, editing } = useEditableNode(c.id);
	return /* @__PURE__ */ jsx(Editable, {
		as: "span",
		value,
		editing,
		onCommit: commit,
		nodeProps: node,
		className: "inline-flex w-fit items-center",
		style: {
			fontFamily: "var(--dl-font-body)",
			fontSize: "var(--dl-size-sm)",
			fontWeight: 600,
			letterSpacing: "0.04em",
			textTransform: "uppercase",
			padding: "6px 12px",
			borderRadius: "var(--dl-radius-pill)",
			border: "1px solid",
			borderColor: loud ? "color-mix(in oklab, var(--dl-loud-text) 30%, transparent)" : "color-mix(in oklab, var(--dl-primary) 28%, transparent)",
			background: loud ? "color-mix(in oklab, var(--dl-loud-text) 12%, transparent)" : "color-mix(in oklab, var(--dl-primary) 8%, transparent)",
			color: loud ? "var(--dl-loud-text)" : "var(--dl-primary)"
		}
	});
}
function CButton({ c, loud = false, block = false }) {
	const value = useCopy(c);
	const commit = useCommitCopy(c);
	const { node, editing } = useEditableNode(c.id);
	const emphasis = c.props.emphasis ?? "primary";
	const base = {
		fontFamily: "var(--dl-font-body)",
		fontSize: "var(--dl-size-base)",
		fontWeight: 600,
		padding: "13px 24px",
		borderRadius: "var(--dl-radius)",
		border: "1px solid transparent",
		cursor: "pointer",
		transition: "transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s, background .18s",
		width: block ? "100%" : void 0,
		textAlign: "center"
	};
	const skin = emphasis === "primary" ? {
		background: loud ? "var(--dl-loud-text)" : "var(--dl-primary)",
		color: loud ? "var(--dl-loud-bg)" : "var(--dl-primary-fg)",
		boxShadow: "0 1px 2px rgba(0,0,0,.12), 0 8px 22px -12px rgba(0,0,0,.45)"
	} : emphasis === "secondary" ? {
		background: loud ? "transparent" : "var(--dl-surface)",
		color: loud ? "var(--dl-loud-text)" : "var(--dl-text)",
		borderColor: loud ? "color-mix(in oklab, var(--dl-loud-text) 35%, transparent)" : "var(--dl-border)"
	} : {
		background: "transparent",
		color: loud ? "var(--dl-loud-text)" : "var(--dl-primary)",
		borderColor: loud ? "color-mix(in oklab, var(--dl-loud-text) 28%, transparent)" : "color-mix(in oklab, var(--dl-primary) 25%, transparent)"
	};
	return /* @__PURE__ */ jsx(Editable, {
		as: "span",
		value,
		editing,
		onCommit: commit,
		nodeProps: node,
		className: "dl-btn inline-flex items-center justify-center select-none",
		style: {
			...base,
			...skin
		}
	});
}
/**
* Placeholder fills are mixed from the live palette, so an un-uploaded slot
* still reads as part of the design instead of a grey hole.
*/
var PLACEHOLDERS = [
	"linear-gradient(135deg, color-mix(in oklab, var(--dl-primary) 82%, black), color-mix(in oklab, var(--dl-accent) 55%, var(--dl-surface)))",
	"linear-gradient(200deg, color-mix(in oklab, var(--dl-accent) 70%, var(--dl-surface)), color-mix(in oklab, var(--dl-primary) 60%, black))",
	"linear-gradient(160deg, color-mix(in oklab, var(--dl-text) 88%, var(--dl-primary)), color-mix(in oklab, var(--dl-primary) 45%, var(--dl-surface)))",
	"linear-gradient(45deg, color-mix(in oklab, var(--dl-surface) 60%, var(--dl-primary)), color-mix(in oklab, var(--dl-accent) 45%, white))",
	"linear-gradient(120deg, color-mix(in oklab, var(--dl-primary) 40%, var(--dl-surface)), color-mix(in oklab, var(--dl-text) 70%, var(--dl-primary)))",
	"radial-gradient(120% 120% at 20% 10%, color-mix(in oklab, var(--dl-accent) 65%, white), color-mix(in oklab, var(--dl-primary) 75%, black))",
	"linear-gradient(180deg, color-mix(in oklab, var(--dl-surface) 70%, var(--dl-accent)), color-mix(in oklab, var(--dl-primary) 55%, var(--dl-text)))",
	"linear-gradient(300deg, color-mix(in oklab, var(--dl-text) 92%, black), color-mix(in oklab, var(--dl-primary) 65%, var(--dl-accent)))"
];
function CImage({ c, className, style, ratio, rounded = "lg" }) {
	const node = useNode(c.id);
	const isStatic = useIsStatic();
	const url = useImageUrl(c.props.imageId);
	const sectionId = useSectionId();
	const update = useLab((s) => s.updateComponent);
	const fill = PLACEHOLDERS[(c.props.placeholder ?? 0) % PLACEHOLDERS.length];
	const upload = () => {
		pickImage().then((imageId) => {
			if (imageId) update(sectionId, c.id, { imageId });
		});
	};
	const handlers = isStatic ? {} : {
		onClick: (event) => {
			node.onClick?.(event);
			if (!c.props.imageId) upload();
		},
		onDoubleClick: (event) => {
			event.stopPropagation();
			upload();
		}
	};
	const radius = rounded === "none" ? "0" : rounded === "sm" ? "var(--dl-radius-sm)" : rounded === "md" ? "var(--dl-radius)" : "var(--dl-radius-lg)";
	return /* @__PURE__ */ jsx("div", {
		...node,
		...handlers,
		className: cn("relative overflow-hidden bg-cover bg-center", !isStatic && !c.props.imageId && "cursor-pointer", className),
		style: {
			aspectRatio: ratio ?? c.props.ratio ?? "4/3",
			borderRadius: radius,
			background: url ? void 0 : fill,
			backgroundImage: url ? `url(${url})` : void 0,
			backgroundSize: "cover",
			backgroundPosition: "center",
			...style
		},
		children: !url && !isStatic && /* @__PURE__ */ jsx("span", {
			className: "pointer-events-none absolute inset-0 flex items-center justify-center text-center",
			style: {
				fontFamily: "var(--dl-font-body)",
				fontSize: "var(--dl-size-sm)",
				fontWeight: 600,
				letterSpacing: "0.06em",
				textTransform: "uppercase",
				color: "rgba(255,255,255,.72)",
				textShadow: "0 1px 8px rgba(0,0,0,.35)"
			},
			children: "Click to upload"
		})
	});
}
function CIconFeature({ c, loud = false, layout = "stack" }) {
	const node = useNode(c.id);
	const iconName = c.props.icon ?? "Sparkles";
	const Ico = Icons[iconName] ?? Icons.Sparkles;
	return /* @__PURE__ */ jsxs("div", {
		...node,
		className: cn("flex", layout === "row" ? "flex-row items-start" : "flex-col"),
		style: { gap: "var(--dl-gap-sm)" },
		children: [/* @__PURE__ */ jsx("span", {
			className: "flex shrink-0 items-center justify-center",
			style: {
				width: 44,
				height: 44,
				borderRadius: "var(--dl-radius-sm)",
				background: loud ? "color-mix(in oklab, var(--dl-loud-text) 14%, transparent)" : "color-mix(in oklab, var(--dl-primary) 10%, transparent)",
				color: loud ? "var(--dl-loud-text)" : "var(--dl-primary)"
			},
			children: /* @__PURE__ */ jsx(Ico, {
				size: 21,
				strokeWidth: 1.9
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col",
			style: { gap: "6px" },
			children: [/* @__PURE__ */ jsx(CText, {
				c,
				as: "h3",
				size: "lg",
				heading: true,
				weight: 650,
				color: loud ? "loud" : "text"
			}), /* @__PURE__ */ jsx(CText, {
				c,
				field: "sub",
				as: "p",
				size: "base",
				color: loud ? "loud" : "muted"
			})]
		})]
	});
}
function CStars({ c, loud = false }) {
	const node = useNode(c.id);
	const rating = c.props.rating ?? 5;
	return /* @__PURE__ */ jsxs("div", {
		...node,
		className: "flex items-center",
		style: { gap: "10px" },
		children: [/* @__PURE__ */ jsx("span", {
			className: "flex",
			style: {
				gap: "2px",
				color: "var(--dl-accent)"
			},
			children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx(Star, {
				size: 16,
				strokeWidth: 1.5,
				fill: i < Math.round(rating) ? "currentColor" : "none",
				opacity: i < Math.round(rating) ? 1 : .35
			}, i))
		}), /* @__PURE__ */ jsx(CText, {
			c,
			field: "sub",
			as: "span",
			size: "sm",
			color: loud ? "loud" : "muted",
			weight: 500
		})]
	});
}
function CStat({ c, loud = false, align = "left" }) {
	const node = useNode(c.id);
	return /* @__PURE__ */ jsxs("div", {
		...node,
		className: cn("flex flex-col", align === "center" && "items-center text-center"),
		style: { gap: "4px" },
		children: [/* @__PURE__ */ jsx(CText, {
			c,
			as: "span",
			size: "h2",
			heading: true,
			weight: 700,
			color: loud ? "loud" : "primary",
			style: { lineHeight: 1 }
		}), /* @__PURE__ */ jsx(CText, {
			c,
			field: "sub",
			as: "span",
			size: "sm",
			color: loud ? "loud" : "muted"
		})]
	});
}
function CAvatar({ c, loud = false }) {
	const node = useNode(c.id);
	const name = useCopy(c);
	const url = useImageUrl(c.props.imageId);
	const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
	return /* @__PURE__ */ jsxs("div", {
		...node,
		className: "flex items-center",
		style: { gap: "12px" },
		children: [/* @__PURE__ */ jsx("span", {
			className: "flex shrink-0 items-center justify-center overflow-hidden bg-cover bg-center",
			style: {
				width: 42,
				height: 42,
				borderRadius: "999px",
				background: url ? void 0 : "color-mix(in oklab, var(--dl-primary) 18%, transparent)",
				backgroundImage: url ? `url(${url})` : void 0,
				color: "var(--dl-primary)",
				fontSize: "var(--dl-size-sm)",
				fontWeight: 700,
				fontFamily: "var(--dl-font-body)"
			},
			children: !url && initials
		}), /* @__PURE__ */ jsxs("span", {
			className: "flex flex-col",
			children: [/* @__PURE__ */ jsx(CText, {
				c,
				as: "span",
				size: "base",
				weight: 600,
				color: loud ? "loud" : "text"
			}), /* @__PURE__ */ jsx(CText, {
				c,
				field: "sub",
				as: "span",
				size: "sm",
				color: loud ? "loud" : "muted"
			})]
		})]
	});
}
function CLogos({ c, count, loud = false, size = "base" }) {
	const node = useNode(c.id);
	const logos = (c.props.logos ?? []).slice(0, Math.max(2, count));
	return /* @__PURE__ */ jsx("div", {
		...node,
		className: "flex flex-wrap items-center justify-center",
		style: {
			gap: "var(--dl-gap-lg)",
			rowGap: "var(--dl-gap)"
		},
		children: logos.map((logo, i) => /* @__PURE__ */ jsx("span", {
			style: {
				fontFamily: "var(--dl-font-heading)",
				fontSize: SIZE_VAR[size],
				fontWeight: 650,
				letterSpacing: "-0.01em",
				color: loud ? "var(--dl-loud-text)" : "var(--dl-text)",
				opacity: .55
			},
			children: logo
		}, `${logo}-${i}`))
	});
}
function CQuote({ c, loud = false, size = "lg" }) {
	const node = useNode(c.id);
	return /* @__PURE__ */ jsxs("figure", {
		...node,
		className: "m-0 flex flex-col",
		style: {
			gap: "var(--dl-gap-sm)",
			padding: "var(--dl-gap)",
			borderRadius: "var(--dl-radius)",
			background: loud ? "color-mix(in oklab, var(--dl-loud-text) 8%, transparent)" : "var(--dl-surface)",
			border: "1px solid",
			borderColor: loud ? "color-mix(in oklab, var(--dl-loud-text) 16%, transparent)" : "var(--dl-border)"
		},
		children: [/* @__PURE__ */ jsx(CText, {
			c,
			as: "blockquote",
			size,
			heading: true,
			weight: 500,
			color: loud ? "loud" : "text",
			className: "m-0",
			style: { letterSpacing: "-0.01em" }
		}), /* @__PURE__ */ jsx(CText, {
			c,
			field: "sub",
			as: "figcaption",
			size: "sm",
			weight: 600,
			color: loud ? "loud" : "muted"
		})]
	});
}
function CListItem({ c, loud = false }) {
	return /* @__PURE__ */ jsx(CText, {
		c,
		as: "span",
		size: "base",
		color: loud ? "loud" : "muted"
	});
}
//#endregion
//#region src/sections/parts.ts
/**
* Section layouts consume components by type rather than by index, so the
* component tray can insert anything anywhere and the layout still knows what
* to do with it.
*/
function byType(components) {
	const of = (type) => components.filter((c) => c.type === type);
	return {
		badges: of("badge"),
		headings: of("heading"),
		subheadings: of("subheading"),
		paragraphs: of("paragraph"),
		buttons: of("button"),
		images: of("imageSlot"),
		stars: of("starRating"),
		stats: of("stat"),
		avatars: of("avatar"),
		logoRows: of("logoRow"),
		quotes: of("quote"),
		features: of("iconFeature"),
		prices: of("priceTag"),
		faqs: of("faqItem"),
		cards: of("bentoCard"),
		listItems: of("listItem"),
		dividers: of("divider")
	};
}
/** Outer padding shared by every section variant. */
function sectionPad(extra) {
	return {
		paddingTop: "var(--dl-pad-y)",
		paddingBottom: "var(--dl-pad-y)",
		paddingLeft: "var(--dl-pad-x)",
		paddingRight: "var(--dl-pad-x)",
		...extra
	};
}
/** Loud sections invert onto the palette's dark surface. */
function surface(loud) {
	return loud ? {
		background: "var(--dl-loud-bg)",
		color: "var(--dl-loud-text)"
	} : {
		background: "var(--dl-bg)",
		color: "var(--dl-text)"
	};
}
var CONTAINER = {
	maxWidth: 1180,
	marginInline: "auto",
	width: "100%"
};
var NARROW = {
	maxWidth: 760,
	marginInline: "auto",
	width: "100%"
};
//#endregion
//#region src/sections/SectionHeader.tsx
/**
* The eyebrow + heading pair almost every non-hero section opens with.
* Keeping it in one place is what makes vertical rhythm consistent across
* variants — the thing squint-test mode is meant to reveal.
*/
function SectionHeader({ subheadings, headings, paragraphs = [], align = "left", loud = false, size = "h2" }) {
	if (subheadings.length === 0 && headings.length === 0 && paragraphs.length === 0) return null;
	const centered = align === "center";
	return /* @__PURE__ */ jsxs("div", {
		className: centered ? "flex flex-col items-center text-center" : "flex flex-col items-start",
		style: {
			gap: "var(--dl-gap-sm)",
			marginBottom: "var(--dl-gap-lg)",
			...centered ? NARROW : { maxWidth: 720 }
		},
		children: [
			subheadings.map((c) => /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(CText, {
				c,
				as: "span",
				size: "sm",
				weight: 650,
				color: loud ? "loud" : "primary",
				style: {
					letterSpacing: "0.12em",
					textTransform: "uppercase"
				}
			}) }, c.id)),
			headings.map((c) => /* @__PURE__ */ jsx(Reveal, {
				index: 1,
				style: { width: "100%" },
				children: /* @__PURE__ */ jsx(CText, {
					c,
					as: "h2",
					size,
					heading: true,
					weight: 700,
					balance: true,
					color: loud ? "loud" : "text"
				})
			}, c.id)),
			paragraphs.map((c, i) => /* @__PURE__ */ jsx(Reveal, {
				index: 2 + i,
				style: { width: "100%" },
				children: /* @__PURE__ */ jsx(CText, {
					c,
					size: "lg",
					color: loud ? "loud" : "muted",
					style: {
						marginTop: "4px",
						...loud ? { opacity: .85 } : {}
					}
				})
			}, c.id))
		]
	});
}
//#endregion
//#region src/sections/Bento.tsx
var COLS = 12;
var MIN_COL = 3;
var MAX_ROW = 3;
function Bento({ section, comps }) {
	const p = byType(comps);
	const gridRef = useRef(null);
	const isStatic = useIsStatic();
	const addComponent = useLab((s) => s.addComponent);
	const loud = section.variant === "contrast";
	return /* @__PURE__ */ jsx("div", {
		style: {
			background: loud ? "var(--dl-loud-bg)" : "var(--dl-bg)",
			color: loud ? "var(--dl-loud-text)" : "var(--dl-text)",
			...sectionPad()
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			children: [/* @__PURE__ */ jsx(SectionHeader, {
				subheadings: p.subheadings,
				headings: p.headings,
				paragraphs: p.paragraphs,
				loud
			}), /* @__PURE__ */ jsxs("div", {
				ref: gridRef,
				className: "grid",
				style: {
					gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
					gridAutoRows: "minmax(148px, auto)",
					gap: "var(--dl-gap-sm)"
				},
				children: [p.cards.map((c, i) => /* @__PURE__ */ jsx(BentoCard, {
					c,
					index: i,
					gridRef,
					variant: section.variant,
					loud
				}, c.id)), !isStatic && /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: (event) => {
						event.stopPropagation();
						addComponent(section.id, "bentoCard");
					},
					className: "flex cursor-pointer items-center justify-center gap-2 border-0 bg-transparent transition-colors",
					style: {
						gridColumn: "span 4",
						minHeight: 148,
						borderRadius: "var(--dl-radius)",
						border: "1.5px dashed",
						borderColor: loud ? "color-mix(in oklab, var(--dl-loud-text) 26%, transparent)" : "var(--dl-border)",
						color: loud ? "var(--dl-loud-text)" : "var(--dl-muted)",
						fontFamily: "var(--dl-font-body)",
						fontSize: "var(--dl-size-sm)",
						fontWeight: 600
					},
					children: [/* @__PURE__ */ jsx(Plus, { size: 16 }), " Add card"]
				})]
			})]
		})
	});
}
var CARD_FILLS = [
	"linear-gradient(135deg, color-mix(in oklab, var(--dl-primary) 80%, black), color-mix(in oklab, var(--dl-accent) 50%, var(--dl-surface)))",
	"linear-gradient(210deg, color-mix(in oklab, var(--dl-accent) 62%, var(--dl-surface)), color-mix(in oklab, var(--dl-primary) 70%, black))",
	"radial-gradient(110% 110% at 15% 15%, color-mix(in oklab, var(--dl-accent) 60%, white), color-mix(in oklab, var(--dl-primary) 78%, black))",
	"linear-gradient(320deg, color-mix(in oklab, var(--dl-text) 90%, black), color-mix(in oklab, var(--dl-primary) 62%, var(--dl-accent)))"
];
function BentoCard({ c, index, gridRef, variant, loud }) {
	const node = useNode(c.id);
	const isStatic = useIsStatic();
	const sectionId = useSectionId();
	const update = useLab((s) => s.updateComponent);
	const commit = useLab((s) => s.commit);
	const stored = c.props.span ?? {
		col: 4,
		row: 1
	};
	const [draft, setDraft] = useState(null);
	const span = draft ?? stored;
	const onResizeStart = (event) => {
		event.preventDefault();
		event.stopPropagation();
		const grid = gridRef.current;
		if (!grid) return;
		const handle = event.currentTarget;
		handle.setPointerCapture(event.pointerId);
		const gridBox = grid.getBoundingClientRect();
		const styles = getComputedStyle(grid);
		const gap = Number.parseFloat(styles.columnGap || "0") || 0;
		const rowGap = Number.parseFloat(styles.rowGap || "0") || gap;
		const colUnit = (gridBox.width - gap * 11) / COLS + gap;
		const cardBox = handle.parentElement?.getBoundingClientRect();
		const rowUnit = cardBox ? cardBox.height / stored.row + rowGap : 148 + rowGap;
		const startX = event.clientX;
		const startY = event.clientY;
		let latest = stored;
		const onMove = (moveEvent) => {
			const dCol = Math.round((moveEvent.clientX - startX) / colUnit);
			const dRow = Math.round((moveEvent.clientY - startY) / rowUnit);
			const next = {
				col: clamp(stored.col + dCol, MIN_COL, COLS),
				row: clamp(stored.row + dRow, 1, MAX_ROW)
			};
			if (next.col !== latest.col || next.row !== latest.row) {
				latest = next;
				setDraft(next);
			}
		};
		const onUp = () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			setDraft(null);
			if (latest.col !== stored.col || latest.row !== stored.row) update(sectionId, c.id, { span: latest });
		};
		commit();
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
	};
	const outline = variant === "outline";
	const fill = CARD_FILLS[(c.props.placeholder ?? index) % CARD_FILLS.length];
	const tall = span.row >= 2;
	return /* @__PURE__ */ jsxs(motion.div, {
		layout: true,
		transition: {
			type: "spring",
			stiffness: 420,
			damping: 38,
			mass: .8
		},
		style: {
			gridColumn: `span ${span.col}`,
			gridRow: `span ${span.row}`,
			position: "relative",
			overflow: "hidden",
			borderRadius: "var(--dl-radius)",
			background: outline ? "transparent" : loud ? "color-mix(in oklab, var(--dl-loud-text) 8%, transparent)" : "var(--dl-surface)",
			border: "1px solid",
			borderColor: loud ? "color-mix(in oklab, var(--dl-loud-text) 16%, transparent)" : "var(--dl-border)"
		},
		children: [/* @__PURE__ */ jsx(Reveal, {
			index,
			style: { height: "100%" },
			children: /* @__PURE__ */ jsxs("div", {
				...node,
				className: "flex h-full flex-col",
				children: [tall && /* @__PURE__ */ jsx("div", {
					style: {
						flex: "1 1 45%",
						minHeight: 90,
						background: fill
					},
					"aria-hidden": true
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col",
					style: {
						gap: "6px",
						padding: "var(--dl-gap)",
						flex: tall ? "0 0 auto" : "1 1 auto"
					},
					children: [/* @__PURE__ */ jsx(CText, {
						c,
						as: "h3",
						size: "lg",
						heading: true,
						weight: 650,
						color: loud ? "loud" : "text"
					}), /* @__PURE__ */ jsx(CText, {
						c,
						field: "sub",
						size: "base",
						color: loud ? "loud" : "muted"
					})]
				})]
			})
		}), !isStatic && /* @__PURE__ */ jsx("span", {
			role: "slider",
			tabIndex: 0,
			"aria-label": `Resize card — ${span.col} of 12 columns, ${span.row} rows`,
			"aria-valuenow": span.col,
			"aria-valuemin": MIN_COL,
			"aria-valuemax": COLS,
			onPointerDown: onResizeStart,
			onKeyDown: (event) => {
				const step = event.key === "ArrowRight" ? {
					col: 1,
					row: 0
				} : event.key === "ArrowLeft" ? {
					col: -1,
					row: 0
				} : event.key === "ArrowDown" ? {
					col: 0,
					row: 1
				} : event.key === "ArrowUp" ? {
					col: 0,
					row: -1
				} : null;
				if (!step) return;
				event.preventDefault();
				update(sectionId, c.id, { span: {
					col: clamp(stored.col + step.col, MIN_COL, COLS),
					row: clamp(stored.row + step.row, 1, MAX_ROW)
				} });
			},
			className: "dl-resize absolute cursor-nwse-resize",
			style: {
				right: 5,
				bottom: 5,
				width: 18,
				height: 18,
				borderRadius: 5,
				background: "rgba(124,108,255,.92)",
				boxShadow: "0 2px 6px rgba(0,0,0,.3)",
				touchAction: "none"
			}
		})]
	});
}
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
//#endregion
//#region src/sections/CtaBanner.tsx
/**
* The ask. Loud by default — this is the section the contrast-pacing minimap
* expects to see spike at the end of a page.
*/
function CtaBanner({ section, comps }) {
	const p = byType(comps);
	const loud = section.mood === "loud";
	const variant = section.variant;
	const copy = (align) => /* @__PURE__ */ jsxs("div", {
		className: align === "center" ? "flex flex-col items-center text-center" : "flex flex-col items-start",
		style: {
			gap: "var(--dl-gap-sm)",
			...align === "center" ? NARROW : {}
		},
		children: [
			p.badges.map((c) => /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(CBadge, {
				c,
				loud
			}) }, c.id)),
			p.headings.map((c) => /* @__PURE__ */ jsx(Reveal, {
				index: 1,
				style: { width: "100%" },
				children: /* @__PURE__ */ jsx(CText, {
					c,
					as: "h2",
					size: "h2",
					heading: true,
					weight: 700,
					balance: true,
					color: loud ? "loud" : "text"
				})
			}, c.id)),
			p.paragraphs.map((c, i) => /* @__PURE__ */ jsx(Reveal, {
				index: 2 + i,
				style: { width: "100%" },
				children: /* @__PURE__ */ jsx(CText, {
					c,
					size: "lg",
					color: loud ? "loud" : "muted",
					style: {
						marginTop: "4px",
						...loud ? { opacity: .82 } : {}
					}
				})
			}, c.id))
		]
	});
	const actions = p.buttons.length > 0 && /* @__PURE__ */ jsx(Reveal, {
		index: 3,
		children: /* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap",
			style: { gap: "var(--dl-gap-sm)" },
			children: p.buttons.map((c) => /* @__PURE__ */ jsx(CButton, {
				c,
				loud
			}, c.id))
		})
	});
	if (variant === "ribbon") return /* @__PURE__ */ jsx("div", {
		style: {
			background: loud ? "var(--dl-loud-bg)" : "var(--dl-surface)",
			color: loud ? "var(--dl-loud-text)" : "var(--dl-text)",
			...sectionPad({
				paddingTop: "calc(var(--dl-pad-y) * 0.75)",
				paddingBottom: "calc(var(--dl-pad-y) * 0.75)"
			})
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			className: "flex flex-wrap items-center justify-between",
			children: [/* @__PURE__ */ jsx("div", {
				style: { maxWidth: 620 },
				children: copy("left")
			}), /* @__PURE__ */ jsx("div", {
				style: { marginTop: "var(--dl-gap-sm)" },
				children: actions
			})]
		})
	});
	if (variant === "panel") return /* @__PURE__ */ jsx("div", {
		style: sectionPad(),
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				...CONTAINER,
				background: loud ? "var(--dl-loud-bg)" : "var(--dl-surface)",
				color: loud ? "var(--dl-loud-text)" : "var(--dl-text)",
				borderRadius: "var(--dl-radius-lg)",
				padding: "calc(var(--dl-pad-y) * 0.7) var(--dl-pad-x)",
				border: loud ? "none" : "1px solid var(--dl-border)",
				boxShadow: loud ? "0 40px 90px -50px rgba(0,0,0,.7)" : void 0
			},
			className: "flex flex-col items-center",
			children: [copy("center"), /* @__PURE__ */ jsx("div", {
				style: { marginTop: "var(--dl-gap)" },
				children: actions
			})]
		})
	});
	if (variant === "split") {
		const image = p.images[0];
		return /* @__PURE__ */ jsx("div", {
			style: {
				background: loud ? "var(--dl-loud-bg)" : "var(--dl-bg)",
				color: loud ? "var(--dl-loud-text)" : "var(--dl-text)",
				...sectionPad()
			},
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid items-center",
				style: {
					...CONTAINER,
					gridTemplateColumns: "minmax(0,7fr) minmax(0,5fr)",
					gap: "calc(var(--dl-gap-lg) * 1.3)"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col",
					style: { gap: "var(--dl-gap)" },
					children: [copy("left"), actions]
				}), image ? /* @__PURE__ */ jsx(Reveal, {
					index: 2,
					children: /* @__PURE__ */ jsx(CImage, {
						c: image,
						ratio: "4/3"
					})
				}) : /* @__PURE__ */ jsx(Reveal, {
					index: 2,
					children: /* @__PURE__ */ jsx("div", {
						"aria-hidden": true,
						style: {
							aspectRatio: "4/3",
							borderRadius: "var(--dl-radius-lg)",
							background: loud ? "color-mix(in oklab, var(--dl-loud-text) 8%, transparent)" : "var(--dl-surface)",
							border: "1px solid",
							borderColor: loud ? "color-mix(in oklab, var(--dl-loud-text) 16%, transparent)" : "var(--dl-border)"
						}
					})
				})]
			})
		});
	}
	return /* @__PURE__ */ jsx("div", {
		style: {
			background: loud ? "var(--dl-loud-bg)" : "var(--dl-bg)",
			color: loud ? "var(--dl-loud-text)" : "var(--dl-text)",
			...sectionPad()
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			className: "flex flex-col items-center",
			children: [copy("center"), /* @__PURE__ */ jsx("div", {
				style: { marginTop: "var(--dl-gap)" },
				children: actions
			})]
		})
	});
}
//#endregion
//#region src/sections/Faq.tsx
function Faq({ section, comps }) {
	const p = byType(comps);
	const loud = section.mood === "loud";
	const variant = section.variant;
	const [open, setOpen] = useState(p.faqs[0]?.id ?? null);
	if (variant === "twoCol") return /* @__PURE__ */ jsx("div", {
		style: {
			...surface(loud),
			...sectionPad()
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				...CONTAINER,
				display: "grid",
				gridTemplateColumns: "minmax(0,4fr) minmax(0,7fr)",
				gap: "calc(var(--dl-gap-lg) * 1.2)",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsx("div", {
				style: {
					position: "sticky",
					top: 32
				},
				children: /* @__PURE__ */ jsx(SectionHeader, {
					subheadings: p.subheadings,
					headings: p.headings,
					paragraphs: p.paragraphs,
					loud
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "flex flex-col",
				style: { gap: "var(--dl-gap)" },
				children: p.faqs.map((c, i) => /* @__PURE__ */ jsx(Reveal, {
					index: i,
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col",
						style: { gap: "8px" },
						children: [/* @__PURE__ */ jsx(CText, {
							c,
							as: "h3",
							size: "lg",
							heading: true,
							weight: 650,
							color: loud ? "loud" : "text"
						}), /* @__PURE__ */ jsx(CText, {
							c,
							field: "sub",
							size: "base",
							color: loud ? "loud" : "muted"
						})]
					})
				}, c.id))
			})]
		})
	});
	const boxed = variant === "boxed";
	return /* @__PURE__ */ jsx("div", {
		style: {
			...surface(loud),
			...sectionPad()
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				...CONTAINER,
				maxWidth: boxed ? 1180 : 860
			},
			children: [/* @__PURE__ */ jsx(SectionHeader, {
				subheadings: p.subheadings,
				headings: p.headings,
				paragraphs: p.paragraphs,
				align: boxed ? "center" : "left",
				loud
			}), /* @__PURE__ */ jsx("div", {
				className: boxed ? "grid" : "flex flex-col",
				style: boxed ? {
					gridTemplateColumns: "repeat(2, minmax(0,1fr))",
					gap: "var(--dl-gap-sm)"
				} : {
					borderTop: "1px solid",
					borderColor: loud ? "color-mix(in oklab, var(--dl-loud-text) 16%, transparent)" : "var(--dl-border)"
				},
				children: p.faqs.map((c, i) => /* @__PURE__ */ jsx(Reveal, {
					index: i,
					children: /* @__PURE__ */ jsx(FaqRow, {
						c,
						loud,
						boxed,
						open: open === c.id,
						onToggle: () => setOpen(open === c.id ? null : c.id)
					})
				}, c.id))
			})]
		})
	});
}
function FaqRow({ c, loud, boxed, open, onToggle }) {
	const node = useNode(c.id);
	const border = loud ? "color-mix(in oklab, var(--dl-loud-text) 16%, transparent)" : "var(--dl-border)";
	return /* @__PURE__ */ jsxs("div", {
		...node,
		style: {
			borderBottom: boxed ? "none" : `1px solid ${border}`,
			border: boxed ? `1px solid ${border}` : void 0,
			borderRadius: boxed ? "var(--dl-radius)" : void 0,
			background: boxed ? loud ? "transparent" : "var(--dl-surface)" : void 0,
			padding: boxed ? "var(--dl-gap)" : "var(--dl-gap) 0"
		},
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: (event) => {
				event.stopPropagation();
				onToggle();
			},
			className: "flex w-full cursor-pointer items-start justify-between border-0 bg-transparent p-0 text-left",
			style: { gap: "var(--dl-gap)" },
			"aria-expanded": open,
			children: [/* @__PURE__ */ jsx(CText, {
				c,
				as: "span",
				size: "lg",
				heading: true,
				weight: 620,
				color: loud ? "loud" : "text"
			}), /* @__PURE__ */ jsx(motion.span, {
				animate: { rotate: open ? 45 : 0 },
				transition: {
					duration: .28,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				style: {
					color: loud ? "var(--dl-loud-text)" : "var(--dl-primary)",
					flexShrink: 0
				},
				children: /* @__PURE__ */ jsx(Plus, {
					size: 20,
					strokeWidth: 2
				})
			})]
		}), /* @__PURE__ */ jsx(AnimatePresence, {
			initial: false,
			children: open && /* @__PURE__ */ jsx(motion.div, {
				initial: {
					height: 0,
					opacity: 0
				},
				animate: {
					height: "auto",
					opacity: 1
				},
				exit: {
					height: 0,
					opacity: 0
				},
				transition: {
					duration: .34,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				style: { overflow: "hidden" },
				children: /* @__PURE__ */ jsx("div", {
					style: {
						paddingTop: "var(--dl-gap-sm)",
						maxWidth: "68ch"
					},
					children: /* @__PURE__ */ jsx(CText, {
						c,
						field: "sub",
						size: "base",
						color: loud ? "loud" : "muted"
					})
				})
			}, "body")
		})]
	});
}
//#endregion
//#region src/sections/FeatureGrid.tsx
function FeatureGrid({ section, comps }) {
	const p = byType(comps);
	const loud = section.mood === "loud";
	const variant = section.variant;
	const header = (align = "left") => /* @__PURE__ */ jsx(SectionHeader, {
		subheadings: p.subheadings,
		headings: p.headings,
		paragraphs: p.paragraphs,
		align,
		loud
	});
	if (variant === "alternating") return /* @__PURE__ */ jsx("div", {
		style: {
			...surface(loud),
			...sectionPad()
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			children: [header(), /* @__PURE__ */ jsx("div", {
				className: "flex flex-col",
				style: { gap: "calc(var(--dl-gap-lg) * 1.4)" },
				children: p.features.map((c, i) => {
					const image = p.images[i];
					const flipped = i % 2 === 1;
					return /* @__PURE__ */ jsx(Reveal, {
						index: i,
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid items-center",
							style: {
								gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
								gap: "calc(var(--dl-gap-lg) * 1.2)"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: { order: flipped ? 2 : 1 },
								children: /* @__PURE__ */ jsx(CIconFeature, {
									c,
									loud
								})
							}), /* @__PURE__ */ jsx("div", {
								style: { order: flipped ? 1 : 2 },
								children: image ? /* @__PURE__ */ jsx(CImage, {
									c: image,
									ratio: "4/3"
								}) : /* @__PURE__ */ jsx("div", { style: {
									aspectRatio: "4/3",
									borderRadius: "var(--dl-radius-lg)",
									background: "var(--dl-surface)",
									border: "1px solid var(--dl-border)"
								} })
							})]
						})
					}, c.id);
				})
			})]
		})
	});
	if (variant === "iconList") return /* @__PURE__ */ jsx("div", {
		style: {
			...surface(loud),
			...sectionPad()
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				...CONTAINER,
				display: "grid",
				gridTemplateColumns: "minmax(0,4fr) minmax(0,7fr)",
				gap: "calc(var(--dl-gap-lg) * 1.2)",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsx("div", {
				style: {
					position: "sticky",
					top: 32
				},
				children: header()
			}), /* @__PURE__ */ jsx("div", {
				className: "flex flex-col",
				style: { gap: "var(--dl-gap-lg)" },
				children: p.features.map((c, i) => /* @__PURE__ */ jsx(Reveal, {
					index: i,
					children: /* @__PURE__ */ jsx("div", {
						style: {
							paddingBottom: "var(--dl-gap-lg)",
							borderBottom: i === p.features.length - 1 ? "none" : "1px solid var(--dl-border)"
						},
						children: /* @__PURE__ */ jsx(CIconFeature, {
							c,
							loud,
							layout: "row"
						})
					})
				}, c.id))
			})]
		})
	});
	const bordered = variant === "bordered";
	return /* @__PURE__ */ jsx("div", {
		style: {
			...surface(loud),
			...sectionPad()
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			children: [
				header(bordered ? "left" : "center"),
				/* @__PURE__ */ jsx("div", {
					className: "grid",
					style: {
						gridTemplateColumns: `repeat(${Math.min(3, Math.max(1, p.features.length))}, minmax(0,1fr))`,
						gap: bordered ? "0" : "var(--dl-gap)",
						...bordered ? {
							border: "1px solid var(--dl-border)",
							borderRadius: "var(--dl-radius-lg)",
							overflow: "hidden"
						} : {}
					},
					children: p.features.map((c, i) => /* @__PURE__ */ jsx(Reveal, {
						index: i,
						children: /* @__PURE__ */ jsx("div", {
							style: {
								height: "100%",
								padding: "var(--dl-gap)",
								borderRadius: bordered ? 0 : "var(--dl-radius)",
								background: bordered ? "transparent" : loud ? "color-mix(in oklab, var(--dl-loud-text) 7%, transparent)" : "var(--dl-surface)",
								borderStyle: "solid",
								borderColor: loud ? "color-mix(in oklab, var(--dl-loud-text) 14%, transparent)" : "var(--dl-border)",
								borderTopWidth: bordered ? 0 : 1,
								borderRightWidth: bordered ? 0 : 1,
								borderBottomWidth: bordered ? 0 : 1,
								borderLeftWidth: bordered ? i > 0 ? 1 : 0 : 1
							},
							children: /* @__PURE__ */ jsx(CIconFeature, {
								c,
								loud
							})
						})
					}, c.id))
				}),
				p.stats.length > 0 && /* @__PURE__ */ jsx(Reveal, {
					index: p.features.length,
					children: /* @__PURE__ */ jsx("div", {
						className: "grid",
						style: {
							marginTop: "var(--dl-gap-lg)",
							gridTemplateColumns: `repeat(${p.stats.length}, minmax(0,1fr))`,
							gap: "var(--dl-gap)"
						},
						children: p.stats.map((c) => /* @__PURE__ */ jsx(CText, {
							c,
							as: "span",
							size: "h3",
							heading: true,
							color: "primary"
						}, c.id))
					})
				})
			]
		})
	});
}
//#endregion
//#region src/sections/Footer.tsx
function Footer({ section, comps }) {
	const p = byType(comps);
	const loud = section.mood === "loud";
	const variant = section.variant;
	const base = {
		background: loud ? "var(--dl-loud-bg)" : "var(--dl-surface)",
		color: loud ? "var(--dl-loud-text)" : "var(--dl-text)"
	};
	if (variant === "minimal") return /* @__PURE__ */ jsx("div", {
		style: {
			...base,
			...sectionPad({
				paddingTop: "calc(var(--dl-pad-y) * 0.5)",
				paddingBottom: "calc(var(--dl-pad-y) * 0.5)"
			})
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			className: "flex flex-wrap items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col",
				style: { gap: "4px" },
				children: [p.headings[0] && /* @__PURE__ */ jsx(CText, {
					c: p.headings[0],
					as: "span",
					size: "lg",
					heading: true,
					weight: 700,
					color: loud ? "loud" : "text"
				}), p.paragraphs[0] && /* @__PURE__ */ jsx(CText, {
					c: p.paragraphs[0],
					as: "span",
					size: "sm",
					color: loud ? "loud" : "muted"
				})]
			}), /* @__PURE__ */ jsx("nav", {
				className: "flex flex-wrap",
				style: { gap: "var(--dl-gap)" },
				children: p.listItems.map((c) => /* @__PURE__ */ jsx(CListItem, {
					c,
					loud
				}, c.id))
			})]
		})
	});
	if (variant === "big") return /* @__PURE__ */ jsx("div", {
		style: {
			...base,
			...sectionPad()
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			className: "flex flex-col",
			children: [
				p.headings[0] && /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(CText, {
					c: p.headings[0],
					as: "h2",
					size: "h1",
					heading: true,
					weight: 700,
					color: loud ? "loud" : "text"
				}) }),
				p.paragraphs[0] && /* @__PURE__ */ jsx(Reveal, {
					index: 1,
					children: /* @__PURE__ */ jsx(CText, {
						c: p.paragraphs[0],
						size: "lg",
						color: loud ? "loud" : "muted",
						style: {
							marginTop: "var(--dl-gap-sm)",
							maxWidth: 620
						}
					})
				}),
				/* @__PURE__ */ jsx(Reveal, {
					index: 2,
					children: /* @__PURE__ */ jsx("nav", {
						className: "flex flex-wrap",
						style: {
							gap: "var(--dl-gap)",
							marginTop: "var(--dl-pad-y)",
							paddingTop: "var(--dl-gap)",
							borderTop: "1px solid var(--dl-border)"
						},
						children: p.listItems.map((c) => /* @__PURE__ */ jsx(CListItem, {
							c,
							loud
						}, c.id))
					})
				}),
				p.logoRows[0] && /* @__PURE__ */ jsx("div", {
					style: { marginTop: "var(--dl-gap-lg)" },
					children: /* @__PURE__ */ jsx(CLogos, {
						c: p.logoRows[0],
						count: p.logoRows[0].props.logos?.length ?? 4,
						loud
					})
				})
			]
		})
	});
	const columns = Math.max(1, Math.ceil(p.listItems.length / 3));
	return /* @__PURE__ */ jsx("div", {
		style: {
			...base,
			...sectionPad()
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid",
			style: {
				...CONTAINER,
				gridTemplateColumns: "minmax(0,5fr) minmax(0,7fr)",
				gap: "calc(var(--dl-gap-lg) * 1.2)"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col",
				style: { gap: "var(--dl-gap-sm)" },
				children: [p.headings[0] && /* @__PURE__ */ jsx(CText, {
					c: p.headings[0],
					as: "h2",
					size: "h3",
					heading: true,
					weight: 700,
					color: loud ? "loud" : "text"
				}), p.paragraphs.map((c) => /* @__PURE__ */ jsx(CText, {
					c,
					size: "base",
					color: loud ? "loud" : "muted"
				}, c.id))]
			}), /* @__PURE__ */ jsx("nav", {
				className: "grid",
				style: {
					gridTemplateColumns: `repeat(${Math.min(3, columns)}, minmax(0,1fr))`,
					gap: "var(--dl-gap-sm)",
					alignContent: "start"
				},
				children: p.listItems.map((c) => /* @__PURE__ */ jsx(CListItem, {
					c,
					loud
				}, c.id))
			})]
		})
	});
}
//#endregion
//#region src/sections/Hero.tsx
/**
* Six hero archetypes sharing one component pool. Swapping variants never
* loses content — each layout simply decides how much of the pool it shows.
*/
function Hero({ section, comps }) {
	switch (section.variant) {
		case "centered": return /* @__PURE__ */ jsx(HeroCentered, {
			section,
			comps
		});
		case "fullBleed": return /* @__PURE__ */ jsx(HeroFullBleed, {
			section,
			comps
		});
		case "editorial": return /* @__PURE__ */ jsx(HeroEditorial, {
			section,
			comps
		});
		case "collage": return /* @__PURE__ */ jsx(HeroCollage, {
			section,
			comps
		});
		case "minimal": return /* @__PURE__ */ jsx(HeroMinimal, {
			section,
			comps
		});
		default: return /* @__PURE__ */ jsx(HeroSplit, {
			section,
			comps
		});
	}
}
/** Shared copy block: badge → heading → paragraph → buttons → proof. */
function CopyStack({ comps, loud = false, align = "left", headingSize = "h1", startIndex = 0 }) {
	const p = byType(comps);
	const centered = align === "center";
	let i = startIndex;
	return /* @__PURE__ */ jsxs("div", {
		className: centered ? "flex flex-col items-center text-center" : "flex flex-col items-start",
		style: { gap: "var(--dl-gap)" },
		children: [
			p.badges.map((c) => /* @__PURE__ */ jsx(Reveal, {
				index: i++,
				children: /* @__PURE__ */ jsx(CBadge, {
					c,
					loud
				})
			}, c.id)),
			p.headings.map((c) => /* @__PURE__ */ jsx(Reveal, {
				index: i++,
				style: { width: "100%" },
				children: /* @__PURE__ */ jsx(CText, {
					c,
					as: "h1",
					size: headingSize,
					heading: true,
					weight: 720,
					balance: true,
					color: loud ? "loud" : "text"
				})
			}, c.id)),
			p.paragraphs.map((c) => /* @__PURE__ */ jsx(Reveal, {
				index: i++,
				style: {
					width: "100%",
					maxWidth: 560
				},
				children: /* @__PURE__ */ jsx(CText, {
					c,
					size: "lg",
					color: loud ? "loud" : "muted",
					style: loud ? { opacity: .85 } : void 0
				})
			}, c.id)),
			p.buttons.length > 0 && /* @__PURE__ */ jsx(Reveal, {
				index: i++,
				children: /* @__PURE__ */ jsx("div", {
					className: centered ? "flex flex-wrap justify-center" : "flex flex-wrap",
					style: { gap: "var(--dl-gap-sm)" },
					children: p.buttons.map((c) => /* @__PURE__ */ jsx(CButton, {
						c,
						loud
					}, c.id))
				})
			}),
			p.prices.length > 0 && /* @__PURE__ */ jsx(Reveal, {
				index: i++,
				children: /* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap items-baseline",
					style: { gap: "var(--dl-gap)" },
					children: p.prices.map((c) => /* @__PURE__ */ jsx(CText, {
						c,
						as: "span",
						size: "h3",
						heading: true,
						color: loud ? "loud" : "text"
					}, c.id))
				})
			}),
			(p.stars.length > 0 || p.stats.length > 0) && /* @__PURE__ */ jsx(Reveal, {
				index: i++,
				children: /* @__PURE__ */ jsxs("div", {
					className: centered ? "flex flex-wrap justify-center" : "flex flex-wrap",
					style: {
						gap: "var(--dl-gap-lg)",
						alignItems: "center"
					},
					children: [p.stars.map((c) => /* @__PURE__ */ jsx(CStars, {
						c,
						loud
					}, c.id)), p.stats.map((c) => /* @__PURE__ */ jsx(CStat, {
						c,
						loud,
						align: centered ? "center" : "left"
					}, c.id))]
				})
			})
		]
	});
}
function useHeroParallax(ref) {
	const intensity = useLab((s) => s.view.choreo.parallax);
	return {
		y: useParallaxY(ref, intensity),
		active: intensity > 0
	};
}
function HeroSplit({ section, comps }) {
	const ref = useRef(null);
	const { y, active } = useHeroParallax(ref);
	const hero = byType(comps).images[0];
	const swap = section.meta.swapSides;
	return /* @__PURE__ */ jsx("div", {
		ref,
		style: sectionPad(),
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid items-center",
			style: {
				...CONTAINER,
				gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
				gap: "calc(var(--dl-gap-lg) * 1.4)"
			},
			children: [/* @__PURE__ */ jsx("div", {
				style: { order: swap ? 2 : 1 },
				children: /* @__PURE__ */ jsx(CopyStack, { comps })
			}), hero && /* @__PURE__ */ jsx(motion$1.div, {
				style: {
					order: swap ? 1 : 2,
					y: active ? y : 0
				},
				children: /* @__PURE__ */ jsx(Reveal, {
					index: 1,
					children: /* @__PURE__ */ jsx(CImage, {
						c: hero,
						ratio: hero.props.ratio ?? "4/5"
					})
				})
			})]
		})
	});
}
function HeroCentered({ comps }) {
	const ref = useRef(null);
	const { y, active } = useHeroParallax(ref);
	const hero = byType(comps).images[0];
	return /* @__PURE__ */ jsx("div", {
		ref,
		style: sectionPad(),
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			className: "flex flex-col",
			children: [/* @__PURE__ */ jsx("div", {
				style: NARROW,
				children: /* @__PURE__ */ jsx(CopyStack, {
					comps,
					align: "center"
				})
			}), hero && /* @__PURE__ */ jsx(motion$1.div, {
				style: {
					y: active ? y : 0,
					marginTop: "var(--dl-pad-y)"
				},
				children: /* @__PURE__ */ jsx(Reveal, {
					index: 2,
					children: /* @__PURE__ */ jsx(CImage, {
						c: hero,
						ratio: hero.props.ratio ?? "16/9"
					})
				})
			})]
		})
	});
}
function HeroFullBleed({ section, comps }) {
	const ref = useRef(null);
	const { y, active } = useHeroParallax(ref);
	const hero = byType(comps).images[0];
	const overlay = section.meta.overlay !== false;
	const alpha = (section.meta.overlayIntensity ?? 45) / 100 * .88;
	return /* @__PURE__ */ jsxs("div", {
		ref,
		className: "relative isolate overflow-hidden",
		children: [
			hero && /* @__PURE__ */ jsx(motion$1.div, {
				className: "absolute inset-0 -z-20",
				style: {
					y: active ? y : 0,
					scale: 1.12
				},
				children: /* @__PURE__ */ jsx(CImage, {
					c: hero,
					rounded: "none",
					className: "h-full w-full",
					style: { aspectRatio: "auto" }
				})
			}),
			overlay && /* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 -z-10",
				style: { background: `linear-gradient(to top, rgba(0,0,0,${Math.min(.95, alpha + .18)}) 0%, rgba(0,0,0,${alpha}) 45%, rgba(0,0,0,${alpha * .55}) 100%)` }
			}),
			/* @__PURE__ */ jsx("div", {
				style: sectionPad({
					minHeight: "72vh",
					display: "flex",
					alignItems: "flex-end"
				}),
				children: /* @__PURE__ */ jsx("div", {
					style: CONTAINER,
					children: /* @__PURE__ */ jsx("div", {
						style: { maxWidth: 680 },
						children: /* @__PURE__ */ jsx(CopyStack, {
							comps,
							loud: true
						})
					})
				})
			})
		]
	});
}
function HeroEditorial({ section, comps }) {
	const ref = useRef(null);
	const { y, active } = useHeroParallax(ref);
	const p = byType(comps);
	const hero = p.images[0];
	const swap = section.meta.swapSides;
	return /* @__PURE__ */ jsx("div", {
		ref,
		style: sectionPad(),
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			children: [
				p.badges[0] && /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("div", {
					className: "flex items-center",
					style: {
						gap: "var(--dl-gap)",
						paddingBottom: "var(--dl-gap)",
						borderBottom: "1px solid var(--dl-border)"
					},
					children: /* @__PURE__ */ jsx(CBadge, { c: p.badges[0] })
				}) }),
				p.headings[0] && /* @__PURE__ */ jsx(Reveal, {
					index: 1,
					children: /* @__PURE__ */ jsx(CText, {
						c: p.headings[0],
						as: "h1",
						size: "h1",
						heading: true,
						weight: 600,
						balance: true,
						style: {
							marginTop: "var(--dl-gap-lg)",
							maxWidth: "15ch"
						}
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid",
					style: {
						marginTop: "var(--dl-pad-y)",
						gridTemplateColumns: "minmax(0,5fr) minmax(0,7fr)",
						gap: "calc(var(--dl-gap-lg) * 1.2)",
						alignItems: "start"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col",
						style: {
							gap: "var(--dl-gap)",
							order: swap ? 2 : 1,
							paddingTop: "var(--dl-gap-sm)"
						},
						children: [
							p.paragraphs.map((c, n) => /* @__PURE__ */ jsx(Reveal, {
								index: 2 + n,
								children: /* @__PURE__ */ jsx(CText, {
									c,
									size: "lg",
									color: "muted"
								})
							}, c.id)),
							p.prices[0] && /* @__PURE__ */ jsx(Reveal, {
								index: 3,
								children: /* @__PURE__ */ jsx(CText, {
									c: p.prices[0],
									as: "span",
									size: "h3",
									heading: true
								})
							}),
							p.buttons.length > 0 && /* @__PURE__ */ jsx(Reveal, {
								index: 4,
								children: /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap",
									style: { gap: "var(--dl-gap-sm)" },
									children: p.buttons.map((c) => /* @__PURE__ */ jsx(CButton, { c }, c.id))
								})
							}),
							p.stars.map((c) => /* @__PURE__ */ jsx(Reveal, {
								index: 5,
								children: /* @__PURE__ */ jsx(CStars, { c })
							}, c.id))
						]
					}), hero && /* @__PURE__ */ jsx(motion$1.div, {
						style: {
							order: swap ? 1 : 2,
							y: active ? y : 0
						},
						children: /* @__PURE__ */ jsx(Reveal, {
							index: 2,
							children: /* @__PURE__ */ jsx(CImage, {
								c: hero,
								ratio: hero.props.ratio ?? "5/4"
							})
						})
					})]
				})
			]
		})
	});
}
function HeroCollage({ comps }) {
	const ref = useRef(null);
	const { y, active } = useHeroParallax(ref);
	const [first, second, third] = byType(comps).images;
	return /* @__PURE__ */ jsx("div", {
		ref,
		style: sectionPad(),
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid items-center",
			style: {
				...CONTAINER,
				gridTemplateColumns: "minmax(0,6fr) minmax(0,6fr)",
				gap: "calc(var(--dl-gap-lg) * 1.3)"
			},
			children: [/* @__PURE__ */ jsx(CopyStack, { comps }), /* @__PURE__ */ jsxs("div", {
				className: "grid",
				style: {
					gridTemplateColumns: "repeat(6, 1fr)",
					gap: "var(--dl-gap-sm)"
				},
				children: [
					first && /* @__PURE__ */ jsx(motion$1.div, {
						style: {
							gridColumn: "span 4",
							y: active ? y : 0
						},
						children: /* @__PURE__ */ jsx(Reveal, {
							index: 1,
							children: /* @__PURE__ */ jsx(CImage, {
								c: first,
								ratio: "4/5"
							})
						})
					}),
					second && /* @__PURE__ */ jsx(motion$1.div, {
						style: {
							gridColumn: "span 2",
							alignSelf: "end",
							y: active ? y : 0,
							marginBottom: "calc(var(--dl-gap) * -1)"
						},
						children: /* @__PURE__ */ jsx(Reveal, {
							index: 2,
							children: /* @__PURE__ */ jsx(CImage, {
								c: second,
								ratio: "3/4",
								rounded: "md"
							})
						})
					}),
					third ? /* @__PURE__ */ jsx(motion$1.div, {
						style: {
							gridColumn: "span 6",
							y: active ? y : 0
						},
						children: /* @__PURE__ */ jsx(Reveal, {
							index: 3,
							children: /* @__PURE__ */ jsx(CImage, {
								c: third,
								ratio: "16/7",
								rounded: "md"
							})
						})
					}) : first && /* @__PURE__ */ jsx(Reveal, {
						index: 3,
						style: { gridColumn: "span 6" },
						children: /* @__PURE__ */ jsx("div", { style: {
							height: 6,
							borderRadius: 999,
							background: "color-mix(in oklab, var(--dl-primary) 30%, transparent)"
						} })
					})
				]
			})]
		})
	});
}
function HeroMinimal({ comps }) {
	const p = byType(comps);
	return /* @__PURE__ */ jsx("div", {
		style: sectionPad({
			paddingTop: "calc(var(--dl-pad-y) * 1.6)",
			paddingBottom: "calc(var(--dl-pad-y) * 1.6)"
		}),
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			className: "flex flex-col",
			children: [
				p.badges[0] && /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(CText, {
					c: p.badges[0],
					as: "span",
					size: "sm",
					color: "muted",
					weight: 600,
					style: {
						letterSpacing: "0.14em",
						textTransform: "uppercase"
					}
				}) }),
				p.headings[0] && /* @__PURE__ */ jsx(Reveal, {
					index: 1,
					children: /* @__PURE__ */ jsx(CText, {
						c: p.headings[0],
						as: "h1",
						size: "h1",
						heading: true,
						weight: 700,
						balance: true,
						style: {
							marginTop: "var(--dl-gap-lg)",
							maxWidth: "18ch"
						}
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-end justify-between",
					style: {
						marginTop: "calc(var(--dl-pad-y) * 0.7)",
						gap: "var(--dl-gap-lg)",
						paddingTop: "var(--dl-gap)",
						borderTop: "1px solid var(--dl-border)"
					},
					children: [p.paragraphs[0] && /* @__PURE__ */ jsx(Reveal, {
						index: 2,
						style: { maxWidth: 480 },
						children: /* @__PURE__ */ jsx(CText, {
							c: p.paragraphs[0],
							size: "base",
							color: "muted"
						})
					}), p.buttons[0] && /* @__PURE__ */ jsx(Reveal, {
						index: 3,
						children: /* @__PURE__ */ jsx(CButton, { c: p.buttons[0] })
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/sections/LogoBar.tsx
function LogoBar({ section, comps }) {
	const density = useLab((s) => s.view.trustDensity);
	const p = byType(comps);
	const loud = section.mood === "loud";
	const variant = section.variant;
	const count = (c) => scaleCount(density, 3, Math.max(3, c.props.logos?.length ?? 6));
	if (variant === "marquee") {
		const logos = p.logoRows[0];
		return /* @__PURE__ */ jsxs("div", {
			style: {
				...surface(loud),
				paddingTop: "calc(var(--dl-pad-y) * 0.45)",
				paddingBottom: "calc(var(--dl-pad-y) * 0.45)",
				overflow: "hidden"
			},
			children: [p.subheadings[0] && /* @__PURE__ */ jsx("div", {
				style: {
					...CONTAINER,
					paddingInline: "var(--dl-pad-x)"
				},
				children: /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(CText, {
					c: p.subheadings[0],
					as: "p",
					size: "sm",
					weight: 650,
					color: loud ? "loud" : "muted",
					className: "text-center",
					style: {
						letterSpacing: "0.12em",
						textTransform: "uppercase",
						marginBottom: "var(--dl-gap)"
					}
				}) })
			}), logos && /* @__PURE__ */ jsx(motion$1.div, {
				className: "flex w-max",
				style: { gap: "var(--dl-gap-lg)" },
				animate: { x: ["0%", "-50%"] },
				transition: {
					duration: 26,
					repeat: Infinity,
					ease: "linear"
				},
				children: [0, 1].map((copy) => /* @__PURE__ */ jsx("div", {
					className: "flex shrink-0",
					style: { gap: "var(--dl-gap-lg)" },
					children: /* @__PURE__ */ jsx(CLogos, {
						c: logos,
						count: count(logos),
						loud,
						size: "lg"
					})
				}, copy))
			})]
		});
	}
	const boxed = variant === "boxed";
	const stacked = variant === "stacked";
	return /* @__PURE__ */ jsx("div", {
		style: {
			...surface(loud),
			...sectionPad({
				paddingTop: "calc(var(--dl-pad-y) * 0.5)",
				paddingBottom: "calc(var(--dl-pad-y) * 0.5)"
			})
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				...CONTAINER,
				...boxed ? {
					border: "1px solid var(--dl-border)",
					borderRadius: "var(--dl-radius-lg)",
					background: "var(--dl-surface)",
					padding: "var(--dl-gap-lg)"
				} : {}
			},
			className: stacked ? "flex flex-col items-center" : "flex flex-col",
			children: [p.subheadings[0] && /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(CText, {
				c: p.subheadings[0],
				as: "p",
				size: "sm",
				weight: 650,
				color: loud ? "loud" : "muted",
				className: "text-center",
				style: {
					letterSpacing: "0.12em",
					textTransform: "uppercase",
					marginBottom: "var(--dl-gap)"
				}
			}) }), p.logoRows.map((c, i) => /* @__PURE__ */ jsx(Reveal, {
				index: i + 1,
				style: { width: "100%" },
				children: /* @__PURE__ */ jsx(CLogos, {
					c,
					count: count(c),
					loud,
					size: stacked ? "h3" : "base"
				})
			}, c.id))]
		})
	});
}
//#endregion
//#region src/sections/Pricing.tsx
function Pricing({ section, comps }) {
	const p = byType(comps);
	const loud = section.mood === "loud";
	const variant = section.variant;
	const compact = variant === "compact";
	const list = variant === "list";
	const useFeature = variant === "featured";
	return /* @__PURE__ */ jsx("div", {
		style: {
			...surface(loud),
			...sectionPad()
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			children: [/* @__PURE__ */ jsx(SectionHeader, {
				subheadings: p.subheadings,
				headings: p.headings,
				paragraphs: p.paragraphs,
				align: list ? "left" : "center",
				loud
			}), /* @__PURE__ */ jsx("div", {
				className: list ? "flex flex-col" : "grid items-stretch",
				style: list ? { gap: "var(--dl-gap-sm)" } : {
					gridTemplateColumns: `repeat(${Math.min(3, Math.max(1, p.prices.length))}, minmax(0,1fr))`,
					gap: "var(--dl-gap)"
				},
				children: p.prices.map((c, i) => {
					const featured = useFeature && c.props.featured;
					return /* @__PURE__ */ jsx(Reveal, {
						index: i,
						children: /* @__PURE__ */ jsx(PlanCard, {
							c,
							loud,
							featured: Boolean(featured),
							compact,
							list,
							cta: p.buttons[i] ?? p.buttons[0]
						})
					}, c.id);
				})
			})]
		})
	});
}
function PlanCard({ c, loud, featured, compact, list, cta }) {
	const bullets = c.props.bullets ?? [];
	return /* @__PURE__ */ jsxs("div", {
		className: list ? "flex flex-wrap items-center justify-between" : "flex h-full flex-col",
		style: {
			gap: "var(--dl-gap)",
			padding: compact ? "var(--dl-gap)" : "var(--dl-gap-lg)",
			borderRadius: "var(--dl-radius-lg)",
			background: featured ? "var(--dl-loud-bg)" : loud ? "color-mix(in oklab, var(--dl-loud-text) 7%, transparent)" : "var(--dl-surface)",
			color: featured ? "var(--dl-loud-text)" : void 0,
			border: "1px solid",
			borderColor: featured ? "transparent" : loud ? "color-mix(in oklab, var(--dl-loud-text) 15%, transparent)" : "var(--dl-border)",
			boxShadow: featured ? "0 24px 60px -30px rgba(0,0,0,.55)" : void 0,
			transform: featured && !compact && !list ? "translateY(-10px)" : void 0
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col",
				style: { gap: "10px" },
				children: [
					/* @__PURE__ */ jsx(CText, {
						c,
						as: "span",
						size: "base",
						weight: 650,
						color: featured || loud ? "loud" : "muted",
						style: {
							letterSpacing: "0.06em",
							textTransform: "uppercase"
						}
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-baseline",
						style: { gap: "8px" },
						children: /* @__PURE__ */ jsx(CText, {
							c,
							field: "plain",
							as: "span",
							size: "h2",
							heading: true,
							weight: 700,
							color: featured || loud ? "loud" : "text",
							style: { lineHeight: 1 }
						})
					}),
					/* @__PURE__ */ jsx(CText, {
						c,
						field: "sub",
						as: "span",
						size: "sm",
						color: featured || loud ? "loud" : "muted"
					})
				]
			}),
			!list && bullets.length > 0 && /* @__PURE__ */ jsx("ul", {
				className: "flex list-none flex-col p-0",
				style: {
					gap: "10px",
					margin: 0,
					flexGrow: 1
				},
				children: bullets.map((bullet) => /* @__PURE__ */ jsxs("li", {
					className: "flex items-start",
					style: {
						gap: "10px",
						fontSize: "var(--dl-size-base)",
						fontFamily: "var(--dl-font-body)",
						color: featured || loud ? "var(--dl-loud-text)" : "var(--dl-muted)"
					},
					children: [/* @__PURE__ */ jsx(Check, {
						size: 17,
						strokeWidth: 2.4,
						style: {
							marginTop: 3,
							flexShrink: 0,
							color: featured ? "var(--dl-accent)" : "var(--dl-primary)"
						}
					}), bullet]
				}, bullet))
			}),
			cta && /* @__PURE__ */ jsx("div", {
				style: { marginTop: list ? 0 : "auto" },
				children: /* @__PURE__ */ jsx(CButton, {
					c: cta,
					loud: featured,
					block: !list && !compact
				})
			})
		]
	});
}
//#endregion
//#region src/sections/Testimonials.tsx
function Testimonials({ section, comps }) {
	const p = byType(comps);
	const loud = section.mood === "loud";
	const variant = section.variant;
	const stats = p.stats.length > 0 && /* @__PURE__ */ jsx(Reveal, {
		index: p.quotes.length,
		children: /* @__PURE__ */ jsx("div", {
			className: "grid",
			style: {
				marginTop: "var(--dl-gap-lg)",
				paddingTop: "var(--dl-gap-lg)",
				borderTop: "1px solid",
				borderColor: loud ? "color-mix(in oklab, var(--dl-loud-text) 18%, transparent)" : "var(--dl-border)",
				gridTemplateColumns: `repeat(${p.stats.length}, minmax(0,1fr))`,
				gap: "var(--dl-gap)"
			},
			children: p.stats.map((c) => /* @__PURE__ */ jsx(CStat, {
				c,
				loud
			}, c.id))
		})
	});
	if (variant === "single") {
		const first = p.quotes[0];
		return /* @__PURE__ */ jsx("div", {
			style: {
				...surface(loud),
				...sectionPad()
			},
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					...CONTAINER,
					display: "flex",
					flexDirection: "column"
				},
				children: [
					/* @__PURE__ */ jsx(SectionHeader, {
						subheadings: p.subheadings,
						headings: p.headings,
						align: "center",
						loud
					}),
					first && /* @__PURE__ */ jsx(Reveal, {
						index: 1,
						style: NARROW,
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center text-center",
							style: { gap: "var(--dl-gap)" },
							children: [
								/* @__PURE__ */ jsx(CQuote, {
									c: first,
									loud,
									size: "h3"
								}),
								p.avatars[0] && /* @__PURE__ */ jsx(CAvatar, {
									c: p.avatars[0],
									loud
								}),
								p.stars[0] && /* @__PURE__ */ jsx(CStars, {
									c: p.stars[0],
									loud
								})
							]
						})
					}),
					stats
				]
			})
		});
	}
	if (variant === "marquee") return /* @__PURE__ */ jsxs("div", {
		style: {
			...surface(loud),
			paddingTop: "var(--dl-pad-y)",
			paddingBottom: "var(--dl-pad-y)",
			overflow: "hidden"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				style: {
					...CONTAINER,
					paddingInline: "var(--dl-pad-x)"
				},
				children: /* @__PURE__ */ jsx(SectionHeader, {
					subheadings: p.subheadings,
					headings: p.headings,
					loud
				})
			}),
			/* @__PURE__ */ jsx(motion$1.div, {
				className: "flex w-max",
				style: {
					gap: "var(--dl-gap)",
					paddingInline: "var(--dl-gap)"
				},
				animate: { x: ["0%", "-50%"] },
				transition: {
					duration: 38,
					repeat: Infinity,
					ease: "linear"
				},
				children: [0, 1].map((copy) => /* @__PURE__ */ jsx("div", {
					className: "flex shrink-0",
					style: { gap: "var(--dl-gap)" },
					children: p.quotes.map((c) => /* @__PURE__ */ jsx("div", {
						style: {
							width: 380,
							flexShrink: 0
						},
						children: /* @__PURE__ */ jsx(CQuote, {
							c,
							loud,
							size: "base"
						})
					}, `${copy}-${c.id}`))
				}, copy))
			}),
			p.stars.length > 0 && /* @__PURE__ */ jsx("div", {
				style: {
					...CONTAINER,
					paddingInline: "var(--dl-pad-x)",
					marginTop: "var(--dl-gap-lg)"
				},
				className: "flex justify-center",
				children: p.stars.map((c) => /* @__PURE__ */ jsx(CStars, {
					c,
					loud
				}, c.id))
			})
		]
	});
	const columns = variant === "grid" ? 2 : Math.min(3, Math.max(1, p.quotes.length));
	return /* @__PURE__ */ jsx("div", {
		style: {
			...surface(loud),
			...sectionPad()
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: CONTAINER,
			children: [
				/* @__PURE__ */ jsx(SectionHeader, {
					subheadings: p.subheadings,
					headings: p.headings,
					align: variant === "cards" ? "center" : "left",
					loud
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid items-start",
					style: {
						gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
						gap: "var(--dl-gap)"
					},
					children: p.quotes.map((c, i) => /* @__PURE__ */ jsx(Reveal, {
						index: i,
						children: /* @__PURE__ */ jsx(CQuote, {
							c,
							loud,
							size: variant === "grid" ? "lg" : "base"
						})
					}, c.id))
				}),
				p.avatars.length > 0 && /* @__PURE__ */ jsx(Reveal, {
					index: p.quotes.length,
					children: /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap",
						style: {
							gap: "var(--dl-gap-lg)",
							marginTop: "var(--dl-gap)"
						},
						children: p.avatars.map((c) => /* @__PURE__ */ jsx(CAvatar, {
							c,
							loud
						}, c.id))
					})
				}),
				stats
			]
		})
	});
}
//#endregion
//#region src/sections/SectionRenderer.tsx
/**
* Renders one section's artwork. Deliberately knows nothing about editing
* chrome — the same component is used for the live canvas, the snapshot
* thumbnail pass, and the A/B compare panes.
*/
function SectionRenderer({ section, tokens }) {
	const density = useLab((s) => s.view.trustDensity);
	const livePageTokens = useLab((s) => s.page.tokens);
	const pageTokens = tokens ?? livePageTokens;
	const comps = visibleComponents(section, density);
	const vars = tokensToVars(effectiveTokens(pageTokens, section.tokensOverride));
	return /* @__PURE__ */ jsx(SectionContext.Provider, {
		value: section.id,
		children: /* @__PURE__ */ jsx("div", {
			style: vars,
			children: /* @__PURE__ */ jsx(Body, {
				section,
				comps
			})
		})
	});
}
function Body({ section, comps }) {
	switch (section.type) {
		case "hero": return /* @__PURE__ */ jsx(Hero, {
			section,
			comps
		});
		case "logoBar": return /* @__PURE__ */ jsx(LogoBar, {
			section,
			comps
		});
		case "featureGrid": return /* @__PURE__ */ jsx(FeatureGrid, {
			section,
			comps
		});
		case "testimonials": return /* @__PURE__ */ jsx(Testimonials, {
			section,
			comps
		});
		case "pricing": return /* @__PURE__ */ jsx(Pricing, {
			section,
			comps
		});
		case "faq": return /* @__PURE__ */ jsx(Faq, {
			section,
			comps
		});
		case "bento": return /* @__PURE__ */ jsx(Bento, {
			section,
			comps
		});
		case "ctaBanner": return /* @__PURE__ */ jsx(CtaBanner, {
			section,
			comps
		});
		case "footer": return /* @__PURE__ */ jsx(Footer, {
			section,
			comps
		});
	}
}
//#endregion
//#region src/components/canvas/SectionShell.tsx
/**
* Editing chrome around one section: drag handle, variant cycler, mood toggle,
* component tray, duplicate and delete. All of it lives outside the artwork's
* own box so nothing here can shift the design being evaluated.
*/
function SectionShell({ section, index }) {
	const [hovered, setHovered] = useState(false);
	const cycleVariant = useLab((s) => s.cycleVariant);
	const duplicateSection = useLab((s) => s.duplicateSection);
	const removeSection = useLab((s) => s.removeSection);
	const setSectionMood = useLab((s) => s.setSectionMood);
	const setActiveSection = useLab((s) => s.setActiveSection);
	const active = useLab((s) => s.activeSectionId === section.id);
	const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
	const def = sectionDef(section.type);
	const showChrome = hovered || active;
	return /* @__PURE__ */ jsxs("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Translate.toString(transform),
			transition,
			zIndex: isDragging ? 40 : void 0,
			position: "relative"
		},
		className: cn("group/section", isDragging && "opacity-95"),
		onMouseEnter: () => setHovered(true),
		onMouseLeave: () => setHovered(false),
		onMouseDown: () => setActiveSection(section.id),
		"data-dl-section": section.id,
		children: [/* @__PURE__ */ jsx(motion.div, {
			animate: {
				boxShadow: isDragging ? "0 30px 70px -30px rgba(0,0,0,.65), 0 0 0 2px rgba(124,108,255,.85)" : showChrome ? "0 0 0 1px rgba(124,108,255,.35)" : "0 0 0 0px rgba(124,108,255,0)",
				scale: isDragging ? 1.006 : 1
			},
			transition: {
				duration: .2,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			style: { borderRadius: 2 },
			children: /* @__PURE__ */ jsx(SectionRenderer, { section })
		}), /* @__PURE__ */ jsx(AnimatePresence, { children: showChrome && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(motion.div, {
			initial: {
				opacity: 0,
				x: 6
			},
			animate: {
				opacity: 1,
				x: 0
			},
			exit: {
				opacity: 0,
				x: 6
			},
			transition: { duration: .14 },
			className: "absolute top-3 left-3 z-30",
			children: /* @__PURE__ */ jsx("button", {
				ref: setActivatorNodeRef,
				...attributes,
				...listeners,
				type: "button",
				"aria-label": `Reorder ${def.label} section`,
				className: "flex h-8 w-7 cursor-grab items-center justify-center rounded-lg border border-ui-700 bg-ui-900/92 text-ui-300 shadow-lg backdrop-blur transition-colors hover:text-white active:cursor-grabbing",
				children: /* @__PURE__ */ jsx(GripVertical, { size: 14 })
			})
		}), /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: -6
			},
			animate: {
				opacity: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				y: -6
			},
			transition: {
				duration: .16,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			className: "absolute top-3 right-3 z-30 flex items-center gap-1 rounded-xl border border-ui-700 bg-ui-900/92 p-1 shadow-xl backdrop-blur",
			onClick: (event) => event.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("span", {
					className: "px-1.5 text-[10px] font-semibold tracking-wide text-ui-500 uppercase",
					children: [
						index + 1,
						" · ",
						def.label
					]
				}),
				/* @__PURE__ */ jsx("span", { className: "mx-0.5 h-4 w-px bg-ui-750" }),
				/* @__PURE__ */ jsx(ToolButton, {
					size: "sm",
					onClick: () => cycleVariant(section.id, -1),
					"aria-label": "Previous layout",
					icon: /* @__PURE__ */ jsx(ChevronLeft, { size: 13 })
				}),
				/* @__PURE__ */ jsx("span", {
					className: "min-w-[62px] text-center text-[11px] font-medium text-ui-200",
					children: variantLabel(section.type, section.variant)
				}),
				/* @__PURE__ */ jsx(ToolButton, {
					size: "sm",
					onClick: () => cycleVariant(section.id, 1),
					"aria-label": "Next layout",
					icon: /* @__PURE__ */ jsx(ChevronRight, { size: 13 })
				}),
				/* @__PURE__ */ jsx("span", { className: "mx-0.5 h-4 w-px bg-ui-750" }),
				/* @__PURE__ */ jsx(ToolButton, {
					size: "sm",
					active: section.mood === "loud",
					onClick: () => setSectionMood(section.id, section.mood === "loud" ? "calm" : "loud"),
					title: section.mood === "loud" ? "Loud section" : "Calm section",
					icon: section.mood === "loud" ? /* @__PURE__ */ jsx(Volume2, { size: 13 }) : /* @__PURE__ */ jsx(Moon, { size: 13 })
				}),
				/* @__PURE__ */ jsx(ComponentTray, { sectionId: section.id }),
				/* @__PURE__ */ jsx(ToolButton, {
					size: "sm",
					onClick: () => duplicateSection(section.id),
					title: "Duplicate section",
					icon: /* @__PURE__ */ jsx(Copy, { size: 13 })
				}),
				/* @__PURE__ */ jsx(ToolButton, {
					size: "sm",
					variant: "danger",
					onClick: () => removeSection(section.id),
					title: "Delete section",
					icon: /* @__PURE__ */ jsx(Trash2, { size: 13 })
				})
			]
		})] }) })]
	});
}
//#endregion
//#region src/components/canvas/SelectionLayer.tsx
var RATIOS = [
	"4/5",
	"1/1",
	"4/3",
	"16/9",
	"3/4"
];
var EMPHASIS = [
	"primary",
	"secondary",
	"ghost"
];
/**
* The floating mini-toolbar for the selected component.
*
* It measures the live DOM node rather than being rendered inside it — putting
* a toolbar in the flow would reflow the artwork the moment you selected
* something, which makes judging a layout impossible.
*/
function SelectionLayer({ scrollRef }) {
	const selection = useLab((s) => s.selection);
	const page = useLab((s) => s.page);
	const select = useLab((s) => s.select);
	const tone = useLab((s) => s.view.tone);
	const removeComponent = useLab((s) => s.removeComponent);
	const duplicateComponent = useLab((s) => s.duplicateComponent);
	const updateComponent = useLab((s) => s.updateComponent);
	const reorderComponents = useLab((s) => s.reorderComponents);
	const [rect, setRect] = useState(null);
	const section = page.sections.find((s) => s.id === selection?.sectionId);
	const index = section?.components.findIndex((c) => c.id === selection?.componentId) ?? -1;
	const component = index >= 0 ? section?.components[index] : void 0;
	const measure = useCallback(() => {
		if (!selection) {
			setRect(null);
			return;
		}
		const el = document.querySelector(`[data-dl-node="${selection.componentId}"]`);
		if (!el) {
			setRect(null);
			return;
		}
		const box = el.getBoundingClientRect();
		setRect({
			top: box.top,
			left: box.left,
			width: box.width
		});
	}, [selection]);
	useEffect(() => {
		measure();
		if (!selection) return;
		let frame = 0;
		const onChange = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(measure);
		};
		const scroller = scrollRef.current;
		scroller?.addEventListener("scroll", onChange, { passive: true });
		window.addEventListener("resize", onChange);
		const observer = new ResizeObserver(onChange);
		if (scroller) observer.observe(scroller);
		return () => {
			cancelAnimationFrame(frame);
			scroller?.removeEventListener("scroll", onChange);
			window.removeEventListener("resize", onChange);
			observer.disconnect();
		};
	}, [
		selection,
		measure,
		scrollRef,
		page
	]);
	if (!selection || !component || !section || !rect) return null;
	const props = component.props;
	const hasTones = Boolean(props.tones);
	const syncVoices = () => {
		const current = props.tones?.[tone];
		if (!current) return;
		updateComponent(section.id, component.id, { tones: {
			authority: current,
			warm: current,
			urgent: current
		} });
	};
	const cycleEmphasis = () => {
		const at = EMPHASIS.indexOf(props.emphasis ?? "primary");
		updateComponent(section.id, component.id, { emphasis: EMPHASIS[(at + 1) % EMPHASIS.length] });
	};
	const cycleRatio = () => {
		const at = RATIOS.indexOf(props.ratio ?? "4/3");
		updateComponent(section.id, component.id, { ratio: RATIOS[(at + 1) % RATIOS.length] });
	};
	const cycleRating = () => {
		const next = (props.rating ?? 5) - .5;
		updateComponent(section.id, component.id, { rating: next < 3 ? 5 : next });
	};
	const replaceImage = () => {
		pickImage().then((imageId) => {
			if (imageId) updateComponent(section.id, component.id, { imageId });
		});
	};
	const cyclePlaceholder = () => {
		updateComponent(section.id, component.id, {
			placeholder: ((props.placeholder ?? 0) + 1) % 8,
			imageId: void 0
		});
	};
	const top = Math.max(52, rect.top - 42);
	return createPortal(/* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 4,
			scale: .97
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		exit: {
			opacity: 0,
			y: 2,
			scale: .98
		},
		transition: {
			duration: .15,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		className: "pointer-events-auto fixed z-[120] flex items-center gap-0.5 rounded-xl border border-ui-700 bg-ui-900/95 p-1 shadow-2xl backdrop-blur",
		style: {
			top,
			left: rect.left
		},
		onMouseDown: (event) => event.stopPropagation(),
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "px-1.5 text-[10px] font-semibold tracking-wide text-ui-500 uppercase",
				children: component.type
			}),
			/* @__PURE__ */ jsx("span", { className: "mx-0.5 h-4 w-px bg-ui-750" }),
			/* @__PURE__ */ jsx(ToolButton, {
				size: "sm",
				disabled: index <= 0,
				onClick: () => reorderComponents(section.id, index, index - 1),
				title: "Move up",
				icon: /* @__PURE__ */ jsx(ArrowUp, { size: 13 })
			}),
			/* @__PURE__ */ jsx(ToolButton, {
				size: "sm",
				disabled: index >= section.components.length - 1,
				onClick: () => reorderComponents(section.id, index, index + 1),
				title: "Move down",
				icon: /* @__PURE__ */ jsx(ArrowDown, { size: 13 })
			}),
			component.type === "button" && /* @__PURE__ */ jsx(ToolButton, {
				size: "sm",
				onClick: cycleEmphasis,
				title: `Style: ${props.emphasis ?? "primary"}`,
				icon: /* @__PURE__ */ jsx(Palette, { size: 13 }),
				children: props.emphasis ?? "primary"
			}),
			component.type === "imageSlot" && /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx(ToolButton, {
					size: "sm",
					onClick: replaceImage,
					title: "Upload image",
					icon: /* @__PURE__ */ jsx(Image, { size: 13 })
				}),
				/* @__PURE__ */ jsx(ToolButton, {
					size: "sm",
					onClick: cycleRatio,
					title: `Aspect ratio: ${props.ratio ?? "4/3"}`,
					icon: /* @__PURE__ */ jsx(Ratio, { size: 13 }),
					children: props.ratio ?? "4/3"
				}),
				/* @__PURE__ */ jsx(ToolButton, {
					size: "sm",
					onClick: cyclePlaceholder,
					title: "Cycle placeholder fill",
					icon: /* @__PURE__ */ jsx(Palette, { size: 13 })
				})
			] }),
			component.type === "starRating" && /* @__PURE__ */ jsx(ToolButton, {
				size: "sm",
				onClick: cycleRating,
				title: "Rating",
				icon: /* @__PURE__ */ jsx(Star, { size: 13 }),
				children: props.rating ?? 5
			}),
			hasTones && /* @__PURE__ */ jsx(ToolButton, {
				size: "sm",
				onClick: syncVoices,
				title: "Copy this voice into all three tones",
				icon: /* @__PURE__ */ jsx(Languages, { size: 13 })
			}),
			/* @__PURE__ */ jsx("span", { className: "mx-0.5 h-4 w-px bg-ui-750" }),
			/* @__PURE__ */ jsx(ToolButton, {
				size: "sm",
				onClick: () => duplicateComponent(section.id, component.id),
				title: "Duplicate",
				icon: /* @__PURE__ */ jsx(Copy, { size: 13 })
			}),
			/* @__PURE__ */ jsx(ToolButton, {
				size: "sm",
				variant: "danger",
				onClick: () => {
					removeComponent(section.id, component.id);
					select(null);
				},
				title: "Delete",
				icon: /* @__PURE__ */ jsx(Trash2, { size: 13 })
			})
		]
	}, component.id) }), document.body);
}
//#endregion
//#region src/components/canvas/Canvas.tsx
/** The 12-column + 8pt overlay. Purely diagnostic; never exported. */
function GridOverlay() {
	return /* @__PURE__ */ jsx("div", {
		className: "dl-grid-overlay pointer-events-none absolute inset-0 z-[60]",
		"aria-hidden": true,
		style: { mixBlendMode: "multiply" },
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto grid h-full",
			style: {
				maxWidth: 1180,
				paddingInline: "var(--dl-pad-x, 48px)",
				gridTemplateColumns: "repeat(12, minmax(0,1fr))",
				gap: "var(--dl-gap, 24px)"
			},
			children: Array.from({ length: 12 }, (_, i) => /* @__PURE__ */ jsx("div", { style: { background: "rgba(124,108,255,.075)" } }, i))
		})
	});
}
function Canvas({ onOpenPicker }) {
	const scrollRef = useRef(null);
	const page = useLab((s) => s.page);
	const view = useLab((s) => s.view);
	const reorderSections = useLab((s) => s.reorderSections);
	const select = useLab((s) => s.select);
	const setActiveSection = useLab((s) => s.setActiveSection);
	const [scrollerReady, setScrollerReady] = useState(false);
	useEffect(() => setScrollerReady(true), []);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	const onDragEnd = (event) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const from = page.sections.findIndex((s) => s.id === active.id);
		const to = page.sections.findIndex((s) => s.id === over.id);
		if (from !== -1 && to !== -1) reorderSections(from, to);
	};
	useEffect(() => {
		if (view.previewNonce === 0) return;
		const scroller = scrollRef.current;
		if (!scroller) return;
		scroller.scrollTo({
			top: 0,
			behavior: "auto"
		});
		let frame = 0;
		let cancelled = false;
		const start = performance.now();
		const distance = scroller.scrollHeight - scroller.clientHeight;
		const duration = Math.min(14e3, Math.max(4200, distance * 2.1));
		const tick = (now) => {
			if (cancelled) return;
			const progress = Math.min(1, (now - start) / duration);
			const eased = progress < .5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;
			scroller.scrollTop = distance * eased;
			if (progress < 1) frame = requestAnimationFrame(tick);
		};
		const kickoff = window.setTimeout(() => {
			frame = requestAnimationFrame(tick);
		}, 260);
		const stop = () => {
			cancelled = true;
		};
		scroller.addEventListener("wheel", stop, { passive: true });
		scroller.addEventListener("pointerdown", stop);
		return () => {
			cancelled = true;
			window.clearTimeout(kickoff);
			cancelAnimationFrame(frame);
			scroller.removeEventListener("wheel", stop);
			scroller.removeEventListener("pointerdown", stop);
		};
	}, [view.previewNonce]);
	return /* @__PURE__ */ jsx(ScrollRootContext.Provider, {
		value: scrollRef,
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative min-h-0 flex-1 bg-ui-950",
			children: [/* @__PURE__ */ jsx("div", {
				ref: scrollRef,
				style: { position: "relative" },
				className: "dl-editing h-full overflow-y-auto overflow-x-hidden",
				onMouseDown: () => {
					select(null);
					setActiveSection(null);
				},
				children: /* @__PURE__ */ jsxs("div", {
					className: "dl-canvas-root relative mx-auto min-h-full",
					style: {
						...tokensToVars(page.tokens),
						maxWidth: 1440,
						filter: view.squint ? "blur(7px) saturate(1.05)" : void 0,
						transition: "filter .28s cubic-bezier(.22,1,.36,1)"
					},
					children: [
						view.grid && /* @__PURE__ */ jsx(GridOverlay, {}),
						/* @__PURE__ */ jsx(DndContext, {
							sensors,
							collisionDetection: closestCenter,
							onDragEnd,
							modifiers: [restrictToVerticalAxis, restrictToParentElement],
							children: /* @__PURE__ */ jsx(SortableContext, {
								items: page.sections.map((s) => s.id),
								strategy: verticalListSortingStrategy,
								children: scrollerReady && page.sections.map((section, index) => /* @__PURE__ */ jsx(SectionShell, {
									section,
									index
								}, section.id))
							})
						}),
						page.sections.length === 0 && /* @__PURE__ */ jsx("div", {
							className: "flex min-h-[70vh] items-center justify-center",
							children: /* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl border border-dashed border-ui-700 bg-ui-900/60 px-10 py-12",
								children: [/* @__PURE__ */ jsx(EmptyState, {
									title: "Nothing on the page yet",
									hint: "Add a section to start, or load a preset from the top bar."
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-2 flex justify-center",
									children: /* @__PURE__ */ jsx(ToolButton, {
										variant: "solid",
										onClick: onOpenPicker,
										icon: /* @__PURE__ */ jsx(Plus, { size: 14 }),
										children: "Add a section"
									})
								})]
							})
						}),
						page.sections.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "flex justify-center bg-white/0 py-8",
							children: /* @__PURE__ */ jsx(ToolButton, {
								variant: "outline",
								onClick: (event) => {
									event.stopPropagation();
									onOpenPicker();
								},
								icon: /* @__PURE__ */ jsx(Plus, { size: 14 }),
								children: "Add section"
							})
						})
					]
				}, view.previewNonce)
			}), !view.squint && /* @__PURE__ */ jsx(SelectionLayer, { scrollRef })]
		})
	});
}
//#endregion
//#region src/components/chrome/CompareView.tsx
/**
* A/B compare with a draggable divider.
*
* Both panes are full-width renders clipped by `inset()`, not squeezed into
* half the space — squeezing changes the line lengths and column counts, which
* is exactly the thing you are trying to compare. Scroll is mirrored so the
* same content sits under the divider on both sides.
*/
function CompareView() {
	const compare = useLab((s) => s.view.compare);
	const snapshots = useLab((s) => s.snapshots);
	const setCompare = useLab((s) => s.setCompare);
	const restoreSnapshot = useLab((s) => s.restoreSnapshot);
	const [split, setSplit] = useState(50);
	const wrapRef = useRef(null);
	const leftRef = useRef(null);
	const rightRef = useRef(null);
	const syncing = useRef(false);
	const left = snapshots.find((s) => s.id === compare?.[0]);
	const right = snapshots.find((s) => s.id === compare?.[1]);
	const onPointerDown = useCallback((event) => {
		event.preventDefault();
		const move = (e) => {
			const box = wrapRef.current?.getBoundingClientRect();
			if (!box) return;
			setSplit(Math.min(96, Math.max(4, (e.clientX - box.left) / box.width * 100)));
		};
		const up = () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
	}, []);
	useEffect(() => {
		const a = leftRef.current;
		const b = rightRef.current;
		if (!a || !b) return;
		const link = (from, to) => () => {
			if (syncing.current) return;
			syncing.current = true;
			to.scrollTop = from.scrollTop;
			requestAnimationFrame(() => {
				syncing.current = false;
			});
		};
		const onA = link(a, b);
		const onB = link(b, a);
		a.addEventListener("scroll", onA, { passive: true });
		b.addEventListener("scroll", onB, { passive: true });
		return () => {
			a.removeEventListener("scroll", onA);
			b.removeEventListener("scroll", onB);
		};
	}, [left, right]);
	if (!compare || !left || !right) return null;
	return /* @__PURE__ */ jsxs("div", {
		ref: wrapRef,
		className: "relative min-h-0 flex-1 overflow-hidden bg-ui-950 select-none",
		children: [
			/* @__PURE__ */ jsx(Pane, {
				innerRef: leftRef,
				page: left.page,
				clip: `inset(0 ${100 - split}% 0 0)`
			}),
			/* @__PURE__ */ jsx(Pane, {
				innerRef: rightRef,
				page: right.page,
				clip: `inset(0 0 0 ${split}%)`
			}),
			/* @__PURE__ */ jsx("div", {
				role: "separator",
				"aria-orientation": "vertical",
				"aria-valuenow": Math.round(split),
				tabIndex: 0,
				onPointerDown,
				onKeyDown: (event) => {
					if (event.key === "ArrowLeft") setSplit((v) => Math.max(4, v - 2));
					if (event.key === "ArrowRight") setSplit((v) => Math.min(96, v + 2));
				},
				className: "absolute inset-y-0 z-30 w-px cursor-ew-resize bg-brand",
				style: { left: `${split}%` },
				children: /* @__PURE__ */ jsx("span", {
					className: "absolute top-1/2 left-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand bg-ui-900 text-[10px] font-semibold text-brand-soft shadow-xl",
					children: "A|B"
				})
			}),
			/* @__PURE__ */ jsx(Label, {
				side: "left",
				name: left.name,
				onRestore: () => restoreSnapshot(left.id)
			}),
			/* @__PURE__ */ jsx(Label, {
				side: "right",
				name: right.name,
				onRestore: () => restoreSnapshot(right.id)
			}),
			/* @__PURE__ */ jsx(ToolButton, {
				variant: "outline",
				onClick: () => setCompare(null),
				className: "absolute top-3 left-1/2 z-40 -translate-x-1/2 bg-ui-900/90 backdrop-blur",
				icon: /* @__PURE__ */ jsx(X, { size: 13 }),
				children: "Exit compare"
			})
		]
	});
}
function Pane({ page, clip, innerRef }) {
	return /* @__PURE__ */ jsx("div", {
		ref: innerRef,
		className: "inset-0 overflow-y-auto overflow-x-hidden",
		style: {
			position: "absolute",
			clipPath: clip
		},
		children: /* @__PURE__ */ jsx(StaticContext.Provider, {
			value: true,
			children: /* @__PURE__ */ jsx(ScrollRootContext.Provider, {
				value: innerRef,
				children: /* @__PURE__ */ jsx("div", {
					className: "dl-canvas-root mx-auto min-h-full",
					style: { maxWidth: 1440 },
					children: page.sections.map((section) => /* @__PURE__ */ jsx(SectionRenderer, {
						section,
						tokens: page.tokens
					}, section.id))
				})
			})
		})
	});
}
function Label({ side, name, onRestore }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "absolute bottom-3 z-40 flex items-center gap-1.5 rounded-lg border border-ui-700 bg-ui-900/92 py-1 pr-1 pl-2.5 shadow-xl backdrop-blur",
		style: side === "left" ? { left: 12 } : { right: 12 },
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "text-[10px] font-semibold tracking-wide text-ui-500 uppercase",
				children: side === "left" ? "A" : "B"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "max-w-[180px] truncate text-[11px] text-ui-200",
				children: name
			}),
			/* @__PURE__ */ jsx(ToolButton, {
				size: "sm",
				onClick: onRestore,
				title: "Restore this one",
				icon: /* @__PURE__ */ jsx(RotateCcw, { size: 12 })
			})
		]
	});
}
//#endregion
//#region src/components/chrome/ExportModal.tsx
var slug = (name) => name.trim().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "page";
/** Feature 10 — a self-contained Tailwind + React file for the current page. */
function ExportModal({ open, onClose }) {
	const page = useLab((s) => s.page);
	const view = useLab((s) => s.view);
	const [copied, setCopied] = useState(false);
	const code = useMemo(() => open ? generatePageJsx(page, view) : "", [
		open,
		page,
		view
	]);
	useEffect(() => {
		if (!copied) return;
		const timer = window.setTimeout(() => setCopied(false), 1600);
		return () => window.clearTimeout(timer);
	}, [copied]);
	const download = () => {
		const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `${slug(page.name)}.tsx`;
		anchor.click();
		URL.revokeObjectURL(url);
	};
	const lines = code ? code.split("\n").length : 0;
	return /* @__PURE__ */ jsx(Modal, {
		open,
		onClose,
		title: "Export page",
		subtitle: `${page.sections.length} sections · ${lines} lines · Tailwind classes, no runtime dependencies`,
		width: 880,
		footer: /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx("span", {
				className: "mr-auto text-[11px] text-ui-500",
				children: "Tokens ship as CSS variables on the root, so the palette stays editable in one object."
			}),
			/* @__PURE__ */ jsx(ToolButton, {
				variant: "outline",
				onClick: download,
				icon: /* @__PURE__ */ jsx(Download, { size: 13 }),
				children: "Download .tsx"
			}),
			/* @__PURE__ */ jsx(ToolButton, {
				variant: "solid",
				onClick: () => {
					navigator.clipboard.writeText(code).then(() => setCopied(true));
				},
				icon: copied ? /* @__PURE__ */ jsx(Check, { size: 13 }) : /* @__PURE__ */ jsx(Copy, { size: 13 }),
				children: copied ? "Copied" : "Copy code"
			})
		] }),
		children: /* @__PURE__ */ jsx("pre", {
			className: "m-0 max-h-[58vh] overflow-auto bg-ui-950 px-5 py-4 font-mono text-[11px] leading-[1.65] text-ui-300",
			children: /* @__PURE__ */ jsx("code", { children: code })
		})
	});
}
//#endregion
//#region src/components/chrome/Minimap.tsx
/**
* Contrast pacing.
*
* A page that never changes register is exhausting, and a page that shouts on
* every section is worse. This rail draws each section as a band whose height
* tracks its content weight and whose fill is its loud/calm mood, so the
* rhythm of the whole page is legible in one glance. Runs of three or more
* identical moods are flagged — that's where attention flatlines.
*/
function Minimap() {
	const sections = useLab((s) => s.page.sections);
	const tokens = useLab((s) => s.page.tokens);
	const activeSectionId = useLab((s) => s.activeSectionId);
	const setSectionMood = useLab((s) => s.setSectionMood);
	const setActiveSection = useLab((s) => s.setActiveSection);
	const palette = getPalette(tokens.paletteId);
	const flags = flatlines(sections);
	return /* @__PURE__ */ jsxs("aside", {
		className: "flex w-[132px] shrink-0 flex-col border-r border-ui-800 bg-ui-900",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "px-3 pt-3 pb-2",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "m-0 text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase",
				children: "Pacing"
			}), /* @__PURE__ */ jsx("p", {
				className: "m-0 mt-1 text-[10px] leading-snug text-ui-600",
				children: "Click a band to flip its register."
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2.5 pb-3",
			children: [sections.map((section, index) => {
				const loud = section.mood === "loud";
				const flagged = flags.has(index);
				return /* @__PURE__ */ jsxs("button", {
					type: "button",
					onMouseEnter: () => setActiveSection(section.id),
					onMouseLeave: () => setActiveSection(null),
					onClick: () => {
						setSectionMood(section.id, loud ? "calm" : "loud");
						document.querySelector(`[data-dl-section="${section.id}"]`)?.scrollIntoView({
							behavior: "smooth",
							block: "center"
						});
					},
					title: `${sectionDef(section.type).label} — ${section.mood}${flagged ? " (three in a row at this register)" : ""}`,
					className: cn("relative w-full cursor-pointer overflow-hidden rounded-md border text-left transition-all duration-150", activeSectionId === section.id ? "border-brand ring-1 ring-brand/40" : "border-ui-800 hover:border-ui-600"),
					style: {
						height: weight(section) * 13 + 20,
						background: loud ? palette.loudBg : palette.surface
					},
					children: [/* @__PURE__ */ jsx("span", {
						className: "absolute inset-x-1.5 top-1.5 truncate text-[9px] font-semibold tracking-wide uppercase",
						style: { color: loud ? palette.loudText : palette.muted },
						children: sectionDef(section.type).label
					}), flagged && /* @__PURE__ */ jsx(motion.span, {
						layout: true,
						className: "absolute right-1 bottom-1 h-1.5 w-1.5 rounded-full bg-amber-400",
						title: "Flatline"
					})]
				}, section.id);
			}), sections.length === 0 && /* @__PURE__ */ jsx("p", {
				className: "px-1 py-4 text-center text-[10px] text-ui-600",
				children: "No sections yet."
			})]
		})]
	});
}
/** Rough visual weight — more components means a taller band. */
function weight(section) {
	const base = section.type === "hero" ? 3 : section.type === "footer" ? 1 : 2;
	return Math.min(7, base + Math.round(section.components.length / 3));
}
/** Indices belonging to a run of 3+ sections sharing one mood. */
function flatlines(sections) {
	const flagged = /* @__PURE__ */ new Set();
	let runStart = 0;
	for (let i = 1; i <= sections.length; i += 1) if (i === sections.length || sections[i].mood !== sections[runStart].mood) {
		if (i - runStart >= 3) for (let j = runStart; j < i; j += 1) flagged.add(j);
		runStart = i;
	}
	return flagged;
}
//#endregion
//#region src/components/chrome/TopBar.tsx
var TONE_OPTIONS = [
	"authority",
	"warm",
	"urgent"
].map((tone) => ({
	value: tone,
	label: tone[0].toUpperCase() + tone.slice(1)
}));
var TONE_HINT = {
	authority: "Credentials first. Calm, specific, evidence-led.",
	warm: "Person first. Softer verbs, plain words, reassurance.",
	urgent: "Now first. Short lines, scarcity, a clear next step."
};
/** The emotional-engineering toolbar: everything that changes how a page feels. */
function TopBar({ onExport }) {
	const page = useLab((s) => s.page);
	const presetId = useLab((s) => s.presetId);
	const view = useLab((s) => s.view);
	const loadPreset = useLab((s) => s.loadPreset);
	const renamePage = useLab((s) => s.renamePage);
	const setView = useLab((s) => s.setView);
	const setTone = useLab((s) => s.setTone);
	const setChoreo = useLab((s) => s.setChoreo);
	const playPreview = useLab((s) => s.playPreview);
	const replacePage = useLab((s) => s.replacePage);
	const undo = useLab((s) => s.undo);
	const redo = useLab((s) => s.redo);
	const canUndo = useLab((s) => s.past.length > 0);
	const canRedo = useLab((s) => s.future.length > 0);
	return /* @__PURE__ */ jsxs("header", {
		className: "z-[100] flex h-13 shrink-0 items-center gap-2 border-b border-ui-800 bg-ui-900 px-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 pr-1",
				children: [/* @__PURE__ */ jsx("span", {
					className: "grid h-6 w-6 place-items-center rounded-md bg-brand text-[11px] font-bold text-white",
					children: "DL"
				}), /* @__PURE__ */ jsx("span", {
					className: "text-xs font-semibold tracking-tight text-ui-100",
					children: "Design\xA0Lab"
				})]
			}),
			/* @__PURE__ */ jsx("span", { className: "h-5 w-px bg-ui-800" }),
			/* @__PURE__ */ jsxs(Popover, {
				width: 272,
				trigger: ({ open, toggle }) => /* @__PURE__ */ jsx(ToolButton, {
					active: open,
					onClick: toggle,
					icon: /* @__PURE__ */ jsx(LayoutTemplate, { size: 14 }),
					children: PRESETS.find((p) => p.id === presetId)?.name ?? "Custom"
				}),
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "m-0 mb-2 text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase",
						children: "Load a preset"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex flex-col gap-1",
						children: PRESETS.map((preset) => /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => loadPreset(preset.id),
							className: "cursor-pointer rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-ui-800",
							children: [/* @__PURE__ */ jsx("span", {
								className: "block text-[12px] font-medium text-ui-100",
								children: preset.name
							}), /* @__PURE__ */ jsx("span", {
								className: "block text-[10px] text-ui-500",
								children: preset.vertical
							})]
						}, preset.id))
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 mb-1.5 text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase",
						children: "Page name"
					}),
					/* @__PURE__ */ jsx("input", {
						value: page.name,
						onChange: (event) => renamePage(event.target.value),
						className: "w-full rounded-lg border border-ui-700 bg-ui-850 px-2.5 py-1.5 text-[12px] text-ui-100 outline-none focus:border-brand"
					})
				]
			}),
			/* @__PURE__ */ jsx("span", { className: "h-5 w-px bg-ui-800" }),
			/* @__PURE__ */ jsx(ToolButton, {
				active: view.squint,
				onClick: () => setView({ squint: !view.squint }),
				title: "Squint test — blur everything to check the hierarchy survives",
				icon: /* @__PURE__ */ jsx(Eye, { size: 14 }),
				children: "Squint"
			}),
			/* @__PURE__ */ jsx(ToolButton, {
				active: view.grid,
				onClick: () => setView({ grid: !view.grid }),
				title: "8pt baseline + 12-column overlay",
				icon: /* @__PURE__ */ jsx(Grid3x3, { size: 14 }),
				children: "Grid"
			}),
			/* @__PURE__ */ jsx(ToolButton, {
				active: view.minimap,
				onClick: () => setView({ minimap: !view.minimap }),
				title: "Contrast-pacing minimap",
				icon: /* @__PURE__ */ jsx(Waves, { size: 14 }),
				children: "Pacing"
			}),
			/* @__PURE__ */ jsxs(Popover, {
				width: 252,
				trigger: ({ open, toggle }) => /* @__PURE__ */ jsxs(ToolButton, {
					active: open,
					onClick: toggle,
					icon: /* @__PURE__ */ jsx(ShieldCheck, { size: 14 }),
					children: ["Trust ", view.trustDensity]
				}),
				children: [/* @__PURE__ */ jsx(Slider, {
					label: "Trust density",
					value: view.trustDensity,
					min: 0,
					max: 100,
					display: `${view.trustDensity}%`,
					onChange: (trustDensity) => setView({ trustDensity })
				}), /* @__PURE__ */ jsx("p", {
					className: "m-0 mt-2 text-[10px] leading-relaxed text-ui-500",
					children: "Reveals proof in tiers — ratings and stats first, then logos, then long-form testimonials. Drag to zero to see whether the page still persuades on copy alone."
				})]
			}),
			/* @__PURE__ */ jsx(Popover, {
				width: 252,
				trigger: ({ open, toggle }) => /* @__PURE__ */ jsx(ToolButton, {
					active: open,
					onClick: toggle,
					icon: /* @__PURE__ */ jsx(Play, { size: 14 }),
					children: "Motion"
				}),
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ jsx(Slider, {
							label: "Stagger",
							value: view.choreo.stagger,
							min: 0,
							max: .3,
							step: .01,
							display: `${Math.round(view.choreo.stagger * 1e3)}ms`,
							onChange: (stagger) => setChoreo({ stagger })
						}),
						/* @__PURE__ */ jsx(Slider, {
							label: "Fade distance",
							value: view.choreo.distance,
							min: 0,
							max: 80,
							display: `${view.choreo.distance}px`,
							onChange: (distance) => setChoreo({ distance })
						}),
						/* @__PURE__ */ jsx(Slider, {
							label: "Hero parallax",
							value: view.choreo.parallax,
							min: 0,
							max: 100,
							display: `${view.choreo.parallax}%`,
							onChange: (parallax) => setChoreo({ parallax })
						}),
						/* @__PURE__ */ jsx(ToolButton, {
							variant: "solid",
							onClick: playPreview,
							icon: /* @__PURE__ */ jsx(Play, { size: 13 }),
							children: "Play the scroll"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("span", { className: "h-5 w-px bg-ui-800" }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1.5",
				title: TONE_HINT[view.tone],
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase",
					children: "Voice"
				}), /* @__PURE__ */ jsx(Segmented, {
					value: view.tone,
					options: TONE_OPTIONS,
					onChange: setTone,
					className: "w-[186px]"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "ml-auto flex items-center gap-1",
				children: [
					/* @__PURE__ */ jsx(ToolButton, {
						disabled: !canUndo,
						onClick: undo,
						title: "Undo (⌘Z)",
						icon: /* @__PURE__ */ jsx(Undo2, { size: 14 })
					}),
					/* @__PURE__ */ jsx(ToolButton, {
						disabled: !canRedo,
						onClick: redo,
						title: "Redo (⇧⌘Z)",
						icon: /* @__PURE__ */ jsx(Redo2, { size: 14 })
					}),
					/* @__PURE__ */ jsx("span", { className: "mx-0.5 h-5 w-px bg-ui-800" }),
					/* @__PURE__ */ jsx(ToolButton, {
						variant: "outline",
						onClick: () => replacePage(remixPage(page)),
						title: "Randomise variants and tokens inside curated bounds",
						icon: /* @__PURE__ */ jsx(Shuffle, { size: 14 }),
						children: "Remix"
					}),
					/* @__PURE__ */ jsx(ToolButton, {
						variant: "solid",
						onClick: onExport,
						icon: /* @__PURE__ */ jsx(Code2, { size: 14 }),
						children: "Export"
					})
				]
			})
		]
	});
}
/** Split out so the right panel can reuse the same choreography controls. */
function ChoreoControls() {
	const choreo = useLab((s) => s.view.choreo);
	const setChoreo = useLab((s) => s.setChoreo);
	const playPreview = useLab((s) => s.playPreview);
	const squint = useLab((s) => s.view.squint);
	const setView = useLab((s) => s.setView);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ jsx(Slider, {
				label: "Stagger",
				value: choreo.stagger,
				min: 0,
				max: .3,
				step: .01,
				display: `${Math.round(choreo.stagger * 1e3)}ms`,
				onChange: (stagger) => setChoreo({ stagger })
			}),
			/* @__PURE__ */ jsx(Slider, {
				label: "Fade distance",
				value: choreo.distance,
				min: 0,
				max: 80,
				display: `${choreo.distance}px`,
				onChange: (distance) => setChoreo({ distance })
			}),
			/* @__PURE__ */ jsx(Slider, {
				label: "Hero parallax",
				value: choreo.parallax,
				min: 0,
				max: 100,
				display: `${choreo.parallax}%`,
				onChange: (parallax) => setChoreo({ parallax })
			}),
			/* @__PURE__ */ jsx(Toggle, {
				checked: squint,
				onChange: (squint) => setView({ squint }),
				label: "Squint test",
				hint: "Blur the page to judge hierarchy"
			}),
			/* @__PURE__ */ jsx(ToolButton, {
				variant: "solid",
				onClick: playPreview,
				icon: /* @__PURE__ */ jsx(Play, { size: 13 }),
				children: "Play the scroll"
			})
		]
	});
}
//#endregion
//#region src/components/chrome/RightPanel.tsx
/**
* The token panel. Every control here writes one number or id into the page's
* `tokens`, which becomes a `--dl-*` custom property on the canvas root — so
* changes are instant and the exported file inherits exactly the same values.
*/
function RightPanel() {
	const tokens = useLab((s) => s.page.tokens);
	const page = useLab((s) => s.page);
	const setTokens = useLab((s) => s.setTokens);
	const replacePage = useLab((s) => s.replacePage);
	const font = getFontPair(tokens.fontPairId);
	const steps = typeSteps(tokens.baseSize, tokens.typeScale);
	return /* @__PURE__ */ jsxs("aside", {
		className: "flex w-[268px] shrink-0 flex-col overflow-y-auto border-l border-ui-800 bg-ui-900",
		children: [
			/* @__PURE__ */ jsx(PanelSection, {
				title: "Palette",
				action: /* @__PURE__ */ jsx(ToolButton, {
					size: "sm",
					onClick: () => setTokens(DEFAULT_TOKENS),
					title: "Reset all tokens",
					icon: /* @__PURE__ */ jsx(RotateCcw, { size: 12 })
				}),
				children: /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-1.5",
					children: PALETTES.map((palette) => {
						const active = palette.id === tokens.paletteId;
						return /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setTokens({ paletteId: palette.id }),
							className: cn("cursor-pointer overflow-hidden rounded-lg border p-1.5 text-left transition-all duration-150", active ? "border-brand ring-1 ring-brand/40" : "border-ui-750 hover:border-ui-600 hover:bg-ui-850"),
							children: [/* @__PURE__ */ jsx("span", {
								className: "flex h-5 overflow-hidden rounded-[5px]",
								children: [
									palette.bg,
									palette.surface,
									palette.primary,
									palette.accent,
									palette.loudBg
								].map((color) => /* @__PURE__ */ jsx("span", {
									className: "flex-1",
									style: { background: color }
								}, color))
							}), /* @__PURE__ */ jsx("span", {
								className: cn("mt-1 block truncate text-[10px] font-medium", active ? "text-ui-100" : "text-ui-400"),
								children: palette.name
							})]
						}, palette.id);
					})
				})
			}),
			/* @__PURE__ */ jsxs(PanelSection, {
				title: "Type",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "flex flex-col gap-1",
						children: FONT_PAIRS.map((pair) => {
							const active = pair.id === tokens.fontPairId;
							return /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setTokens({ fontPairId: pair.id }),
								className: cn("flex cursor-pointer items-baseline justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-all duration-150", active ? "border-brand bg-brand/10" : "border-transparent hover:border-ui-750 hover:bg-ui-850"),
								children: [/* @__PURE__ */ jsx("span", {
									className: cn("text-[15px] leading-none", active ? "text-ui-100" : "text-ui-300"),
									style: {
										fontFamily: pair.heading,
										letterSpacing: pair.tracking
									},
									children: "Ag"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-ui-500",
									children: pair.name
								})]
							}, pair.id);
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-1 flex flex-col gap-2.5",
						children: [/* @__PURE__ */ jsx(Slider, {
							label: "Base size",
							value: tokens.baseSize,
							...TOKEN_LIMITS.baseSize,
							display: `${tokens.baseSize}px`,
							onChange: (baseSize) => setTokens({ baseSize })
						}), /* @__PURE__ */ jsx(Slider, {
							label: "Scale ratio",
							value: tokens.typeScale,
							...TOKEN_LIMITS.typeScale,
							display: tokens.typeScale.toFixed(2),
							onChange: (typeScale) => setTokens({ typeScale })
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-1 overflow-hidden rounded-lg bg-ui-850 px-2.5 py-2",
						style: {
							fontFamily: font.heading,
							letterSpacing: font.tracking
						},
						children: [
							"h1",
							"h2",
							"h3",
							"base"
						].map((key) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "truncate text-ui-200",
								style: {
									fontSize: Math.min(30, steps[key]),
									lineHeight: 1.25
								},
								children: "Booking that feels calm"
							}), /* @__PURE__ */ jsx("span", {
								className: "shrink-0 font-mono text-[9px] text-ui-600 tabular-nums",
								children: steps[key]
							})]
						}, key))
					})
				]
			}),
			/* @__PURE__ */ jsxs(PanelSection, {
				title: "Shape & rhythm",
				children: [
					/* @__PURE__ */ jsx(Slider, {
						label: "Corner radius",
						value: tokens.radius,
						...TOKEN_LIMITS.radius,
						display: `${tokens.radius}px`,
						onChange: (radius) => setTokens({ radius })
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex gap-1.5",
						children: [
							0,
							2,
							6,
							10,
							14,
							20,
							28
						].map((stop) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setTokens({ radius: stop }),
							title: `${stop}px`,
							className: cn("h-7 flex-1 cursor-pointer border transition-colors", tokens.radius === stop ? "border-brand bg-brand/15" : "border-ui-750 hover:border-ui-600"),
							style: { borderRadius: Math.min(stop, 12) }
						}, stop))
					}),
					/* @__PURE__ */ jsx(Slider, {
						label: "Spacing",
						value: tokens.spacing,
						...TOKEN_LIMITS.spacing,
						display: `${tokens.spacing.toFixed(2)}×`,
						onChange: (spacing) => setTokens({ spacing })
					}),
					/* @__PURE__ */ jsx("p", {
						className: "m-0 text-[10px] leading-snug text-ui-600",
						children: "Scales section padding and every gap together, so the page breathes as one system instead of drifting apart."
					})
				]
			}),
			/* @__PURE__ */ jsx(PanelSection, {
				title: "Motion",
				children: /* @__PURE__ */ jsx(ChoreoControls, {})
			}),
			/* @__PURE__ */ jsxs(PanelSection, {
				title: "Layout",
				children: [/* @__PURE__ */ jsx(ToolButton, {
					variant: "outline",
					onClick: () => replacePage(remixLayoutsOnly(page)),
					icon: /* @__PURE__ */ jsx(Shuffle, { size: 13 }),
					children: "Shuffle layouts only"
				}), /* @__PURE__ */ jsx("p", {
					className: "m-0 text-[10px] leading-snug text-ui-600",
					children: "Keeps the palette and type you chose, and re-rolls every section's variant."
				})]
			})
		]
	});
}
//#endregion
//#region src/components/chrome/SectionPicker.tsx
/** Adds a section to the end of the page. Variants are cycled on the canvas. */
function SectionPicker({ open, onClose }) {
	const addSection = useLab((s) => s.addSection);
	return /* @__PURE__ */ jsx(Modal, {
		open,
		onClose,
		title: "Add a section",
		subtitle: "Every type ships with three to six layouts — cycle them on the canvas.",
		width: 680,
		children: /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-3 gap-2 p-5",
			children: SECTION_DEFS.map((def) => /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => {
					addSection(def.type);
					onClose();
				},
				className: "group flex cursor-pointer flex-col gap-2 rounded-xl border border-ui-750 bg-ui-850/60 p-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-brand/60 hover:bg-ui-850",
				children: [/* @__PURE__ */ jsx(SectionGlyph, { type: def.type }), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-1.5 text-[12px] font-semibold text-ui-100",
						children: [def.label, def.defaultMood === "loud" ? /* @__PURE__ */ jsx(Volume2, {
							size: 11,
							className: "text-amber-400/80"
						}) : /* @__PURE__ */ jsx(Moon, {
							size: 11,
							className: "text-ui-600"
						})]
					}),
					/* @__PURE__ */ jsx("span", {
						className: "mt-0.5 block text-[10px] leading-snug text-ui-500",
						children: def.blurb
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "mt-1 block text-[10px] text-ui-600",
						children: [def.variants.length, " layouts"]
					})
				] })]
			}, def.type))
		})
	});
}
/** Tiny wireframe so the picker reads visually, not as a list of words. */
function SectionGlyph({ type }) {
	const bar = "rounded-[2px] bg-ui-600 transition-colors group-hover:bg-brand/70";
	const box = "rounded-[3px] bg-ui-700 transition-colors group-hover:bg-brand/35";
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-[52px] flex-col justify-center gap-1 rounded-lg bg-ui-900 px-2.5 py-2",
		children: [
			type === "hero" && /* @__PURE__ */ jsxs("div", {
				className: "flex h-full gap-1.5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-1 flex-col justify-center gap-1",
					children: [
						/* @__PURE__ */ jsx("div", { className: `${bar} h-1.5 w-full` }),
						/* @__PURE__ */ jsx("div", { className: `${bar} h-1 w-3/4 opacity-60` }),
						/* @__PURE__ */ jsx("div", { className: `${bar} h-1.5 w-1/3` })
					]
				}), /* @__PURE__ */ jsx("div", { className: `${box} h-full w-[38%]` })]
			}),
			type === "logoBar" && /* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-between gap-1.5",
				children: [
					0,
					1,
					2,
					3,
					4
				].map((i) => /* @__PURE__ */ jsx("div", { className: `${bar} h-1.5 flex-1 opacity-70` }, i))
			}),
			type === "featureGrid" && /* @__PURE__ */ jsx("div", {
				className: "grid h-full grid-cols-3 gap-1.5",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ jsx("div", { className: `${box} h-full` }, i))
			}),
			type === "testimonials" && /* @__PURE__ */ jsxs("div", {
				className: "flex h-full items-center gap-1.5",
				children: [/* @__PURE__ */ jsx("div", { className: `${box} h-6 w-6 !rounded-full` }), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-1 flex-col gap-1",
					children: [
						/* @__PURE__ */ jsx("div", { className: `${bar} h-1 w-full opacity-60` }),
						/* @__PURE__ */ jsx("div", { className: `${bar} h-1 w-4/5 opacity-60` }),
						/* @__PURE__ */ jsx("div", { className: `${bar} h-1 w-1/3` })
					]
				})]
			}),
			type === "pricing" && /* @__PURE__ */ jsxs("div", {
				className: "grid h-full grid-cols-3 gap-1.5",
				children: [
					/* @__PURE__ */ jsx("div", { className: `${box} h-full` }),
					/* @__PURE__ */ jsx("div", { className: `${box} h-full !bg-brand/45` }),
					/* @__PURE__ */ jsx("div", { className: `${box} h-full` })
				]
			}),
			type === "faq" && /* @__PURE__ */ jsx("div", {
				className: "flex flex-col gap-1.5",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ jsx("div", {
					className: `${bar} h-2 w-full`,
					style: { opacity: i === 0 ? 1 : .5 }
				}, i))
			}),
			type === "bento" && /* @__PURE__ */ jsxs("div", {
				className: "grid h-full grid-cols-3 grid-rows-2 gap-1",
				children: [
					/* @__PURE__ */ jsx("div", { className: `${box} col-span-2 row-span-2` }),
					/* @__PURE__ */ jsx("div", { className: box }),
					/* @__PURE__ */ jsx("div", { className: box })
				]
			}),
			type === "ctaBanner" && /* @__PURE__ */ jsxs("div", {
				className: "flex h-full flex-col items-center justify-center gap-1.5 rounded-md bg-ui-800",
				children: [/* @__PURE__ */ jsx("div", { className: `${bar} h-1.5 w-1/2` }), /* @__PURE__ */ jsx("div", { className: `${box} h-2 w-1/4 !bg-brand/60` })]
			}),
			type === "footer" && /* @__PURE__ */ jsx("div", {
				className: "grid h-full grid-cols-4 gap-1.5 opacity-70",
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-1",
					children: [
						/* @__PURE__ */ jsx("div", { className: `${bar} h-1 w-full` }),
						/* @__PURE__ */ jsx("div", { className: `${bar} h-1 w-2/3 opacity-50` }),
						/* @__PURE__ */ jsx("div", { className: `${bar} h-1 w-2/3 opacity-50` })
					]
				}, i))
			})
		]
	});
}
//#endregion
//#region src/components/chrome/SnapshotStrip.tsx
/**
* Saved page states, with thumbnails.
*
* The page itself is stored as JSON (a `Page` is already serialisable), so a
* restore is exact rather than approximate. Thumbnails are rasterised once on
* capture — re-rendering 24 live previews would cost more than the canvas.
*/
function SnapshotStrip() {
	const snapshots = useLab((s) => s.snapshots);
	const compare = useLab((s) => s.view.compare);
	const addSnapshot = useLab((s) => s.addSnapshot);
	const removeSnapshot = useLab((s) => s.removeSnapshot);
	const renameSnapshot = useLab((s) => s.renameSnapshot);
	const restoreSnapshot = useLab((s) => s.restoreSnapshot);
	const setCompare = useLab((s) => s.setCompare);
	const [busy, setBusy] = useState(false);
	const [picking, setPicking] = useState(false);
	const [pending, setPending] = useState(null);
	const capture = async () => {
		const node = document.querySelector(".dl-canvas-root");
		if (!node) return;
		setBusy(true);
		try {
			const thumb = await toPng(node, {
				pixelRatio: .28,
				cacheBust: true,
				filter: (child) => !(child instanceof HTMLElement) || !(child.dataset.dlChrome === "true" || child.classList.contains("dl-grid-overlay"))
			});
			addSnapshot(thumb);
		} catch {
			addSnapshot("");
		} finally {
			setBusy(false);
		}
	};
	const onCardClick = (id) => {
		if (!picking) return;
		if (!pending) {
			setPending(id);
			return;
		}
		if (pending === id) {
			setPending(null);
			return;
		}
		setCompare([pending, id]);
		setPending(null);
		setPicking(false);
	};
	return /* @__PURE__ */ jsxs("footer", {
		"data-dl-chrome": "true",
		className: "z-[100] flex h-[132px] shrink-0 flex-col border-t border-ui-800 bg-ui-900",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 px-3 pt-2.5 pb-1.5",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "text-[10px] font-semibold tracking-[0.13em] text-ui-500 uppercase",
					children: "Snapshots"
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "text-[10px] text-ui-600",
					children: [snapshots.length, "/24"]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ml-auto flex items-center gap-1",
					children: [
						compare && /* @__PURE__ */ jsx(ToolButton, {
							size: "sm",
							variant: "outline",
							onClick: () => setCompare(null),
							children: "Close compare"
						}),
						/* @__PURE__ */ jsx(ToolButton, {
							size: "sm",
							active: picking,
							disabled: snapshots.length < 2,
							onClick: () => {
								setPicking((v) => !v);
								setPending(null);
							},
							title: "Pick two snapshots to compare side by side",
							icon: /* @__PURE__ */ jsx(Columns2, { size: 13 }),
							children: picking ? pending ? "Pick the second" : "Pick the first" : "Compare"
						}),
						/* @__PURE__ */ jsx(ToolButton, {
							size: "sm",
							variant: "solid",
							disabled: busy,
							onClick: () => void capture(),
							icon: busy ? /* @__PURE__ */ jsx(Loader2, {
								size: 13,
								className: "animate-spin"
							}) : /* @__PURE__ */ jsx(Camera, { size: 13 }),
							children: "Save snapshot"
						})
					]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex min-h-0 flex-1 items-stretch gap-2 overflow-x-auto px-3 pb-3",
			children: [snapshots.length === 0 && /* @__PURE__ */ jsx("div", {
				className: "flex w-full items-center justify-center",
				children: /* @__PURE__ */ jsx(EmptyState, {
					title: "No snapshots yet",
					hint: "Save one before a big change so you can always get back."
				})
			}), /* @__PURE__ */ jsx(AnimatePresence, {
				initial: false,
				children: snapshots.map((snapshot) => {
					const selectedForCompare = compare?.includes(snapshot.id);
					return /* @__PURE__ */ jsxs(motion.div, {
						layout: true,
						initial: {
							opacity: 0,
							scale: .94
						},
						animate: {
							opacity: 1,
							scale: 1
						},
						exit: {
							opacity: 0,
							scale: .94
						},
						transition: {
							duration: .2,
							ease: [
								.22,
								1,
								.36,
								1
							]
						},
						onClick: () => onCardClick(snapshot.id),
						className: cn("group relative flex w-[148px] shrink-0 flex-col overflow-hidden rounded-lg border bg-ui-850 transition-colors", pending === snapshot.id ? "border-brand ring-1 ring-brand/50" : selectedForCompare ? "border-brand/60" : "border-ui-750 hover:border-ui-600", picking && "cursor-pointer"),
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative min-h-0 flex-1 overflow-hidden bg-white",
							children: [snapshot.thumb ? /* @__PURE__ */ jsx("img", {
								src: snapshot.thumb,
								alt: "",
								className: "h-full w-full object-cover object-top"
							}) : /* @__PURE__ */ jsx("div", {
								className: "grid h-full place-items-center text-[10px] text-ui-500",
								children: "no preview"
							}), !picking && /* @__PURE__ */ jsxs("div", {
								className: "absolute inset-0 flex items-center justify-center gap-1 bg-ui-950/75 opacity-0 backdrop-blur-[2px] transition-opacity duration-150 group-hover:opacity-100",
								children: [/* @__PURE__ */ jsx(ToolButton, {
									size: "sm",
									variant: "solid",
									onClick: () => restoreSnapshot(snapshot.id),
									icon: /* @__PURE__ */ jsx(RotateCcw, { size: 12 }),
									children: "Restore"
								}), /* @__PURE__ */ jsx(ToolButton, {
									size: "sm",
									variant: "danger",
									onClick: () => removeSnapshot(snapshot.id),
									"aria-label": "Delete snapshot",
									icon: /* @__PURE__ */ jsx(Trash2, { size: 12 })
								})]
							})]
						}), /* @__PURE__ */ jsx("input", {
							value: snapshot.name,
							onChange: (event) => renameSnapshot(snapshot.id, event.target.value),
							onClick: (event) => event.stopPropagation(),
							"aria-label": "Snapshot name",
							className: "w-full truncate border-t border-ui-800 bg-transparent px-2 py-1 text-[10px] text-ui-300 outline-none focus:bg-ui-800 focus:text-ui-100"
						})]
					}, snapshot.id);
				})
			})]
		})]
	});
}
//#endregion
//#region src/App.tsx
/** True when focus is somewhere text is being typed. */
function isTyping(target) {
	const el = target;
	if (!el) return false;
	return el.isContentEditable || el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT";
}
function App() {
	const [picker, setPicker] = useState(false);
	const [exporting, setExporting] = useState(false);
	const minimapOn = useLab((s) => s.view.minimap);
	const comparing = useLab((s) => s.view.compare !== null);
	useEffect(() => {
		const onKey = (event) => {
			const meta = event.metaKey || event.ctrlKey;
			const lab = useLab.getState();
			if (meta && event.key.toLowerCase() === "z") {
				if (isTyping(event.target)) return;
				event.preventDefault();
				if (event.shiftKey) lab.redo();
				else lab.undo();
				return;
			}
			if (event.key === "Escape") {
				useEditing.getState().endEdit();
				lab.select(null);
				return;
			}
			if (isTyping(event.target)) return;
			if (event.key === "Backspace" || event.key === "Delete") {
				const { selection } = lab;
				if (!selection) return;
				event.preventDefault();
				lab.removeComponent(selection.sectionId, selection.componentId);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-screen w-screen flex-col overflow-hidden bg-ui-950 text-ui-200",
		children: [
			/* @__PURE__ */ jsx(TopBar, { onExport: () => setExporting(true) }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-h-0 flex-1",
				children: [
					minimapOn && !comparing && /* @__PURE__ */ jsx(Minimap, {}),
					comparing ? /* @__PURE__ */ jsx(CompareView, {}) : /* @__PURE__ */ jsx(Canvas, { onOpenPicker: () => setPicker(true) }),
					/* @__PURE__ */ jsx(RightPanel, {})
				]
			}),
			/* @__PURE__ */ jsx(SnapshotStrip, {}),
			/* @__PURE__ */ jsx(SectionPicker, {
				open: picker,
				onClose: () => setPicker(false)
			}),
			/* @__PURE__ */ jsx(ExportModal, {
				open: exporting,
				onClose: () => setExporting(false)
			})
		]
	});
}
//#endregion
export { App as default };
