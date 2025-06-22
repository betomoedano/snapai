import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { ConfigService } from '../services/config.js';
import { ValidationService } from '../utils/validation.js';

export default class ConfigCommand extends Command {
  static description = 'Manage SnapAI configuration';

  static examples = [
    '<%= config.bin %> <%= command.id %> --api-key sk-your-openai-key',
    '<%= config.bin %> <%= command.id %> --show',
    '<%= config.bin %> <%= command.id %> --telemetry false',
  ];

  static flags = {
    'api-key': Flags.string({
      description: 'Set OpenAI API key',
    }),
    telemetry: Flags.boolean({
      description: 'Enable/disable anonymous usage tracking',
      allowNo: true,
    }),
    show: Flags.boolean({
      description: 'Show current configuration',
    }),
    'show-telemetry': Flags.boolean({
      description: 'Show telemetry status',
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(ConfigCommand);

    if (flags['api-key']) {
      await this.setApiKey(flags['api-key']);
    }

    if (flags.telemetry !== undefined) {
      await this.setTelemetry(flags.telemetry);
    }

    if (flags.show) {
      await this.showConfig();
    }

    if (flags['show-telemetry']) {
      await this.showTelemetryStatus();
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
  }

  private async setTelemetry(enabled: boolean): Promise<void> {
    await ConfigService.set('telemetry_enabled', enabled);
    const status = enabled ? 'enabled' : 'disabled';
    this.log(chalk.green(`✅ Telemetry ${status} successfully!`));
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
    
    const telemetryStatus = config.telemetry_enabled ? 'Enabled' : 'Disabled';
    const telemetryColor = config.telemetry_enabled ? chalk.green : chalk.red;
    this.log(`📊 Telemetry: ${telemetryColor(telemetryStatus)}`);
    
    if (config.default_output_path) {
      this.log(`📁 Default Output: ${chalk.blue(config.default_output_path)}`);
    }
    
    this.log('');
  }

  private async showTelemetryStatus(): Promise<void> {
    const enabled = await ConfigService.get('telemetry_enabled');
    const status = enabled ? 'enabled' : 'disabled';
    const color = enabled ? chalk.green : chalk.red;
    
    this.log(`📊 Telemetry is ${color(status)}`);
    
    if (enabled) {
      this.log(chalk.gray('Anonymous usage data helps improve SnapAI.'));
      this.log(chalk.gray('To disable: snapai config --telemetry false'));
    } else {
      this.log(chalk.gray('No usage data is collected.'));
      this.log(chalk.gray('To enable: snapai config --telemetry true'));
    }
  }
}