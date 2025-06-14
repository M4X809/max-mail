import { clearCredentials, deleteCredentials, setCredentials } from "@/lib/accountManagement.js";
import type { WindowIpcParams } from "@shared/types.js";

export default function initAccountIpc({ ipcMain }: WindowIpcParams) {
	ipcMain.handle("account:setCredentials", (_event, credentials) => {
		return setCredentials(credentials);
	});
	ipcMain.handle("account:deleteCredentials", (_event, username) => {
		return deleteCredentials(username);
	});
	ipcMain.handle("account:clearCredentials", (_event) => {
		return clearCredentials();
	});
}
