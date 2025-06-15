import path from "node:path";
import { $ } from "bun";
import chalk from "chalk";
import { createLogger } from "./utils/logger";

import ms from "ms";

const logger = createLogger("Build-Publish");

const rootDir = path.resolve(__dirname, "..");

const runBuild = async () => {
	logger.info("Building Max-Mail...");
	const projectPath = path.join(rootDir);
	$.cwd(projectPath);
	$.throws(true);
	try {
		logger.await(chalk.blue("Installing dependencies "));
		await $`bun i -d`;
		try {
			await $`bun pm trust --all`;
		} catch (err: any) {}
		logger.await(chalk.blue("Building project, and publishing "));
		await $`bun run build && electron-builder --win -p always --config electron-builder.yml`;

		logger.success(chalk.green("Build completed, Is Published!"));
	} catch (err: any) {
		logger.error(chalk.red("Build failed"));
		logger.fatal(`Failed with code ${err.exitCode}`);
		logger.fatal(err.stdout.toString());
		logger.fatal(err.stderr.toString());
	}
};

const startTime = Date.now();

await runBuild();

const endTime = Date.now();
const timeTaken = endTime - startTime;

logger.success(chalk.green(`Build-Publish took ~${ms(timeTaken, { long: true })}`));
