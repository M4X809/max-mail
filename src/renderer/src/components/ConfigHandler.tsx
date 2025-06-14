/*
 * File: ConfigHandler.tsx
 * Project: note-mark
 * File Created: 21.08.2024, 12:08:53
 *
 * Last Modified: 03.09.2024, 09:09:12
 * Modified By: MAX809
 */

import { useEffect } from "react";
import { useConfigStore } from "@renderer/stores/configStore";

const ConfigHandler = () => {
	const setUpdateConfig = useConfigStore((state) => state.setUpdateConfig);
	const refreshUpdateConfig = useConfigStore((state) => state.refreshUpdateConfig);

	const setWindowConfig = useConfigStore((state) => state.setWindowConfig);
	const refreshWindowConfig = useConfigStore((state) => state.refreshWindowConfig);

	const setDevConfig = useConfigStore((state) => state.setDevConfig);
	const refreshDevConfig = useConfigStore((state) => state.refreshDevConfig);

	const setAppState = useConfigStore((state) => state.setAppState);
	const refreshAppState = useConfigStore((state) => state.refreshAppState);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (typeof window.config === "undefined") return;

		window.config.updateConfigChanged((data) => {
			// console.log('updateConfigChanged', data)
			setUpdateConfig(data);
		});

		window.config.windowConfigChanged((data) => {
			// console.log('windowConfigChanged', data)
			setWindowConfig(data);
		});

		window.config.devConfigChanged((data) => {
			// console.log('devConfigChanged', data)
			setDevConfig(data);
		});

		window.config.appStateChanged((data) => {
			// console.log('appStateChanged', data)
			setAppState(data);
		});

		window.updater.debug((data) => {
			console.info("debug", data);
		});

		refreshUpdateConfig();
		refreshWindowConfig();
		refreshDevConfig();
		refreshAppState();

		return () => {
			window.context.removeAllListeners("update-config-changed");
			window.context.removeAllListeners("editor-config-changed");
			window.context.removeAllListeners("window-config-changed");
			window.context.removeAllListeners("dev-config-changed");
			window.context.removeAllListeners("app-state-changed");
			window.context.removeAllListeners("debug");
		};
	}, []);

	return null;
};

export default ConfigHandler;
