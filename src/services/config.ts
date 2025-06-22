import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { ConfigData } from '../types.js';

export class ConfigService {
  private static configPath = path.join(os.homedir(), '.snapai', 'config.json');

  static async getConfig(): Promise<ConfigData> {
    try {
      await fs.ensureFile(this.configPath);
      const config = await fs.readJSON(this.configPath);
      return {
        telemetry_enabled: true,
        ...config
      };
    } catch {
      return {
        telemetry_enabled: true
      };
    }
  }

  static async setConfig(updates: Partial<ConfigData>): Promise<void> {
    const current = await this.getConfig();
    const updated = { ...current, ...updates };
    await fs.ensureDir(path.dirname(this.configPath));
    await fs.writeJSON(this.configPath, updated, { spaces: 2 });
  }

  static async get<K extends keyof ConfigData>(key: K): Promise<ConfigData[K]> {
    const config = await this.getConfig();
    return config[key];
  }

  static async set<K extends keyof ConfigData>(key: K, value: ConfigData[K]): Promise<void> {
    await this.setConfig({ [key]: value } as Partial<ConfigData>);
  }
}