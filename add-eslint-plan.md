# Plan: Add ESLint

Spec: `.claude/_specs/add-eslint.md`
Branch: `sebin/task/#2-setup-lint-for-project`

## Decisions

Taken from the spec and its open questions. Items marked *(default)* weren't answered in the spec; they use the recommended option and can be changed before implementation.

| Question | Decision |
|---|---|
| Style preset | `neostandard` (flat config successor of `standard`) |
| TypeScript rules | Non-type-aware `typescript-eslint` recommended set, via neostandard's `ts` option *(default)* |
| Lint vs. build | `lint` becomes a dependency of `build`: `deno task build` runs lint first and stops if it fails (spec answer) |
| Existing violations | Fixed in the same PR, as a separate auto-fix commit so the review stays readable *(default)* |
| Astro a11y rules | Not enabled now; can be added later *(default)* |
| SCSS / Stylelint | Out of scope *(default)* |
| CI workflow | None (spec answer: lint runs through `build`) |

## Blocker: version compatibility and the 14-day dependency age

`deno.json` sets `minimumDependencyAge: P14D`, so today (2026-10-17) only versions published on or before 2026-10-03 can be installed. Checked on the npm registry:

- `neostandard` added ESLint 10 support only in **0.14.0, published 2026-10-08**. The newest installable version, 0.13.0, supports ESLint 9 only.
- `eslint-plugin-astro` 2.x and 3.x require **ESLint 10 or newer**. The last version that supports ESLint 9 is 1.7.0.

So the latest neostandard and the latest Astro plugin can't be installed together until neostandard 0.14.0 reaches 14 days old on **2026-10-22**.

Options:

- **A. Wait until 2026-10-22 (recommended).** Use the current stack: ESLint 10 + neostandard 0.14.x + eslint-plugin-astro 3.x. No later major upgrade needed.
- **B. Start now on the ESLint 9 stack.** ESLint 9.39.5 + neostandard 0.13.0 + eslint-plugin-astro 1.7.0, all installable today. This needs an ESLint 10 / Astro plugin 3 upgrade later.

The rest of this plan assumes **A**. With B, only the versions in step 1 change.

### Target versions (option A)

Exact versions are the newest ones at least 14 days old on the day of implementation. Expected at 2026-10-22:

| Package | Version | Why |
|---|---|---|
| `eslint` | 10.12.x | Core. 10.13.0 is too new until 2026-10-30 |
| `neostandard` | 0.14.0 | Standard style. Brings `typescript-eslint`, `@stylistic/eslint-plugin`, `eslint-plugin-n`, `eslint-plugin-promise` and `globals` as its own dependencies |
| `typescript-eslint` | 8.71.x | Pinned directly so Vue and Astro use the same TS parser as neostandard |
| `typescript` | 6.0.3 | Required peer of `typescript-eslint`, which supports `<6.1.0`. **Not 7.x**, the npm `latest` |
| `eslint-plugin-vue` | 10.11.1 | Vue 3 rules, `flat/recommended` |
| `vue-eslint-parser` | 10.4.1 | Required peer of `eslint-plugin-vue` |
| `eslint-plugin-astro` | 3.2.1 | Astro rules, `flat/recommended`. Includes `astro-eslint-parser` |
| `globals` | 17.13.0 | Browser and Node global sets for the config |

`eslint-plugin-jsx-a11y` is an optional peer of the Astro plugin and isn't needed because a11y rules aren't enabled.

## Steps

### 1. Dependencies
- Add the packages above to the `imports` map in `deno.json`, pinned to exact versions.
- Run `deno install` and confirm `deno.lock` updates without errors or age-limit refusals.
- Confirm `npm:typescript` resolves to 6.0.x in the lock file, not 7.x.

### 2. ESLint config (`eslint.config.js` at the project root)
Build it from these layers, in order:

1. **Ignores:** `dist/`, `.astro/`, `node_modules/`, `public/` and `src/pages/episodes/` (Markdown/MDX, not linted).
2. **neostandard** with `ts: true`. Covers `.js`, `.mjs` and `.ts` with standard style plus the recommended `typescript-eslint` rules.
3. **Vue:** `eslint-plugin-vue`'s `flat/recommended` for `.vue`, with `vue-eslint-parser` and `typescript-eslint`'s parser for `<script setup lang="ts">` blocks. All 6 Vue components use `lang="ts"`.
4. **Astro:** `eslint-plugin-astro`'s `flat/recommended` for `.astro` (frontmatter and `<script>` blocks), also with the TS parser.
5. **Globals:**
   - Browser globals for `.vue` files and Astro client scripts.
   - Node globals for `astro.config.mjs` and the ESLint config.
   - `Plyr` as a read-only global, used by `src/components/AudioPlayer.vue:29`.
6. **Rule tweaks**, only where needed after step 4's first run:
   - Turn off Vue template formatting rules that clash with neostandard's `@stylistic` rules, so formatting has one owner.
   - Make sure the `@/` alias and `astro:*` virtual imports aren't reported. neostandard doesn't enable import-resolution rules, so this is a check rather than an expected change.

`import.meta.glob` in `src/helpers.ts:28` and `src/pages/rss.xml.js:20` needs no special handling: it's valid syntax and not a global.

### 3. Deno tasks (`deno.json`)
- **`lint`:** runs ESLint over the project. Permissions: `--allow-read`, `--allow-env`, `--allow-sys`, and `ASTRO_TELEMETRY_DISABLED=1` only if the Astro parser turns out to need it. No write and no network. Adjust after the first real run if ESLint or a plugin asks for a missing permission, and add only what's asked for.
- **`lint:fix`:** same as `lint`, plus `--fix` and `--allow-write=.`.
- **`build`:** change to object form, keeping the existing command and adding `"dependencies": ["lint"]`.

### 4. First run and fixing existing code
- Run `deno task lint` and record the number of problems per rule.
- **Commit 1:** config, tasks and dependencies only.
- **Commit 2:** the output of `deno task lint:fix` on its own, for style only. The code already mostly matches standard style (no semicolons in `.ts`/`.js` except `src/types.ts`), so this should be small.
- **Commit 3:** manual fixes for whatever auto-fix can't handle. Where a rule must be disabled, use a single-line disable comment with a reason, never a file-wide one.

### 5. Documentation
- **`README.md`:** add `deno task lint` and `deno task lint:fix` to the commands table, and mention that `build` runs lint first.
- **`AGENTS.md`:**
  - Add the lint tasks to Commands.
  - Replace "There is no lint, type-check or test script" with: lint exists and runs before every build; there's still no type-check or test script.
  - Note the `typescript` < 6.1 pin and the neostandard/ESLint 10 version coupling.

### 6. Verification (spec's Testing Guidelines)
- `deno task lint` exits 0 on the branch.
- Add a deliberate violation to each of `.ts`, `.js`, `.vue` and `.astro` (an unused variable, double quotes): lint reports the file and rule. Revert.
- Add one auto-fixable error: `deno task lint:fix` fixes it and writes nothing outside the project.
- Lint never reports files in `dist/`, `.astro/` or `public/third-party/`.
- With a violation present, `deno task build` stops before Astro starts. Without one, it builds successfully.
- Compare `dist/rss.xml` and a few episode pages with a `main` build. They should be identical; the auto-fix commit must not change behavior.

### 7. Pull request
- Clearly state that **`deno task build` now runs lint first and fails on lint errors.** This affects the project owner's deploy, so it needs their agreement. This replaces the spec's acceptance criterion that said the deployed build isn't affected.
- List the pinned versions and why `typescript` is held at 6.0.x.

## Risks
- **Deno permissions:** ESLint or a parser may need extra permissions such as env or sys access. Handle it by adding the specific flag asked for, never `--allow-all`.
- **Deno's own TypeScript:** Deno ships TS 6.0.3 internally, but `typescript-eslint` uses the npm `typescript` package, so only the import-map pin matters.
- **Rule clashes between Vue/Astro and `@stylistic`:** expect a few clashes in `.vue` templates; step 2.6 handles them.
- **Deploy blocked by style errors:** this is the intended effect of the `build` decision and is called out in the PR.
