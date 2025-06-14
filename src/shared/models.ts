/*
 * File: models.ts
 * Project: max-mail
 * File Created: 12.08.2024, 19:08:65
 *
 * Last Modified: 06.09.2024, 10:09:47
 * Modified By: MAX809
 */

export type NoteInfo = {
	title: string;
	lastEditTime: number;
};

export type NoteContent = string;

export type FolderInfo = {
	name: string;
	count: number;
	pinnedNotes: number;
};
