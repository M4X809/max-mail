import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	main: {
		plugins: [
			externalizeDepsPlugin(),
			viteStaticCopy({
				targets: [
					{
						src: "resources/migrations",
						dest: "resources",
					},
				],
			}),
		],
		resolve: {
			alias: {
				"@/lib": resolve("src/main/lib"),
				"@shared": resolve("src/shared"),
			},
		},
		assetsInclude: ["src/main/resources/**"],
		build: {
			sourcemap: "inline",
			minify: false,

			emptyOutDir: true,
			watch: {
				include: ["src/main/**", "src/shared/**", "src/preload/**", "./package.json", "resources/**"],
			},
			assetsDir: "resources",
		},
	},
	preload: {
		build: {
			emptyOutDir: true,
			// write: false,
			lib: {
				entry: "src/preload/index.ts",
				formats: ["cjs"],
			},
			watch: {
				include: ["src/preload/**"],
			},
		},
		plugins: [externalizeDepsPlugin()],
	},
	renderer: {
		assetsInclude: "src/renderer/assets/**",
		resolve: {
			alias: {
				"@renderer": resolve("src/renderer/src"),
				"@shared": resolve("src/shared"),
				"@/hooks": resolve("src/renderer/src/hooks"),
				"@/assets": resolve("src/renderer/src/assets"),
				"@/store": resolve("src/renderer/src/store"),
				"@/components": resolve("src/renderer/src/components"),
				"@/mocks": resolve("src/renderer/src/mocks"),
				"@/pages": resolve("src/renderer/src/pages"),
			},
		},
		build: {
			emptyOutDir: true,
			// copyPublicDir: true,
		},
		plugins: [react()],
	},
});
