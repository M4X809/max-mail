import { saveBounds } from "@/main/lib/settings.js";
import type { WindowIpcParams } from "@shared/types.js";

export default async function initWindowIpc({ ipcMain, app, window }: WindowIpcParams) {
	ipcMain.handle("window-close", () => app.quit());
	ipcMain.handle("window-maximize", () => window.maximize());
	ipcMain.handle("window-toggle-size", () => {
		if (window.isMaximized()) {
			window.unmaximize();
			return false;
		}
		window.maximize();
		return true;
	});
	ipcMain.handle("window-minimize", () => window.minimize());
	ipcMain.handle("window-get-size", () => window.isMaximized());

	// saveBounds(mainWindow);
	window.on("resized", () => {
		saveBounds(window);
	});
	window.on("moved", () => {
		saveBounds(window);
	});

	window.on("unmaximize", () => {
		saveBounds(window);
	});

	window.on("maximize", () => {
		saveBounds(window);
	});
}
