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
					{
						src: "resources/icon.png",
						dest: "resources",
					},
					{
						src: "resources/mm_256.png",
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
			minify: true,

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
			minify: true,
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
				"@/utils": resolve("src/renderer/src/lib/utils"),
				"@/ui": resolve("src/renderer/src/components/ui"),
				"@/lib": resolve("src/renderer/src/lib"),
			},
		},
		build: {
			emptyOutDir: true,
			minify: true,
			// copyPublicDir: true,
		},
		plugins: [react()],
	},
});
