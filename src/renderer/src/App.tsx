import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import "@mdxeditor/editor/style.css";
import "@mantine/dropzone/styles.css";
import "@mantine/spotlight/styles.css";
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

const theme = createTheme({
	fontFamily: "Roboto Mono, sans-serif",
	fontFamilyMonospace: "Roboto Mono, Courier, monospace",
	headings: {
		fontFamily: "Roboto Mono, sans-serif",
	},
	focusClassName: "focus-auto",
});

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
				<Routes>
					<Route path="/settings/*" element={<SettingsView />}>
						<Route path="accounts" element={<AccountSettingsPage />} />
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
