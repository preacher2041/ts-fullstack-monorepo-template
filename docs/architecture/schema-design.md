# Schema Design

## Current state

There is no shared schema package in the template. A `packages/schemas` directory does not exist. The template currently has two separate, parallel definitions of the user data shape:

1. **Prisma schema** (`apps/api/prisma/schema.prisma`) — the authoritative database schema
2. **Zod schema** (`apps/web/src/features/Auth/components/Registration/RegistrationContainer.tsx`) — a client-side validation schema for the registration form

These two definitions are co-located with their respective consumers and are not shared.

---

## Prisma schema (`apps/api/prisma/schema.prisma`)

The database has a single model:

```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  username  String
  firstName String?
  lastName  String?
  dob       DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

Prisma generates TypeScript types from this schema. The most important generated type for the API is `Prisma.UserCreateInput`, which is used directly as the parameter type for `createUser` in `users.services.ts`. This means the TypeScript type for what the service accepts is derived from the database schema — if you add a field to the model, the type updates automatically after `pnpm --filter @template/api generate`.

The `PrismaClient` is exposed as a singleton from `apps/api/src/lib/db.ts`.

---

## Zod schema (frontend form validation)

The registration form defines its own Zod schema in `RegistrationContainer.tsx`:

```typescript
const registrationFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email({
    pattern: z.regexes.html5Email,
    error: 'Email address must be a valid email',
  }),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  username: z.string().min(1, 'Username name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})
```

This schema is passed as a prop to `RegistrationForm`, which feeds it into TanStack Form's `onChange` validator. Validation fires on field change (after touch) and again on submit.

Note that this schema does not include `id`, `createdAt`, or `updatedAt` — those are server-generated. The `dob` field is validated as an ISO date string here (`YYYY-MM-DD`), but the Prisma model stores it as `DateTime?`. The service layer converts the string to a `Date` object with `new Date(data.dob as string)`.

---

## The gap between layers

There is no runtime type validation on the API side. The two schemas can drift independently:

| Field | Prisma model | Frontend Zod schema |
|---|---|---|
| `id` | ✅ server-generated | — |
| `email` | ✅ unique | ✅ html5Email pattern |
| `password` | ✅ required | ✅ min 8 chars |
| `username` | ✅ required | ✅ min 1 char |
| `firstName` | optional (`String?`) | ✅ required (`min(1)`) |
| `lastName` | optional (`String?`) | ✅ required (`min(1)`) |
| `dob` | optional (`DateTime?`) | ✅ YYYY-MM-DD regex |
| `createdAt` | ✅ server-generated | — |
| `updatedAt` | ✅ server-generated | — |

The frontend makes `firstName` and `lastName` required even though the database treats them as optional. This inconsistency would not be caught at runtime — if someone calls the API directly without the frontend they could omit those fields.

---

## OpenAPI / Swagger (not yet implemented)

The `package.json` for `apps/api` lists `swagger-jsdoc` and `swagger-ui-express` as dependencies, but neither is imported or configured anywhere in the source code. This indicates a Swagger UI endpoint was intended but has not been wired up.

**Open question:** The intended approach for generating the OpenAPI spec is unknown. Common patterns would be:
- JSDoc comments on route handlers consumed by `swagger-jsdoc`
- A code-first approach generating the spec from Zod or TypeBox schemas
- A schema-first approach with the spec checked in and types generated from it

---

## Recommended path toward shared schemas

A common next step when this template is used as a base is to introduce a `packages/schemas` package that exports Zod schemas shared by both the API and the web app. This would:

- Eliminate the drift between client and server validation
- Provide a single source of truth for request/response shapes
- Enable OpenAPI spec generation from the schemas (e.g. via `zod-to-openapi` or `@asteasolutions/zod-to-openapi`)

The monorepo structure already supports this — adding a new package under `packages/` with a `workspace:*` reference is all that is needed to wire it in.
