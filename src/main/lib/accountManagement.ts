import { safeStorage } from "electron";

import { store } from "./store.js";
import type { MailCredentials } from "@shared/types.js";
import { mailServices } from "@/main/index.js";
import { initMailService } from "@/main/lib/mailService.js";

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

	await initMailService();

	return { success: true };
};

export const updateCredentials = async (
	credentials: Partial<MailCredentials>,
): Promise<{ success: boolean; error?: string }> => {
	const accounts = store.get("accounts");
	if (!accounts) {
		return { success: false, error: "No accounts found" };
	}

	const account = accounts.find((account) => account.name === credentials.username);
	if (!account) {
		return { success: false, error: "Account not found" };
	}

	// Decrypt existing credentials
	const encryptedData = Buffer.from(account.encryptedCredentials, "base64");
	const decryptedData = safeStorage.decryptString(encryptedData);
	const existingCredentials = JSON.parse(decryptedData);

	// Merge existing credentials with new ones
	const updatedCredentials = {
		host: credentials.host ?? existingCredentials.host,
		port: credentials.port ?? existingCredentials.port,
		username: credentials.username ?? existingCredentials.username,
		password: credentials.password ?? existingCredentials.password,
	} as MailCredentials;

	// Encrypt and save updated credentials
	const encryptedCredentials = safeStorage.encryptString(JSON.stringify(updatedCredentials));
	account.encryptedCredentials = encryptedCredentials.toString("base64");

	store.set("accounts", accounts);
	const creds = await loadCredentials();
	console.log("🚀 ~ accountManagement.ts:65 ~ updateCredentials ~ creds:", creds);

	await initMailService();

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

export const getAccounts = async (): Promise<(Omit<MailCredentials, "password"> & { connected: boolean })[] | null> => {
	const encryptedCredentials = store.get("accounts");
	if (!encryptedCredentials) return null;

	const accounts = await loadCredentials();

	const data = accounts?.map((account) => {
		const mailService = mailServices.get(account.username);
		console.log("🚀 ~ accountManagement.ts:108 ~ data ~ mailService:", mailService?.getState());
		if (!mailService) {
			return {
				host: account.host,
				port: account.port,
				username: account.username,
				connected: false,
			};
		}

		return {
			host: account.host,
			port: account.port,
			username: account.username,
			connected: mailServices.get(account.username)?.getState() === "authenticated",
		};
	});
	console.log("🚀 ~ accountManagement.ts:103 ~ data ~ data:", data);
	return data ?? null;
};
