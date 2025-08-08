import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  // Ignore build outputs and dependencies
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.config.{js,ts,d.ts}',
      'src/vite-env.d.ts',
      'src/routeTree.gen.ts',
      'scripts/**',
      'coverage/**',
      'src/__mocks__/**',
      'src/styled-system/**',
      'postcss.config.js',
    ],
  },

  // Recommended ESLint rules
  eslint.configs.recommended,

  // Strict and stylistic TypeScript rules
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // React recommended settings (including JSX runtime)
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],

  // React Hooks recommended rules
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  // React Refresh rules (useful for Fast Refresh)
  reactRefresh.configs.recommended,

  // Custom TypeScript and React rules
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            'args',
            'rotation',
            'anchor',
            'scale',
            'draw',
            'texture',
            'text',
            'style',
            'jsx',
          ],
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Disable unsafe rules for Panda CSS generated functions
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',

      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Prettier to override conflicting style rules
  prettier,
)