# Multi-stage build for API
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all packages (needed for workspace dependencies)
COPY packages ./packages

# Copy the API app
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter @mythmaker/api generate

# Development stage
FROM base AS development

WORKDIR /app

EXPOSE 3000

# Start dev server with nodemon
CMD ["pnpm", "--filter", "@mythmaker/api", "dev"]

# Production stage
FROM base AS production

WORKDIR /app

# Build TypeScript
RUN pnpm --filter @mythmaker/api build

EXPOSE 3000

# Start production server
CMD ["node", "apps/api/dist/index.js"]
