// @ts-check
import { SITE_URL } from './src/constants';
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
    ssr: {
      // Without a package.json, Astro leaves @astrojs/vue external in the server build,
      // and its 'virtual:@astrojs/vue/app' import then fails at runtime.
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
