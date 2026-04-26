export default {
  "**/*.{ts,tsx,js,mjs,cjs,json,css,md,yaml,yml}":
    "prettier --write --ignore-unknown",

  "apps/web/**/*.{ts,tsx}": (files) =>
    `pnpm --filter @template/web exec eslint --fix ${files.join(" ")}`,
  "apps/api/src/**/*.ts": (files) =>
    `pnpm --filter @template/api exec eslint --fix ${files.join(" ")}`,
  "packages/ui/**/*.{ts,tsx}": (files) =>
    `pnpm --filter @template/ui exec eslint --fix ${files.join(" ")}`,
};
