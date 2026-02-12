module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react', 'react-native'],
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'android/',
    'ios/',
    'vendor/',
    '.eslintrc.js',
    'babel.config.js',
    'jest.config.js',
    'metro.config.js',
    '__mocks__',
    '__tests__',
  ],
  rules: {
    'no-console': 'error',
    'no-unused-vars': 'off',
    'react-native/no-unused-styles': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'react/no-children-prop': 'off',
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/__tests__/**',
        '**/__mocks__/**',
        'jest.setup.js',
      ],
      env: {
        jest: true,
      },
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
