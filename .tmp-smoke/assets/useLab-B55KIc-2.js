import { a as newComponent, i as cloneSection, n as buildPreset, o as newSection, r as cloneComponent, s as uid, t as PRESETS } from "./presets-BhveEIpX.js";
import { r as nextVariant } from "./registry-BCIIPLiT.js";
import { t as DEFAULT_TOKENS } from "./tokens-CLCekMxW.js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
//#region src/store/useLab.ts
var HISTORY_LIMIT = 60;
var DEFAULT_VIEW = {
	squint: false,
	grid: false,
	minimap: true,
	trustDensity: 55,
	tone: "authority",
	choreo: {
		stagger: .07,
		distance: 26,
		parallax: 30
	},
	previewNonce: 0,
	compare: null
};
function findSection(page, id) {
	return page.sections.find((s) => s.id === id);
}
function move(list, from, to) {
	const next = list.slice();
	const [item] = next.splice(from, 1);
	if (item === void 0) return list;
	next.splice(to, 0, item);
	return next;
}
var useLab = create()(persist((set, get) => {
	/**
	* Every page mutation funnels through here so undo/redo is free and
	* nothing can forget to snapshot history.
	*/
	const mutate = (fn) => set((state) => {
		return {
			page: fn(structuredClone(state.page)),
			past: [...state.past, state.page].slice(-60),
			future: []
		};
	});
	const mutateSection = (id, fn) => mutate((page) => {
		const section = findSection(page, id);
		if (section) fn(section);
		return page;
	});
	const mutateComponent = (sectionId, componentId, fn) => mutateSection(sectionId, (section) => {
		const component = section.components.find((c) => c.id === componentId);
		if (component) fn(component, section);
	});
	return {
		page: buildPreset(PRESETS[0].id),
		presetId: PRESETS[0].id,
		snapshots: [],
		view: DEFAULT_VIEW,
		selection: null,
		activeSectionId: null,
		past: [],
		future: [],
		loadPreset: (id) => {
			const page = buildPreset(id);
			set((state) => ({
				page,
				presetId: id,
				selection: null,
				activeSectionId: null,
				past: [...state.past, state.page].slice(-60),
				future: []
			}));
		},
		renamePage: (name) => mutate((page) => ({
			...page,
			name
		})),
		setTokens: (patch) => mutate((page) => ({
			...page,
			tokens: {
				...page.tokens,
				...patch
			}
		})),
		replacePage: (page) => set((state) => ({
			page: structuredClone(page),
			selection: null,
			activeSectionId: null,
			past: [...state.past, state.page].slice(-60),
			future: []
		})),
		addSection: (type, index) => mutate((page) => {
			const section = newSection(type);
			const at = index ?? page.sections.length;
			page.sections.splice(at, 0, section);
			return page;
		}),
		removeSection: (id) => mutate((page) => ({
			...page,
			sections: page.sections.filter((s) => s.id !== id)
		})),
		duplicateSection: (id) => mutate((page) => {
			const index = page.sections.findIndex((s) => s.id === id);
			if (index === -1) return page;
			page.sections.splice(index + 1, 0, cloneSection(page.sections[index]));
			return page;
		}),
		reorderSections: (from, to) => mutate((page) => ({
			...page,
			sections: move(page.sections, from, to)
		})),
		cycleVariant: (id, dir = 1) => mutateSection(id, (section) => {
			section.variant = nextVariant(section.type, section.variant, dir);
		}),
		setVariant: (id, variant) => mutateSection(id, (section) => {
			section.variant = variant;
		}),
		setSectionMeta: (id, patch) => mutateSection(id, (section) => {
			section.meta = {
				...section.meta,
				...patch
			};
		}),
		setSectionMood: (id, mood) => mutateSection(id, (section) => {
			section.mood = mood;
		}),
		setActiveSection: (id) => set({ activeSectionId: id }),
		addComponent: (sectionId, type, afterId) => mutateSection(sectionId, (section) => {
			const component = newComponent(type);
			const index = afterId ? section.components.findIndex((c) => c.id === afterId) : -1;
			if (index === -1) section.components.push(component);
			else section.components.splice(index + 1, 0, component);
		}),
		removeComponent: (sectionId, componentId) => {
			mutateSection(sectionId, (section) => {
				section.components = section.components.filter((c) => c.id !== componentId);
			});
			if (get().selection?.componentId === componentId) set({ selection: null });
		},
		duplicateComponent: (sectionId, componentId) => mutateSection(sectionId, (section) => {
			const index = section.components.findIndex((c) => c.id === componentId);
			if (index === -1) return;
			section.components.splice(index + 1, 0, cloneComponent(section.components[index]));
		}),
		updateComponent: (sectionId, componentId, patch) => mutateComponent(sectionId, componentId, (component) => {
			component.props = {
				...component.props,
				...patch
			};
		}),
		reorderComponents: (sectionId, from, to) => mutateSection(sectionId, (section) => {
			section.components = move(section.components, from, to);
		}),
		select: (selection) => set({ selection }),
		setView: (patch) => set((state) => ({ view: {
			...state.view,
			...patch
		} })),
		setChoreo: (patch) => set((state) => ({ view: {
			...state.view,
			choreo: {
				...state.view.choreo,
				...patch
			}
		} })),
		setTone: (tone) => set((state) => ({ view: {
			...state.view,
			tone
		} })),
		playPreview: () => set((state) => ({ view: {
			...state.view,
			previewNonce: state.view.previewNonce + 1
		} })),
		addSnapshot: (thumb, name) => set((state) => ({ snapshots: [{
			id: uid("snap"),
			name: name ?? `${state.page.name} · ${state.snapshots.length + 1}`,
			createdAt: Date.now(),
			thumb,
			page: structuredClone(state.page)
		}, ...state.snapshots].slice(0, 24) })),
		removeSnapshot: (id) => set((state) => ({
			snapshots: state.snapshots.filter((s) => s.id !== id),
			view: {
				...state.view,
				compare: state.view.compare?.includes(id) ? null : state.view.compare
			}
		})),
		renameSnapshot: (id, name) => set((state) => ({ snapshots: state.snapshots.map((s) => s.id === id ? {
			...s,
			name
		} : s) })),
		restoreSnapshot: (id) => {
			const snapshot = get().snapshots.find((s) => s.id === id);
			if (snapshot) get().replacePage(snapshot.page);
		},
		setCompare: (pair) => set((state) => ({ view: {
			...state.view,
			compare: pair
		} })),
		undo: () => set((state) => {
			const previous = state.past.at(-1);
			if (!previous) return state;
			return {
				page: previous,
				past: state.past.slice(0, -1),
				future: [state.page, ...state.future].slice(0, HISTORY_LIMIT),
				selection: null
			};
		}),
		redo: () => set((state) => {
			const next = state.future[0];
			if (!next) return state;
			return {
				page: next,
				past: [...state.past, state.page].slice(-60),
				future: state.future.slice(1),
				selection: null
			};
		}),
		/** Marks a history point without changing anything (drag start, etc.). */
		commit: () => set((state) => ({
			past: [...state.past, state.page].slice(-60),
			future: []
		}))
	};
}, {
	name: "design-lab:v1",
	version: 1,
	partialize: (state) => ({
		page: state.page,
		presetId: state.presetId,
		snapshots: state.snapshots,
		view: state.view
	}),
	merge: (persisted, current) => {
		const saved = persisted;
		if (!saved) return current;
		return {
			...current,
			...saved,
			view: {
				...DEFAULT_VIEW,
				...saved.view,
				previewNonce: 0,
				compare: null
			},
			page: saved.page ? {
				...saved.page,
				tokens: {
					...DEFAULT_TOKENS,
					...saved.page.tokens
				}
			} : current.page,
			past: [],
			future: [],
			selection: null,
			activeSectionId: null
		};
	}
}));
//#endregion
export { useLab as n, DEFAULT_VIEW as t };
