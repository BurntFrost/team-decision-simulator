# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Dev server (Next.js + Turbopack)
npm run build            # Production build (static export)
npm run lint             # ESLint
npm run typecheck        # TypeScript type checking (tsc --noEmit)
npm test                 # Run all tests (vitest run)
npx vitest run tests/logic.test.ts  # Run a single test file
```

## Architecture

This is a **single-page Next.js 15 app** (App Router, static export) that simulates how MBTI personality types make decisions using a 6-factor weighted matrix.

### Data Flow

```
User adjusts sliders → Inputs (6 factors) → DecisionService facade
  → calculateResults() loops over 16 MBTI archetypes
  → Each archetype has unique weights → weighted score → decision category
  → Results rendered via Recharts visualizations
```

### Key Layers

- **`app/page.tsx`** — Renders the single `UserDecisionDashboard` component (client-side only)
- **`components/UserDecisionDashboard.tsx`** — Main container: state management, slider inputs, tab navigation. This is the largest component.
- **`components/UserDecisionCharts.tsx`** — All Recharts visualizations (radar, scatter, heatmap, bar, sankey)
- **`lib/decisionMatrixService.ts`** — Service facade that re-exports from `models/decision/`. Import from here, not directly from models.
- **`models/decision/logic.ts`** — Core algorithms: `calculateScore`, `getDecision`, `calculateResults`, `calculatePublicOpinion`
- **`models/decision/types.ts`** — All TypeScript types (`FactorKey`, `Weights`, `SimulationResult`, etc.)
- **`models/decision/mbti/`** — Factory pattern: `BaseMBTIType` abstract class → 16 concrete type classes → `MBTIFactory` with cached lookups

### Decision Scoring

Scores map to 5 decision categories via thresholds in `getDecision()`: Full Speed Ahead (>0.85), Proceed Strategically (>0.65), Implement with Oversight (>0.55), Request Clarification (>0.35), Delay or Disengage (≤0.35).

The 6 input factors are: `data_quality`, `roi_visibility`, `autonomy_scope`, `time_pressure`, `social_complexity`, `psychological_safety`.

### UI Stack

- **shadcn/ui** (new-york style) with Radix UI primitives — components in `components/ui/`
- **Tailwind CSS 4** — configured via `@tailwindcss/postcss`
- **MUI** (`@mui/material` + `@emotion`) — used alongside shadcn for some components
- **Recharts** for all chart visualizations

### Deployment

Static export to GitHub Pages. Production builds use `basePath: /team-decision-simulator` — this affects asset paths and is set in both `next.config.js` and `app/layout.tsx`.

## Testing

Tests live in `tests/` and use Vitest with `environment: 'node'`. Test categories:
- `logic.test.ts` — Core scoring/decision algorithms
- `integration.test.ts` — Cross-module interactions
- `edge-cases.test.ts` — Boundary conditions
- `ui-components.test.ts` — Component tests (Testing Library)
- `additional.test.ts` — Extended coverage

## Conventions

- Path alias: `@/*` maps to project root
- TypeScript strict mode enabled
- All MBTI type implementations follow the same structure: extend `BaseMBTIType`, define `name`, `weights`, and `description`
