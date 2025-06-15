// import "@mantine/core/styles.css";
// import "@mantine/code-highlight/styles.css";
// import "@mdxeditor/editor/style.css";
// import "@mantine/dropzone/styles.css";
// import "@mantine/spotlight/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ModalsProvider } from "@mantine/modals";

import type { JSX } from "react";

// import classes from "./App.module.css";
import SettingsView from "./layouts/settingsView";
import ConfigHandler from "./components/ConfigHandler";
import MailView from "./layouts/mailView";
import AppView from "./layouts/appView";
import AccountSettingsPage from "./pages/settings/accout";
import SettingsUpdatePage from "./pages/settings/updater";
import Updater from "./components/Updater";
import { theme } from "./theme";
import { Toaster } from "./components/Toaster";

const App = (): JSX.Element => {
	// useEffect(() => {
	// 	if (autoCheckUpdates) startUpdateInterval();
	// 	setIdle(idleState);
	// 	setInterval(!idleState);
	// }, [idleState, setIdle, setInterval, autoCheckUpdates, startUpdateInterval]);

	// useEffect(() => {
	// 	if (hasUpdated && showChangelogAfterUpdate && !downloaded) {
	// 		window.store.set("appState.hasUpdated", false);
	// 		navigate("/settings/update", { replace: true });
	// 	}
	// }, [hasUpdated, showChangelogAfterUpdate, navigate, downloaded]);
	const pathname = useLocation();
	console.log("🚀 ~ appLayout.tsx:9 ~ AppLayout ~ pathname:", pathname);
	return (
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
	);
};

export default App;
