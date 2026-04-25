import { defineConfig } from 'vitest/config';

export const nodeConfig = defineConfig({
	test: {
		environment: 'node',
		exclude: ['**/node_modules/**', '**/.git/**', '**/*.integration.test.ts'],
	},
});
