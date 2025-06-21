import { sendStatusToWindow } from "@/main/lib/util.js";
import type { WindowIpcParams } from "@shared/types.js";
import { autoUpdater } from "electron-updater";
import { store } from "@/main/lib/store.js";

export default function initUpdaterIpc({ ipcMain, window }: WindowIpcParams) {
	// Updater
	ipcMain.handle("update:version", () => autoUpdater.currentVersion);
	ipcMain.handle("update:check", async () => {
		const result = await autoUpdater.checkForUpdates();
		const version = autoUpdater?.currentVersion;
		return {
			result,
			version,
		};
	});
	ipcMain.handle("update:download", async () => await autoUpdater.downloadUpdate());
	ipcMain.handle("update:install", () => autoUpdater.quitAndInstall(false));

	autoUpdater.on("download-progress", (progressObj) => {
		let log_message = `Download speed: ${progressObj.bytesPerSecond}`;
		log_message = `${log_message} - Downloaded ${progressObj.percent}%`;
		log_message = `${log_message} (${progressObj.transferred}/${progressObj.total})`;
		sendStatusToWindow(window, progressObj, "update-downloading");
	});

	autoUpdater.on("checking-for-update", () => {
		sendStatusToWindow(window, "Checking for update...");
	});
	autoUpdater.on("update-available", (info) => {
		sendStatusToWindow(window, `Update available ${info}`, "update-available");
	});
	autoUpdater.on("update-not-available", (info) => {
		sendStatusToWindow(window, `Update not available. ${info}`, "update-not-available");
	});
	autoUpdater.on("error", (err) => {
		sendStatusToWindow(window, `Error in auto-updater. ${err}`);
	});

	autoUpdater.on("update-downloaded", (info) => {
		sendStatusToWindow(window, `Update downloaded. ${info}`, "update-downloaded");
		store.set("appState.hasUpdated", true);
	});
}
