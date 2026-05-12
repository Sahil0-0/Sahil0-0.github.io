# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Personal portfolio for Sahil — a developer and designer who builds mobile apps, web products, and UI. The site is dark + minimal in aesthetic.

**Planned sections:** Home (entry), About, Projects, Experience, Contact.

## Commands

```bash
npm run dev      # Start dev server (opens browser automatically)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

No test suite is configured yet.

## Stack

- **Next.js 16.2.4** (App Router) with **React 19** and **TypeScript**
- **Tailwind CSS v4** — configured via `postcss.config.mjs`; global styles and theme tokens live in `app/globals.css` using `@theme inline` (v4 syntax, not `tailwind.config.*`)
- **Geist** font family loaded via `next/font/google`, exposed as CSS variables `--font-geist-sans` / `--font-geist-mono`
- No external UI libraries (no shadcn, Radix, etc.) — all components built from scratch

## Architecture

Portfolio site bootstrapped from `create-next-app`. The entire app lives in the `app/` directory using the Next.js App Router:

- `app/layout.tsx` — root layout; sets fonts, `<html>` classes, and wraps all pages
- `app/page.tsx` — home / entry page
- `app/globals.css` — global styles, Tailwind import, and CSS custom property theme tokens
- `public/images/` — static images (e.g. cloud_image.png)
- `public/icons/` — static icons

The `@/*` path alias resolves to the repo root (configured in `tsconfig.json`).

## Naming conventions

- **Component files:** PascalCase (e.g. `HeroPage.tsx`, `BottomLeftNav.tsx`)
- **Next.js reserved files:** always lowercase as required by the framework (`page.tsx`, `layout.tsx`, `globals.css`, `middleware.ts`)
- **Config / data files:** lowercase (e.g. `projects.ts`)
- **Folders:** lowercase (e.g. `app/hero/`, `components/`, `config/`)
- **React components:** PascalCase function names inside files

## Code rules (always follow)

1. **Reuse before creating** — before writing any component or util, check if one already exists. Extract shared UI into reusable functions/components.
2. **Mobile-first, always responsive** — write Tailwind classes mobile-first and ensure every UI works on small screens before scaling up.
3. **Reusable component comments** — whenever a reusable component is created, add a single clean comment above it describing what it does.
4. **No comments otherwise** — do not add inline comments or explanatory prose inside non-reusable code.

## Key conventions

- **Next.js version is 16.x** — APIs, file conventions, and behavior may differ from what training data covers. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/` (organized as `01-app/`, `02-pages/`, `03-architecture/`).
- Tailwind v4 does not use a `tailwind.config.*` file; extend the theme inside `globals.css` with `@theme`.
- ESLint uses the flat config format (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
