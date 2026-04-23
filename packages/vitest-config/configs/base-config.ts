import {defineConfig} from 'vitest/config';

export const baseTestOptions = {
    environment: 'jsdom',
}

export const baseConfig = defineConfig({
    test: baseTestOptions
});