import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tsEslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginAstro from 'eslint-plugin-astro'

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
    ]
  },
  {
    files: ['**/*.vue'],
    extends: [
      js.configs.recommended,
      tsEslint.configs.recommended,
      pluginVue.configs['flat/essential']
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        Plyr: 'readonly'
      },
      parserOptions: {
        parser: tsEslint.parser
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    files: ['**/*.astro'],
    extends: [
      js.configs.recommended,
      tsEslint.configs.recommended,
      pluginAstro.configs.recommended
    ]
  },
  {
    files: ['**/*.{ts,vue,astro}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
])
