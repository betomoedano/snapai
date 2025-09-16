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
    'base-url': Flags.string({
      description: 'Set OpenAI Base URL',
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

    if (flags['base-url']) {
      await this.setBaseUrl(flags['base-url']);
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
    this.log(chalk.dim('Built with ❤️  by \u001b]8;;https://codewithbeto.dev\u001b\\codewithbeto.dev\u001b]8;;\u001b\\ - Ship faster, contribute more, lead with confidence'));
  }


  private async setBaseUrl(baseUrl: string): Promise<void> {
    const error = ValidationService.validateBaseUrl(baseUrl);
    if (error) {
      this.error(chalk.red(error));
    }

    await ConfigService.set('openai_base_url', baseUrl);
    this.log(chalk.green('✅ OpenAI Base URL configured successfully!'));
    this.log('');
    this.log(chalk.dim('Built with ❤️  by \u001b]8;;https://codewithbeto.dev\u001b\\codewithbeto.dev\u001b]8;;\u001b\\ - Ship faster, contribute more, lead with confidence'));
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

    if (config.openai_base_url) {
      this.log(`🔗 OpenAI Base URL: ${chalk.blue(config.openai_base_url)}`);
    }
    
    if (config.default_output_path) {
      this.log(`📁 Default Output: ${chalk.blue(config.default_output_path)}`);
    }
    
    this.log('');
    this.log(chalk.dim('Built with ❤️  by \u001b]8;;https://codewithbeto.dev\u001b\\codewithbeto.dev\u001b]8;;\u001b\\ - Ship faster, contribute more, lead with confidence'));
  }
}