/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        // The production source is type-checked by `tsc` (moduleResolution:
        // node). Under jest's ESM transform, `openai` resolves to a different
        // built-in fetch shim, producing a false-positive Fetch type error on
        // the intentional globalThis.fetch override. Skip diagnostics for the
        // source only; test files are still fully type-checked.
        diagnostics: { exclude: ["**/services/openai.ts"] },
      },
    ],
  },
};
