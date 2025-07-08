# Choose Your Own Curriculum

<<<<<<< HEAD
Choose Your Own Curriculum is a web application for planning and tracking long term learning goals. It lets users define topic graphs, upload work samples and stores embeddings to recommend what to study next.
||||||| 5f73234
A web application for planning and tracking long term learning goals. Users define topic graphs and upload work samples. The app stores metadata and embeddings to recommend what to study next.

Users can authenticate via email. Use the navigation bar's **Sign in** link to open the `/login` page. Once signed in, the link changes to **Sign out**. The navigation bar also links to the **Uploaded Work** page and the **My Curriculums** page.

The home page includes a math skill selector that generates prerequisite graphs as JSON using the built-in LLM client. The graphs are converted to Mermaid diagrams only when rendered.
=======
A web application for planning and tracking long term learning goals. Users define topic graphs and upload work samples. The app stores metadata and embeddings to recommend what to study next.

Users can authenticate via email. Use the navigation bar's **Sign in** link to open the `/login` page. Once signed in, the link changes to **Sign out**. The navigation bar links to **Upload Work**, **Curriculums** and **Students**.

The Curriculum Generator moved to `/curriculum-generator`. Start there from the **Curriculums** page to generate prerequisite graphs.
>>>>>>> vze0e8-codex/rename-home-page-to-curriculum-generator

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

Usage documentation is in the [docs](docs/) directory. Refer to those files for feature guides and additional information.
