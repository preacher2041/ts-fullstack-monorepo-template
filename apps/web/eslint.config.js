import {config} from '@mythmaker/eslint-config';

/** @type {import('eslint').Linter.Config} */
export default [
  { ignores: ['dist/**', '.tanstack/**'] },
  ...config,
];