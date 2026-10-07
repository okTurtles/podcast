// @ts-check
import { SITE_URL } from './src/constants';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  devToolbar: {
    enabled: false
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      // Makes the build include the code of @astrojs/vue in its output instead of loading the package separately.
      // This used to happen automatically with npm. Since we replaced package.json with deno.json it no longer does,
      // and the build fails with an error about a "virtual:" import.
      noExternal: ['@astrojs/vue']
    },
    // Sass-related options
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  },
  integrations: [
    mdx(),
    vue()
  ]
})
