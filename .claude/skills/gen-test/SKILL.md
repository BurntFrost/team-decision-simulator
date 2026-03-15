---
name: gen-test
description: Generate Vitest tests following project test patterns for decision logic, MBTI types, or UI components
disable-model-invocation: true
---

# Generate Tests

Generate Vitest tests that follow the project's existing test patterns.

## Instructions

1. Read the target file to understand what needs testing
2. Read the most relevant existing test file from `tests/` to match the style:
   - `tests/logic.test.ts` — for decision logic functions
   - `tests/edge-cases.test.ts` — for boundary conditions
   - `tests/integration.test.ts` — for cross-module tests
   - `tests/ui-components.test.ts` — for React component tests
3. Generate tests in the same file or a new file in `tests/`

## Test Conventions

- Import from `vitest`: `describe`, `it`, `expect`
- Import types from `../models/decision/types`
- Import logic from `../models/decision/logic` or `../lib/decisionMatrixService`
- Use `toBeCloseTo` for floating-point score comparisons
- Use descriptive test names that explain the expected behavior
- For MBTI types: test that weights produce expected decisions for known input scenarios
- All 6 factors must be present in test `Inputs`: `data_quality`, `roi_visibility`, `autonomy_scope`, `time_pressure`, `social_complexity`, `psychological_safety`

## Example

```typescript
import { describe, it, expect } from 'vitest';
import { calculateScore } from '../models/decision/logic';
import { Weights, Inputs } from '../models/decision/types';

describe('INTJ scoring', () => {
  const intjWeights: Weights = {
    data_quality: 0.32,
    roi_visibility: 0.28,
    autonomy_scope: 0.22,
    time_pressure: 0.08,
    social_complexity: -0.12,
    psychological_safety: 0.15,
  };

  it('scores high with strong data and clear ROI', () => {
    const inputs: Inputs = {
      data_quality: 0.9, roi_visibility: 0.9,
      autonomy_scope: 0.7, time_pressure: 0.3,
      social_complexity: 0.2, psychological_safety: 0.8,
    };
    expect(calculateScore(intjWeights, inputs)).toBeGreaterThan(0.6);
  });
});
```
