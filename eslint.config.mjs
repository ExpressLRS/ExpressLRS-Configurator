import _import from 'eslint-plugin-import';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [{
  ignores: [
    '**/logs',
    '**/*.log',
    '**/pids',
    '**/*.pid',
    '**/*.seed',
    '**/lib-cov',
    '**/coverage',
    '**/.grunt',
    '**/.lock-wscript',
    'build/Release',
    '**/.eslintcache',
    '**/node_modules',
    '**/.DS_Store',
    '**/release',
    'src/*.main.prod.js',
    'src/main.prod.js',
    'src/main.prod.js.map',
    'src/renderer.prod.js',
    'src/renderer.prod.js.map',
    'src/style.css',
    'src/style.css.map',
    '**/dist',
    '**/dll',
    '**/main.js',
    '**/main.js.map',
    '**/.idea',
    '**/npm-debug.log.*',
    '**/__snapshots__',
    'src/ui/gql/generated/types.ts',
    'assets/assets.d.ts',
    '**/package.json',
    '**/.travis.yml',
    '**/*.css.d.ts',
    '**/*.sass.d.ts',
    '**/*.scss.d.ts',
    '**/dependencies',
    '**/.eslintrc.js'
  ]
}, ...compat.extends(
  'airbnb',
  'airbnb-typescript',
  'airbnb/hooks',
  'plugin:@typescript-eslint/recommended',
  'plugin:jest/recommended',
  'plugin:promise/recommended',
  'plugin:compat/recommended',
  'plugin:prettier/recommended'
), {
  plugins: {
    import: fixupPluginRules(_import)
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node
    },

    parser: tsParser,
    ecmaVersion: 2020,
    sourceType: 'module',

    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: './',
      createDefaultProgram: true
    }
  },

  settings: {
    'import/resolver': {
      node: {},

      webpack: {
        config: './.erb/configs/webpack.config.eslint.ts'
      }
    },

    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    }
  },

  rules: {
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

    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function'
    }],

    'react/require-default-props': ['error', {
      ignoreFunctionalComponents: true
    }],

    'no-console': ['warn', {
      allow: ['error']
    }],

    'linebreak-style': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',

    'no-param-reassign': ['error', {
      props: false
    }],

    'prettier/prettier': ['error', {
      endOfLine: 'auto'
    }]
  }
}];
