FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY scripts ./scripts
RUN corepack enable && pnpm install --frozen-lockfile
CMD ["pnpm", "--filter", "@influencerstudio/convex-schema", "dev"]
