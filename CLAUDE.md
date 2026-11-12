# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start development server at localhost:3000
pnpm build      # Production build
pnpm start      # Run production build
pnpm lint       # Run ESLint
```

## Architecture

Single-page Next.js 16 portfolio site (App Router) with two scroll sections — a hero and a projects grid — plus a footer. No routing beyond the root page.

- `app/page.tsx` — main page, marked `"use client"`. Contains the `projects` array (add new projects here). Uses Framer Motion for entrance animations.
- `app/components/ProjectCard.tsx` — reusable animated card linking to external GitHub projects.
- `app/layout.tsx` — root layout with Geist Sans/Mono fonts (via `next/font/google`) and metadata.
- `app/globals.css` — Tailwind v4 (`@import "tailwindcss"`), CSS variables for black/white theme, `.glass-card` utility class (frosted-glass effect), `.animate-bounce-slow` keyframe.

## Key conventions

- Tailwind v4 is used (PostCSS-based, `@import "tailwindcss"` syntax — not the v3 `@tailwind` directives).
- All interactive/animated components use `"use client"` since Framer Motion requires it.
- The `.glass-card` CSS class in `globals.css` is the shared visual style for project cards — extend it there rather than via inline Tailwind.
- Icons come from `lucide-react`; animations from `framer-motion`.

## Rules for AI Agents
### DO
- Help the human contributor understand code and debug issues
- Suggest improvements that follow existing patterns in the codebase
- Write tests for new and existing functionality

### DON'T
- Generate entire pull requests autonomously
- Open issues based on static analysis without human verification
- Refactor code without prior discussion with maintainers
- Add new dependencies without justification
- Introduce patterns that don't already exist in the codebase without discussion
- Submit code that the human operator cannot explain or modify
- Proactively create documentation or markdown wrap-up files after completing unrelated tasks

Keep replies concise and professional, without emojis, unnecessary affirmations, or explanations of obvious points.