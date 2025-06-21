import { homedir } from "node:os";
import path from "node:path";
import { appDirectoryName } from "@shared/constants.js";
import log from "electron-log";

const env = process.env.NODE_ENV ?? "production";

export const getRootDir = (dirs?: string[]) => {
	const basePath = path.join(homedir(), appDirectoryName);

	if (env === "development") {
		return dirs ? path.join(basePath, "dev", ...dirs) : path.join(basePath, "dev");
	}

	return dirs ? path.join(basePath, ...dirs) : basePath;
};

export function sendStatusToWindow(win: Electron.BrowserWindow, data: string | number | object, event?: string) {
	log.info(data);
	win.webContents.send(event ?? "message", data);
}

type Success<T> = {
	data: T;
	error?: never;
};

type Failure<E> = {
	data?: never;
	error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

type MaybePromise<T> = T | Promise<T>;

export function tryCatch<T, E = Error>(
	arg: Promise<T> | (() => MaybePromise<T>),
): Result<T, E> | Promise<Result<T, E>> {
	if (typeof arg === "function") {
		try {
			const result = arg();

			return result instanceof Promise ? tryCatch(result) : { data: result };
		} catch (error) {
			return { error: error as E };
		}
	}

	return arg.then((data) => ({ data })).catch((error) => ({ error: error as E }));
}
