import { Command, Flags } from "@oclif/core";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { OpenAIService } from "../services/openai.js";
import { ValidationService } from "../utils/validation.js";
import { renderIconComposerLayer } from "../utils/icon-composer.js";

function slugifyLayerName(value: string): string {
  const cleaned = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned.length > 0 ? cleaned : "layer";
}

export default class ComposerCommand extends Command {
  static description =
    "Generate layered SVG files (one SVG = one layer) compatible with Apple Icon Composer";

  static examples = [
    '<%= config.bin %> <%= command.id %> --prompt "minimalist weather app with sun and cloud"',
    '<%= config.bin %> <%= command.id %> --prompt "chat bubble" --output ./output',
    '<%= config.bin %> <%= command.id %> --prompt "calculator" --planner-model gpt-4o-mini',
  ];

  static flags = {
    prompt: Flags.string({
      char: "p",
      description: "Natural language icon prompt",
      required: true,
    }),
    "api-key": Flags.string({
      description:
        "OpenAI API key override (does not persist to disk). Also supports SNAPAI_API_KEY / OPENAI_API_KEY",
    }),
    output: Flags.string({
      char: "o",
      description: "Output root directory",
      default: "./output",
    }),
    "planner-model": Flags.string({
      description: "OpenAI model used as JSON planner",
      default: "gpt-4o-mini",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(ComposerCommand);

    const promptError = ValidationService.validatePrompt(flags.prompt);
    if (promptError) this.error(promptError);

    const outputError = ValidationService.validateOutputPath(flags.output);
    if (outputError) this.error(outputError);

    if (flags["api-key"]) {
      const keyError = ValidationService.validateApiKey(flags["api-key"]);
      if (keyError) this.error(chalk.red(keyError));
    }

    const timestamp = Date.now();
    const outDir = path.join(flags.output, `icon-${timestamp}`);

    try {
      this.log(chalk.blue("🧩 Planning icon layers (JSON only)..."));
      const plan = await OpenAIService.planIconComposerLayers({
        prompt: flags.prompt,
        model: flags["planner-model"],
        apiKey: flags["api-key"],
      });

      this.log(chalk.gray("💾 Writing SVG layers..."));
      await fs.ensureDir(outDir);

      for (let i = 0; i < plan.icon.layers.length; i++) {
        const layer = plan.icon.layers[i];
        const name = slugifyLayerName(layer.id || layer.type || `layer-${i + 1}`);
        const filename = `${String(i + 1).padStart(2, "0")}-${name}.svg`;
        const svg = renderIconComposerLayer(layer);
        await fs.writeFile(path.join(outDir, filename), svg, "utf8");
      }

      this.log(chalk.green("✅ Layered SVGs generated successfully!"));
      this.log(chalk.gray(`Saved to: ${outDir}`));
      this.log(chalk.gray("Import into Apple Icon Composer one SVG at a time."));
    } catch (error) {
      this.error(
        chalk.red(
          `Failed to generate layered SVGs: ${(error as Error).message}`
        )
      );
    }
  }
}

