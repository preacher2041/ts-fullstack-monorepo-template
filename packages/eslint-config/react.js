// eslint.config.js
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import {config as baseConfig} from './index.js';

/**
 * A custom ESLint configuration for React projects in the monorepo.
 * 
 * @type {import('eslint').Linter.Config} 
 * */

export const config = [
    ...baseConfig, // Start with the base configuration
    js.configs.recommended, // ESLint's recommended rules for JavaScript
    ...tseslint.configs.recommended, // TypeScript-ESLint's recommended rules
    pluginReact.configs.react.recommended, // React plugin's recommended rules
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parser: tseslint.parser, // Use TypeScript parser
            parserOptions: {
                ecmaFeatures: {
                    jsx: true, // Enable JSX parsing
                },
                ecmaVersion: 'latest', // Use latest ECMAScript features
                project: ['./apps/**/tsconfig.json', './packages/**/tsconfig.json'], // Specify your tsconfig.json files here
                sourceType: 'module', // Use ES modules
                tsconfigRootDir: __dirname, // Set the root directory for tsconfig files
            },
        },

        plugins: {
            react: pluginReact,
            'react-hooks': pluginReactHooks,
            'react-refresh': pluginReactRefresh,
        },
        settings: {
            react: {
                version: 'detect', // Automatically detect the react version
            },
        },
        rules: {
            // React specific rules
            ...pluginReact.configs.recommended.rules,
            ...pluginReactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn', // Warn if components are not exported
                {
                    allowConstantExport: true, // Allow constant exports without warning
                },
            ],
            
            // Custom rules or overrides
            'no-unused-vars': 'off', // Handled by @typescript-eslint/no-unused-vars
            '@typescript-eslint/no-unused-vars': [
                'warn', // Warn about unused variables
                {
                    argIgnorePattern: '^_', // Ignore variables starting with an underscore
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn', // Warn about explicit 'any' types
            '@typescript-eslint/ban-ts-comment': 'warn', // Warn about 'ts-ignore' comments
            'react/jsx-uses-react': 'off', // Not needed with React 17+
            'react/react-in-jsx-scope': 'off', // Not needed with React 17+
            'react/prop-types': 'off', // Disable prop-types in TypeScript projects
        },
    },
    eslintConfigPrettier // Must be the last config to disable all stylistic rules that conflict with Prettier
];