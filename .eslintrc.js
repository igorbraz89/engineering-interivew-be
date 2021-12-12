module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: ['airbnb-typescript/base', 'plugin:prettier/recommended'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ['**/__tests__/**'],
      rules: {
        'no-unused-vars': 'warn',
        'no-underscore-dangle': 'off',
      },
    },
  ],
};
