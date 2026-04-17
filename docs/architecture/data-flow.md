# Data Flow

How data moves through the system — from a browser interaction through to the database and back.

---

## Request lifecycle (API)

All API requests follow the same four-layer path:

```
HTTP Request
    │
    ▼
Express middleware stack (index.ts)
  • CORS
  • body-parser (JSON + URL-encoded)
  • cookie-parser
  • morgan (logging)
  • express-session (hydrates req.session from cookie)
    │
    ▼
Router (routes/index.ts  →  /api/v1)
  • Dispatches to auth or user sub-router
  • addAuthMiddleware (on protected routes): checks cookie + req.session.user
    │
    ▼
Controller (controllers/*.ts)
  • Reads from req.body / req.params / req.session
  • Calls one service function
  • Formats and sends the JSON response
  • Passes errors to next() for the global error handler
    │
    ▼
Service (services/*.ts)
  • Contains all business logic
  • Talks to Prisma exclusively
  • Throws http-errors on domain errors (NotFound, Unauthorized)
    │
    ▼
Prisma ORM  →  PostgreSQL
```

### Error path

Errors propagate via `next(e)` in every controller. The global error handler in `routes/index.ts` processes them in order:

1. `mapPrismaError(err)` — converts known Prisma errors to http-errors:
   - `P2002` (unique constraint) → 409 Conflict
   - `P2025` (record not found) → 404 Not Found
   - `PrismaClientValidationError` → 400 Bad Request
2. `isHttpError(err)` — passes through errors already created with `http-errors`
3. Fallback → 500 Internal Server Error

The response shape for errors is always `{ status: number, message: string }`.

---

## Validation

There is currently no runtime validation layer between the HTTP request and the service layer. The API trusts `req.body` as-is and passes it directly to service functions or Prisma. The only enforcement at the database boundary is:

- Prisma's type system (`Prisma.UserCreateInput`) at compile time
- PostgreSQL constraints at runtime (unique on `email`, non-null on required fields)
- Prisma maps constraint violations to errors via `mapPrismaError`

**Open question:** `swagger-jsdoc` and `swagger-ui-express` are installed as dependencies but are not mounted anywhere in the Express app. This suggests a Swagger/OpenAPI setup was intended but is not yet implemented. A Zod request validation layer (e.g. using `zod-express-middleware` or similar) is also absent.

---

## Authentication flow

### Registration

```
POST /api/v1/user/create
  Body: { username, email, password, firstName?, lastName?, dob? }
    │
    ▼
createUserController
    │
    ▼
createUser (service)
  • bcrypt.hashSync(password, 8)  — password never stored in plain text
  • prisma.user.create({ data })
  • Returns full user record
    │
    ▼
Controller sets req.session.user = { id, username, email }
Response: { status: 200, message: "User created successfully", data: user }
```

The session is established immediately on registration — the user is logged in as soon as they create an account.

### Login

```
POST /api/v1/auth/login
  Body: { email, password }
    │
    ▼
loginUserController
    │
    ▼
loginUser (service)
  • prisma.user.findUnique({ where: { email } })
  • If not found → 404
  • bcrypt.compareSync(password, user.password)
  • If mismatch → 401
  • Returns { id, username, email }
    │
    ▼
Controller sets req.session.user = data
express-session serialises session and sets cookie "MySessionID" (HTTP-only)
Response: { status: 200, message: "Account login successful", userId }
```

### Subsequent authenticated requests

```
Any request with cookie "MySessionID"
    │
    ▼
express-session middleware
  • Reads session ID from cookie
  • Hydrates req.session from the session store
    │
    ▼
addAuthMiddleware
  • Checks req.cookies.MySessionID exists → 401 if absent
  • Checks req.session.user exists → 401 if absent
  • Calls next() to proceed
```

### Logout

```
POST /api/v1/auth/logout
    │
    ▼
logoutUserController
  • req.session.destroy(callback)
  • res.clearCookie("MySessionID")
  • Response: { status: 200, message: "Account logout successful" }
```

---

## Frontend data flow (current state)

The frontend does not yet make API calls. The data flow for the registration form is client-only:

```
User types in RegistrationForm
    │
    ▼
TanStack Form (useAppForm)
  • onChange validators run Zod schema on each field change
  • Errors displayed by FieldErrors component once field is touched
    │
    ▼
Form submit
  • onSubmit: currently calls alert(JSON.stringify(value))
  • No fetch call to the API yet
```

The `authApi.ts` file exists at `features/Auth/api/authApi.ts` but is empty — it is the intended home for `fetch` wrappers that will call the API once implemented.

The login form (`LoginForm.tsx`) is a stub that renders a placeholder `<div>`.

---

## Database schema data flow

Prisma is the only layer that talks to PostgreSQL. The `PrismaClient` is instantiated once as a singleton in `lib/db.ts` using the `PrismaPg` adapter (driver-level connection pooling via the `pg` package). All services import this singleton.

```
Service function
    │
    ▼
prisma.<model>.<operation>({ ... })
    │
    ▼
PrismaPg adapter  →  pg connection pool  →  PostgreSQL
    │
    ▼
Returns typed result (Prisma-generated types)
```

Password fields are never returned from service functions that call Prisma — each service manually selects only the fields it returns (e.g. `fetchUser` explicitly picks `username`, `email`, `firstName`, `lastName`, `dob`).
