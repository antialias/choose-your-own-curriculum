# Programming Agent Guidance

- Run `pnpm install` before other commands.
- Use `pnpm lint`, `pnpm test`, and `pnpm build` to validate changes.
- A task is not complete until `pnpm typecheck` succeeds.
- Keep styles in StyleX and ensure new components have Storybook stories and tests.
- Database migrations are managed with Drizzle. Run `pnpm exec drizzle-kit push` after schema changes.
- Migrations live in `app/drizzle` and are ordered via `app/drizzle/meta/_journal.json`.
- Each SQL statement in a migration must end with `--> statement-breakpoint` so the migrator can execute them individually. Missing breakpoints cause a `RangeError` about multiple statements.
- `pnpm exec drizzle-kit push` generates these breakpoints automatically and updates the journal file.
- `src/db/index.ts` runs migrations on startup when the `drizzle` folder exists. Commit both the new SQL and updated metadata.
- Update documentation when adding features.
