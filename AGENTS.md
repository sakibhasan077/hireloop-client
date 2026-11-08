<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HireLoop

Single Next.js 16 App Router app — no workspaces or packages. All source is in `src/`; alias `@/*` → `src/*`. Next.js only rewrites the text between the markers above, so keep custom notes outside them and commit this file with your work.

## Commands

Use **npm** (`package-lock.json` is the lockfile — not pnpm/yarn/bun).

- `npm run dev` — dev server (Turbopack is the default bundler), http://localhost:3000
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`), runs bare `eslint` (not `next lint`)
- `npx tsc --noEmit` — typecheck; there is no `typecheck` script
- `npm run build` — production build (also typechecks)
- **No test runner and no CI exist.** Verify changes with `npm run lint && npx tsc --noEmit`; don't invent `npm test`.

## Before writing Next.js code

Read the version-matched docs bundled at `node_modules/next/dist/docs/` (see the block above). Most relevant here:

- `01-app/01-getting-started/08-caching.md` — `cacheComponents: true` + `partialPrefetching: true` are set in `next.config.ts`: data caching uses `use cache`/`cacheLife`, request APIs (`cookies()`, `headers()`) are async, and `GET` route handlers follow the page prerendering model.
- `01-app/02-guides/ai-agents.md` — verify loop tooling: the running dev server exposes an MCP endpoint at `/_next/mcp` that reports compile issues without a full `next build`.

## Stack quirks

- **React Compiler is on** (`reactCompiler: true` in `next.config.ts`, `babel-plugin-react-compiler` in devDependencies). Components are auto-memoized; write them to the Rules of React.
- **Tailwind v4, CSS-first** — no `tailwind.config` or PostCSS config exists. CSS loads via the custom Turbopack loader rule in `next.config.ts`, and the theme lives in `src/app/globals.css` (`@theme inline`). Don't add a Tailwind config file.
- **shadcn style is `base-nova`** (`components.json`): primitives are Base UI (`@base-ui/react`), **not Radix**. Generate new primitives with the shadcn CLI (it's a dependency) instead of hand-writing; they land in `src/components/ui/`.
- **`cn` is the npm package `cn`**, re-exported by `src/lib/utils.ts` — not the usual clsx + tailwind-merge helper. Don't "fix" it.

## Auth (better-auth + MongoDB Atlas)

- Server config: `src/lib/auth.ts` — Mongo adapter, database `hire-loop`, email+password enabled. New auth options are added here.
- Client: `src/lib/auth-client.ts` — prefer `authClient`; the `signIn`/`signUp`/`useSession` exports come from a *second* client created without `baseURL`.
- HTTP handler: catch-all `src/app/api/auth/[...all]/route.ts` serves every auth endpoint — don't create per-endpoint route files under `api/auth/`.

## Environment

`.env` is gitignored and holds **real credentials — never commit, print, or echo its values**. A fresh clone must create it with `MONGODB_URI`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` before the app can reach the database/auth.

## Docs

`README.md` is stale create-next-app boilerplate (it points at `app/page.tsx`; the real path is `src/app/page.tsx`). Trust `src/`, the config files, and the bundled Next.js docs over it.
