import type { MailCredentials } from "@shared/types.js";
import type { Settings } from "@shared/types.js";
import { contextBridge, ipcRenderer } from "electron";

if (!process.contextIsolated) {
	throw new Error("contextIsolated must be enabled");
}

try {
	contextBridge.exposeInMainWorld("context", {
		locale: navigator.language,
		os: process.platform,
		// Folder IO

		navigate: (callback: (arg0: any) => void) => ipcRenderer.on("navigate", (_, data) => callback(data)),

		windowClose: () => ipcRenderer.invoke("window-close"),
		windowToggleSize: () => ipcRenderer.invoke("window-toggle-size"),
		windowMinimize: () => ipcRenderer.invoke("window-minimize"),
		getWindowMaximized: () => ipcRenderer.invoke("window-get-size"),

		mail: {
			getAccounts: () => ipcRenderer.invoke("mail:get-accounts"),
			getInboxes: (accountName: string) => ipcRenderer.invoke("mail:get-inboxes", accountName),
		},

		account: {
			setCredentials: (credentials: MailCredentials) => ipcRenderer.invoke("account:setCredentials", credentials),
			updateCredentials: (credentials: Partial<MailCredentials>) =>
				ipcRenderer.invoke("account:updateCredentials", credentials),
			deleteCredentials: (email: string) => ipcRenderer.invoke("account:deleteCredentials", email),
			// clearCredentials: () => ipcRenderer.invoke("account:clearCredentials"),
		},

		removeAllListeners: (event: string) => {
			if (!event) return console.error("Event is required");
			return ipcRenderer.removeAllListeners(event);
		},

		getEventListeners: (event: string) => {
			return ipcRenderer.listeners(event);
		},
	});
	contextBridge.exposeInMainWorld("updater", {
		getVersion: () => ipcRenderer.invoke("update:version"),

		// reviveUpdateStatus: (callback) => ipcRenderer.on("updater-status", (_, data) => callback(data)),
		message: (callback: (arg0: any) => void) => ipcRenderer.on("message", (_, data) => callback(data)),
		debug: (callback: (arg0: any) => void) => ipcRenderer.on("debug", (_, data) => callback(data)),
		updateNotAvailable: (callback: (arg0: any) => void) =>
			ipcRenderer.on("update-not-available", (_, data) => callback(data)),
		updateAvailable: (callback: (arg0: any) => void) => ipcRenderer.on("update-available", (_, data) => callback(data)),
		updateDownloaded: (callback: (arg0: any) => void) => ipcRenderer.on("update-downloaded", (_, data) => callback(data)),
		updateDownloading: (callback: (arg0: any) => void) =>
			ipcRenderer.on("update-downloading", (_, data) => callback(data)),

		checkForUpdates: () => ipcRenderer.invoke("update:check"),
		downloadUpdate: () => ipcRenderer.invoke("update:download"),
		installUpdate: () => ipcRenderer.invoke("update:install"),
	});

	contextBridge.exposeInMainWorld("store", {
		get: (key: keyof Settings) => ipcRenderer.invoke("store:get", key) as Promise<Settings>,
		set: (key: keyof Settings, value: Settings[keyof Settings]) => ipcRenderer.invoke("store:set", key, value),
		has: (key: keyof Settings) => ipcRenderer.invoke("store:has", key),
		clear: () => ipcRenderer.invoke("store:clear"),
		delete: (key: keyof Settings) => ipcRenderer.invoke("store:delete", key),
	});

	contextBridge.exposeInMainWorld("config", {
		updateConfigChanged: (callback: (arg0: any) => void) =>
			ipcRenderer.on("update-config-changed", (_, data) => callback(data)),
		editorConfigChanged: (callback: (arg0: any) => void) =>
			ipcRenderer.on("editor-config-changed", (_, data) => callback(data)),
		windowConfigChanged: (callback: (arg0: any) => void) =>
			ipcRenderer.on("window-config-changed", (_, data) => callback(data)),
		devConfigChanged: (callback: (arg0: any) => void) =>
			ipcRenderer.on("dev-config-changed", (_, data) => callback(data)),
		appStateChanged: (callback: (arg0: any) => void) => ipcRenderer.on("app-state-changed", (_, data) => callback(data)),
	});

	contextBridge.exposeInMainWorld("account", {
		setCredentials: (credentials: MailCredentials) => ipcRenderer.invoke("account:setCredentials", credentials),
		deleteCredentials: (email: string) => ipcRenderer.invoke("account:deleteCredentials", email),
		clearCredentials: () => ipcRenderer.invoke("account:clearCredentials"),
	});
} catch (error) {
	console.error(error);
}
