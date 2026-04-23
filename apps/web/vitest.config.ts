import { defineConfig } from 'vitest/config'
import { baseTestOptions } from '@template/vitest-config/base'

export default defineConfig({
	test: { ...baseTestOptions },
})
