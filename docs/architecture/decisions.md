# Architectural Decisions

Decisions inferred from the code. Where intent is unclear, it is noted as an open question.

---

## Session-based authentication instead of JWTs

The template uses `express-session` with HTTP-only cookies rather than JWTs, despite `jsonwebtoken` being listed as a dependency.

**Inferred rationale:** HTTP-only session cookies are simpler to implement correctly for a web app (no client-side token storage, no token refresh logic, automatic expiry control) and avoid the class of XSS attacks that can steal tokens from `localStorage`. The session store is in-memory by default, which is fine for development but would need replacing (e.g. Redis, PostgreSQL) before production use.

**Open question:** `jsonwebtoken` is installed but never imported. It may have been included as a dependency for a future JWT-based option, or it was used in an earlier version of the template and not cleaned up.

---

## Layered API architecture (routes → controllers → services → Prisma)

The API is strictly layered with no cross-layer shortcuts. Services do not import from controllers; controllers do not import Prisma directly.

**Inferred rationale:** Clear boundaries make the codebase more testable (services can be unit-tested without HTTP, controllers can be tested without a real database) and make it easier to reason about where to add logic. The template enforces this by having services accept plain data types rather than `Request` objects... partially. `updateUser`, `updateUserPassword`, `deleteUser`, and `fetchUser` all accept `Request` directly — only `loginUser` and `createUser` take plain data. This inconsistency suggests the pattern is still being established.

**Open question:** The inconsistency in service signatures (some take `Request`, some take data objects) appears to be an oversight rather than intentional design. Services that take `Request` are harder to test without mocking Express objects.

---

## UI package exported as TypeScript source, not compiled

`packages/ui` sets `"main": "./src/index.ts"` in its `package.json`, exporting raw TypeScript rather than a compiled distribution.

**Inferred rationale:** Because all consumers (`apps/web`, `apps/design-system`) run through Vite or a TypeScript-aware bundler, compilation is not needed at the package boundary. This eliminates a build step and means changes to the UI library are immediately reflected in consuming apps without a separate `build` step. The trade-off is that the UI package cannot be published to npm without modification.

---

## TanStack Form over React Hook Form / Formik

The template uses TanStack Form (`@tanstack/react-form`) for form management, with a custom `createFormHook` wrapper that pre-registers field components.

**Inferred rationale:** TanStack Form is type-safe by design, with field-level TypeScript inference that eliminates the need for manual type annotations on individual fields. The `createFormHook` pattern from the library allows the project to define its own form vocabulary (`form.AppField`, `field.TextField`, etc.) rather than importing primitives directly everywhere. This standardises form patterns across the app and makes the shared UI components the single way to build forms.

---

## Zod for client-side validation only (currently)

Zod is used in `RegistrationContainer.tsx` for form validation. It is not used on the API side for request validation.

**Inferred rationale:** The template is at an early stage, and this likely reflects the order of implementation rather than a deliberate decision to skip server-side validation. Using Zod on both sides with a shared schema package is a common and recommended extension of this pattern.

**Open question:** There is no apparent plan for how server-side validation will be added. Candidates include adding a `packages/schemas` shared package, using Zod middleware (e.g. `@asteasolutions/zod-express`), or inferring request types from an OpenAPI spec.

---

## `swagger-jsdoc` and `swagger-ui-express` installed but unused

These packages appear in `apps/api/package.json` as production dependencies but are not imported or mounted anywhere.

**Inferred rationale:** The API documentation infrastructure was planned and the dependencies were added, but implementation was not completed. This is consistent with the template being a starting point rather than a finished product.

---

## Prisma with PrismaPg driver

The template uses `@prisma/adapter-pg` (the driver adapter) instead of the default Prisma connection pool.

**Inferred rationale:** `PrismaPg` uses the `pg` package as the underlying PostgreSQL driver and gives more control over connection pooling. It is the recommended setup when you want to manage the connection pool yourself (e.g. for serverless environments, or to share a pool with other tools). The adapter is created once and passed to `PrismaClient` in `lib/db.ts`.

---

## Docker volumes exclude `node_modules`

Each service in `docker-compose.yml` mounts the whole repo with:
```yaml
volumes:
  - .:/app
  - /app/node_modules
  - /app/apps/<service>/node_modules
```

The anonymous volume for `node_modules` causes Docker to use the container's `node_modules` directory (installed during image build) rather than the host's. This is the standard Docker Node.js pattern to avoid platform-incompatible native modules and prevents the host's `node_modules` from shadowing the container's.

---

## pnpm workspaces with `workspace:*` protocol

All internal packages reference each other using `workspace:*` rather than exact versions.

**Inferred rationale:** `workspace:*` means "use whatever version of this package exists in the workspace". This eliminates version management friction during development — you never need to `npm publish` or bump versions to consume changes across packages. pnpm rewrites `workspace:*` to the actual version number when publishing, so it would work correctly if the packages were ever published.

---

## Husky pre-commit: format + lint + typecheck on web only

The `.husky/pre-commit` hook runs `pnpm --filter web format`, `pnpm --filter web lint`, and `pnpm --filter web typecheck`, scoped only to `apps/web`.

**Inferred rationale:** The web app has the most churn and is where formatting inconsistencies and type errors are most likely to slip through. The API and shared packages are likely committed less frequently. This is a pragmatic balance — running checks on all packages in a pre-commit hook can be slow.

**Open question:** The API (`apps/api`) has a `lint` script but is not covered by the pre-commit hook. Whether this is intentional or an oversight is unclear.

---

## `_auth` route group without a guard

The `_auth/` prefix groups the login and registration routes but does not apply any middleware or layout specific to those routes. The underscore prefix in TanStack Router creates a pathless layout route, but no `_auth.tsx` layout file exists — the routes are just grouped in a directory for organisational clarity.

**Inferred rationale:** In a typical setup, the `_auth` group would eventually have an auth check that redirects authenticated users away from login/registration (so you can't see the login form if you're already logged in). The infrastructure is in place to add this, but the guard has not been implemented yet.

---

## No test scripts wired up

Vitest is installed across all packages (`@template/vitest-config` is referenced as a workspace dependency), and a shared config is provided in `packages/vitest-config/`. However, no `test` script exists in any `package.json`.

**Inferred rationale:** The testing infrastructure is scaffolded and ready — the intent is clearly to use Vitest — but the template leaves it for the builder to wire up. Writing tests early in a template risks the tests becoming outdated or misleading as the consuming project diverges significantly from the template's starting state.
