module.exports = {
  env: {
    browser: true,
  },
  root: true,
  extends: ['prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  globals: {
    JSX: true,
    node: true,
    es6: true,
  },
  rules: {
    'react-native/no-inline-styles': 0,
    'prettier/prettier': 0,
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['index', 'sibling', 'parent']],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        pathGroups: [
          {
            pattern: 'aidbox-react/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'fhir-react/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'shared/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: 'src/**',
            group: 'internal',
            position: 'after',
          },
        ],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};
