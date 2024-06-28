module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:compat/recommended',
    'plugin:prettier/recommended'
  ],
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
    'import/no-relative-packages': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function'
      }
    ],
    'react/require-default-props': [
      'error',
      { ignoreFunctionalComponents: true }
    ],
    'no-console': ['warn', { allow: ['error'] }],
    // No need to enforce linebreak styles since "* text=auto" in .gitattributes will ensure LF is committed to the repo
    'linebreak-style': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-param-reassign': ['error', { props: false }],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ]
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true
  },
  env: {
    browser: true,
    node: true
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts')
      }
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    }
  },
  plugins: ['import']
};
