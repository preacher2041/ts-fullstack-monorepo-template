import { defineConfig } from 'vitest/config';

export const nodeConfig = defineConfig({
	test: {
		environment: 'node',
	},
});
