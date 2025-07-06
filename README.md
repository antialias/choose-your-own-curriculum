# Choose Your Own Curriculum

A web application for planning and tracking long term learning goals. Users define topic graphs and upload work samples. The app stores metadata and embeddings to recommend what to study next.

## Tech Stack

- **Next.js** with React Server Components and Server Side Rendering
- **StyleX** for styling
- **TypeScript** throughout
- **SQLite** database accessed via Drizzle ORM with migrations
- **Vitest** for unit and e2e testing
- **Storybook** for component development
- **NextAuth** for authentication
- **Casbin** for access control
- **GitHub Actions** build Docker images and push to GCR

## Development

```bash
pnpm install
pnpm dev
```

### Tests

```bash
pnpm test
```

### Storybook

```bash
pnpm storybook
```

## Contributing

Ensure all tests pass and lint before submitting PRs. See `AGENTS.md` for automation guidelines.
Remaining tasks and future work are documented in `TASKS.md`.
