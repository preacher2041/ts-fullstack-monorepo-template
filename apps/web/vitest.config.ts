import { defineConfig } from 'vitest/config'
import { baseTestOptions } from '@template/vitest-config/base'
import path from 'path'

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	test: {
		...baseTestOptions,
		setupFiles: ['./src/test/setup.ts'],
	},
})
