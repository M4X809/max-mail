import fs from "node:fs";
import path from "node:path";

export default async (context) => {
	console.log("------------build-hooks------------");
	const resourcesPath = path.join(context.appOutDir, "resources");
	const migrationsPath = path.join(resourcesPath, "migrations");

	// Ensure migrations directory exists
	if (!fs.existsSync(migrationsPath)) {
		console.log("migrationsPath does not exist, creating it");
		fs.mkdirSync(migrationsPath, { recursive: true });
	}

	// Copy migrations from source to the resources directory
	const sourceMigrationsPath = path.join(context.packager.projectDir, "resources", "migrations");
	console.log("sourceMigrationsPath", sourceMigrationsPath);
	if (fs.existsSync(sourceMigrationsPath)) {
		const files = fs.readdirSync(sourceMigrationsPath);
		for (const file of files) {
			const sourceFile = path.join(sourceMigrationsPath, file);
			const targetFile = path.join(migrationsPath, file);
			fs.copyFileSync(sourceFile, targetFile);
		}
	}

	console.log("------------build-hooks------------");
};
