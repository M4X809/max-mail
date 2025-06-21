import { Stack } from "@mantine/core";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

export default function MainView() {
	const [width, setWidth] = useLocalStorage({
		key: "mail-sidebar-width",
		defaultValue: {
			accounts: 250,
			inbox: 250,
		},
	});

	const onResizeAccounts = (_e: any, { size }: { size: { width: number } }) => {
		setWidth((prev) => ({ ...prev, accounts: size.width }));
	};

	const onResizeInbox = (_e: any, { size }: { size: { width: number } }) => {
		setWidth((prev) => ({ ...prev, inbox: size.width }));
	};

	const { data: accounts } = useQuery({
		queryKey: ["accounts"],
		queryFn: () => window.context.mail.getAccounts(),
	});

	const { data: inboxes } = useQuery({
		queryKey: ["inboxes"],
		queryFn: async ({ queryKey }) => {
			const [_, username] = queryKey;
			if (username) {
				return await window.context.mail.getInboxes(username);
			}
			return [];
		},
		enabled: !!accounts?.length,
	});

	return (
		<main className="bg-transparent">
			<div className="flex h-full">
				<Resizable
					width={width.accounts}
					height={0}
					onResize={onResizeAccounts}
					draggableOpts={{ enableUserSelectHack: true }}
					minConstraints={[150, 0]}
					maxConstraints={[250, 0]}
					handle={
						<div className="absolute top-0 right-0 h-full w-3 cursor-col-resize">
							<span className="absolute top-0 right-1/2 h-full w-[1px] translate-x-1/2 bg-gray-600 hover:bg-gray-400" />
						</div>
					}
				>
					<div style={{ width: `${width.accounts}px` }} className="h-full">
						<Stack className="h-full">{/* Your stack content here */}</Stack>
					</div>
				</Resizable>
				<Resizable
					width={width.inbox}
					height={0}
					onResize={onResizeInbox}
					draggableOpts={{ enableUserSelectHack: true }}
					minConstraints={[200, 0]}
					maxConstraints={[300, 0]}
					handle={
						<div className="absolute top-0 right-0 h-full w-3 cursor-col-resize">
							<span className="absolute top-0 right-1/2 h-full w-[1px] translate-x-1/2 bg-gray-600 hover:bg-gray-400" />
						</div>
					}
				>
					<div style={{ width: `${width.inbox}px` }} className="h-full">
						<Stack className="h-full">{/* Inbox content here */}</Stack>
					</div>
				</Resizable>
				<div className="flex-1">
					<Outlet />
				</div>
			</div>
		</main>
	);
}
