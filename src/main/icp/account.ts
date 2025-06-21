import { mailServices } from "@/main/index.js";
import {
	clearCredentials,
	deleteCredentials,
	setCredentials,
	updateCredentials,
} from "@/main/lib/accountManagement.js";
import type { WindowIpcParams } from "@shared/types.js";

export default function initAccountIpc({ ipcMain }: WindowIpcParams) {
	ipcMain.handle("account:setCredentials", (_event, credentials) => {
		return setCredentials(credentials);
	});
	ipcMain.handle("account:updateCredentials", async (_event, credentials) => {
		const result = await updateCredentials(credentials);
		if (result.success) {
			await mailServices.get(credentials.username)?.restart();
		}
		return result;
	});
	ipcMain.handle("account:deleteCredentials", (_event, username) => {
		return deleteCredentials(username);
	});
	ipcMain.handle("account:clearCredentials", (_event) => {
		return clearCredentials();
	});
}
