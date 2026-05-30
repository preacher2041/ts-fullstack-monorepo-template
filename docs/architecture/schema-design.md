# Schema Design

## Shared schemas (`packages/schemas`)

Zod schemas and TypeScript types shared between the API and the web app live in `packages/schemas`. Both apps reference it as a workspace dependency (`@template/schemas`).

Exported schemas:

- `loginSchema` — email + password
- `createUserSchema` — all fields required to register a new user
- `updateUserSchema` — updatable profile fields (username, email, firstName, lastName, dob)
- `updateUserPasswordSchema` — currentPassword + newPassword

Exported types (inferred from schemas):

- `LoginCredentials`
- `CreateUserInput`

---

## API usage

The `validate` middleware (`apps/api/src/middleware/validate.ts`) takes a Zod schema and validates `req.body` before the request reaches the controller. If validation fails it returns a 400 immediately. Every mutating route uses it:

```typescript
import { createUserSchema } from "@template/schemas";
router.post("/", validate(createUserSchema), createUserController);
```

---

## Web usage

The web app imports the inferred TypeScript types from `@template/schemas` for form definitions and API call signatures:

```typescript
import type { LoginCredentials, CreateUserInput } from "@template/schemas";
```

The registration form (`RegistrationContainer.tsx`) also defines its own local Zod schema for client-side form validation. This schema is more specific than `createUserSchema` in some respects — for example it enforces a minimum length on string fields and validates `dob` as an ISO date string. Aligning the shared schema with the form schema is a natural next step.

---

## Prisma schema (`apps/api/prisma/schema.prisma`)

The database has a single model:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  username  String
  firstName String
  lastName  String
  dob       DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Prisma generates TypeScript types from this schema. The `PrismaClient` is exposed as a singleton from `apps/api/src/lib/db.ts`. After any schema change, run `pnpm --filter @template/api migrate` (inside Docker) to generate a migration and regenerate the client.

---

## OpenAPI / Swagger (Fully Integrated)

We have fully implemented OpenAPI 3.0 specification generation using **Zod-to-OpenAPI** (`@asteasolutions/zod-to-openapi`).

- **Specification**: Validated request and response Zod schemas are automatically compiled and served as a raw JSON spec at `/openapi.json` and generated as a static file at `apps/api/openapi-spec.json`.
- **Interactive Documentation**: Interactive API documentation is served at `/docs` using **Swagger UI** (`swagger-ui-express`). This allows developers to test authenticated and public endpoints interactively in the browser.
