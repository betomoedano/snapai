import { TelemetryData } from '../types.js';
import { ConfigService } from './config.js';

export class TelemetryService {
  private static ENDPOINT = 'https://api.iconiq-analytics.com/v1/track';

  static async track(data: TelemetryData): Promise<void> {
    // Only track if user hasn't opted out
    if (!(await this.isEnabled())) return;

    try {
      const { default: fetch } = await import('node-fetch');
      
      await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `iconiq-cli/${data.version}`
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      // Fail silently - never break user experience
    }
  }

  static async isEnabled(): Promise<boolean> {
    return await ConfigService.get('telemetry_enabled') !== false;
  }

  static generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}