/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
	plugins: ["prettier-plugin-tailwindcss"],
	tabWidth: 1,
	useTabs: true,
	arrowParens: "always",
	printWidth: 120,
};

export default config;
