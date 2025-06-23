import { getRootDir } from "@/main/lib/util.js";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";
export * from "./schema.js";

const sqliteDriver = new Database(`${getRootDir()}/db.sqlite`, { verbose: console.log });
const db = drizzle({ client: sqliteDriver, schema: schema });

export default db;
