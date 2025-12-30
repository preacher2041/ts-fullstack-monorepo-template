# Mythmaker Monorepo

A monorepo for Mythmaker projects using pnpm workspaces.

## Docker Setup

This monorepo is fully dockerized with both production and development configurations.

### Quick Start

#### Production Builds

Build and run the production web app:
```bash
docker-compose up web
# Access at http://localhost:8080
```

Build and run the production design system (Storybook):
```bash
docker-compose up design-system
# Access at http://localhost:8081
```

#### Development Mode

Run the web app in development mode with hot reload:
```bash
docker-compose up web-dev
# Access at http://localhost:9000
```

Run Storybook in development mode:
```bash
docker-compose up design-system-dev
# Access at http://localhost:6006
```

### Building Individual Services

You can also build and run individual services:

**Web App (Production):**
```bash
docker build -f apps/web/Dockerfile -t mythmaker-web .
docker run -p 8080:80 mythmaker-web
```

**Web App (Development):**
```bash
docker build -f apps/web/Dockerfile.dev -t mythmaker-web-dev .
docker run -p 9000:9000 -v $(pwd):/app mythmaker-web-dev
```

**Design System (Production):**
```bash
docker build -f apps/design-system/Dockerfile -t mythmaker-design-system .
docker run -p 8081:80 mythmaker-design-system
```

**Design System (Development):**
```bash
docker build -f apps/design-system/Dockerfile.dev -t mythmaker-design-system-dev .
docker run -p 6006:6006 -v $(pwd):/app mythmaker-design-system-dev
```

### Docker Compose Services

- `web` - Production web app (port 8080)
- `web-dev` - Development web app with hot reload (port 9000)
- `design-system` - Production Storybook build (port 8081)
- `design-system-dev` - Development Storybook (port 6006)

### Notes

- All Dockerfiles use multi-stage builds for optimized image sizes
- Development containers use volume mounts for live code reloading
- The build context is the monorepo root to properly handle pnpm workspace dependencies
- Production builds use nginx to serve static assets 