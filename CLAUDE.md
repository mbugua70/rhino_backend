# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured yet.

## Stack

- **Next.js 16.2.6** — newer than training data; APIs and conventions differ. Always read `node_modules/next/dist/docs/` before writing code.
- **React 19.2.4** with App Router (no Pages Router)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — config syntax differs from v3
- **TypeScript** with strict mode; path alias `@/*` maps to project root

## Architecture

The `app/` directory uses the App Router exclusively:

- `app/layout.tsx` — root layout with Geist fonts and Tailwind base classes
- `app/page.tsx` — home route (`/`)
- API endpoints go in `app/api/route.ts` (or any `app/**/route.ts`); a `route.ts` and `page.tsx` cannot coexist in the same segment

All components are Server Components by default. Add `'use client'` only when you need state, event handlers, `useEffect`, or browser APIs.

## Key Next.js 16 Specifics

**Caching (`use cache` directive):**  
The old `fetch` cache options are replaced by the `use cache` directive. Enable with `cacheComponents: true` in `next.config.ts`, then annotate async functions or components:

```ts
export async function getData() {
  'use cache'
  // cached automatically
}
```

**Instant client-side navigation:**  
`<Suspense>` alone does not guarantee instant navigations. Export `unstable_instant` from any route that must navigate instantly. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.

**Route Handlers:**  
Use the Web `Request`/`Response` APIs (or `NextRequest`/`NextResponse`). `GET` handlers are not cached by default; add `export const dynamic = 'force-static'` to opt in.

**`params` is now a Promise:**  
Dynamic route params (e.g., `{ params }: { params: Promise<{ id: string }> }`) must be awaited before use.
