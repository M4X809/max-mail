import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
type AppState = {
	// State
	idle: boolean;
	interval: boolean;

	// Header
	title: string;

	// Methods

	setIdle: (value: boolean) => void;
	setInterval: (value: boolean) => void;

	setTitle: (value?: string) => void;

	// Updater
};

export const useAppStore = create<AppState>((set) => ({
	// State
	maximized: false,
	minimized: true,
	idle: false,
	interval: true,
	title: "max-mail",

	// Methods
	setIdle: (value) => set(() => ({ idle: value })),
	setInterval: (value) => set(() => ({ interval: value })),
	setTitle: (value) => set(() => ({ title: value ?? "max-mail" })),
}));

if (process.env.NODE_ENV === "development") {
	mountStoreDevtool("App Store", useAppStore);
}
