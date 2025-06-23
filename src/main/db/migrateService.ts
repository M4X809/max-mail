import { ensureDir, ensureFile, readFile, readdir, stat, writeFile, copy } from "fs-extra";
import { getRootDir, tryCatch } from "@/main/lib/util.js";
import path from "node:path";
import { app } from "electron";
import db from "./index.js";

interface DbConfig {
	lastMigrationFile: string;
}

async function initDb() {
	const dbConfigPath = getRootDir(["settings"]);
	await ensureDir(dbConfigPath);
	const dbConfigFilePath = path.join(dbConfigPath, "db.json");
	await ensureFile(dbConfigFilePath);

	// get available migrations
	const migrationDir = app.isPackaged
		? path.join(process.resourcesPath, "migrations")
		: path.join(__dirname, "resources", "migrations");
	const migrationFiles = await readdir(migrationDir);

	// sort them based on the first numbers until the "_" they are named like 0000_strong_silver_surfer.sql
	const sortedMigrationFiles = migrationFiles.toSorted((a, b) => {
		const aNumber = Number.parseInt(a.split("_")[0]);
		const bNumber = Number.parseInt(b.split("_")[0]);
		return aNumber - bNumber;
	});

	let dbConfigPreUpdate: DbConfig;
	try {
		const dbConfigPreUpdateFile = await readFile(dbConfigFilePath, "utf-8");
		dbConfigPreUpdate = dbConfigPreUpdateFile.length > 0 ? JSON.parse(dbConfigPreUpdateFile) : { lastMigrationFile: "" }; // Initialize with empty string to run all migrations
	} catch (error) {
		console.warn("Failed to parse db.json, initializing with default values:", error);
		dbConfigPreUpdate = { lastMigrationFile: "" }; // Initialize with empty string to run all migrations
	}

	// If no migration was executed before (empty lastMigrationFile), run all migrations
	const newMigrationFiles =
		dbConfigPreUpdate.lastMigrationFile === ""
			? sortedMigrationFiles
			: sortedMigrationFiles.filter(
					(file) =>
						Number.parseInt(file.split("_")[0]) > Number.parseInt(dbConfigPreUpdate.lastMigrationFile?.split("_")[0] ?? "0"),
				);

	console.log("🚀 ~ migrateService.ts:13 ~ initDb ~ dbConfigPreUpdate:", dbConfigPreUpdate);
	console.log("Available migrations:", newMigrationFiles);

	if (newMigrationFiles.length === 0) {
		console.log("No new migrations to apply, skipping...");
		return true;
	}

	let migrationFileContent = "";

	// loop through the sortedMigrationFiles and execute them
	for (const file of newMigrationFiles) {
		const migrationFile = path.join(migrationDir, file);
		const migrationFileContentFromFile = await readFile(migrationFile, "utf-8");

		migrationFileContent = `
        ${migrationFileContent}
        -- ${file}
        ${migrationFileContentFromFile}
        `;
	}
	console.log("🚀 ~ migrateService.ts:77 ~ initDb ~ migrationFileContent:", migrationFileContent);

	await db.$client.exec(migrationFileContent);

	// write the last migration file name to the db.json
	const lastMigrationFile = newMigrationFiles[newMigrationFiles.length - 1];
	const dbConfigData = { lastMigrationFile };
	await writeFile(dbConfigFilePath, JSON.stringify(dbConfigData, null, 2));

	return true;
}

async function createDbBackup() {
	try {
		const rootDir = getRootDir();
		const settingsDir = getRootDir(["settings"]);
		const dbPath = path.join(rootDir, "db.sqlite");
		const dbBackupPath = path.join(rootDir, "db.backup.sqlite");
		const dbConfigPath = path.join(settingsDir, "db.json");
		const dbConfigBackupPath = path.join(rootDir, "db.backup.json");

		// Ensure directories exist
		await ensureDir(rootDir);
		await ensureDir(settingsDir);

		// Check if source files exist before copying
		const dbExists = await stat(dbPath)
			.then(() => true)
			.catch(() => false);
		const dbConfigExists = await stat(dbConfigPath)
			.then(() => true)
			.catch(() => false);

		if (dbExists) {
			await copy(dbPath, dbBackupPath);
			console.log("Successfully backed up database file");
		} else {
			console.log("No existing database file to backup");
		}

		if (dbConfigExists) {
			await copy(dbConfigPath, dbConfigBackupPath);
			console.log("Successfully backed up database config");
		} else {
			console.log("No existing database config to backup");
		}

		return true;
	} catch (error) {
		console.error("Failed to create database backup:", error);
		return false;
	}
}

async function restoreDbBackup() {
	try {
		const rootDir = getRootDir();
		const settingsDir = getRootDir(["settings"]);
		const dbPath = path.join(rootDir, "db.sqlite");
		const dbBackupPath = path.join(rootDir, "db.backup.sqlite");
		const dbConfigPath = path.join(settingsDir, "db.json");
		const dbConfigBackupPath = path.join(rootDir, "db.backup.json");

		// Check if backup files exist before restoring
		const dbBackupExists = await stat(dbBackupPath)
			.then(() => true)
			.catch(() => false);
		const dbConfigBackupExists = await stat(dbConfigBackupPath)
			.then(() => true)
			.catch(() => false);

		if (dbBackupExists) {
			await copy(dbBackupPath, dbPath);
			console.log("Successfully restored database file from backup");
		}

		if (dbConfigBackupExists) {
			await copy(dbConfigBackupPath, dbConfigPath);
			console.log("Successfully restored database config from backup");
		}

		return true;
	} catch (error) {
		console.error("Failed to restore database backup:", error);
		return false;
	}
}

export async function migrateService() {
	const dbConfigPath = getRootDir(["settings"]);
	await ensureDir(dbConfigPath);
	const dbConfigFilePath = path.join(dbConfigPath, "db.json");
	await ensureFile(dbConfigFilePath);

	try {
		const dbConfig = await readFile(dbConfigFilePath, "utf-8");
		const { error } = await tryCatch(() => JSON.parse(dbConfig) as { version: number });
		if (error) {
			console.warn("Failed to parse db.json:", error);
		}
	} catch (error) {
		console.warn("Failed to read db.json:", error);
	}

	// try to create a backup of the db
	const backupSuccess = await createDbBackup();
	if (!backupSuccess) {
		console.warn("Failed to create a backup of the db, proceeding with caution...");
	}

	// try to init the db
	const { data: initDbSuccess } = await tryCatch(async () => {
		return await initDb();
	});

	if (!initDbSuccess) {
		console.error("Failed to initialize database, attempting to restore from backup...");
		const restoreSuccess = await restoreDbBackup();
		if (!restoreSuccess) {
			throw new Error("Failed to initialize database and restore from backup");
		}
	}

	return true;
}
