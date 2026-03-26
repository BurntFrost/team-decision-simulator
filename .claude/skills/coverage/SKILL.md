---
name: coverage
description: Run vitest coverage analysis, identify untested decision logic and component branches, suggest high-value test targets
disable-model-invocation: true
---

# Test Coverage Reporter

Run coverage analysis and identify the highest-value untested code paths.

## Instructions

1. Run coverage:
   ```bash
   npx vitest run --coverage --reporter=verbose 2>&1
   ```

2. Analyze the output and categorize uncovered code:

### Priority Tiers

| Priority | Category | Why |
|----------|----------|-----|
| 🔴 Critical | Decision logic branches in `models/decision/logic.ts` | Incorrect scoring affects all 16 types |
| 🔴 Critical | Probability distribution edge cases in `getPublicProbabilities` | Math errors cascade to charts |
| 🟡 High | MBTI type weight interactions in `models/decision/mbti/` | Each type's behavior depends on weight correctness |
| 🟡 High | Data transformations feeding Recharts | Bad transforms = misleading visualizations |
| 🟢 Medium | Component state logic in `UserDecisionDashboard.tsx` | UI bugs from stale state |
| 🟢 Medium | Slider input edge cases (0, 1, boundaries) | User-facing input handling |
| ⚪ Low | Pure presentation components | Visual-only, low regression risk |

3. Output a report:
   - Overall coverage percentage per file
   - Top 5 uncovered functions/branches ranked by priority
   - For each: the file, line range, what it does, and a suggested test description
   - Recommend whether to add tests to existing files or create new ones

4. If the user wants to fix coverage, use `/gen-test` for each target

## Coverage Thresholds

- `models/decision/` — target 90%+ (core business logic)
- `lib/` — target 80%+ (shared utilities)
- `components/` — target 60%+ (focus on logic, not rendering)
