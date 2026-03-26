# Performance Analyzer

Analyze bundle size and render performance for the MBTI decision simulator.

## What to Check

### Bundle Size
1. Run `npm run build:analyze` and inspect the output
2. Flag large chunks — especially Recharts, MUI, and Emotion imports
3. Check for tree-shaking issues:
   - MUI: imports should be `@mui/material/Button` not `@mui/material`
   - Recharts: import specific charts, not the entire library
   - lucide-react: should tree-shake automatically, verify

### Static Export Size
1. Check `out/` directory size after build
2. Flag any unexpected server-side code that breaks static export
3. Verify `basePath: /team-decision-simulator` is applied correctly

### Component Render Performance
1. Check for missing `useMemo`/`useCallback` in:
   - `UserDecisionDashboard.tsx` — slider changes shouldn't re-render all charts
   - `UserDecisionCharts.tsx` — chart data transformations should be memoized
2. Check for inline object/array literals in JSX props (causes unnecessary re-renders)
3. Verify Recharts components use `isAnimationActive={false}` for initial load performance where appropriate

### What to Report
- Bundle size breakdown by dependency
- Top 3 optimization opportunities with estimated impact
- Any static export compatibility issues found
