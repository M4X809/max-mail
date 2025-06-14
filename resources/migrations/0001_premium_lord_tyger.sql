CREATE TABLE `mail_body` (
	`id` integer PRIMARY KEY NOT NULL,
	`mail_id` integer NOT NULL,
	`body` text NOT NULL,
	`html` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `mail` DROP COLUMN `body`;