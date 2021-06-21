module.exports = {
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'prettier',
    'prettier/react',
  ],
  plugins: ['prettier', 'unicorn'],
  env: {
    node: true,
    browser: false,
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { peerDependencies: true }],
    'prettier/prettier': 'error',
    'unicorn/prevent-abbreviations': 'off',
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      rules: {
        'no-param-reassign': 'off',
      },
    },
  ],
};
