CREATE TABLE `mail` (
	`id` integer PRIMARY KEY NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`subject` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
