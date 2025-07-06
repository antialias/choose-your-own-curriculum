# Choose Your Own Curriculum

A web application for planning and tracking long term learning goals. Users define topic graphs and upload work samples. The app stores metadata and embeddings to recommend what to study next.

Users can authenticate via email. Use the navigation bar's **Sign in** link to open the `/login` page. Once signed in, the link changes to **Sign out**.

## Tech Stack

- **Next.js** with React Server Components and Server Side Rendering
- **StyleX** for styling
- **TypeScript** throughout
- **SQLite** database accessed via Drizzle ORM with migrations
- **Vitest** for unit and e2e testing
- **Storybook** for component development
- **NextAuth** for authentication
- **Casbin** for access control
- **LLM Client** uses OpenAI-compatible API with Zod schema validation ([docs](app/src/llm/README.md))
- **GitHub Actions** build Docker images and push to GCR

## Development
This project requires **Node.js 22**. Install it via `nvm`:

```bash
nvm install 22
nvm use 22
```


`pnpm install` automatically rebuilds native modules like `better-sqlite3` for
the current Node version. If you encounter binding errors, you can manually
rebuild with:

```bash
npm rebuild better-sqlite3
```


```bash
pnpm install
pnpm exec drizzle-kit migrate
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
