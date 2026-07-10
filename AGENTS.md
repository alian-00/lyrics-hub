# Repository Guidelines

## Project Structure & Module Organization

This is a Nuxt 4 application for managing worship lyrics, song resources, and setlists. Frontend routes live in `app/pages`, shared page layout is in `app/app.vue`, and reusable Vue UI belongs in `app/components`. Server API handlers are under `server/api`, grouped by resource (`songs`, `setlists`, and `exports`). Server-side helpers are in `server/utils`, while seed and JSON-backed data are in `server/data`. Shared TypeScript contracts and helpers live in `shared/types` and `shared/utils`. Static public assets such as icons and robots metadata belong in `public`.

## Build, Test, and Development Commands

- `npm install`: install dependencies and run Nuxt preparation through `postinstall`.
- `npm run dev`: start the local Nuxt dev server on `127.0.0.1:3000`.
- `npm run build`: build the production application.
- `npm run generate`: generate a static output where supported by the app.
- `npm run preview`: preview the production build locally after building.

Use npm because `package-lock.json` is present.

## Coding Style & Naming Conventions

Use TypeScript for application and server code. Follow the existing style: two-space indentation, single quotes, no semicolons, and Vue single-file components with `<script setup lang="ts">`. Name Vue components in PascalCase, such as `SongEditor.vue`, and route files according to Nuxt conventions, such as `app/pages/songs/[id].vue`. Keep server route handlers close to their resource path and put cross-route logic in `server/utils`.

## Testing Guidelines

No test framework or test script is currently configured. Before adding behavioral changes, at minimum run `npm run build` to catch type and Nuxt integration issues. If tests are introduced, prefer Vitest for TypeScript utilities and Vue component logic, place specs beside the code or in a clear `tests` directory, and add an `npm test` script so contributors have one standard entry point.

## Commit & Pull Request Guidelines

This repository currently has no commit history, so no project-specific commit convention is established. Use concise, imperative commit subjects such as `Add song export endpoint` or `Fix setlist ordering`. Pull requests should include a short summary, verification steps, linked issues when available, and screenshots or screen recordings for UI changes. Note any data-shape changes that affect files in `server/data` or shared types.

## Security & Configuration Tips

Do not commit secrets or local environment overrides. Treat JSON files in `server/data` as development data unless the deployment model explicitly changes. Validate URLs and user-entered metadata at API boundaries before expanding persistence beyond the current file-backed storage.
