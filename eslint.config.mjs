import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'logs/**',
      '*.log',
      'coverage/**',
      'build/**',
      '.eslintcache',
      'node_modules/**',
      'release/**',
      'dist/**',
      'dll/**',
      '.erb/**',
      '__snapshots__/**',
      'src/ui/gql/generated/types.ts',
      'assets/assets.d.ts',
      '*.css.d.ts',
      '*.sass.d.ts',
      '*.scss.d.ts',
      'dependencies/**',
      'src/main.prod.js',
      'src/main.prod.js.map',
      'src/renderer.prod.js',
      'src/renderer.prod.js.map',
      'src/style.css',
      'src/style.css.map',
      'main.js',
      'main.js.map',
      'eslint.config.mjs',
    ],
  },

  // Base recommended rules
  js.configs.recommended,

  // TypeScript recommended
  ...tseslint.configs.recommended,

  // Stylistic formatting (replaces Prettier)
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    jsx: true,
    commaDangle: 'always-multiline',
    braceStyle: '1tbs',
    arrowParens: true,
    quoteProps: 'as-needed',
  }),

  // Global settings
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // React + React Hooks + JSX-A11y
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // React 19 JSX transform
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Rules from old config
      'react/prop-types': 'off',
      'react/no-array-index-key': 'off',
      'react/display-name': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/function-component-definition': ['error', {
        namedComponents: 'arrow-function',
      }],

      // JSX-A11y
      'jsx-a11y/accessible-emoji': 'off',

      // React hooks
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Core rules (ported from old config)
  {
    rules: {
      'no-case-declarations': 'off',
      'no-plusplus': 'off',
      'class-methods-use-this': 'off',
      'no-console': ['warn', { allow: ['error'] }],
      'linebreak-style': 'off',
      'no-param-reassign': ['error', { props: false }],

      // Prefer modern patterns
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'object-shorthand': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-eval': 'error',
      'no-proto': 'error',
      'no-iterator': 'error',
      'no-new-wrappers': 'error',
      'no-caller': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-with': 'error',
      'no-void': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-rename': 'error',
      'no-multi-assign': 'error',
      'no-nested-ternary': 'error',
      'one-var': ['error', 'never'],
      radix: 'error',
    },
  },

  // TypeScript-specific overrides
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'no-undef': 'off',
    },
  },

  // Stylistic overrides
  {
    rules: {
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/max-len': 'off',
    },
  },

  // .erb/configs and .erb/scripts overrides
  {
    files: ['.erb/configs/**/*.ts', '.erb/configs/**/*.js'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['.erb/scripts/**/*.ts', '.erb/scripts/**/*.js'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
