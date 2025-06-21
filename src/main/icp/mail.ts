import type { WindowIpcParams } from "@shared/types.js";

import { mailServices } from "@/main/index.js";
import { getAccounts } from "@/main/lib/accountManagement.js";

export default function initMailIpc({ ipcMain }: WindowIpcParams) {
	// get accounts
	ipcMain.handle("mail:get-accounts", async () => {
		const accounts = await getAccounts();
		return accounts;
	});

	// get inboxes
	ipcMain.handle("mail:get-inboxes", async (event, accountName: string) => {
		const mailService = mailServices.get(accountName);
		if (!mailService) {
			throw new Error(`Mail service for account ${accountName} not found`);
		}
		const inboxes = await mailService.listMailboxes();
		return inboxes;
	});

	// get messages
	// ipcMain.handle("mail:get-messages", () => {
	// 	const messages = store.get("mailMessages");
	// 	return messages;
	// });
}
