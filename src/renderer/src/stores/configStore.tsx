/*
 * File: ConfigHandler.tsx
 * Project: note-mark
 * File Created: 16.08.2024, 12:08:13
 *
 * Last Modified: 04.09.2024, 23:09:20
 * Modified By: MAX809
 */

import type { Settings } from "@shared/types.js";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

interface ConfigStore {
	// Update Config
	updateConfig: Settings["updateConfig"];
	setUpdateConfig: (value: Settings["updateConfig"]) => void;
	refreshUpdateConfig: () => Promise<void>;

	windowConfig: Settings["windowData"];
	setWindowConfig: (value: Settings["windowData"]) => void;
	refreshWindowConfig: () => Promise<void>;

	devConfig: Settings["devConfig"];
	setDevConfig: (value: Settings["devConfig"]) => void;
	refreshDevConfig: () => Promise<void>;

	appState: Settings["appState"];
	setAppState: (value: Settings["appState"]) => void;
	refreshAppState: () => Promise<void>;
}

export const useConfigStore = create<ConfigStore>((set) => ({
	updateConfig: {},
	setUpdateConfig: (value) => set(() => ({ updateConfig: value })),
	refreshUpdateConfig: async () => {
		const updateConfig = await window.store.get("updateConfig");
		set(() => ({ updateConfig }));
		console.log("updateConfig", updateConfig);
	},

	windowConfig: {},
	setWindowConfig: (value) => set(() => ({ windowConfig: value })),
	refreshWindowConfig: async () => {
		const windowConfig = await window.store.get("windowData");
		set(() => ({ windowConfig }));
		console.log("windowConfig", windowConfig);
	},

	devConfig: {},
	setDevConfig: (value) => set(() => ({ devConfig: value })),
	refreshDevConfig: async () => {
		const devConfig = await window.store.get("devConfig");
		set(() => ({ devConfig }));
		console.log("devConfig", devConfig);
	},

	appState: {},
	setAppState: (value) => set(() => ({ appState: value })),
	refreshAppState: async () => {
		const appState = await window.store.get("appState");
		set(() => ({ appState }));
		console.log("appState", appState);
	},
}));
