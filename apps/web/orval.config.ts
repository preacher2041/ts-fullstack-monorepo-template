import { defineConfig } from 'orval'

export default defineConfig({
	api: {
		input: {
			target: '../api/openapi-spec.json',
		},
		output: {
			target: './src/api/generated/openapi.ts',
			client: 'react-query',
			override: {
				mutator: {
					path: './src/api/custom-fetch.ts',
					name: 'customFetch',
				},
			},
		},
	},
})
