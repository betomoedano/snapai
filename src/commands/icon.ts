import { Command, Flags } from '@oclif/core';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { OpenAIService } from '../services/openai.js';
import { TelemetryService } from '../services/telemetry.js';
import { ValidationService } from '../utils/validation.js';

export default class IconCommand extends Command {
  static description = 'Generate AI-powered app icons';

  static examples = [
    '<%= config.bin %> <%= command.id %> --prompt "minimalist calculator app icon"',
    '<%= config.bin %> <%= command.id %> --prompt "fitness tracker" --output ./assets/icons',
  ];

  static flags = {
    prompt: Flags.string({
      char: 'p',
      description: 'Description of the icon you want to generate',
      required: true,
    }),
    output: Flags.string({
      char: 'o',
      description: 'Output directory for generated icon',
      default: './assets',
    }),
    size: Flags.integer({
      char: 's',
      description: 'Icon size in pixels',
      default: 1024,
      options: ['256', '512', '1024'],
    }),
    quality: Flags.string({
      char: 'q',
      description: 'Image quality',
      default: 'standard',
      options: ['standard', 'hd'],
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(IconCommand);
    const startTime = Date.now();
    const sessionId = TelemetryService.generateSessionId();

    try {
      // Validate inputs
      const promptError = ValidationService.validatePrompt(flags.prompt);
      if (promptError) {
        this.error(promptError);
      }

      const outputError = ValidationService.validateOutputPath(flags.output);
      if (outputError) {
        this.error(outputError);
      }

      this.log(chalk.blue('🎨 Generating your app icon...'));
      this.log(chalk.gray(`Prompt: ${flags.prompt}`));

      // Generate icon using OpenAI
      const imageUrl = await OpenAIService.generateIcon({
        prompt: flags.prompt,
        output: flags.output,
        size: flags.size,
        quality: flags.quality as 'standard' | 'hd',
      });

      // Download and save the image
      const outputPath = await this.downloadAndSaveImage(imageUrl, flags.output);

      this.log(chalk.green('✅ Icon generated successfully!'));
      this.log(chalk.gray(`Saved to: ${outputPath}`));

      // Track successful generation
      await TelemetryService.track({
        session_id: sessionId,
        command: 'icon',
        success: true,
        timestamp: Date.now(),
        version: this.config.version,
        execution_time: Date.now() - startTime,
        prompt_length: flags.prompt.length,
        output_format: 'png',
        model_used: 'dall-e-3',
      });

    } catch (error) {
      // Track failed generation
      await TelemetryService.track({
        session_id: sessionId,
        command: 'icon',
        success: false,
        timestamp: Date.now(),
        version: this.config.version,
        execution_time: Date.now() - startTime,
        error_type: this.categorizeError(error),
        prompt_length: flags.prompt?.length || 0,
      });

      this.error(chalk.red(`Failed to generate icon: ${(error as Error).message}`));
    }
  }

  private async downloadAndSaveImage(url: string, outputDir: string): Promise<string> {
    const { default: fetch } = await import('node-fetch');
    const filename = `icon-${Date.now()}.png`;
    const outputPath = path.join(outputDir, filename);
    
    await fs.ensureDir(outputDir);
    
    try {
      this.log(chalk.gray('📥 Downloading image...'));
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(outputPath, buffer);
      
      return outputPath;
    } catch (error: any) {
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  private categorizeError(error: any): string {
    if (error.message?.includes('API key')) return 'auth_error';
    if (error.message?.includes('quota')) return 'quota_error';
    if (error.message?.includes('network')) return 'network_error';
    return 'unknown_error';
  }
}