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
