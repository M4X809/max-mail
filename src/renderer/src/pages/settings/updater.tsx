import {
	Button,
	Container,
	Grid,
	Group,
	NumberInput,
	type NumberInputHandlers,
	Progress,
	Stack,
	Switch,
	Text,
	Title,
} from "@mantine/core";
import { useUpdaterStore } from "@renderer/components/Updater";
import { useConfigStore } from "@renderer/stores/configStore";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function SettingsUpdatePage() {
	const info = useUpdaterStore((state) => state.versionInfo);
	const updateAvailable = useUpdaterStore((state) => state.updateAvailable);
	const checkingForUpdates = useUpdaterStore((state) => state.checkingForUpdates);
	const updateDownloaded = useUpdaterStore((state) => state.updateDownloaded);

	const downloadingProgress = useUpdaterStore((state) => state.downloadingProgress);

	const checkForUpdates = useUpdaterStore((state) => state.checkForUpdates);
	const downloadUpdate = useUpdaterStore((state) => state.downloadUpdate);
	const installUpdate = useUpdaterStore((state) => state.installUpdate);

	const isDownloading = useUpdaterStore((state) => state.isDownloading);
	const isDownloadPending = useUpdaterStore((state) => state.isDownloadPending);
	const setIsDownloadPending = useUpdaterStore((state) => state.setIsDownloadPending);

	const autoCheckUpdates = useConfigStore((state) => state.updateConfig?.autoCheckUpdates ?? null);
	const autoDownloadUpdates = useConfigStore((state) => state.updateConfig?.autoDownloadUpdates ?? null);
	const updateNotifications = useConfigStore((state) => state.updateConfig?.updateNotifications ?? null);
	const autoCheckInterval = useConfigStore((state) => state.updateConfig?.autoCheckInterval ?? null);

	// const changelog = useConfigStore((state) => state.changelog);

	const showChangelogAfterUpdate = useConfigStore((state) => state.updateConfig?.showChangelogAfterUpdate ?? null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only on mount
	useEffect(() => {
		if (!updateAvailable && autoCheckUpdates) {
			checkForUpdates();
		}
		toast.dismiss();
	}, []);

	const handlersRef = useRef<NumberInputHandlers>(null);

	if (!info) return null;

	const disableSettings = isDownloading || isDownloadPending || checkingForUpdates;

	return (
		<>
			<Container size={"lg"} pt={15} className="mx-auto max-w-screen-lg">
				<Title>Update Center</Title>

				{!!info && (
					<Grid p={15} columns={10}>
						<Grid.Col span={4} h={25} className="text-nowrap">
							<Text>Current Version</Text>
						</Grid.Col>
						<Grid.Col span={6} h={25} className="text-nowrap">
							<Group fz={12}>
								<Text>v{info.version?.version}</Text>
								{updateAvailable && (
									<>
										<Text ta={"end"} c={"dimmed"} fw={800} fz={12}>
											Update Available: v{info.result?.updateInfo.version}
										</Text>
										{/* <Text c={"dimmed"} fw={800} fz={12}>
                                {formatDate(info.result?.updateInfo.releaseDate ? new Date(info.result.updateInfo.releaseDate) : new Date())}
								</Text> */}
									</>
								)}
								{!updateAvailable && !!info.result && (
									<>
										<Text ta={"end"} c={"dimmed"} fw={800} fz={12}>
											No Update Available
										</Text>
										{/* <Text c={"dimmed"} fw={800} fz={12}>
                                {formatDate(info.result?.updateInfo.releaseDate ? new Date(info.result.updateInfo.releaseDate) : new Date())}
								</Text> */}
									</>
								)}
							</Group>
						</Grid.Col>

						<Grid.Col span={4} hidden={updateAvailable} h={25}>
							<Button loading={checkingForUpdates} size="compact-xs" onClick={checkForUpdates}>
								Check for Updates
							</Button>
						</Grid.Col>
						<Grid.Col span={4} hidden={!updateAvailable || updateDownloaded || isDownloading} h={25}>
							<Button
								variant="gradient"
								gradient={{ from: "orange", to: "yellow", deg: 0 }}
								loading={isDownloadPending}
								size="compact-xs"
								onClick={() => {
									setIsDownloadPending(true);
									downloadUpdate();
								}}
							>
								Download update
							</Button>
							{isDownloadPending || isDownloading ? (
								<Text fz={12} c={"dimmed"}>
									Downloading...
								</Text>
							) : null}
						</Grid.Col>
						<Grid.Col span={4} hidden={!updateAvailable || !updateDownloaded} h={25}>
							<Button
								variant="gradient"
								gradient={{ from: "blue", to: "green", deg: 0 }}
								size="compact-xs"
								onClick={installUpdate}
							>
								Restart and Install
								<Text c={"dimmed"} fz={12} />
							</Button>
						</Grid.Col>
						<Grid.Col span={8} hidden={!isDownloading || isDownloadPending || updateDownloaded} h={25}>
							<Stack>
								<Text fz={12} c={"dimmed"}>
									Downloading...
								</Text>
								<Progress
									value={downloadingProgress?.percent || 0}
									size={"xs"}
									color={"blue"}
									transitionDuration={300}
									animated
								/>
							</Stack>
						</Grid.Col>
					</Grid>
				)}

				<Group mt={25} p={15}>
					<Stack>
						<Switch
							disabled={disableSettings}
							label="Auto Check Updates"
							checked={autoCheckUpdates ?? false}
							onChange={(event) => {
								const value = event.currentTarget.checked;
								window.store.set("updateConfig.autoCheckUpdates", value);
							}}
						/>
						<Switch
							label="Update Notifications"
							checked={updateNotifications ?? false}
							onChange={(event) => {
								const value = event.currentTarget.checked;
								window.store.set("updateConfig.updateNotifications", value);
							}}
							disabled={!autoCheckUpdates || disableSettings}
						/>
						<Switch
							// // TODO: Fix Auto Updating
							disabled={disableSettings}
							label="Auto Download Updates"
							// description="Disabled until auto-downloading is fixed."
							checked={autoDownloadUpdates ?? false}
							onChange={(event) => {
								const value = event.currentTarget.checked;
								window.store.set("updateConfig.autoDownloadUpdates", value);
							}}
						/>
						<NumberInput
							description="Use arrow keys to increase or decrease the value."
							label="Auto Check Updates every X minutes"
							disabled={!autoCheckUpdates}
							tabIndex={-1}
							// onFocus={(e) => e.preventDefault()}
							handlersRef={handlersRef}
							stepHoldDelay={500}
							stepHoldInterval={100}
							value={autoCheckInterval ?? 10}
							min={10}
							max={60}
							allowNegative={false}
							allowLeadingZeros={false}
							allowDecimal={false}
							isAllowed={(value) => Number.isInteger(value)}
							// @ts-ignore
							onChange={(value) => {
								if (typeof value !== "number") return window.store.set("updateConfig.autoCheckInterval", 3);
								if (value < 10) return window.store.set("updateConfig.autoCheckInterval", 10);
								if (value > 60) return window.store.set("updateConfig.autoCheckInterval", 60);

								window.store.set("updateConfig.autoCheckInterval", value);
							}}
							// readOnly
							inputMode="numeric"
						/>

						<Switch
							label="Show Changelog After Update"
							checked={showChangelogAfterUpdate ?? false}
							onChange={(event) => {
								const value = event.currentTarget.checked;
								window.store.set("updateConfig.showChangelogAfterUpdate", value);
							}}
						/>
					</Stack>
				</Group>
			</Container>
		</>
	);
}
