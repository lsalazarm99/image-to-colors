module.exports = {
  root: true,
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsConfigRootDir: __dirname,
    project: [
      './tsconfig.eslint.json'
    ]
  },
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
    'plugin:jest/style',
    "prettier",
    'prettier/@typescript-eslint',
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    'coverage',
    '**/*.config.js',
  ],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 0,
  },
};
