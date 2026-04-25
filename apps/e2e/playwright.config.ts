import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: false,
	retries: process.env.CI ?  2 : 0,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:9000',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
		},
	],
	webServer:
      {
        command: 'pnpm --filter @template/web dev',
        url: 'http://localhost:9000',
        reuseExistingServer: !process.env.CI,
      }
})