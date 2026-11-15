import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Context files intentionally export both a provider and its hook.
    files: ['src/context/*.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    // Data pages fetch on mount and on farm change; loading state is set
    // inside the async loader, which this rule flags as a sync effect update.
    files: ['src/pages/**/*.jsx', 'src/context/*.jsx'],
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },
])
