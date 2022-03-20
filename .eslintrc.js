module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/prop-types': 'off',
    'react/no-array-index-key': 'off',
    'react/display-name': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-case-declarations': 'off',
    'no-plusplus': 'off',
    'promise/always-return': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/require-default-props': [
      'error',
      { ignoreFunctionalComponents: true },
    ],
    // No need to enforce linebreak styles since "* text=auto" in .gitattributes will ensure LF is committed to the repo
    'linebreak-style': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.js'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  plugins: ['import'],
};
