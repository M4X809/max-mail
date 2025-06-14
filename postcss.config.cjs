/*
 * File: postcss.config.cjs
 * Project: max-mail
 * File Created: 12.08.2024, 13:08:54
 *
 * Last Modified: 17.08.2024, 21:08:77
 * Modified By: MAX809
 */

/**
 * @type {import('postcss')}
 */
module.exports = {
	plugins: {
		"postcss-preset-mantine": {},
		"postcss-simple-vars": {
			variables: {
				"mantine-breakpoint-xs": "36em",
				"mantine-breakpoint-sm": "48em",
				"mantine-breakpoint-md": "62em",
				"mantine-breakpoint-lg": "75em",
				"mantine-breakpoint-xl": "88em",
			},
		},
		'@tailwindcss/postcss': {},
	},
};
