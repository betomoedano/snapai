import { Command, Flags } from '@oclif/core';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { OpenAIService } from '../services/openai.js';
import { ValidationService } from '../utils/validation.js';

export default class IconCommand extends Command {
  static description = 'Generate AI-powered app icons';

  static examples = [
    '<%= config.bin %> <%= command.id %> --prompt "minimalist calculator app icon"',
    '<%= config.bin %> <%= command.id %> --prompt "fitness tracker" --output ./assets/icons',
    '<%= config.bin %> <%= command.id %> --prompt "a blue circle with white text" --raw-prompt',
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
    size: Flags.string({
      char: 's',
      description: 'Icon size',
      default: '1024x1024',
      options: ['1024x1024', '1536x1024', '1024x1536'],
    }),
    quality: Flags.string({
      char: 'q',
      description: 'Image quality',
      default: 'standard',
      options: ['standard', 'hd'],
    }),
    'raw-prompt': Flags.boolean({
      description: 'Use the exact prompt without enhancement for iOS app icons',
      default: false,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(IconCommand);

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
      if (flags['raw-prompt']) {
        this.log(chalk.yellow('⚠️  Using raw prompt (no iOS enhancement)'));
      }

      // Generate icon using OpenAI
      const imageBase64 = await OpenAIService.generateIcon({
        prompt: flags.prompt,
        output: flags.output,
        size: flags.size,
        quality: flags.quality as 'standard' | 'hd',
        rawPrompt: flags['raw-prompt'],
      });

      // Save the base64 image
      const outputPath = await this.saveBase64Image(imageBase64, flags.output);

      this.log(chalk.green('✅ Icon generated successfully!'));
      this.log(chalk.gray(`Saved to: ${outputPath}`));
      this.log('');
      this.log(chalk.dim('Built with ❤️  by \u001b]8;;https://codewithbeto.dev\u001b\\codewithbeto.dev\u001b]8;;\u001b\\ - Ship faster, contribute more, lead with confidence'));

    } catch (error) {
      this.error(chalk.red(`Failed to generate icon: ${(error as Error).message}`));
    }
  }

  private async saveBase64Image(base64Data: string, outputDir: string): Promise<string> {
    const filename = `icon-${Date.now()}.png`;
    const outputPath = path.join(outputDir, filename);
    
    await fs.ensureDir(outputDir);
    
    try {
      this.log(chalk.gray('💾 Saving image...'));
      
      // Convert base64 to buffer
      const buffer = Buffer.from(base64Data, 'base64');
      await fs.writeFile(outputPath, buffer);
      
      return outputPath;
    } catch (error: any) {
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

}