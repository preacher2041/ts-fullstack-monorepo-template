import { config } from '@template/eslint-config/node';

/** @type {import('eslint').Linter.Config} */
export default [
  { ignores: ['dist/**'] },
  ...config,
];
