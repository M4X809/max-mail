import type { BrowserWindow } from "electron";
import { store } from "./store.js";

export const getWinSettings = () => {
	// const screenCenter = window.
	// console.info(screenCenter);

	const default_bounds = { width: 800, height: 600, x: undefined, y: undefined, maximized: false };

	const size = store.get("windowData");
	if (size) return size;

	store.set("windowData", default_bounds);
	return default_bounds;
};

export const saveBounds = (window: BrowserWindow) => {
	const size = window.getSize();
	const pos = window.getPosition();
	const maximized = window.isMaximized();

	store.set("windowData", {
		width: size[0],
		height: size[1],
		x: pos[0],
		y: pos[1],
		maximized: maximized,
	});

	// console.info(store.get("windowData"));
};
