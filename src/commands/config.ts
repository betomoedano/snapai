import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { ConfigService } from '../services/config.js';
import { ValidationService } from '../utils/validation.js';

export default class ConfigCommand extends Command {
  static description = 'Manage SnapAI configuration';

  static examples = [
    '<%= config.bin %> <%= command.id %> --api-key sk-your-openai-key',
    '<%= config.bin %> <%= command.id %> --replicate-api-token r8_your-token',
    '<%= config.bin %> <%= command.id %> --show',
  ];

  static flags = {
    'api-key': Flags.string({
      description: 'Set OpenAI API key',
    }),
    'replicate-api-token': Flags.string({
      description: 'Set Replicate API token (for recraft-v3-svg model)',
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

    if (flags['replicate-api-token']) {
      await this.setReplicateApiToken(flags['replicate-api-token']);
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

  private async setReplicateApiToken(token: string): Promise<void> {
    const error = ValidationService.validateReplicateApiToken(token);
    if (error) {
      this.error(chalk.red(error));
    }

    await ConfigService.set('replicate_api_token', token);
    this.log(chalk.green('✅ Replicate API token configured successfully!'));
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

    if (config.replicate_api_token) {
      const maskedToken = `r8_...${config.replicate_api_token.slice(-4)}`;
      this.log(`🔑 Replicate API Token: ${chalk.green(maskedToken)}`);
    } else {
      this.log(`🔑 Replicate API Token: ${chalk.red('Not configured')}`);
      this.log(chalk.gray('   Set with: snapai config --replicate-api-token YOUR_TOKEN'));
    }

    if (config.default_output_path) {
      this.log(`📁 Default Output: ${chalk.blue(config.default_output_path)}`);
    }
    
    this.log('');
    this.log(chalk.dim('Built with ❤️  by \u001b]8;;https://codewithbeto.dev\u001b\\codewithbeto.dev\u001b]8;;\u001b\\ - Ship faster, contribute more, lead with confidence'));
  }
}