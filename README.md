# Choose Your Own Curriculum

Choose Your Own Curriculum is a web application for planning and tracking long term learning goals. It lets users define topic graphs, upload work samples and stores embeddings to recommend what to study next.

## Tech Stack

- **Next.js** with React Server Components and Server Side Rendering
- **Panda CSS** for styling
- **Mermaid diagrams** rendered with `react-mermaid2`
- **TypeScript** throughout
- **SQLite** database accessed via Drizzle ORM with migrations
- **Vitest** for unit and e2e testing
- **Storybook** for component development
- **NextAuth** for authentication
- **Casbin** for access control
- **LLM Client** uses OpenAI-compatible API with Zod schema validation ([docs](app/src/llm/README.md))
- **GitHub Actions** build Docker images and push to GCR

## Quick Start

This project requires **Node.js 22**. After installing it with `nvm`, run:

```bash
pnpm install
pnpm dev
```

Run `pnpm test` and `pnpm test:e2e` to execute unit and end-to-end tests. Build the project with `pnpm build`.

## Contributing

Before opening a pull request run `pnpm format`, `pnpm lint`, `pnpm run typecheck`, `pnpm test` and `pnpm test:e2e`. See `AGENTS.md` for full automation guidelines. Remaining tasks are listed in `TASKS.md`.

## Documentation

Usage documentation has moved to the [docs](docs/) directory. Refer to those files for feature guides and additional information.
