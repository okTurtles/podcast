# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project

Static site for the okTurtles Podcast (https://podcast.okturtles.org/), built with Astro 5, Vue 3 islands and SCSS. The site's main outputs are the episode pages and the podcast RSS feed at `/rss.xml`.

## Commands

```sh
deno install        # install dependencies into node_modules/ (after cloning or changing deno.json)
deno task dev       # dev server
deno task build     # static build into dist/
deno task preview   # serve the built dist/
```

There is no lint, type-check or test script. `deno task build` is the only automated check; after touching the feed, inspect `dist/rss.xml` (the README lists external feed validators).

- The project runs on Deno, with no `package.json`. Dependencies are npm packages pinned to exact versions in the `imports` map of `deno.json` and locked in `deno.lock`. The Astro version appears in both the `imports` map and the three task commands; keep them in sync.
- Tasks run Astro with an explicit permission list rather than `--allow-all` (network is limited to localhost) and set `ASTRO_TELEMETRY_DISABLED=1`; without it Astro tries to write its telemetry config outside the project, which the write permission denies.
- `vite.ssr.noExternal: ['@astrojs/vue']` in `astro.config.mjs` is required for the build: without a `package.json`, `@astrojs/vue` is otherwise left external and its `virtual:` import fails at runtime.
- Episode MP3s (`public/media/audios/episodes/*.mp3`) are stored in Git LFS (`.gitattributes`); `git lfs` is needed to fetch or add them.

## Architecture

### Episodes are Markdown pages

Each episode is `src/pages/episodes/<n>.md`, routed by Astro's file-based routing and rendered through `src/layouts/EpisodePageLayout.astro` (set via the `layout` frontmatter key). There is no content collection; the frontmatter is the single source of truth for the page, the episode lists, the tag pages and the RSS feed. Its shape is the `Episode` interface in `src/types.ts`.

Adding an episode means adding:

1. `src/pages/episodes/<n>.md` with the full frontmatter (copy the latest episode)
2. `public/media/audios/episodes/<n>.mp3` (LFS)
3. `public/images/episode-covers/ep<n>.jpg` (`coverImage` is the bare filename; the directory is prepended in code)

Frontmatter fields that feed the RSS `<enclosure>` and `<guid>` must be accurate: `filesize` is the MP3 size in bytes, `filetype` its MIME type, `duration` is `HH:MM:SS` (or `MM:SS`), and `guid` is a unique UUID that must not change once published. `episode` (number) is the sort key everywhere.

### Episode data access

`getAllEpisodes()` in `src/helpers.ts` loads all episodes with `import.meta.glob('./pages/episodes/*.{md,mdx}', { eager: true })` and attaches `details` (frontmatter + compiled HTML as `epContent`). Tag helpers there derive everything from episode `tags`; there is no separate tag registry. Tag URLs replace whitespace with underscores (`getTagLink` / `whiteSpaceToUnderscore`), and `src/pages/tag/[tag].astro` must use the same transform in `getStaticPaths`.

`EpisodeList.vue` is hydrated with `client:load` and calls `getAllEpisodes()` itself when no `episodeList` prop is passed, so that helper also runs in the client bundle.

### RSS feed

`src/pages/rss.xml.js` builds the feed XML by hand using the string helpers in `src/utils/rss-generation.ts` (not `@astrojs/rss`), following Apple Podcasts requirements and the PSP-1 spec linked in the source comments. Channel-level metadata comes from `src/constants.ts`; `SITE_URL` there is also used as Astro's `site` in `astro.config.mjs`. `generateXMLTag` escapes content unless it contains a CDATA block or `noEscape` is passed. Each item carries the post as sanitized HTML (`content:encoded`, `itunes:summary`) and as plain text (`description`).

### Layout and client-side pieces

- `PageLayout.astro` wraps every page (`BaseHead`, `Header`, `Footer`). It takes `pageType` (`'default' | 'episode'`), which sets the `is-<pageType>` body class and the header variant, and puts the episode number on `<body data-episode>`, which `HeaderButtons.vue` reads on the client.
- Plyr is not an npm dependency. `EpisodePageLayout.astro` injects `public/third-party/plyr.3.7.8.min.js` as an inline script through the `head-append` slot, and `AudioPlayer.vue` uses the global `Plyr`. A `?play` query parameter on an episode URL triggers autoplay.
- Cross-island state uses nanostores (`src/store/toast.ts`, consumed via `@nanostores/vue`).

### Styles

Global styles are loaded once via `src/styles/main.scss` (imported in `BaseHead.astro`). Component `<style lang="scss">` blocks pull in variables, colors and mixins with `@use '@/styles/variables' as *;` (e.g. the `from($tablet)` breakpoint mixin). Class naming: `c-` for component-scoped classes, `l-` for layout, `is-` for state modifiers. `@/` aliases `src/` (`tsconfig.json`).

## CI

The only workflows (`.github/workflows/pull-review*.yml`) run an AI PR review when a member, owner or collaborator comments `/review` on a pull request. Nothing builds or deploys from CI.
