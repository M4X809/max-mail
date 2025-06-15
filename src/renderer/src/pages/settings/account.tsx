import { Card, Stack, Title, Button } from "@mantine/core";
import { DismissButton } from "@renderer/components/Toaster";
import { toast } from "sonner";

export default function AccountSettingsPage() {
	return (
		<Stack>
			<NotificationDebugging />
		</Stack>
	);
}

export function NotificationDebugging() {
	return (
		<Card>
			<Stack gap={15}>
				<Title order={4}>Notification Debugging</Title>
				<Button
					onClick={() => {
						toast.success("Test Notification", {
							id: "test-notification-success",
							description: "This is a test notification",
							duration: Number.POSITIVE_INFINITY,
							cancel: <DismissButton id="test-notification-success" />,
						});

						toast.error("Test Notification", {
							id: "test-notification-error",
							description: "This is a test notification",
							duration: Number.POSITIVE_INFINITY,
							cancel: <DismissButton id="test-notification-error" />,
						});

						toast.warning("Test Notification", {
							id: "test-notification-warning",
							description: "This is a test notification",
							duration: Number.POSITIVE_INFINITY,
							cancel: <DismissButton id="test-notification-warning" />,
						});
						toast.loading("Test Notification", {
							id: "test-notification-loading",
							description: "This is a test notification",
							duration: Number.POSITIVE_INFINITY,
							cancel: <DismissButton id="test-notification-loading" />,
						});
						toast.info("Test Notification", {
							id: "test-notification-info",
							description: "This is a test notification",
							duration: Number.POSITIVE_INFINITY,
							cancel: <DismissButton id="test-notification-info" />,
						});
					}}
				>
					Send Test Notification
				</Button>
			</Stack>
		</Card>
	);
}
