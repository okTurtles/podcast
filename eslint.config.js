import eslintPluginAstro from 'eslint-plugin-astro'

export default [
  // Explicitly target Astro files in flat config.
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    }
  }
]
