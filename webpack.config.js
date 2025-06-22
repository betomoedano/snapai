const path = require('path');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: './dist/index.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: 'iconiq.js',
    library: {
      type: 'commonjs2'
    }
  },
  externals: {
    // Keep these as external dependencies
    '@oclif/core': '@oclif/core',
    '@oclif/plugin-help': '@oclif/plugin-help',
    'openai': 'openai',
    'fs-extra': 'fs-extra',
    'chalk': 'chalk',
    'inquirer': 'inquirer',
    'fs': 'fs',
    'path': 'path',
    'os': 'os'
  },
  plugins: [
    new JavaScriptObfuscator({
      rotateStringArray: true,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      stringArrayThreshold: 0.8,
      transformObjectKeys: true,
      unicodeEscapeSequence: false,
      identifierNamesGenerator: 'hexadecimal',
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4
    }, [])
  ],
  resolve: {
    extensions: ['.js']
  }
};