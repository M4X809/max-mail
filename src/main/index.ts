/*
 * File: index.ts
 * Project: max-mail
 * File Created: 31.08.2024, 20:08:88
 *
 * Last Modified: 06.09.2024, 09:09:56
 * Modified By: MAX809
 */

import { join } from "node:path";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { BrowserWindow, app, ipcMain } from "electron";
import log from "electron-log";
import { autoUpdater } from "electron-updater";

import open from "open";
import icon from "../../resources/icon.png?asset";

import { getWinSettings } from "./lib/settings.js";

import { store } from "./lib/store.js";
import { initMailService, type MailService } from "./lib/mailService.js";

import * as icp from "./icp/index.js";
import { sendStatusToWindow } from "./lib/util.js";
import db, { mail } from "./db/index.js";
import { migrateService } from "./db/migrateService.js";

export let mainWindow: BrowserWindow;
export const mailServices: Map<string, MailService> = new Map();
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	app.quit();
} else {
	app.on("second-instance", () => {
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});

	await migrateService();

	store.set("configCreated", new Date());
	store.set("devConfig.environment", process.env.NODE_ENV ?? "production");

	log.info(store.get("configCreated"));

	// setup the titlebar main process
	autoUpdater.logger = log;
	// @ts-ignore
	autoUpdater.logger.transports.file.level = "info";
	log.info("App starting...");

	// const windowSize = await getSpecificSetting("windowSize");
	function createWindow(): BrowserWindow {
		// Create the browser window.
		const windowSettings = getWinSettings();
		const mainWindow = new BrowserWindow({
			show: false,
			autoHideMenuBar: true,

			x: windowSettings.x ?? undefined,
			y: windowSettings.y ?? undefined,
			width: windowSettings.width ?? 800,
			height: windowSettings.height ?? 600,

			frame: false, // needed if process.versions.electron < 14
			fullscreenable: true,
			maximizable: true,
			center: true,

			// backgroundMaterial: "acrylic",

			// transparent: true,
			title: "max-mail",
			// darkTheme: true,
			minWidth: 1000,
			minHeight: 600,
			// backgroundColor: "#2D1B6900",

			// alwaysOnTop: process.env.NODE_ENV === "development",
			icon,
			webPreferences: {
				preload: join(__dirname, "../preload/index.cjs"),
				sandbox: true,
				contextIsolation: true,
				nodeIntegration: true,
			},
		});

		log.info(windowSettings);

		mainWindow.on("ready-to-show", () => {
			if (windowSettings.maximized) mainWindow.maximize();
			mainWindow.show();
			mainWindow.setAlwaysOnTop(true);
			mainWindow.setAlwaysOnTop(false);

			// This is a workaround to force a repaint and fix the acrylic bug
			setTimeout(() => {
				const [width, height] = mainWindow.getSize();
				mainWindow.setSize(width, height - 1);
				mainWindow.setSize(width, height);
			}, 10);
		});

		// HMR for renderer base on electron-vite cli.
		// Load the remote URL for development or the local html file for production.
		if (is.dev && process.env.ELECTRON_RENDERER_URL) {
			mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
		} else {
			mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
		}

		return mainWindow;
	}

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.whenReady().then(async () => {
		// if (process.env.NODE_ENV === "development") {
		// 	await session.defaultSession.loadExtension(
		// 		"C:/Users/jp/AppData/Local/Packages/TheBrowserCompany.Arc_ttt1ap7aakyb4/LocalCache/Local/Arc/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/5.3.1_0",
		// 	);
		// }

		// Set app user model id for windows
		electronApp.setAppUserModelId("com.electron.max-mail");
		autoUpdater.forceDevUpdateConfig = true;
		autoUpdater.autoDownload = false;
		autoUpdater.autoInstallOnAppQuit = true;
		autoUpdater.disableWebInstaller = true;

		// autoUpdater.checkForUpdates();

		// Default open or close DevTools by F12 in development
		// and ignore CommandOrControl + R in production.
		// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
		app.on("browser-window-created", (_, window) => {
			optimizer.watchWindowShortcuts(window);
		});

		// DEBUG CSS
		//   ipcMain.handle("getDebugCss", (_, ...args: Parameters<GetDebugCss>) =>
		//      getDebugCss(...args),
		//   );

		mainWindow = createWindow();

		await initMailService();

		for (const mailService of mailServices.values()) {
			await mailService.connect();

			const messages = await mailService.fetchMessages("INBOX", 10);
			console.log(messages.length);

			await db
				.insert(mail)
				.values(
					messages.map((m) => ({
						id: m.uid,
						from: m.parsed.from?.value.toString() ?? "",
						to: Array.isArray(m.parsed.to) ? m.parsed.to.map((t) => t.text).join(", ") : (m.parsed.to?.text ?? "none"),
						subject: m.parsed.subject ?? "",
						createdAt: m.parsed.date?.getTime() ?? 0,
						updatedAt: m.parsed.date?.getTime() ?? 0,
					})),
				)
				.onConflictDoNothing({ target: mail.id })
				.returning();
		}

		mainWindow.webContents.setWindowOpenHandler(({ url }) => {
			console.info(url);
			// handleUrl(url);
			open(url);
			return { action: "deny" };
		});

		mainWindow.webContents.session.setSpellCheckerEnabled(true);
		mainWindow.webContents.session.setSpellCheckerLanguages(["en-US", "de-DE"]);

		for (const icpHandler of Object.values(icp)) {
			icpHandler({ ipcMain, app, window: mainWindow });
		}

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
			sendStatusToWindow(mainWindow, progressObj, "update-downloading");
		});

		autoUpdater.on("checking-for-update", () => {
			sendStatusToWindow(mainWindow, "Checking for update...");
		});
		autoUpdater.on("update-available", (info) => {
			sendStatusToWindow(mainWindow, `Update available ${info}`, "update-available");
		});
		autoUpdater.on("update-not-available", (info) => {
			sendStatusToWindow(mainWindow, `Update not available. ${info}`, "update-not-available");
		});
		autoUpdater.on("error", (err) => {
			sendStatusToWindow(mainWindow, `Error in auto-updater. ${err}`);
		});

		autoUpdater.on("update-downloaded", (info) => {
			sendStatusToWindow(mainWindow, `Update downloaded. ${info}`, "update-downloaded");
			store.set("appState.hasUpdated", true);
		});

		// if (process.env.NODE_ENV === "development") {
		// 	mainWindow.webContents.openDevTools({
		// 		mode: "right",
		// 		activate: true,
		// 		title: "DevTools - max-mail",
		// 	});
		// }

		app.on("activate", (_, hasVisibleWindows) => {
			if (hasVisibleWindows) return;

			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (BrowserWindow.getAllWindows().length === 0) createWindow();
		});
	});

	// Quit when all windows are closed, except on macOS. There, it's common
	// for applications and their menu bar to stay active until the user quits
	// explicitly with Cmd + Q.
	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});

	// In this file you can include the rest of your app"s specific main process
	// code. You can also put them in separate files and require them here.
}
