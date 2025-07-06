# Choose Your Own Curriculum

A web application for planning and tracking long term learning goals. Users define topic graphs and upload work samples. The app stores metadata and embeddings to recommend what to study next.

## Tech Stack

- **Next.js** with React Server Components and Server Side Rendering
- **StyleX** for styling
- **TypeScript** throughout
- **SQLite** database accessed via Prisma ORM
- **Vitest** for unit and e2e testing
- **Storybook** for component development
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

### Configuration

Create an `.env` file based on `.env.example` and provide SMTP credentials for email authentication:

```
NEXTAUTH_SECRET=yourSecret
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=username
EMAIL_SERVER_PASSWORD=password
EMAIL_FROM=Example <noreply@example.com>
```

## Contributing

Ensure all tests pass and lint before submitting PRs. See `AGENTS.md` for automation guidelines.
Remaining tasks and future work are documented in `TASKS.md`.
