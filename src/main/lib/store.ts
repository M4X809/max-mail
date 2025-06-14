/*
 * File: store.ts
 * Project: max-mail
 * File Created: 16.08.2024, 22:08:33
 *
 * Last Modified: 05.09.2024, 11:09:05
 * Modified By: MAX809
 */

import { type Settings, configSchema } from "@shared/configSchema.js";
import Store from "electron-store";
import { getRootDir } from "./util.js";

// Store.initRenderer();
export const store = new Store<Settings>({
	cwd: getRootDir(["settings"]),
	watch: true,
	schema: configSchema,
	clearInvalidConfig: true,

	accessPropertiesByDotNotation: true,
});

export const logStore = new Store({
	cwd: getRootDir(["settings"]),
	watch: true,
	clearInvalidConfig: true,
	name: "logs",
	defaults: {
		debug: [],
	},
});

export const addLog = (...log: any) => {
	const oldLog = logStore.get("debug") as any[];

	log.unshift(new Date());

	if (typeof oldLog !== "object") {
		logStore.set("debug", [...log]);
		return;
	}

	if (!oldLog) {
		logStore.set("debug", [...log]);
		return;
	}

	oldLog.unshift(...log);
	console.info(oldLog);
	logStore.set("debug", oldLog);
	return;
};
