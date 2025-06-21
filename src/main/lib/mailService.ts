import { EventEmitter } from "node:events";
import Imap from "imap";
import { simpleParser, type ParsedMail } from "mailparser";
import { loadCredentials } from "./accountManagement.js";
import { mailServices } from "../index.js";

export interface MailConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	secure: boolean;
}

export interface MailMessage {
	uid: number;
	flags: string[];
	parsed: ParsedMail;
}

export interface MailService {
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
	listMailboxes: () => Promise<string[]>;
	fetchMessages: (mailbox: string, limit?: number) => Promise<MailMessage[]>;
	watchMailbox: (mailbox: string, callback: (message: MailMessage) => void) => Promise<void>;
	on: (event: string, listener: (...args: any[]) => void) => void;
	off: (event: string, listener: (...args: any[]) => void) => void;
	restart: () => Promise<boolean>;
	getState: () => "disconnected" | "connected" | "authenticated";
}

export const createMailService = (config: MailConfig): MailService => {
	const events = new EventEmitter();
	let client: Imap | null = null;
	let isConnected = false;

	const connect = async (): Promise<void> => {
		return new Promise((resolve, reject) => {
			try {
				client = new Imap({
					user: config.user,
					password: config.password,
					host: config.host,
					port: config.port,
					tls: config.secure,
					tlsOptions: { rejectUnauthorized: false },
				});

				client.once("ready", () => {
					isConnected = true;
					events.emit("connected");
					resolve();
				});

				client.once("error", (err) => {
					events.emit("error", err);
					reject(err);
				});

				client.connect();
			} catch (error) {
				events.emit("error", error);
				reject(error);
			}
		});
	};

	const disconnect = async (): Promise<void> => {
		if (client && isConnected) {
			return new Promise((resolve) => {
				client?.end();
				isConnected = false;
				events.emit("disconnected");
				resolve();
			});
		}
	};

	const listMailboxes = async (): Promise<string[]> => {
		if (!client || !isConnected) {
			throw new Error("Not connected to IMAP server");
		}

		return new Promise((resolve, reject) => {
			client?.getBoxes((err, boxes) => {
				if (err) {
					events.emit("error", err);
					reject(err);
					return;
				}
				resolve(Object.keys(boxes));
			});
		});
	};

	const fetchMessages = async (mailbox: string, limit = 50, offset = 0): Promise<MailMessage[]> => {
		if (!client || !isConnected) {
			throw new Error("Not connected to IMAP server");
		}

		return new Promise((resolve, reject) => {
			client?.openBox(mailbox, false, (err, box) => {
				if (err) {
					events.emit("error", err);
					reject(err);
					return;
				}

				const fetch = client?.seq.fetch(`${Math.max(1, box.messages.total - limit + 1 + offset)}:${box.messages.total}`, {
					bodies: ["HEADER.FIELDS (FROM SUBJECT DATE)", "TEXT"],
					struct: true,
					envelope: true,
				});

				const messages: MailMessage[] = [];

				fetch?.on("message", (msg) => {
					const message: Partial<MailMessage> = {};

					msg.on("body", (stream) => {
						let buffer = "";
						stream.on("data", (chunk) => {
							buffer += chunk.toString("utf8");
						});
						stream.once("end", async () => {
							try {
								message.parsed = await simpleParser(buffer);
							} catch (error) {
								events.emit("error", error);
							}
						});
					});

					msg.once("attributes", (attrs) => {
						message.uid = attrs.uid;
						message.flags = attrs.flags;
					});

					msg.once("end", () => {
						if (message.uid && message.flags && message.parsed) {
							messages.push(message as MailMessage);
						}
					});
				});

				fetch?.once("error", (err) => {
					events.emit("error", err);
					reject(err);
				});

				fetch?.once("end", () => {
					resolve(messages);
				});
			});
		});
	};

	const watchMailbox = async (mailbox: string, callback: (message: MailMessage) => void): Promise<void> => {
		if (!client || !isConnected) {
			throw new Error("Not connected to IMAP server");
		}

		return new Promise((resolve, reject) => {
			client?.openBox(mailbox, false, (err) => {
				if (err) {
					events.emit("error", err);
					reject(err);
					return;
				}

				client?.on("mail", async () => {
					const messages = await fetchMessages(mailbox, 1);
					if (messages.length > 0) {
						callback(messages[0]);
					}
				});

				resolve();
			});
		});
	};

	const restart = async (): Promise<boolean> => {
		await disconnect();
		await connect();
		console.log("🚀 ~ mailService.ts:186 ~ restart ~ client.state:", client?.state);
		return true;
	};

	const getState = (): "disconnected" | "connected" | "authenticated" => {
		return client?.state as "disconnected" | "connected" | "authenticated";
	};

	return {
		connect,
		disconnect,
		listMailboxes,
		fetchMessages,
		watchMailbox,
		on: (event: string, listener: (...args: any[]) => void) => events.on(event, listener),
		off: (event: string, listener: (...args: any[]) => void) => events.off(event, listener),
		restart,
		getState,
	};
};

export async function initMailService() {
	const credentials = await loadCredentials();
	if (!credentials) {
		throw new Error("No credentials found");
	}

	if (mailServices.size > 0) {
		await Promise.all(Array.from(mailServices.values()).map((service) => service.disconnect()));
	}

	for (const credential of credentials) {
		mailServices.set(
			credential.username,
			createMailService({
				host: credential.host,
				port: credential.port,
				user: credential.username,
				password: credential.password,
				secure: true,
			}),
		);
		await mailServices.get(credential.username)?.connect();
	}
}
