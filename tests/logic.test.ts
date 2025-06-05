import { describe, it, expect } from 'vitest';
import { calculateScore, getDecision } from '../models/decision/logic';
import { Weights, Inputs } from '../models/decision/types';

describe('calculateScore', () => {
  it('computes weighted sum of inputs', () => {
    const weights: Weights = {
      data_quality: 0.2,
      roi_visibility: 0.2,
      autonomy_scope: 0.2,
      time_pressure: 0.2,
      social_complexity: 0.2,
    };
    const inputs: Inputs = {
      data_quality: 0.5,
      roi_visibility: 0.5,
      autonomy_scope: 0.5,
      time_pressure: 0.5,
      social_complexity: 0.5,
    };
    expect(calculateScore(weights, inputs)).toBeCloseTo(0.5);
  });
});

describe('getDecision', () => {
  it('returns correct decision for each threshold', () => {
    expect(getDecision(0.9).text).toBe('Full Speed Ahead');
    expect(getDecision(0.75).text).toBe('Proceed Strategically');
    expect(getDecision(0.56).text).toBe('Implement with Oversight');
    expect(getDecision(0.4).text).toBe('Request Clarification');
    expect(getDecision(0.2).text).toBe('Delay or Disengage');
  });
});
