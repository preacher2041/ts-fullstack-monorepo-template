# Frontend Architecture

## Entry point

```
index.html
  └── src/main.tsx
        └── <AppProvider />
              ├── <StrictMode>
              ├── <QueryClientProvider client={queryClient}>
              └── <RouterProvider router={router}>
```

`main.tsx` is minimal — it renders `<AppProvider />` into `#root`. All composition (providers, router) lives in `providers/app.tsx`.

---

## Provider tree

`AppProvider` (`src/providers/app.tsx`) wraps three concerns in order:

1. **React StrictMode** — enables double-invoke checks in development.
2. **QueryClientProvider** — makes the `QueryClient` singleton available to all components via React Query's context. The client is instantiated in `src/lib/query.ts` with default settings.
3. **RouterProvider** — mounts the TanStack Router instance. The router is created in `src/lib/router.ts` and receives the `queryClient` as part of its context object, making it accessible in route loaders and components.

---

## Routing

The app uses TanStack Router's **file-based routing** convention, driven by the `@tanstack/router-vite-plugin` Vite plugin. The plugin watches `src/routes/` and regenerates `src/routeTree.gen.ts` automatically. This file must not be edited manually.

### Route tree

```
src/routes/
├── __root.tsx          # Root route — wraps everything in MainLayout
├── index.tsx           # Route: /
└── _auth/
    ├── login.tsx       # Route: /_auth/login  → renders at /login
    └── registration.tsx # Route: /_auth/registration  → renders at /registration
```

The `_auth` prefix creates a **pathless layout group** in TanStack Router. The underscore means it groups routes for organisational purposes without adding a URL segment. There is no `_auth` route file itself — no layout wrapping or auth guard is currently applied at the group level. At this stage the `_auth` prefix is purely organisational.

### Root route (`__root.tsx`)

```tsx
const RootComponent = () => (
  <>
    <MainLayout>
      <Outlet />
    </MainLayout>
    <ReactQueryDevtools buttonPosition='bottom-left' />
    <TanStackRouterDevtools position='bottom-right' />
  </>
)

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
})
```

The root route receives `queryClient` as typed context (enabling use of `useQuery` or loaders within route components), wraps all pages in `MainLayout`, and adds devtools panels in development.

### Router context

The router is created with `context: { queryClient }`:

```typescript
// src/lib/router.ts
const router = createRouter({ routeTree, context: { queryClient } })
```

This is the recommended TanStack Router pattern for integrating with React Query — it allows route loaders to call `queryClient.ensureQueryData()` for data prefetching. No loaders are defined yet in the template.

---

## Component hierarchy

```
AppProvider
└── MainLayout
    ├── ApplicationBar
    │   ├── Link (to="/")  — logo/title
    │   └── MainNav
    │       ├── Link (to="/registration")
    │       └── Link (to="/login")
    └── <Outlet />
        ├── /  →  <h1>Welcome</h1>
        ├── /login  →  LoginView
        │   └── LoginContainer
        │       └── LoginForm   (stub — placeholder div)
        └── /registration  →  RegistrationView
            └── RegistrationContainer
                └── RegistrationForm
```

### Layout components (`src/components/Layout/`)

- **MainLayout** — adds top padding of `pt-20` (to clear the fixed header) and wraps children in `p-6`.
- **ApplicationBar** — fixed top bar (`z-20`). Contains the logo link and `MainNav`. Uses `clsx` for class composition.
- **MainNav** — renders navigation links using TanStack Router's `<Link>` with `.active` class applied automatically by the router.

---

## Feature structure (`src/features/Auth/`)

Auth is the only feature in the template. It follows a three-tier pattern:

```
features/Auth/
├── api/
│   └── authApi.ts        # Empty — future home of fetch wrappers
├── components/
│   ├── Login/
│   │   ├── LoginContainer.tsx    # Shell that renders LoginForm
│   │   └── LoginForm.tsx         # Stub — not yet implemented
│   └── Registration/
│       ├── RegistrationContainer.tsx  # Owns the Zod schema; passes it as prop
│       └── RegistrationForm.tsx       # Renders form fields via useAppForm
└── views/
    ├── Login.tsx          # Page heading + LoginContainer
    └── Registration.tsx   # Page heading + RegistrationContainer
```

The **view** is what the route renders — a page heading and the container. The **container** owns state and business logic (in this case, the Zod schema definition). The **component** is the pure presentational layer. This is a common pattern for keeping forms testable and composable.

---

## Forms (TanStack Form + `useAppForm`)

Forms are built using `useAppForm` from `@template/ui`, which is a typed form hook created via TanStack Form's `createFormHook`. The hook is pre-configured with the shared field components (`TextField`, `EmailField`, `PasswordField`, `DateField`, `CheckboxField`) and the `SubmitButton` form component.

The registration form (`RegistrationForm.tsx`) is the only working form in the template:

```tsx
const form = useAppForm({
  defaultValues,
  validators: {
    onChange: registrationFormSchema,  // Zod schema applied to the whole form
  },
  onSubmit: ({ value }) => {
    alert(JSON.stringify(value, null, 2))  // placeholder — no API call yet
  },
})
```

Field components connect to the form via `form.AppField name='fieldName'` — TanStack Form uses a render-prop pattern. Each field component (`field.TextField`, `field.EmailField`, etc.) reads its value and error state from `fieldContext` and writes changes back via `field.handleChange`.

Error messages are suppressed until a field has been touched (`!field.state.meta.isTouched`), which prevents the form from looking like an error screen on first render.

The `SubmitButton` is disabled when `state.isDefaultValue` (nothing has been typed) or `!state.canSubmit` (validation is failing).

---

## React Query

TanStack Query (`@tanstack/react-query`) is installed and configured with a `QueryClient` singleton, but **no queries or mutations are defined in the template**. The infrastructure is ready:

- `QueryClient` exported from `src/lib/query.ts`
- `QueryClientProvider` wraps the app in `AppProvider`
- `queryClient` passed to the router context for use in loaders
- `ReactQueryDevtools` mounted in the root route

When you add a query, the conventional location for the hook is `features/<Feature>/api/<featureApi>.ts`.

---

## Styling

The web app uses **Tailwind CSS v4** via `@tailwindcss/postcss`. PostCSS processes the CSS in `src/index.css`, which imports the UI library's styles:

```css
/* src/index.css */
@import '@template/ui/styles';   /* resolves to packages/ui/src/styles/index.css */
```

The UI library's style file declares the `@theme` block with CSS custom properties for the design tokens (colours, ring, border, etc.). Tailwind v4 uses these `--color-*` variables to generate utilities at build time.

The `cn()` utility (defined in both `src/lib/utils.ts` and `packages/ui/src/utils/cn.ts`) merges Tailwind classes using `clsx` and `tailwind-merge` to resolve conflicts.

---

## Aliases

A single path alias is configured in `vite.config.ts`:

```
@ → ./src
```

This means `import { router } from '@/lib'` resolves to `src/lib/index.ts`. The alias is not registered in `tsconfig.json` (only in Vite config), but TypeScript can still resolve it because Vite handles module resolution at build time.

---

## Devtools

Both TanStack Router Devtools and React Query Devtools are mounted in the root route component and are active during development. They do not need to be removed for production — TanStack wraps them with a production no-op automatically.
