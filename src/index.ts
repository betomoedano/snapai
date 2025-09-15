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

await execute({ dir: import.meta.url });
