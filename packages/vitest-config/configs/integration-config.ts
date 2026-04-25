import { defineConfig } from 'vitest/config';

export const integrationConfig = defineConfig({
	test: {
		environment: 'jsdom',
		include: ['**/*.integration.test.ts'],
		exclude: ['**/node_modules/**', '**/.git/**'],
	},
});