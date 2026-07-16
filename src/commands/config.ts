import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { ConfigService } from '../services/config.js';
import { ValidationService } from '../utils/validation.js';
import { CTA } from '../utils/branding.js';

export default class ConfigCommand extends Command {
  static description = 'Manage SnapAI configuration';

  static examples = [
    '<%= config.bin %> <%= command.id %> --openai-api-key sk-your-openai-key',
    '<%= config.bin %> <%= command.id %> --openai-base-url https://my-proxy.example.com/v1',
    '<%= config.bin %> <%= command.id %> --show',
  ];

  static flags = {
    'openai-api-key': Flags.string({
      char: 'k',
      description: 'Set OpenAI API key',
    }),
    'openai-base-url': Flags.string({
      description: 'Set a custom OpenAI-compatible API base URL (e.g. Azure OpenAI, OpenRouter, local server)',
    }),
    'google-api-key': Flags.string({
      char: 'g',
      description: 'Set Google Studio (Gemini) API key',
    }),
    show: Flags.boolean({
      description: 'Show current configuration',
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(ConfigCommand);

    if (flags['openai-api-key']) {
      await this.setApiKey(flags['openai-api-key']);
    }

    if (flags['openai-base-url']) {
      await this.setBaseUrl(flags['openai-base-url']);
    }

    if (flags['google-api-key']) {
      await this.setGoogleApiKey(flags['google-api-key']);
    }

    if (flags.show) {
      await this.showConfig();
    }

    // If no flags provided, show the current configuration
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
    this.log(CTA);
  }

  private async setBaseUrl(baseUrl: string): Promise<void> {
    const error = ValidationService.validateBaseUrl(baseUrl);
    if (error) {
      this.error(chalk.red(error));
    }

    await ConfigService.set('openai_base_url', baseUrl);
    this.log(chalk.green('✅ OpenAI base URL configured successfully!'));
    this.log('');
    this.log(CTA);
  }

  private async setGoogleApiKey(apiKey: string): Promise<void> {
    const error = ValidationService.validateGoogleApiKey(apiKey);
    if (error) {
      this.error(chalk.red(error));
    }

    await ConfigService.set('google_api_key', apiKey);
    this.log(chalk.green('✅ Google API key configured successfully!'));
    this.log('');
    this.log(CTA);
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
      this.log(chalk.gray('   Set with: snapai config --openai-api-key YOUR_KEY'));
    }

    if (config.openai_base_url) {
      this.log(`🌐 OpenAI Base URL: ${chalk.blue(config.openai_base_url)}`);
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
    this.log(CTA);
  }
}