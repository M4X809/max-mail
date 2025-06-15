// "use client";
// import {
// 	ActionIcon,
// 	Autocomplete,
// 	Button,
// 	Card,
// 	ColorInput,
// 	Input,
// 	Menu,
// 	Modal,
// 	MultiSelect,
// 	NumberInput,
// 	Pill,
// 	Select,
// 	Switch,
// 	TagsInput,
// 	Tooltip,
// 	TooltipFloating,
// 	type MantineThemeOverride,
// } from "@mantine/core";
// import { DateInput, DatePicker, TimeInput } from "@mantine/dates";
// import "dayjs/locale/de";

// export const theme: MantineThemeOverride = {
// 	focusRing: "never",
// 	fontFamily: "Nunito, sans-serif",
// 	fontFamilyMonospace: "Roboto Mono, Courier, monospace",
// 	headings: {
// 		fontFamily: "Nunito, sans-serif",
// 	},
// 	focusClassName: "focus-auto",
// 	breakpoints: {
// 		xs: "30em",
// 		sm: "48em",
// 		md: "64em",
// 		lg: "74em",
// 		xl: "90em",
// 	},
// 	components: {
// 		Card: Card.extend({
// 			defaultProps: {
// 				className: "bg-accent/20 backdrop-blur-lg rounded-lg",
// 			},
// 		}),
// 		Pill: Pill.extend({
// 			defaultProps: {
// 				variant: "default",
// 				className: "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.12)] text-white",
// 			},
// 		}),
// 		Button: Button.extend({
// 			defaultProps: {
// 				variant: "light",
// 			},
// 			classNames: {
// 				label: "text-text-color",
// 				root:
// 					"bg-accent/30  data-[disabled=true]:bg-[rgba(0,0,0,0.15)] data-[disabled=true]:backdrop-blur-lg data-[disabled=true]:cursor-not-allowed cursor-pointer ",
// 			},
// 		}),
// 		ActionIcon: ActionIcon.extend({
// 			classNames: {
// 				root:
// 					"data-[disabled=true]:bg-[rgba(0,0,0,0.15)] data-[disabled=true]:backdrop-blur-lg data-[disabled=true]:cursor-not-allowed",
// 			},
// 		}),
// 		Tooltip: Tooltip.extend({
// 			defaultProps: {
// 				// className: " backdrop-blur-xl",
// 				bg: "rgba(255,255,255,0.05)",
// 				bd: "1px solid #404448",
// 				c: "white",
// 			},
// 			classNames: {
// 				tooltip: " backdrop-blur-xl ",
// 			},
// 		}),
// 		TooltipFloating: TooltipFloating.extend({
// 			defaultProps: {
// 				// className: " backdrop-blur-xl",
// 				bg: "rgba(0,0,0,0.35)",
// 				c: "white",
// 			},
// 			classNames: {
// 				tooltip: " backdrop-blur-xl ",
// 			},
// 		}),
// 		Input: Input.extend({
// 			defaultProps: {
// 				styles: {
// 					wrapper: {
// 						background: "transparent",
// 					},
// 					input: {
// 						background: "rgba(255,255,255,0.05)",
// 					},
// 				},
// 			},
// 		}),
// 		NumberInput: NumberInput.extend({
// 			defaultProps: {
// 				styles: {
// 					wrapper: {
// 						background: "transparent",
// 					},
// 					input: {
// 						background: "rgba(255,255,255,0.05)",
// 					},
// 				},
// 			},
// 		}),
// 		TimeInput: TimeInput.extend({
// 			defaultProps: {
// 				styles: {
// 					wrapper: {
// 						background: "transparent",
// 					},
// 					input: {
// 						background: "rgba(255,255,255,0.05)",
// 					},
// 				},
// 			},
// 		}),
// 		DatePicker: DatePicker.extend({
// 			classNames: {
// 				calendarHeader: "bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] text-white",
// 				calendarHeaderControl: "bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] text-white",
// 				day: "data-[selected=true]:bg-[rgba(255,255,255,0.1)] data-[selected=true]:text-white",
// 			},
// 			defaultProps: {
// 				locale: "de",
// 			},
// 			styles: {
// 				day: {
// 					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
// 				},
// 				calendarHeader: {
// 					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
// 				},
// 				calendarHeaderControl: {
// 					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
// 				},
// 			},
// 		}),
// 		DateInput: DateInput.extend({
// 			classNames: {
// 				calendarHeader: "bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] ",
// 				calendarHeaderControl: "bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)]",
// 				day: "data-[selected=true]:bg-[rgba(255,255,255,0.1)] data-[selected=true]:text-white",
// 			},
// 			defaultProps: {
// 				locale: "de",
// 			},
// 			styles: {
// 				day: {
// 					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
// 				},
// 				calendarHeader: {
// 					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
// 				},
// 				calendarHeaderControl: {
// 					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
// 				},
// 			},
// 		}),

// 		Select: Select.extend({
// 			classNames() {
// 				return {
// 					input: "bg-[rgba(255,255,255,0.05)] text-white",
// 					wrapper: "bg-transparent",
// 					dropdown: "backdrop-blur-lg bg-[rgba(0,0,0,0.3)] text-white",
// 					option: "hover:bg-[rgba(255,255,255,0.1)] rounded-md aria-[selected=true]:bg-[rgba(255,255,255,0.09)]",
// 				};
// 			},
// 		}),
// 		MultiSelect: MultiSelect.extend({
// 			classNames() {
// 				return {
// 					input: "bg-[rgba(255,255,255,0.05)] text-white",
// 					wrapper: "bg-transparent",
// 					dropdown: "backdrop-blur-lg bg-transparent text-white",
// 					option: "hover:bg-[rgba(255,255,255,0.1)] rounded-md aria-[selected=true]:bg-[rgba(255,255,255,0.09)]",
// 					pill: "bg-[rgba(255,255,255,0.05)] text-white",
// 					empty: "backdrop-blur-lg  text-white",
// 				};
// 			},
// 		}),
// 		Autocomplete: Autocomplete.extend({
// 			defaultProps: {
// 				classNames: {
// 					input: "bg-[rgba(255,255,255,0.05)] text-white",
// 					wrapper: "bg-transparent",
// 					dropdown: "backdrop-blur-lg bg-[rgba(0,0,0,0.3)] text-white",
// 					option: "hover:bg-[rgba(255,255,255,0.1)] rounded-md aria-[selected=true]:bg-[rgba(255,255,255,0.09)]",
// 				},
// 			},
// 		}),
// 		TagsInput: TagsInput.extend({
// 			defaultProps: {
// 				classNames: {
// 					dropdown: "backdrop-blur-lg bg-[rgba(0,0,0,0.3)] text-white",
// 					input: "bg-[rgba(255,255,255,0.05)] text-white",
// 					wrapper: "bg-transparent",
// 					option: "hover:bg-[rgba(255,255,255,0.1)] rounded-md aria-[selected=true]:bg-[rgba(255,255,255,0.09)]",
// 					pill: "bg-[rgba(255,255,255,0.05)] text-white",
// 					empty: "backdrop-blur-lg  text-white",
// 				},
// 			},
// 		}),
// 		Menu: Menu.extend({
// 			classNames: {
// 				dropdown: "backdrop-blur-xl bg-[rgba(255,255,255,0.1)] text-white rounded-lg",
// 				item:
// 					"hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-300  rounded-md data-[disabled=true]:opacity-100 data-[disabled=true]:hover:bg-red-500 data-[disabled=true]:cursor-not-allowed",
// 			},
// 		}),
// 		ColorInput: ColorInput.extend({
// 			classNames: {
// 				dropdown: "backdrop-blur-lg bg-[rgba(0,0,0,0.1)] text-white",
// 				input: "bg-[rgba(255,255,255,0.05)] text-white",
// 				wrapper: "bg-transparent",
// 			},
// 		}),
// 		Modal: Modal.extend({
// 			defaultProps: {
// 				withCloseButton: false,
// 				transitionProps: {
// 					transition: "pop",
// 					duration: 300,
// 					timingFunction: "ease",
// 				},
// 				classNames: {
// 					content: "bg-[rgb(255,255,255,0.1)] rounded-lg backdrop-blur-md",
// 					body: "text-white",
// 				},
// 			},
// 		}),
// 		Switch: Switch.extend({
// 			defaultProps: {
// 				withThumbIndicator: false,
// 			},
// 		}),
// 	},
// };

"use client";
import {
	ActionIcon,
	Autocomplete,
	Button,
	Card,
	ColorInput,
	Input,
	Menu,
	Modal,
	MultiSelect,
	NumberInput,
	Pill,
	Select,
	Switch,
	TagsInput,
	Tooltip,
	TooltipFloating,
	type MantineThemeOverride,
} from "@mantine/core";
import { DateInput, DatePicker, TimeInput } from "@mantine/dates";
import "dayjs/locale/de";
import { twMerge } from "tailwind-merge";

export const theme: MantineThemeOverride = {
	focusRing: "never",
	fontFamily: "var(--font-nunito)",
	components: {
		Card: Card.extend({
			defaultProps: {
				className: "bg-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-xl",
			},
			classNames(_, props) {
				return {
					root: twMerge("bg-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-xl", props.className),
				};
			},
		}),
		Pill: Pill.extend({
			defaultProps: {
				variant: "default",
				className: "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.12)] text-white",
			},
			// classNames: {
			// 	root: "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.12)] text-white",
			// },
			classNames(_, props) {
				return {
					root: twMerge("bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.12)] text-white", props.className),
				};
			},
		}),
		Button: Button.extend({
			defaultProps: {
				variant: "light",
				color: "gray.2",
			},
			classNames: {
				root:
					"data-[disabled=true]:bg-[rgba(0,0,0,0.15)] data-[disabled=true]:backdrop-blur-lg data-[disabled=true]:cursor-not-allowed",
			},
		}),
		ActionIcon: ActionIcon.extend({
			classNames: {
				root:
					"data-[disabled=true]:bg-[rgba(0,0,0,0.15)] data-[disabled=true]:backdrop-blur-lg data-[disabled=true]:cursor-not-allowed",
			},
		}),
		Tooltip: Tooltip.extend({
			defaultProps: {
				bg: "rgba(255,255,255,0.05)",
				bd: "1px solid #404448",
				c: "white",
			},
			classNames: {
				tooltip: " backdrop-blur-xl ",
			},
		}),
		TooltipFloating: TooltipFloating.extend({
			defaultProps: {
				className: " backdrop-blur-xl",
				bg: "rgba(0,0,0,0.35)",
				c: "white",
			},
			classNames: {
				tooltip: " backdrop-blur-xl ",
			},
		}),
		Input: Input.extend({
			defaultProps: {
				styles: {
					wrapper: {
						background: "transparent",
					},
					input: {
						background: "rgba(255,255,255,0.05)",
					},
				},
			},
		}),
		NumberInput: NumberInput.extend({
			defaultProps: {
				styles: {
					wrapper: {
						background: "transparent",
					},
					input: {
						background: "rgba(255,255,255,0.05)",
					},
				},
			},
		}),
		TimeInput: TimeInput.extend({
			defaultProps: {
				styles: {
					wrapper: {
						background: "transparent",
					},
					input: {
						background: "rgba(255,255,255,0.05)",
					},
				},
			},
		}),
		DatePicker: DatePicker.extend({
			classNames: {
				calendarHeader: "bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] text-white",
				calendarHeaderControl: "bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] text-white",
				day: "data-[selected=true]:bg-[rgba(255,255,255,0.1)] data-[selected=true]:text-white",
			},
			defaultProps: {
				locale: "de",
			},
			styles: {
				day: {
					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
				},
				calendarHeader: {
					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
				},
				calendarHeaderControl: {
					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
				},
			},
		}),
		DateInput: DateInput.extend({
			classNames: {
				calendarHeader: "bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] ",
				calendarHeaderControl: "bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)]",
				day: "data-[selected=true]:bg-[rgba(255,255,255,0.1)] data-[selected=true]:text-white",
			},
			defaultProps: {
				locale: "de",
			},
			styles: {
				day: {
					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
				},
				calendarHeader: {
					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
				},
				calendarHeaderControl: {
					"--mantine-color-dark-5": "rgba(255,255,255,0.1)",
				},
			},
		}),

		Select: Select.extend({
			classNames() {
				return {
					input: "bg-[rgba(255,255,255,0.05)] text-white",
					wrapper: "bg-transparent",
					dropdown: "backdrop-blur-lg bg-[rgba(0,0,0,0.3)] text-white",
					option: "hover:bg-[rgba(255,255,255,0.1)] rounded-md aria-[selected=true]:bg-[rgba(255,255,255,0.09)]",
				};
			},
		}),
		MultiSelect: MultiSelect.extend({
			classNames() {
				return {
					input: "bg-[rgba(255,255,255,0.05)] text-white",
					wrapper: "bg-transparent",
					dropdown: "backdrop-blur-lg bg-transparent text-white",
					option: "hover:bg-[rgba(255,255,255,0.1)] rounded-md aria-[selected=true]:bg-[rgba(255,255,255,0.09)]",
					pill: "bg-[rgba(255,255,255,0.05)] text-white",
					empty: "backdrop-blur-lg  text-white",
				};
			},
		}),
		Autocomplete: Autocomplete.extend({
			defaultProps: {
				classNames: {
					input: "bg-[rgba(255,255,255,0.05)] text-white",
					wrapper: "bg-transparent",
					dropdown: "backdrop-blur-lg bg-[rgba(0,0,0,0.3)] text-white",
					option: "hover:bg-[rgba(255,255,255,0.1)] rounded-md aria-[selected=true]:bg-[rgba(255,255,255,0.09)]",
				},
			},
		}),
		TagsInput: TagsInput.extend({
			defaultProps: {
				classNames: {
					dropdown: "backdrop-blur-lg bg-[rgba(0,0,0,0.3)] text-white",
					input: "bg-[rgba(255,255,255,0.05)] text-white",
					wrapper: "bg-transparent",
					option: "hover:bg-[rgba(255,255,255,0.1)] rounded-md aria-[selected=true]:bg-[rgba(255,255,255,0.09)]",
					pill: "bg-[rgba(255,255,255,0.05)] text-white",
					empty: "backdrop-blur-lg  text-white",
				},
			},
		}),
		Menu: Menu.extend({
			classNames: {
				dropdown: "backdrop-blur-xl bg-[rgba(255,255,255,0.1)] text-white rounded-lg",
				item:
					"hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-300  rounded-md data-[disabled=true]:opacity-100 data-[disabled=true]:hover:bg-red-500 data-[disabled=true]:cursor-not-allowed",
			},
		}),
		ColorInput: ColorInput.extend({
			classNames: {
				dropdown: "backdrop-blur-lg bg-[rgba(0,0,0,0.1)] text-white",
				input: "bg-[rgba(255,255,255,0.05)] text-white",
				wrapper: "bg-transparent",
			},
		}),
		Modal: Modal.extend({
			defaultProps: {
				withCloseButton: false,
				transitionProps: {
					transition: "pop",
					duration: 300,
					timingFunction: "ease",
				},
				classNames: {
					content: "bg-[rgba(255,255,255,0.1)] rounded-lg backdrop-blur-md",
					body: "text-white",
				},
			},
		}),
		Switch: Switch.extend({
			classNames() {
				return {
					root: "group",
					track: twMerge(
						"transition-colors duration-200 ease-in-out group-data-[checked=true]:bg-white/10 bg-black/10 group-data-[checked=true]:border-white/20",
					),
					thumb: "transition-all duration-200 ease-in-out ",
				};
			},
			defaultProps: {
				withThumbIndicator: false,
				styles: {
					track: {
						"--switch-bd": "#474747",
					},
				},
			},
		}),
	},
};
