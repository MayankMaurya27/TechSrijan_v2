---
name: codebase-refactor-cleanup
description: Systematic, high-safety codebase refactoring and dead code cleanup. Use whenever the user asks to clean, refactor, reorganize, optimize, prune dependencies, or purge dead assets across the codebase without breaking active functionality.
license: MIT
---

# Codebase Refactor & Architecture Cleanup

This skill provides an autonomous, step-by-step protocol for deep codebase cleanups. It ensures redundant duplicates, dead code, orphan binary assets, and unused dependencies are safely pruned while keeping 100% of active functionality, styling, and routes intact.

---

## When to Activate This Skill
Trigger this skill whenever the user asks to:
* "Refactor the codebase"
* "Clean up duplicate components and dead code"
* "Organize directories and standardize architecture"
* "Prune unused dependencies and reduce bundle size"
* "Purge unused images, videos, and binary assets"

---

## The 5-Phase Execution Protocol

```
Phase 1: Pre-Flight Audit ➔ Phase 2: Consolidation ➔ Phase 3: Dead Code & Asset Purge ➔ Phase 4: Dependency Pruning ➔ Phase 5: Strict Verification
```

### Phase 1: Pre-Flight Audit & Baseline Check
1. **Verify Baseline Health**: Run `pnpm tsc --noEmit` before making any changes. Confirm the baseline state is clean or note any preexisting errors.
2. **Scan for Parallel Directory Structures**:
   * Check for duplicate component trees (e.g., `src/components/` vs `src/domains/` vs `src/shared/`).
   * Identify which folders are active and which are legacy or abandoned.
3. **Scan for Orphaned Assets**:
   * Inspect `public/` for image sequences, unreferenced video files, and legacy mockups.
4. **Identify Candidate Dead Code**:
   * List files that have 0 references across the project.

### Phase 2: Structural Consolidation
1. **Enforce Domain-Driven Architecture**:
   * **Domains** (`src/domains/<feature>/`): Encapsulate feature-specific views, state, and private components (e.g. `ambassador`, `events`, `sponsors`, `about`, `contact`, `landing`).
   * **Shared** (`src/shared/`): Cross-cutting UI primitives, global layout components (`navbar`, `footer`), and generic canvas/visual effects.
   * **Core** (`src/core/`): Global providers, theme context, hooks, and foundational utilities.
2. **Migrate Active Components**:
   * Move active components from legacy locations into their canonical domain or shared folder.
   * Update all import specifiers in pages, layouts, and sibling modules using clean tsconfig aliases (e.g., `@/domains/*`, `@/shared/*`, `@/core/*`).
3. **Preserve Functionality & Visual Parity**:
   * Never alter business logic, CSS classes, framer-motion transitions, or responsive breakpoints during a structural move.

### Phase 3: Dead Code & Orphan Asset Purging
1. **Cross-Reference Before Deleting**:
   * For every candidate file, run a ripgrep search (`grep_search`) across the entire repository to confirm zero dynamic or static imports exist.
2. **Remove Dead Component Trees**:
   * Delete the empty or deprecated legacy folders once all active files have been migrated.
3. **Purge Unused Binary Assets**:
   * Delete unreferenced frame sequences (e.g., frame animations replaced by video or canvas).
   * Delete unused video test files and stale image assets in `public/`.
   * Keep all assets actively used in `og:image`, metadata, or dynamic routes.

### Phase 4: Dependency Pruning
1. **Audit `package.json`**:
   * Identify installed packages that have zero `import` or `require` statements across `src/`.
   * Check for database, auth, or UI packages installed during experimentation that were never wired up.
2. **Prune Packages**:
   * Remove unused packages from `package.json` dependencies and devDependencies.
   * Clean up import optimization arrays in `next.config.ts` (e.g., `optimizePackageImports`).
   * Run `pnpm install` or lockfile update if needed.

### Phase 5: Mandatory Strict Verification
Execute these checks in order before concluding:
1. **Type Checking**:
   ```bash
   pnpm tsc --noEmit
   ```
   Must exit with code 0 (zero errors).
2. **Build Validation**:
   ```bash
   pnpm run build
   ```
   Confirm Next.js builds all static and dynamic routes cleanly.
3. **Route Verification**:
   Verify dev server response for every key route (`/`, `/about`, `/contact`, `/events`, `/sponsors`, `/ambassador`, etc.).
4. **Reporting**:
   Provide the user with a structured report detailing:
   * Migrated file paths and standardized import aliases.
   * Pruned dependencies and deleted dead files.
   * Final bundle health and verification status.
