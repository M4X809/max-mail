import { faCalendarAlt, faCog, faInbox } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack } from "@mantine/core";
import { MainHeader } from "@renderer/components/MainHeader";
import { Link, Outlet, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const tabs = [
	{
		icon: faInbox,
		label: "Inbox",
		path: "/mails",
	},
	{
		icon: faCalendarAlt,
		label: "Calendar",
		path: "/calendar",
	},
];

export default function AppLayout() {
	const location = useLocation();
	return (
		<Box className="flex h-full grow flex-col">
			<MainHeader />
			<Box className="flex h-full grow flex-row">
				<Box className="border-r-1 border-r-gray-600 bg-white/10">
					<Stack className="p-1" gap={5}>
						{tabs.map((tab) => (
							<Box
								component={Link}
								to={tab.path}
								key={tab.path}
								className={twMerge(
									"flex aspect-square h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-all duration-300",
									location.pathname === tab.path && "bg-white/20",
								)}
							>
								<FontAwesomeIcon fixedWidth icon={tab.icon} size="lg" />
							</Box>
						))}
						<Box
							className="absolute bottom-1 inline-flex aspect-square h-10 w-10 items-center justify-center rounded-xl bg-white/10"
							component={Link}
							to="/settings/accounts"
						>
							<FontAwesomeIcon fixedWidth icon={faCog} size="lg" />
						</Box>
					</Stack>
				</Box>
				<Box className="w-full">
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
