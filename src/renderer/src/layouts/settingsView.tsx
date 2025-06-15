import { faInbox, faCalendarAlt, faCog, faUser, faMailbox, faArrowLeft } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Group, Stack } from "@mantine/core";
import { MainHeader } from "@renderer/components/MainHeader";
import { useConfigStore } from "@renderer/stores/configStore";
import { Link, Outlet, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const tabs = [
	{
		icon: faUser,
		label: "Accounts",
		path: "/settings/accounts",
	},
	{
		icon: faCog,
		label: "Update",
		path: "/settings/update",
	},
];

export default function SettingsView() {
	const location = useLocation();
	return (
		<Box className="flex h-full grow flex-col">
			<MainHeader />
			<Group className="h-full" align="stretch">
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
							to="/mails"
						>
							<FontAwesomeIcon fixedWidth icon={faArrowLeft} size="lg" />
						</Box>
					</Stack>
				</Box>
				<Box className="h-full">
					<Outlet />
				</Box>
			</Group>
		</Box>
	);
}
