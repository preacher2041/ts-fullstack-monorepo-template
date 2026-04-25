import {defineConfig} from 'vitest/config';

export const baseTestOptions = {
    environment: 'jsdom',
    exclude: ['**/node_modules/***', '***/.git/**', '**/*.integration.test.ts']
}

export const baseConfig = defineConfig({
    test: baseTestOptions
});