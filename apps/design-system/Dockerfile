# Multi-stage build for design-system (Storybook)
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all packages (needed for workspace dependencies)
COPY packages ./packages

# Copy the design-system app
COPY apps/design-system ./apps/design-system

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder

WORKDIR /app

# Build Storybook
RUN pnpm --filter design-system build

# Production stage
FROM nginx:alpine AS production

# Copy built Storybook from builder
COPY --from=builder /app/apps/design-system/storybook-static /usr/share/nginx/html

# Copy nginx configuration
COPY apps/design-system/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

