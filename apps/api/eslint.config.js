import { config } from '@mythmaker/eslint-config/node';

/** @type {import('eslint').Linter.Config} */
export default [
  { ignores: ['dist/**'] },
  ...config,
];
