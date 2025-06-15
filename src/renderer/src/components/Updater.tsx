/*
 * File: Updater.tsx
 * Project: note-mark
 * File Created: 13.08.2024, 18:08:67
 *
 * Last Modified: 04.09.2024, 23:09:31
 * Modified By: MAX809
 */

import type { ProgressInfo, UpdateCheckResult } from "electron-updater";
import { useEffect } from "react";
import { create } from "zustand";

// import { notifications } from "@mantine/notifications";

import { faDownload } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import type { SemVer } from "semver";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { useConfigStore } from "@renderer/stores/configStore";
import { toast } from "sonner";
import { DismissButton } from "./Toaster";

type UpdaterState = {
	versionInfo: {
		result: UpdateCheckResult | null;
		version: SemVer | null;
	};
	updateAvailable: boolean;
	sendNotification: {
		update: boolean;
		download: boolean;
	};
	updateDownloaded: boolean;
	checkingForUpdates: boolean;
	isDownloading: boolean;
	isDownloadPending: boolean;
	downloadingProgress: ProgressInfo | null;

	checkForUpdates: () => Promise<void>;
	setUpdateAvailable: (value: boolean) => void;
	setDownloadingProgress: (value: ProgressInfo) => void;
	setUpdateDownloaded: (value: boolean) => void;
	downloadUpdate: () => void;
	installUpdate: () => void;
	setIsDownloading: (value: boolean) => void;
	setIsDownloadPending: (value: boolean) => void;
	setSendNotification: (value: boolean, type: "update" | "download") => void;

	setVersion: () => Promise<void>;
};

export const useUpdaterStore = create<UpdaterState>((set) => ({
	versionInfo: {
		result: null,
		version: null,
	},

	checkingForUpdates: false,
	updateAvailable: false,
	sendNotification: {
		update: false,
		download: false,
	},

	downloadingProgress: null,
	updateDownloaded: false,
	isDownloading: false,
	isDownloadPending: false,

	setVersion: async () => {
		const version = await window.updater.getVersion();
		set((state) => ({
			versionInfo: {
				result: state.versionInfo.result,
				version: version as any,
			},
		}));
	},

	checkForUpdates: async () => {
		set({
			checkingForUpdates: true,
		});
		const { result, version } = await window.updater.checkForUpdates();
		// console.log("result", result)
		set({
			versionInfo: {
				result,
				version,
			},
		});
		set({
			checkingForUpdates: false,
		});
	},
	setUpdateAvailable: (value) => set(() => ({ updateAvailable: value })),
	setDownloadingProgress: (value) => set(() => ({ downloadingProgress: value })),
	downloadUpdate: () => window.updater.downloadUpdate(),
	setUpdateDownloaded: (value) => set(() => ({ updateDownloaded: value })),
	installUpdate: () => window.updater.installUpdate(),
	setIsDownloading: (value) => set(() => ({ isDownloading: value })),
	setIsDownloadPending: (value) => set(() => ({ isDownloadPending: value })),
	setSendNotification: (value, type) =>
		set((state) => ({
			sendNotification: {
				...state.sendNotification,
				[type]: value,
			},
		})),
}));

const Updater = () => {
	const setVersion = useUpdaterStore((state) => state.setVersion);
	const checkForUpdates = useUpdaterStore((state) => state.checkForUpdates);
	const setUpdateAvailable = useUpdaterStore((state) => state.setUpdateAvailable);
	const setDownloadingProgress = useUpdaterStore((state) => state.setDownloadingProgress);
	const setUpdateDownloaded = useUpdaterStore((state) => state.setUpdateDownloaded);
	const setIsDownloading = useUpdaterStore((state) => state.setIsDownloading);
	const setIsDownloadPending = useUpdaterStore((state) => state.setIsDownloadPending);

	const setSendNotification = useUpdaterStore((state) => state.setSendNotification);
	const sendNotification = useUpdaterStore((state) => state.sendNotification);
	const updateAvailable = useUpdaterStore((state) => state.updateAvailable);
	const updateDownloaded = useUpdaterStore((state) => state.updateDownloaded);

	const autoCheckUpdates = useConfigStore((state) => state.updateConfig?.autoCheckUpdates ?? null);
	const autoDownloadUpdates = useConfigStore((state) => state.updateConfig?.autoDownloadUpdates ?? null);
	const updateNotifications = useConfigStore((state) => state.updateConfig?.updateNotifications ?? null);

	const isDownloading = useUpdaterStore((state) => state.isDownloading);
	const isDownloadPending = useUpdaterStore((state) => state.isDownloadPending);

	const downloadUpdate = useUpdaterStore((state) => state.downloadUpdate);

	const installUpdate = useUpdaterStore((state) => state.installUpdate);

	const navigate = useNavigate();
	const path = useLocation().pathname;

	useEffect(() => {
		if (
			!sendNotification.update &&
			updateAvailable &&
			updateNotifications &&
			autoCheckUpdates &&
			!path.includes("/settings/update") &&
			!isDownloading &&
			!isDownloadPending &&
			!updateDownloaded
		) {
			setSendNotification(true, "update");
			toast.info("Update Available", {
				id: "update-notification",
				icon: <FontAwesomeIcon icon={faDownload} />,
				description: (
					<Button
						size="compact-xs"
						variant="gradient"
						gradient={{ from: "orange", to: "yellow", deg: 0 }}
						onClick={() => {
							if (!autoDownloadUpdates) {
								setIsDownloadPending(true);
								downloadUpdate();
								console.log("downloadUpdate");
							}

							navigate("/settings/update", { replace: true });
							toast.dismiss("update-notification");
						}}
					>
						Download Update
					</Button>
				),
				duration: Number.POSITIVE_INFINITY,
			});
		}
	}, [
		updateAvailable,
		sendNotification.update,
		setSendNotification,
		navigate,
		updateNotifications,
		autoCheckUpdates,
		path,
		isDownloading,
		isDownloadPending,
		updateDownloaded,
		downloadUpdate,
		setIsDownloadPending,
		autoDownloadUpdates,
	]);

	useEffect(() => {
		if (
			updateDownloaded &&
			updateNotifications &&
			autoDownloadUpdates &&
			!path.includes("/settings/update") &&
			!sendNotification.download
		) {
			setSendNotification(true, "download");
			toast.info("Update Downloaded", {
				id: "update-notification",
				icon: <FontAwesomeIcon icon={faDownload} />,
				description: (
					<Button
						size="compact-xs"
						variant="gradient"
						gradient={{ from: "blue", to: "green", deg: 0 }}
						onClick={() => {
							// navigate("/settings/update", { replace: true });

							installUpdate();
							toast.dismiss("update-notification");
						}}
					>
						Restart and Install
					</Button>
				),
				cancel: <DismissButton id="update-notification" />,
				duration: Number.POSITIVE_INFINITY,
			});
		}
	}, [
		updateDownloaded,
		sendNotification.download,
		setSendNotification,
		updateNotifications,
		autoDownloadUpdates,
		path,
		installUpdate,
	]);

	useEffect(() => {
		if (typeof window.updater === "undefined") return;

		window.updater.updateAvailable((_data) => {
			// console.log("updateAvailable", data)
			setUpdateAvailable(true);
		});

		window.updater.updateNotAvailable((_data) => {
			// console.log("updateNotAvailable", data)
			setUpdateAvailable(false);
		});

		window.updater.updateDownloaded((_data) => {
			// console.log("updateDownloaded", data)
			setUpdateDownloaded(true);
			setIsDownloadPending(false);
			// setIsDownloading(false)
		});

		window.updater.updateDownloading((data) => {
			// console.log("updateDownloading", data)
			setDownloadingProgress(data);
			setIsDownloading(true);
			setIsDownloadPending(false);
		});

		return () => {
			window.context.removeAllListeners("update-not-available");
			window.context.removeAllListeners("update-available");
			window.context.removeAllListeners("update-downloaded");
			window.context.removeAllListeners("checking-for-update");
			window.context.removeAllListeners("update-downloading");
			window.context.removeAllListeners("error");
		};
	}, [setUpdateAvailable, setDownloadingProgress, setUpdateDownloaded, setIsDownloading, setIsDownloadPending]);

	useEffect(() => {
		if (autoCheckUpdates) checkForUpdates();
		if (!autoCheckUpdates) setVersion();
	}, [checkForUpdates, autoCheckUpdates, setVersion]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (autoDownloadUpdates && updateAvailable) {
			setIsDownloadPending(true);
			downloadUpdate();
		}
	}, [autoDownloadUpdates, downloadUpdate, updateAvailable]);

	// window.updater.checkForUpdates().then((result) => {
	//     console.log("result", result)
	// })

	return null;
};

export default Updater;

if (process.env.NODE_ENV === "development") {
	mountStoreDevtool("Updater Store", useUpdaterStore);
}
