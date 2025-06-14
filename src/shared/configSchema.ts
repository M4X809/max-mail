/*
 * File: configSchema.ts
 * Project: max-mail
 * File Created: 16.08.2024, 13:08:59
 *
 * Last Modified: 03.09.2024, 10:09:82
 * Modified By: MAX809
 */

// import type { Settings } from "./types.js";
import type { Schema } from "electron-store";
export interface Settings {
	configCreated?: Date | null;
	appState?: {
		hasUpdated?: boolean;
		welcomeNoteCreated?: boolean;
		hasMigratedNotes?: boolean;
	};
	devConfig: {
		environment?: string;
		cssDebug?: boolean;
		cssDebugButton?: boolean;
		navigateButton?: boolean;
	};
	windowData?: {
		/** With */
		width?: number;
		/** Height */
		height?: number;
		/** X */
		x?: number | undefined;
		/** Y */
		y?: number | undefined;
		/** Maximized */
		maximized?: boolean;
	};
	updateConfig: {
		autoCheckUpdates?: boolean;
		autoDownloadUpdates?: boolean;
		updateNotifications?: boolean;
		autoCheckInterval?: number;
		showChangelogAfterUpdate?: boolean;
	};
	accounts: Array<{
		encryptedCredentials: string;
		name: string;
	}>;
}

export const configSchema: Schema<Settings> = {
	configCreated: {
		// type: "string",
		default: null,
	},
	appState: {
		type: "object",
		default: {
			hasUpdated: true,
			welcomeNoteCreated: false,
			hasMigratedNotes: false,
		},
		properties: {
			hasUpdated: {
				type: "boolean",
				default: true,
			},
			welcomeNoteCreated: {
				type: "boolean",
				default: false,
			},
			hasMigratedNotes: {
				type: "boolean",
				default: false,
			},
		},
	},
	devConfig: {
		type: "object",
		default: {
			environment: "",
			cssDebug: false,
			cssDebugButton: false,
			navigateButton: false,
		},
		properties: {
			environment: {
				type: "string",
				default: "",
			},
			cssDebug: {
				type: "boolean",
				default: false,
			},
			cssDebugButton: {
				type: "boolean",
				default: false,
			},
			navigateButton: {
				type: "boolean",
				default: false,
			},
		},
	},
	windowData: {
		type: "object",
		default: {
			width: 800,
			height: 600,
			x: undefined,
			y: undefined,
			maximized: false,
		},
		properties: {
			width: {
				type: "number",
				default: 800,
			},
			height: {
				type: "number",
				default: 600,
			},
			x: {
				// type: "any",
				default: undefined,
			},
			y: {
				// type: "any",
				default: undefined,
			},
			maximized: {
				type: "boolean",
				default: false,
			},
		},
	},
	updateConfig: {
		type: "object",
		default: {
			autoCheckUpdates: true,
			updateNotifications: true,
			autoDownloadUpdates: false,
			autoCheckInterval: 30,
			showChangelogAfterUpdate: true,
		},
		properties: {
			autoCheckUpdates: {
				type: "boolean",
				default: true,
			},
			updateNotifications: {
				type: "boolean",
				default: true,
			},
			autoDownloadUpdates: {
				type: "boolean",
				default: false,
			},
			autoCheckInterval: {
				type: "number",
				default: 30,
				maximum: 60,
				minimum: 10,
			},
			showChangelogAfterUpdate: {
				type: "boolean",
				default: true,
			},
		},
	},
	accounts: {
		type: "array",
		default: [],
		items: {
			type: "object",
			properties: {
				encryptedCredentials: {
					type: "string",
				},
				name: {
					type: "string",
				},
			},
		},
	},
} as const as Schema<Settings>;
