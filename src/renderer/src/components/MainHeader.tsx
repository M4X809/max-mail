import { faWindowMaximize, faWindowMinimize, faWindowRestore, faXmarkLarge } from "@fortawesome/pro-duotone-svg-icons";
import { Box, Center, Group, Text, UnstyledButton } from "@mantine/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAppStore } from "@renderer/stores/appStore";
import { useConfigStore } from "@renderer/stores/configStore";

import pkg from "../../../../package.json";
import { twMerge } from "tailwind-merge";

export const MainHeader = () => {
	const title = useAppStore((state) => state.title);
	const maximized = useConfigStore((state) => state.windowConfig?.maximized ?? false);

	return (
		<Box id="main-header" className="border-b-1 border-b-gray-600 bg-white/10">
			<Box pos={"sticky"} className="border-b-solid items-center border-zinc-600" component="header">
				{/* className='flex flex-nowrap flex-col justify-between w-auto align-middle' */}
				<Group h={25} wrap="nowrap" justify="space-between">
					{/* STETINGS AND TITLE */}

					<Group className="flex w-fit space-x-2 pl-1" gap={0} wrap="nowrap">
						<Center>
							<Text pr={10} ta={"left"} className="self-end" fz={12}>
								MaxMail
							</Text>
							<Text
								ta={"end"}
								fz={11}
								className={twMerge("self-end", process.env.NODE_ENV === "development" ? "text-pink-500" : "text-violet-300")}
							>
								v{pkg.version}
							</Text>
						</Center>
					</Group>

					{/* PATH */}
					<Box className="">
						<Text ta={"center"} fz={12}>
							{/* {JSON.stringify(path)} */}
							{title}
						</Text>
					</Box>

					{/* WINDOW CONTROLS */}
					<Group className="h-full" gap={0} wrap="nowrap">
						<UnstyledButton
							tabIndex={-1}
							component="button"
							className="h-full w-12 justify-center rounded-sm hover:bg-neutral-700/50 hover:text-white"
							onClick={() => window.context.windowMinimize()}
						>
							<Center>
								<FontAwesomeIcon fixedWidth icon={faWindowMinimize} />
							</Center>
						</UnstyledButton>
						<UnstyledButton
							tabIndex={-1}
							className="h-full w-12 justify-center self-center rounded-sm hover:bg-neutral-700/50 hover:text-white"
							onClick={() => {
								window.context.windowToggleSize();
							}}
						>
							<Center>
								<FontAwesomeIcon fixedWidth icon={maximized ? faWindowRestore : faWindowMaximize} />
							</Center>
						</UnstyledButton>
						<UnstyledButton
							tabIndex={-1}
							className="h-full w-12 justify-center rounded-sm hover:bg-neutral-700/50 hover:text-white"
							onClick={() => window.context.windowClose()}
						>
							<Center>
								<FontAwesomeIcon fixedWidth icon={faXmarkLarge} />
							</Center>
						</UnstyledButton>
					</Group>
				</Group>
			</Box>
		</Box>
	);
};
