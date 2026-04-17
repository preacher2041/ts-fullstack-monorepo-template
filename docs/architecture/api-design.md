# API Design

## Base URL

All routes are mounted under `/api/v1`. The Express app listens on the port specified by `API_PORT` (default `3000`), exposed as `3001` in Docker Compose during development.

---

## Routes

### Auth routes (`/api/v1/auth`)

| Method | Path | Auth required | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | No | Authenticate with email + password; creates session |
| `POST` | `/api/v1/auth/logout` | No | Destroys session and clears session cookie |
| `GET` | `/api/v1/auth/session` | Yes | Returns whether the current session is authenticated |

#### `POST /api/v1/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

Success response (`200`):
```json
{
  "status": 200,
  "message": "Account login successful",
  "userId": "<uuid>"
}
```

On login, `express-session` sets an HTTP-only cookie named `MySessionID`. The session stores `{ id, username, email }`.

#### `POST /api/v1/auth/logout`

No request body required.

Success response (`200`):
```json
{
  "status": 200,
  "message": "Account logout successful"
}
```

Calls `req.session.destroy()` and clears the `MySessionID` cookie.

#### `GET /api/v1/auth/session`

Protected by `addAuthMiddleware`.

Success response (`200`):
```json
{
  "authenticated": true
}
```

Returns `authenticated: false` if the session exists but has no user. Returns `401` if the middleware rejects the request.

---

### User routes (`/api/v1/user`)

| Method | Path | Auth required | Description |
|---|---|---|---|
| `POST` | `/api/v1/user/create` | No | Register a new user; establishes session |
| `GET` | `/api/v1/user/me` | Yes | Fetch the current user's profile |
| `PUT` | `/api/v1/user/:id` | Yes | Update profile fields for a user |
| `PATCH` | `/api/v1/user/:id/password` | Yes | Change password (requires current password) |
| `DELETE` | `/api/v1/user/:id` | Yes | Delete a user account |

#### `POST /api/v1/user/create`

Request body (all fields accepted by `Prisma.UserCreateInput`):
```json
{
  "email": "user@example.com",
  "password": "secret",
  "username": "jdoe",
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990-01-15"
}
```

The service hashes `password` with bcrypt (salt rounds: 8) before writing to the database. `dob` is coerced to a `Date` object if present.

Success response (`200`):
```json
{
  "status": 200,
  "message": "User created successfully",
  "data": { /* full Prisma user record including hashed password */ }
}
```

**Open question:** The `data` field returns the full Prisma record from `prisma.user.create()`, which includes the hashed password. Other endpoints strip the password field manually; this one does not. This appears to be an oversight.

After creation, the session is populated identically to login: `req.session.user = { id, username, email }`.

#### `GET /api/v1/user/me`

Protected by `addAuthMiddleware`. Uses `req.session.user.id` to look up the record.

Success response (`200`):
```json
{
  "status": 200,
  "message": "User profile fetched successfully",
  "user": {
    "username": "jdoe",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "dob": "1990-01-15T00:00:00.000Z"
  }
}
```

Password is explicitly excluded by the service.

#### `PUT /api/v1/user/:id`

Protected. Updates profile fields. Only `username`, `email`, `firstName`, `lastName`, and `dob` can be changed through this endpoint — `password` is not.

Request body (all optional):
```json
{
  "username": "johnd",
  "email": "new@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990-01-15"
}
```

**Open question:** The route uses `:id` from `req.params.id` but does not verify that the `:id` in the path matches the authenticated session's user ID. Any authenticated user could potentially update another user's record.

#### `PATCH /api/v1/user/:id/password`

Protected. Changes password after verifying the current one.

Request body:
```json
{
  "current_password": "oldSecret",
  "new_password": "newSecret"
}
```

Returns the updated user record (without password) on success. The service throws `401 Unauthorized` if `current_password` does not match.

#### `DELETE /api/v1/user/:id`

Protected. Deletes the user record from the database. No soft-delete mechanism exists.

---

## Response shape conventions

All successful responses follow a consistent envelope:

```json
{
  "status": <http status code>,
  "message": "<human-readable description>",
  // optional: "data", "user", "userId", "authenticated"
}
```

All error responses follow:

```json
{
  "status": <http status code>,
  "message": "<error description>"
}
```

The error handler in `routes/index.ts` is responsible for producing this shape.

---

## Authentication mechanism

Session-based. `express-session` manages a server-side session store (in-memory by default — appropriate for development only; a Redis or database-backed store should be used in production). The session ID is sent to the client as an HTTP-only cookie named `MySessionID`, scoped to the domain specified by `COOKIE_DOMAIN` (default: `localhost`).

The `addAuthMiddleware` function enforces authentication on protected routes. It checks:
1. That `req.cookies` is populated (cookie-parser must have run)
2. That `req.cookies.MySessionID` exists
3. That `req.session.user` exists

It does not validate the session ID or compare it against the stored session data directly — that is handled transparently by `express-session`.

---

## Middleware stack order (`apps/api/src/index.ts`)

```
cors({ credentials: true, origin: CORS_ORIGIN })
bodyParser.urlencoded({ extended: true })
bodyParser.json()
cookieParser()
morgan('tiny')
session({ name: 'MySessionID', ... })
router (/api/v1)
```

CORS is configured to allow credentials (necessary for cookies) from the origin specified by `CORS_ORIGIN`.

---

## Error handling

The global error handler at the bottom of `routes/index.ts` is the single exit point for all errors. Controllers never write error responses directly — they always call `next(e)`.

Errors originating from services are typically `http-errors` instances (e.g. `createError.NotFound()`, `createError.Unauthorized()`). Errors originating from Prisma are mapped to `http-errors` via `mapPrismaError` before falling through to the handler.

5xx errors are logged to `console.error` with the method and path. 4xx errors are silently returned.

---

## Installed but unused dependencies

- `jsonwebtoken` — installed; not imported anywhere. The template uses sessions, not JWTs.
- `swagger-jsdoc` and `swagger-ui-express` — installed; not mounted in the Express app.
- `uuid` — installed; Prisma generates UUIDs at the database level via `@default(uuid())`, so this package is not used directly.
