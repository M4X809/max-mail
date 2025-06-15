const dateFormatter = new Intl.DateTimeFormat(window.context.locale, {
	dateStyle: "short",
	timeStyle: "short",
	timeZone: "europe/berlin",
});

export const formatDateFromMs = (ms: number) => dateFormatter.format(ms);
export const formatDate = (date: Date) => dateFormatter.format(date);

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
