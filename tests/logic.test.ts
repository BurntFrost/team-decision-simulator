import { describe, it, expect } from 'vitest';
import {
  calculateScore,
  getDecision,
  calculateMajorityDecision,
} from '../models/decision/logic';
import { Weights, Inputs } from '../models/decision/types';

describe('calculateScore', () => {
  it('computes weighted sum of inputs', () => {
    const weights: Weights = {
      data_quality: 1/6,
      roi_visibility: 1/6,
      autonomy_scope: 1/6,
      time_pressure: 1/6,
      social_complexity: 1/6,
      psychological_safety: 1/6,
    };
    const inputs: Inputs = {
      data_quality: 0.5,
      roi_visibility: 0.5,
      autonomy_scope: 0.5,
      time_pressure: 0.5,
      social_complexity: 0.5,
      psychological_safety: 0.5,
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

describe('calculateMajorityDecision', () => {
  it('identifies the most common decision', () => {
    const results = [
      {
        name: 'A',
        score: 0.8,
        decision: 'Proceed Strategically',
        color: '#4ade80',
      },
      {
        name: 'B',
        score: 0.82,
        decision: 'Proceed Strategically',
        color: '#4ade80',
      },
      {
        name: 'C',
        score: 0.45,
        decision: 'Request Clarification',
        color: '#facc15',
      },
    ];

    const { decision, counts } = calculateMajorityDecision(results);
    expect(decision).toBe('Proceed Strategically');
    expect(counts['Proceed Strategically']).toBe(2);
  });
});
