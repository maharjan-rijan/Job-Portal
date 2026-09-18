# JobGrids — React + Vite

A migration of the original JobGrids Bootstrap/jQuery HTML template into a
production-shaped React application. This first pass sets up the
architecture and wires a few real pages end to end; it intentionally does
not port every page from the template yet.

## Stack

| Concern | Choice |
|---|---|
| Build tool | Vite |
| UI | React 19 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first `@theme` tokens) |
| Routing | React Router v7 (`createBrowserRouter`) |
| Server state | TanStack Query |
| HTTP | Axios (single configured instance) |
| Forms | React Hook Form + Zod |
| Headless components | Headless UI (`Dialog`, `Menu`, etc.) |
| Icons | lucide-react |
| Notifications | react-hot-toast |
| Carousels | Swiper (replaces Tiny Slider) |
| Dates | date-fns |
| Charts | Recharts |

Bootstrap, jQuery, Tiny Slider, GLightbox, Animate.css and LineIcons from
the original template are **not** used — their jobs are done by Tailwind,
Swiper, CSS transitions, and lucide-react respectively.

## Why this structure

```
src/
  components/
    ui/        Small, dumb, reusable primitives (Button, Input, Card, Badge,
               Modal, JobCard). No routing or data-fetching logic lives here.
    layout/    Structural chrome shared across pages (header, footer,
               dashboard sidebar/topbar). Composed by layouts/, not by pages.
    forms/     Feature-level forms (LoginForm, later PostJobForm, etc.),
               each pairing a React Hook Form + Zod schema with the UI
               primitives above.
  pages/
    public/    Marketing + job-browsing pages, no auth required.
    auth/      Login / Register.
    seeker/    Authenticated job-seeker dashboard pages.
    employer/  Authenticated employer dashboard pages.
  layouts/     One layout per section (Public, Auth, Seeker, Employer).
               Pages stay layout-agnostic; swapping a section's chrome
               means editing one file, not every page in it.
  routes/      `routes/index.jsx` is the single source of truth for the
               URL tree. `ProtectedRoute` guards seeker/employer branches
               and enforces role checks in one place.
  services/    One file per resource (authService, jobService,
               applicationService), each a thin wrapper over the shared
               axios instance. Pages/hooks never call axios directly.
  hooks/       Cross-cutting hooks: `useAuth` (context accessor),
               `useJobs`/`useJob`/`useSaveJob` (TanStack Query wrappers).
               New resources should follow the `useJobs.js` pattern.
  context/     `AuthContext` holds the current user and auth actions
               (login/register/logout) and is the single source of truth
               for "who is logged in."
  lib/         Cross-app configuration: the axios instance, the shared
               QueryClient, a query-key factory (`queryKeys.js`) so
               invalidation stays consistent, and Zod schemas under
               `lib/validation/`.
  utils/       Pure helper functions: `cn` (class merging), `formatters`
               (date-fns wrappers, salary formatting), `constants` (roles,
               job types, route helpers).
  assets/      Static assets migrated from the template (currently the
               logo SVG).
```

This separation keeps each layer swappable: the mock data in
`lib/mockData.js` can be deleted once `jobService` points at a real API,
without touching any component; a new dashboard section only needs a new
layout + protected route branch, not changes to existing pages.

## What's implemented right now

- App shell: `App.jsx` wires `QueryClientProvider`, `AuthProvider`,
  `RouterProvider`, and a `Toaster`.
- Public: Home (hero search + featured jobs), Job List (client-side
  filtered for now), 404.
- Auth: Login and Register, both React Hook Form + Zod, backed by
  `AuthContext`.
- Seeker dashboard and Employer dashboard (with a Recharts line chart),
  both behind `ProtectedRoute` with role checks.
- Design tokens in `src/index.css` (`@theme`) carry over the original
  template's brand colors (`#081828` navy, `#2042e3` blue) and Inter
  typeface, so the new app doesn't look like a generic Tailwind starter.

## Not built yet (by design)

Job Details, Browse Categories, Add Resume, Job Alerts, Post Job/Manage
Jobs/Manage Applications/Browse Resumes (employer side), Blog, About,
Contact, Pricing, FAQ. These slot into the existing folders
(`pages/seeker`, `pages/employer`, `pages/public`) and route tree without
structural changes.

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev
```

`authService`, `jobService` and `applicationService` currently expect a
REST API at `VITE_API_BASE_URL` with `/auth/login`, `/auth/register`,
`/auth/me`, `/jobs`, and `/applications` endpoints. Until that backend
exists, the public pages render from `src/lib/mockData.js` so the UI is
reviewable standalone.
