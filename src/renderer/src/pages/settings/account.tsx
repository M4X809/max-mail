import { faPlus, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Card,
	Stack,
	Title,
	Button,
	Box,
	Text,
	Group,
	TextInput,
	UnstyledButton,
	PasswordInput,
	Pill,
	ColorSwatch,
	ActionIcon,
} from "@mantine/core";
import { DismissButton } from "@renderer/components/Toaster";
import { Form, useForm } from "@mantine/form";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { MailCredentials } from "@shared/types";
import { twMerge } from "tailwind-merge";

export default function AccountSettingsPage() {
	const form = useForm({
		initialValues: {
			host: "",
			port: 993,
			username: "",
			password: "",
		},
	});

	const {
		data: accounts,
		isLoading: isLoadingAccounts,
		isError: isErrorAccounts,
		error: errorAccounts,
		refetch: refetchAccounts,
	} = useQuery({
		queryKey: ["accounts"],
		queryFn: async () => await window.context.mail.getAccounts(),
	});

	const {
		mutate: createAccount,
		isPending: isPendingCreateAccount,
		isSuccess: isSuccessCreateAccount,
		error: errorCreateAccount,
	} = useMutation({
		mutationFn: async (account: MailCredentials) => await window.context.account.setCredentials(account),
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: () => {
			refetchAccounts();
		},
	});

	const { mutate: deleteAccount, isPending: isPendingDeleteAccount } = useMutation({
		mutationFn: async (account: string) => await window.context.account.deleteCredentials(account),
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: () => {
			refetchAccounts();
		},
	});

	const { mutate: updateAccount } = useMutation({
		mutationFn: async (account: Partial<MailCredentials>) => await window.context.account.updateCredentials(account),
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: () => {
			refetchAccounts();
		},
	});

	const [selectedAccount, setSelectedAccount] = useState<Omit<MailCredentials, "password"> | null>(null);
	console.log("🚀 ~ account.tsx:19 ~ AccountSettingsPage ~ errorAccounts:", errorAccounts);
	console.log("🚀 ~ account.tsx:14 ~ AccountSettingsPage ~ isErrorAccounts:", isErrorAccounts);

	return (
		<main>
			<Stack>
				<Title order={4}>Email Accounts</Title>

				<Box className="grid grid-cols-8 gap-4">
					<Box className="col-span-2">
						<Stack gap={10}>
							<Card
								className="h-6 w-full cursor-pointer rounded-sm px-2 py-0"
								component={"button"}
								onClick={() => {
									setSelectedAccount(null);
									form.setValues({
										host: "",
										port: 993,
										username: "",
										password: "",
									});
								}}
							>
								<Group justify="center">
									<Text>New Account</Text>
									<FontAwesomeIcon icon={faPlus} />
								</Group>
							</Card>
							{accounts?.map((account) => (
								<Card
									key={account.username}
									className={twMerge(
										"h-6 w-full cursor-pointer rounded-sm px-2 py-0",

										selectedAccount?.username === account.username && "bg-white/20",
									)}
									component={"button"}
									onClick={() => {
										setSelectedAccount(account);
										form.setValues({
											host: account.host,
											port: account.port,
											username: account.username,
											password: "",
										});
									}}
								>
									<Group justify="space-between" className="w-full">
										<Text>{account.username}</Text>
										<ColorSwatch color={account.connected ? "lime" : "red"} size={10} />
									</Group>
								</Card>
							))}
							{isLoadingAccounts && <Text>Loading...</Text>}
						</Stack>
					</Box>
					<Box className="relative col-span-6">
						<ActionIcon
							variant="light"
							color="red"
							loading={isPendingDeleteAccount}
							className={twMerge(
								"absolute -top-5 right-0 transition-all duration-300",
								selectedAccount && "opacity-100",
								!selectedAccount && "opacity-0",
							)}
							onClick={() => {
								if (selectedAccount) {
									deleteAccount(selectedAccount.username);
								}
							}}
						>
							<FontAwesomeIcon icon={faTrash} />
						</ActionIcon>
						<Form
							form={form}
							onSubmit={(values) => {
								if (selectedAccount) {
									updateAccount({ ...values, password: values.password === "" ? undefined : values.password });
								} else {
									createAccount(form.values);
								}
							}}
						>
							<Stack gap={10}>
								<Box className="grid grid-cols-6 gap-4">
									<TextInput className="col-span-4" label="Host" {...form.getInputProps("host")} />
									<TextInput className="col-span-2" label="Port" {...form.getInputProps("port")} />
								</Box>
								<Box className="grid grid-cols-2 items-end gap-4">
									<TextInput label="Username / Email" {...form.getInputProps("username")} />
									<PasswordInput
										description={selectedAccount ? <Text>Password is not shown again</Text> : null}
										label="Password"
										{...form.getInputProps("password")}
									/>
								</Box>
								<Button type="submit" loading={isPendingCreateAccount}>
									{selectedAccount ? "Update" : "Create"}
								</Button>
							</Stack>
						</Form>
					</Box>
				</Box>
			</Stack>
		</main>
	);

	// return (
	// 	<Stack>
	// 		{/* <NotificationDebugging /> */}
	// 	</Stack>
	// );
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
