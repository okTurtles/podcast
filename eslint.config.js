import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tsEslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist/', 'public/', '.astro/']),
  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tsEslint.configs.recommended
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
])
