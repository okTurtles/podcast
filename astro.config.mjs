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
      // Lets SCSS '@use "@/styles/..."' resolve; the tsconfig 'paths' alias does not reach Sass.
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
      // Without a package.json, Astro leaves @astrojs/vue external in the server build,
      // and its 'virtual:' import then fails at runtime.
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
