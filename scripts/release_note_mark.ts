import path from "node:path";
import { homedir } from "node:os";
import pkg from "../package.json";
const { version } = pkg;
// @ts-ignore
// import changelogFile from "C:/Users/jp/max-mail/notes/dev/changelog.md?asset";
import { $, file } from "bun";
import { readFile } from "fs-extra";

const changelog = await readFile(path.join(homedir(), "max-mail", "notes", "dev", "changelog.md"), {
	encoding: "utf8",
});

// console.log(changelog.split("---")[0]);

const latestChangelog = changelog.split("---")[0];
const latestVersion = latestChangelog.split("]")[0].replace(/[^0-9.]/g, "");

console.log(latestVersion);

if (latestVersion !== version) {
	console.error("Version mismatch, please update the changelog");
	process.exit(1);
}
// Split the changelog by --- and then by \n and remove the first element

const releaseNotes = changelog.split("---")[0].split("\n").slice(1).join("\n");

console.log(releaseNotes);

await $`gh release edit v${version} --repo m4x809/max-mail --draft=false --latest=true -n "${releaseNotes}"`;
