"use client";

import {
	faArrowsRotate,
	faBadgeCheck,
	faExclamationTriangle,
	faInfoCircle,
	faX,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon } from "@mantine/core";
import { motion } from "motion/react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme={"dark"}
			className="toaster group"
			toastOptions={{
				classNames: {
					title: "text-lg ",
					toast:
						"group toast group-[.toaster]:bg-[rgba(1,1,1,0.35)] group-[.toaster]:backdrop-blur-xl group-[.toaster]:border-none relative ",
					actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					error: "!text-red-100 !bg-red-800/50 !border-red-800/50",
					success: "!text-green-100 !bg-green-800/50 !border-green-800/50",
					warning: "!text-yellow-100 !bg-yellow-800/50 !border-yellow-800/50",
					info: "!text-violet-100 !bg-violet-500/10 !border-white/10",
					loading: "!text-blue-100 !bg-blue-600/10 !border-blue-600/10",
					icon: "data-[icon]:size-5 place-self-center place-items-center justify-center align-middle",
					description: "text-sm text-gray-400",
					cancelButton: " absolute top-4 right-4 ",
				},
			}}
			icons={{
				success: <FontAwesomeIcon icon={faBadgeCheck} size="xl" className="w-fit" />,
				info: <FontAwesomeIcon icon={faInfoCircle} size="xl" className="w-fit" />,
				warning: <FontAwesomeIcon icon={faExclamationTriangle} size="xl" className="w-fit" />,
				error: (
					<motion.div
						animate={{
							y: ["0%", "-4%", "0%"],
							rotate: ["5deg", "-5deg", "5deg", "-5deg", "5deg"],
						}}
						transition={{
							duration: 2,
							ease: "easeInOut",
							repeat: Number.POSITIVE_INFINITY,
						}}
					>
						<FontAwesomeIcon icon={faExclamationTriangle} size="xl" className="w-fit" />
					</motion.div>
				),
				loading: (
					<motion.div
						animate={{
							y: ["0%", "-2%", "0%"],
							rotate: ["2deg", "-2deg", "2deg", "-2deg", "2deg"],
						}}
					>
						<FontAwesomeIcon icon={faArrowsRotate} spin size="xl" className="w-fit" />
					</motion.div>
				),
			}}
			{...props}
			closeButton={false}
			richColors
		/>
	);
};

const DismissButton = ({ id }: { id: string }) => {
	return (
		<ActionIcon
			id={id}
			variant="transparent"
			className="!absolute !top-2 !right-2 justify-center !text-inherit transition-colors duration-300 hover:text-[red]"
			onClick={() => toast.dismiss(id)}
		>
			<FontAwesomeIcon
				icon={faX}
				fixedWidth
				swapOpacity
				className="!text-inherit transition-colors duration-300 hover:text-[red]"
			/>
		</ActionIcon>
	);
};

export { Toaster, DismissButton };
