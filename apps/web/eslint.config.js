import {config} from '@template/eslint-config';

/** @type {import('eslint').Linter.Config} */
export default [
  { ignores: ['dist/**', '.tanstack/**'] },
  ...config,
];