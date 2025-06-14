import { safeStorage } from "electron";

import { store } from "./store.js";

export interface MailCredentials {
	host: string;
	port: number;
	username: string;
	password: string;
}

export const setCredentials = async (credentials: MailCredentials): Promise<{ success: boolean; error?: string }> => {
	if (!safeStorage.isEncryptionAvailable()) {
		throw new Error("Encryption is not available on this system");
	}

	const encryptedCredentials = safeStorage.encryptString(JSON.stringify(credentials));
	const accounts = store.get("accounts");

	if (!accounts) {
		return { success: false, error: "No accounts found" };
	}

	const account = accounts.find((account) => account.name === credentials.username);
	if (account) {
		return { success: false, error: "Account already exists" };
	}

	accounts.push({
		name: credentials.username,
		encryptedCredentials: encryptedCredentials.toString("base64"),
	});

	store.set("accounts", accounts);

	return { success: true };
};

export const deleteCredentials = async (username: string): Promise<{ success: boolean; error?: string }> => {
	const accounts = store.get("accounts");
	if (!accounts) {
		return { success: false, error: "No accounts found" };
	}

	store.set(
		"accounts",
		accounts.filter((account) => account.name !== username),
	);

	return { success: true };
};

export const clearCredentials = async (): Promise<{ success: boolean; error?: string }> => {
	store.set("accounts", []);
	return { success: true };
};

export const loadCredentials = async (): Promise<MailCredentials[] | null> => {
	const encryptedCredentials = store.get("accounts");
	if (!encryptedCredentials) return null;

	return encryptedCredentials.map((account) => {
		const encryptedData = Buffer.from(account.encryptedCredentials, "base64");
		const decryptedData = safeStorage.decryptString(encryptedData);
		return JSON.parse(decryptedData);
	});
};

export const getAccounts = async (): Promise<Pick<MailCredentials, "username">[] | null> => {
	const encryptedCredentials = store.get("accounts");
	if (!encryptedCredentials) return null;

	const accounts = await loadCredentials();

	const data = accounts?.map((account) => {
		return {
			username: account.username,
		};
	});
	return data ?? null;
};
