import { store } from "@/main/lib/store.js";
import { sendStatusToWindow } from "@/main/lib/util.js";
import type { Settings, WindowIpcParams } from "@shared/types.js";

export default async function initStoreIpc({ ipcMain, window }: WindowIpcParams) {
	//  Store
	ipcMain.handle("store:get", (_, key: keyof Settings) => {
		return store.get(key);
	});
	ipcMain.handle("store:set", (_, key: keyof Settings, value) => {
		return store.set(key, value);
	});
	ipcMain.handle("store:has", (_, key: keyof Settings) => {
		return store.has(key);
	});
	ipcMain.handle("store:clear", () => {
		return store.clear();
	});
	ipcMain.handle("store:delete", (_, key: keyof Settings) => {
		return store.delete(key);
	});

	store.onDidChange("updateConfig", (newValue, _oldValue) => {
		sendStatusToWindow(window, newValue ?? {}, "update-config-changed");
	});

	store.onDidChange("windowData", (newValue, _oldValue) => {
		sendStatusToWindow(window, newValue ?? {}, "window-config-changed");
	});
	store.onDidChange("devConfig", (newValue, _oldValue) => {
		sendStatusToWindow(window, newValue ?? {}, "dev-config-changed");
	});
	store.onDidChange("appState", (newValue, _oldValue) => {
		sendStatusToWindow(window, newValue ?? {}, "app-state-changed");
	});
}
