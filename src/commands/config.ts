import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { ConfigService } from '../services/config.js';
import { ValidationService } from '../utils/validation.js';

export default class ConfigCommand extends Command {
  static description = 'Manage SnapAI configuration';

  static examples = [
    '<%= config.bin %> <%= command.id %> --api-key sk-your-openai-key',
    '<%= config.bin %> <%= command.id %> --show',
  ];

  static flags = {
    'api-key': Flags.string({
      description: 'Set OpenAI API key',
    }),
    'google-api-key': Flags.string({
      description: 'Set Google Studio (Gemini) API key',
    }),
    show: Flags.boolean({
      description: 'Show current configuration',
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(ConfigCommand);

    if (flags['api-key']) {
      await this.setApiKey(flags['api-key']);
    }

    if (flags['google-api-key']) {
      await this.setGoogleApiKey(flags['google-api-key']);
    }

    if (flags.show) {
      await this.showConfig();
    }

    // If no flags provided, show help
    if (Object.keys(flags).length === 0) {
      await this.showConfig();
    }
  }

  private async setApiKey(apiKey: string): Promise<void> {
    const error = ValidationService.validateApiKey(apiKey);
    if (error) {
      this.error(chalk.red(error));
    }

    await ConfigService.set('openai_api_key', apiKey);
    this.log(chalk.green('✅ OpenAI API key configured successfully!'));
    this.log('');
    this.log(chalk.dim('Powered by codewithbeto.dev — check out our React Native course!'));
  }

  private async setGoogleApiKey(apiKey: string): Promise<void> {
    const error = ValidationService.validateGoogleApiKey(apiKey);
    if (error) {
      this.error(chalk.red(error));
    }

    await ConfigService.set('google_api_key', apiKey);
    this.log(chalk.green('✅ Google API key configured successfully!'));
    this.log('');
    this.log(chalk.dim('Powered by codewithbeto.dev — check out our React Native course!'));
  }

  private async showConfig(): Promise<void> {
    const config = await ConfigService.getConfig();
    
    this.log(chalk.bold('📋 Current Configuration:'));
    this.log('');
    
    if (config.openai_api_key) {
      const maskedKey = `sk-...${config.openai_api_key.slice(-4)}`;
      this.log(`🔑 OpenAI API Key: ${chalk.green(maskedKey)}`);
    } else {
      this.log(`🔑 OpenAI API Key: ${chalk.red('Not configured')}`);
      this.log(chalk.gray('   Set with: snapai config --api-key YOUR_KEY'));
    }

    if (config.google_api_key) {
      const maskedKey = `...${config.google_api_key.slice(-4)}`;
      this.log(`🟦 Google API Key: ${chalk.green(maskedKey)}`);
    } else {
      this.log(`🟦 Google API Key: ${chalk.red('Not configured')}`);
      this.log(chalk.gray('   Set with: snapai config --google-api-key YOUR_KEY'));
    }
    
    if (config.default_output_path) {
      this.log(`📁 Default Output: ${chalk.blue(config.default_output_path)}`);
    }
    
    this.log('');
    this.log(chalk.dim('Powered by codewithbeto.dev — check out our React Native course!'));
  }
}