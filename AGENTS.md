# Programming Agent Guidance

This repository is a Next.js TypeScript project that uses Biome for formatting and linting, Vitest for testing, and Panda CSS for styling.

## Setup

- Run `pnpm install` before other commands. If Biome or Rollup binaries are missing afterwards, run:
  `pnpm install @biomejs/cli-linux-x64 @rollup/rollup-linux-x64-gnu`.

## Formatting and Linting

- Run `pnpm run format` before committing to apply Biome's formatting.
- Ensure `pnpm run lint` exits with no errors or warnings. If you changed Markdown files, run `pnpm run lint:md`.
- A task is not complete until `pnpm run typecheck` succeeds and no new TypeScript errors remain.

## Testing

- Execute `pnpm test` and `pnpm test:e2e` after linting. All tests must pass.
- Use `pnpm build` to verify the project builds successfully.
- Provide manual testing instructions for reviewers.

## Styles and UI

- Use Panda CSS `css` utilities for new styles. Components should include Storybook stories and tests.

## Code Style

- Use 2‑space indentation, double quotes for strings, and end statements with semicolons.
- Import Node.js builtin modules using the `node:` protocol.
- Avoid `z-index` unless absolutely necessary and reference a variable when used.

## Dates and Times

- Parse and store timestamps in UTC ISO format. Let the client format and display dates.

## Next.js Dynamic APIs

- Type `params` and `searchParams` as `Promise` objects and `await` them before use.

## Drizzle Migrations

- Run `pnpm run generate-migrations` after schema changes. Migrations live in `app/drizzle` and are ordered via `app/drizzle/meta/_journal.json`. Under normal circumstances, there should be no need to edit a migration file after it has been generated. Exceptions may include adding something that the generated migration didn't pick up on, or transforming data along with the migration.
- Each SQL statement in a migration must end with `--> statement-breakpoint`. The command above generates these breakpoints and updates the journal file.
- `src/db/index.ts` runs migrations on startup when the `drizzle` folder exists. Commit both the new SQL and updated metadata.

## Other Rules

- Never manually edit files under `src/generated`.
- Commit updates to `pnpm-lock.yaml` in full and ensure the diff starts with `lockfileVersion` and ends with a newline. Never ever edit pnpm-lock by hand. If you need a change start first by looking at what you can change in package.json and then regenerate the lockfile.
- Follow [Semantic Commit Messages](https://www.conventionalcommits.org/).
- Update documentation when adding features.
