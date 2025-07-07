# Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY app/package.json app/pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Build the Next.js app
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY app/ .
RUN pnpm build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY app/package.json ./package.json
COPY app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable && pnpm install --prod --frozen-lockfile
EXPOSE 3000
CMD ["pnpm", "start"]
