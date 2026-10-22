# Project: TechSrijan'27 Polish & Architecture

## Architecture
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript.
- **Styling**: Tailwind CSS + CSS Custom Properties (`globals.css` theme engine).
- **Domain Structure**: 12 Domain modules under `src/domains/` (`admin`, `ambassador`, `auth`, `contact`, `events`, `guests`, `landing`, `legal`, `profile`, `sponsors`, `team`, `workshop`).
- **Shared Utilities & Layout**: `src/shared/`, `src/core/`, `src/components/`, `src/styles/`.

---

## Feature Inventory
Every feature and defect identified during the Survey phase mapped to its assigned milestone:

| # | Feature / Issue | Description | Milestone | Source |
|---|-----------------|-------------|-----------|--------|
| 1 | Restore Team Domain Routing | Reconnect `/team` page to render `<TeamView />` and `<OperativeDossierModal />` | M1 | Survey R4 |
| 2 | Enforce DDD Auth Boundaries | Re-export `useAuthModal` from `@/domains/auth` index and eliminate deep internal imports | M1 | Survey R4 |
| 3 | Clean Knip Dead Code & Exports | Prune unused file `jwt.ts`, duplicate export `EnhancedCursor`, and unreferenced exports | M1 | Survey R4 |
| 4 | Route State Completeness | Create root and route-level `error.tsx`, `loading.tsx`, `not-found.tsx`, and `global-error.tsx` | M1 | Survey R2 |
| 5 | Theme Variable Normalization | Eliminate raw hex colors (>1,300 instances) and consolidate 6 duplicate JS theme objects to CSS vars | M2 | Survey R1 |
| 6 | WCAG Contrast Token Correction | Fix contrast ratios for Arrakis (3.16:1 -> 4.5:1), Krelln (2.78:1 -> 4.5:1), and Geass Moon | M2 | Survey R1/R2 |
| 7 | Eliminate AI Template Tropes | Remove radar ping dots, muddy 140px blurs, triple corona pulsers, and tracked-out diamond eyebrows | M2 | Survey R1 |
| 8 | Typographic Hierarchy Refactor | Standardize font pairings; eliminate Frankenstein 3-font splices and micro-typography (<10px) | M2 | Survey R1/R2 |
| 9 | Mobile 360px Responsive Viewport | Fix horizontal overflow in `/contact` headline and badges; allow fluid wrapping and text clamping | M3 | Survey R2 |
| 10 | Tablet 768px Grid Adjustments | Fix element collision on iPad/tablet in Arena Spatial Cards and Accommodation cards | M3 | Survey R2 |
| 11 | Modal Accessibility Suite | Add focus trapping, `role="dialog"`, ARIA labels, and Escape dismissal to all 6 modals | M3 | Survey R2 |
| 12 | Form Input Label Association | Bind all 55+ unassociated form controls with explicit `id` and `<label htmlFor>` / `aria-label` | M3 | Survey R1/R2 |
| 13 | Focus-Visible Ring System | Enforce universal `:focus-visible` styling on all interactive elements across the app | M3 | Survey R2 |
| 14 | Remove Mobile Scroll Hijack | Eliminate non-passive `{ passive: false }` touchmove and `e.preventDefault()` in `accommodation/page.tsx` | M4 | Survey R3 |
| 15 | Remove Events Wheel Trap | Remove wheel interception and modulo card locking in `club-events-section.tsx:759` | M4 | Survey R3 |
| 16 | Touch-Action Pan-Y Enforcement | Add `touch-action: pan-y` on horizontal scroll carousels (`citadel-archive.tsx` etc.) | M4 | Survey R3 |
| 17 | Canvas & rAF Performance Fixes | Reset `ctx.shadowBlur` in contact particles; eliminate React state churn in `techsrijan-3d-logo` rAF | M4 | Survey R3 |
| 18 | Composite-Only Animations | Replace `animate={{ width }}` layout animations with `scaleX` composite transforms | M4 | Survey R3 |
| 19 | Prefers-Reduced-Motion Engine | Wire `prefers-reduced-motion` media checks into all Canvas/WebGL loops, Three.js, and GSAP | M4 | Survey R3 |
| 20 | WebGL Resource Cleanup | Verify Three.js geometries, materials, textures, and animation frames are disposed on unmount | M4 | Survey R3 |
| 21 | Full Build & Typecheck Gate | Verify `tsc --noEmit` and `pnpm run build` pass cleanly across all 33 routes | M5 | Acceptance |
| 22 | Knip Sweep Gate | Verify Knip reports 0 unused production files | M5 | Acceptance |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | System Architecture, Routing & Dead Code | Re-link `/team` route, fix `@/domains/auth` barrel imports, prune dead files, add route error/loading boundaries | none | DONE |
| M2 | Visual Design, Theme Tokens & Taste Polish | CSS variable normalization, fix WCAG contrast ratios in `globals.css`, eliminate AI tropes in `/contact` & `/about`, typography cleanup | M1 | DONE |
| M3 | UI/UX Overhaul, Responsiveness & Accessibility | Fix 360px mobile overflow & 768px tablet grid, modal focus traps & ARIA attributes, bind 55+ form labels, universal focus-visible | M2 | DONE |
| M4 | Motion Optimization & Performance Hardening | Remove touch/wheel scroll hijacking, fix canvas shadowBlur & rAF React state churn, composite animations, prefers-reduced-motion | M3 | DONE |
| M5 | Final Verification & E2E Acceptance Gate | Full TypeScript check (`tsc --noEmit`), Next.js build (33 routes), Knip scan, Reviewer, Challenger, and Auditor verification | M4 | DONE |

---

## Interface Contracts

### Auth Domain ↔ Client Domains (`events`, `ambassador`, `profile`, `layout`)
- `src/domains/auth/index.ts` MUST export `useAuthModal` and `AuthModalProvider`.
- Deep import `import { useAuthModal } from "@/domains/auth/context/auth-modal-context"` is FORBIDDEN.
- Consumers MUST import via `@/domains/auth`.

### Team Domain ↔ Next.js Routing
- `src/app/team/page.tsx` MUST export default Next.js Server Component rendering `<TeamView />` from `@/domains/team`.
- Unconditional `redirect("/developers")` in `src/app/team/page.tsx` is removed.

### Styling Engine ↔ Component Consumers
- All background, accent, and text colors MUST reference CSS variables defined in `src/styles/globals.css`:
  - `var(--bg-primary)`, `var(--bg-secondary)`, `var(--bg-card)`
  - `var(--accent-primary)`, `var(--accent-secondary)`
  - `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`
  - `var(--border-subtle)`, `var(--border-strong)`
  - `var(--glow)`
- Hardcoded hex values (`#...`) in new or refactored components are FORBIDDEN.

---

## Code Layout
- **Domain Modules**: `src/domains/<domain>/components/`, `data/`, `types/`, `index.ts`
- **Shared Layout**: `src/shared/layout/` (`navbar.tsx`, `fest-footer.tsx`)
- **Shared Effects**: `src/shared/effects/` (`sword-cursor.tsx`, `grid-background.tsx`)
- **Styles**: `src/styles/globals.css`, `src/styles/theme-palettes.ts`
- **App Routes**: `src/app/`
- **Metadata/Coordination**: `.agents/teamwork/` (NEVER place source code here)
