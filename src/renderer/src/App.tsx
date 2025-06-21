import { MantineProvider } from "@mantine/core";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useEffect, type JSX } from "react";

import SettingsView from "./layouts/settingsView";
import ConfigHandler from "./components/ConfigHandler";
import MailView from "./layouts/mailView";
import AppView from "./layouts/appView";
import AccountSettingsPage from "./pages/settings/account";
import SettingsUpdatePage from "./pages/settings/updater";
import Updater, { useUpdaterStore } from "./components/Updater";
import { theme } from "./theme";
import { Toaster } from "./components/Toaster";
import { useConfigStore } from "@renderer/stores/configStore";
import { useIdle, useInterval } from "@mantine/hooks";
import { useAppStore } from "@renderer/stores/appStore";

const queryClient = new QueryClient();

const App = (): JSX.Element => {
	const navigate = useNavigate();

	const setIdle = useAppStore((state) => state.setIdle);
	const setInterval = useAppStore((state) => state.setInterval);

	const autoCheckUpdates = useConfigStore((state) => state.updateConfig?.autoCheckUpdates ?? null);
	const autoCheckInterval = useConfigStore((state) => state.updateConfig?.autoCheckInterval ?? 10);
	const checkForUpdates = useUpdaterStore((state) => state.checkForUpdates);

	const hasUpdated = useConfigStore((state) => state.appState?.hasUpdated ?? false);
	const showChangelogAfterUpdate = useConfigStore((state) => state.updateConfig?.showChangelogAfterUpdate ?? null);
	const downloaded = useUpdaterStore((state) => state.updateDownloaded);

	const { start: startUpdateInterval } = useInterval(
		() => {
			// refreshNotes(notesFilter);
			if (autoCheckUpdates) checkForUpdates();
			console.log("checkForUpdates", autoCheckUpdates);
		},
		1000 * 60 * autoCheckInterval,
		{ autoInvoke: true },
	);

	const idleState = useIdle(1000 * 10, {
		initialState: false,
	});

	useEffect(() => {
		if (autoCheckUpdates) startUpdateInterval();
		setIdle(idleState);
		setInterval(!idleState);
	}, [idleState, setIdle, setInterval, autoCheckUpdates, startUpdateInterval]);

	useEffect(() => {
		if (hasUpdated && showChangelogAfterUpdate && !downloaded) {
			window.store.set("appState.hasUpdated", false);
			navigate("/settings/update", { replace: true });
		}
	}, [hasUpdated, showChangelogAfterUpdate, navigate, downloaded]);

	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme} defaultColorScheme="dark">
				<ModalsProvider>
					<ConfigHandler />
					<Toaster expand visibleToasts={5} richColors />
					<Updater />
					<Routes>
						<Route path="/settings/*" element={<SettingsView />}>
							<Route path="accounts" element={<AccountSettingsPage />} />
							<Route path="update" element={<SettingsUpdatePage />} />
						</Route>
						<Route element={<AppView />}>
							<Route path="/mails" index element={<MailView />} />
							<Route path="/mails/:mailId" index element={<MailView />} />
							<Route path="/calendar" index element={<div>calendar</div>} />
							<Route path="/*" index element={<Navigate to="/mails" replace />} />
						</Route>
					</Routes>
				</ModalsProvider>
			</MantineProvider>
		</QueryClientProvider>
	);
};

export default App;
