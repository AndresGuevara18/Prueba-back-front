import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { process: 'readonly', __dirname: 'readonly', module: 'readonly', require: 'readonly' },
    },
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-unused-vars': 'warn',
      'no-useless-catch': 'warn',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { console: 'readonly', document: 'readonly', window: 'readonly', fetch: 'readonly', alert: 'readonly', confirm: 'readonly', prompt: 'readonly', navigator: 'readonly', URL: 'readonly', setTimeout: 'readonly' },
    },
    rules: {
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'no-console': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'warn',
      'no-useless-catch': 'warn',
    },
  },
];
