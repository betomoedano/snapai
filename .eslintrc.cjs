/**
 * Minimal ESLint config for this repo.
 * Keeps `pnpm run lint` working without extra installs.
 */
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["dist/", "bundle/", "node_modules/"],
  rules: {
    // Keep it lightweight; this repo is primarily a CLI.
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
  },
};

