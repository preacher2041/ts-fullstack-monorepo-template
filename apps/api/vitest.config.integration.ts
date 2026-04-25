import { mergeConfig } from 'vitest/config'
import { integrationConfig } from '@template/vitest-config/integration'

export default mergeConfig(integrationConfig, {
	test: {
		globalSetup: './src/test/global-setup.ts',
		setupFiles: ['./src/test/integration-setup.ts'],
		env: {
			DATABASE_URL:
				'postgresql://postgres:postgres@localhost:5432/testdb',
		},
	},
})
