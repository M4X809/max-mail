/*
 * File: types.ts
 * Project: max-mail
 * File Created: 12.08.2024, 20:08:82
 *
 * Last Modified: 06.09.2024, 10:09:64
 * Modified By: MAX809
 */

export type GetDebugCss = () => Promise<string>;
export type GetChangelog = () => Promise<string>;

export type * from "./configSchema.js";

export interface WindowIpcParams {
	ipcMain: Electron.IpcMain;
	app: Electron.App;
	window: Electron.BrowserWindow;
}

export interface MailCredentials {
	host: string;
	port: number;
	username: string;
	password: string;
}
