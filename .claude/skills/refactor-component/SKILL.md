---
name: refactor-component
description: Guide decomposition of large React components while preserving decision simulator patterns, data flow, and Recharts integration
disable-model-invocation: true
---

# Refactor Component

Guide the decomposition of large React components into smaller, focused pieces while preserving the decision simulator's data flow and conventions.

## Instructions

1. Read the target component file completely
2. Identify natural extraction boundaries:
   - **State groups** — related useState/useMemo/useCallback clusters that serve one feature
   - **Render sections** — JSX blocks behind tab panels, conditional renders, or map iterations
   - **Data transformations** — Recharts data prep, MBTI grouping, probability calculations
3. Propose an extraction plan before making changes — list each new component/hook with its props interface
4. Extract following these rules:

## Extraction Rules

### Custom Hooks (`lib/hooks/`)
- Extract when 2+ state variables + their handlers form a cohesive unit
- Name: `use<Feature>` (e.g., `useSliderState`, `useSimulationResults`)
- Return an object, not an array, for named access
- Keep the hook in `lib/hooks/` with the `@/lib/hooks/` import path

### Sub-components (`components/`)
- Extract when a JSX block is >80 lines and has a clear boundary
- Pass data down via props — don't reach into parent state
- Use the existing `@/*` path alias for imports
- Co-locate with the parent if tightly coupled, otherwise top-level `components/`

### Chart Components
- Each Recharts visualization can be its own component
- Keep data transformation close to the chart that uses it
- Import MBTI data from `@/lib/mbtiData`, not inline

### Data Transformations (`lib/utils/`)
- Extract pure functions that transform SimulationResult[] into chart-ready data
- These should be independently testable with Vitest

## What NOT to Extract

- Single-use JSX under 40 lines — leave inline
- State that's used by 3+ sibling sections — keep in parent
- The `DecisionService` facade pattern — don't restructure imports through models/

## Validation

After extraction:
1. Run `npm run typecheck` — zero errors
2. Run `npm test` — all existing tests pass
3. Verify the UI looks identical (no visual regressions)
