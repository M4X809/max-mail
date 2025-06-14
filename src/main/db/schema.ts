import { sql } from "drizzle-orm";
import { sqliteTable } from "drizzle-orm/sqlite-core";

import * as d from "drizzle-orm/sqlite-core";

export const mail = sqliteTable("mail", {
	id: d.integer("id").primaryKey().notNull(),
	from: d.text("from").notNull(),
	to: d.text("to").notNull(),
	subject: d.text("subject").notNull(),

	createdAt: d
		.integer("created_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: d
		.integer("updated_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const mailBody = sqliteTable("mail_body", {
	id: d.integer("id").primaryKey().notNull(),
	mailId: d.integer("mail_id").notNull(),
	body: d.text("body").notNull(),
	html: d.integer("html").notNull().default(0),
});
