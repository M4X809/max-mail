/*
 * File: index.d.ts
 * Project: max-mail
 * File Created: 11.08.2024, 21:08:30
 *
 * Last Modified: 03.09.2024, 09:09:39
 * Modified By: MAX809
 */

// import { ElectronAPI } from '@electron-toolkit/preload'
import type {
	DeleteFolder,
	DeleteNote,
	GetChangelog,
	GetDebugCss,
	GetFolders,
	GetNotes,
	OpenBackup,
	OpenFile,
	ReadNote,
	RenameFolder,
	RenameNote,
	Settings,
	WelcomeNote,
	WriteNote,
} from "@shared/types.js";
import type { Key, ProgressInfo, UpdateCheckResult } from "electron-updater";
import type { SemVer } from "semver";
import type { MailCredentials } from "@/lib/accountManagement.js";

// import type Store from "electron-store";

// import type Conf from "electron-store";

// type T = Store<Settings>;

// import type { store } from "../main/index.js";

declare global {
	interface Window {
		context: {
			locale: string;

			windowClose: () => void;
			windowToggleSize: () => Promise<boolean>;
			windowMinimize: () => void;

			getWindowMaximized: () => Promise<boolean>;

			removeAllListeners: (event: string) => void;
			getEventListeners: (event: string) => void;
		};

		updater: {
			getVersion: () => Promise<string>;

			message: (callback: (data: unknown) => void) => void;
			debug: (callback: (data: unknown) => void) => void;
			updateNotAvailable: (callback: (data: unknown) => void) => void;
			updateAvailable: (callback: (data: unknown) => void) => void;
			updateDownloaded: (callback: (data: unknown) => void) => void;
			updateDownloading: (callback: (data: ProgressInfo) => void) => void;

			checkForUpdates: () => Promise<{ result: UpdateCheckResult; version: SemVer }>;
			downloadUpdate: () => Promise<void>;
			installUpdate: () => Promise<void>;
		};

		store: {
			get: <Key extends keyof T>(key: Key) => Promise<Settings[T]>;
			set: <Key extends keyof T>(key: Key, value?: T[Key]) => Promise<void>;
			has: <Key extends keyof T>(key: Key) => Promise<boolean>;
			clear: () => Promise<void>;
			delete: <Key extends keyof T>(key: Key) => Promise<void>;
		};

		config: {
			updateConfigChanged: (callback: (data: Settings["updateConfig"]) => void) => void;
			editorConfigChanged: (callback: (data: Settings["editorConfig"]) => void) => void;
			windowConfigChanged: (callback: (data: Settings["windowData"]) => void) => void;
			devConfigChanged: (callback: (data: Settings["devConfig"]) => void) => void;
			appStateChanged: (callback: (data: Settings["appState"]) => void) => void;
		};

		account: {
			setCredentials: (credentials: MailCredentials) => Promise<{ success: boolean; error?: string }>;
			deleteCredentials: (email: string) => Promise<{ success: boolean; error?: string }>;
			clearCredentials: () => Promise<{ success: boolean; error?: string }>;
		};
	}
}
