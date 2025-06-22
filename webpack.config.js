import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './dist/index.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: 'snapai.js',
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  externals: {
    // Keep these as external dependencies
    '@oclif/core': '@oclif/core',
    '@oclif/plugin-help': '@oclif/plugin-help',
    'openai': 'openai',
    'fs-extra': 'fs-extra',
    'chalk': 'chalk',
    'fs': 'fs',
    'path': 'path',
    'os': 'os'
  },
  resolve: {
    extensions: ['.js']
  }
};