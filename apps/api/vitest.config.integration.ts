import { mergeConfig } from 'vitest/config'
import { integrationConfig } from '@template/vitest-config/integration'

export default mergeConfig(integrationConfig, {
	test: {
		globalSetup: './src/test/global-setup.ts',
		setupFiles: ['./src/test/integration-setup.ts'],
		env: {
			DATABASE_URL:
				'postgresql://postgres:postgres@localhost:5432/testdb',
			// SESSION_SECRET is required to be at least 32 characters long by src/env.ts.
			// This fallback ensures Zod validation passes in CI environments where a local .env file does not exist.
			SESSION_SECRET:
				'a-very-long-and-secure-session-secret-for-testing-only-32-chars-long',
		},
	},
})
