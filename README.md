# okTurtles Podcast

okTurtles Podcast.

## Development

This project is built with [Astro](https://astro.build/) and runs on [Deno](https://deno.com/) instead of Node.js and npm.

### Requirements

- [Deno](https://docs.deno.com/runtime/getting_started/installation/) 2.7.0 or higher. Check your version with `deno --version` and update it with `deno upgrade`.
- [Git LFS](https://git-lfs.com/), only if you need the episode audio files (see below).

### Setup

```sh
deno install      # install the dependencies
```

Run `deno install` again whenever `deno.json` changes.

The episode audio files are stored in Git LFS. Without it the site still runs and builds, but the audio does not play. You need it to add an episode or to build the site for deployment:

```sh
git lfs install   # once per machine
git lfs pull      # download the episode audio files
```

### Commands

| Command | What it does |
|---|---|
| `deno task dev` | Starts the development server at http://localhost:4321 |
| `deno task build` | Builds the site into the `dist/` folder |
| `deno task preview` | Serves the built `dist/` folder at http://localhost:4321 |
| `deno task stop-preview` | Stops a preview server left running in the background |

## Feed validation services

- https://www.castfeedvalidator.com/
- https://podcastai.com/feed-validator
- https://podba.se/validate/
- https://beamly.com/tools/podcast-feed-validator/

## License

All rights reserved.
