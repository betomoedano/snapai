#!/usr/bin/env node

// Suppress punycode deprecation warning from transitive dependencies
process.removeAllListeners("warning");
process.on("warning", (warning) => {
  if (
    warning.name === "DeprecationWarning" &&
    warning.message.includes("punycode")
  ) {
    return; // Suppress punycode warnings
  }
  console.warn(warning.stack);
});

import { execute } from "@oclif/core";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

await execute({ dir: __dirname });
