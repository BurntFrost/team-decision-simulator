import { describe, it, expect } from 'vitest';
import {
  getPublicProbabilities,
  calculateResults,
  calculatePublicOpinion,
  calculateScore,
  getDecision,
} from '../models/decision/logic';
import { Inputs } from '../models/decision/types';
import { archetypes } from '../models/decision/mbti/constants';
import { publicOpinionWeights } from '../models/decision/constants';

describe('getPublicProbabilities', () => {
  it('probabilities sum to 1 and align with high score', () => {
    const probs = getPublicProbabilities(0.9);
    const sum = Object.values(probs).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
    const maxKey = Object.entries(probs).sort((a, b) => b[1] - a[1])[0][0];
    expect(maxKey).toBe('Full Speed Ahead');
  });

  it('favors disengage when score is low', () => {
    const probs = getPublicProbabilities(0.1);
    const maxKey = Object.entries(probs).sort((a, b) => b[1] - a[1])[0][0];
    expect(maxKey).toBe('Delay or Disengage');
  });
});

describe('calculateResults', () => {
  const inputs: Inputs = {
    data_quality: 0.5,
    roi_visibility: 0.5,
    autonomy_scope: 0.5,
    time_pressure: 0.5,
    social_complexity: 0.5,
  };

  it('returns a result for every archetype', () => {
    const results = calculateResults(inputs);
    expect(results.length).toBe(archetypes.length);
    const first = results[0];
    const expectedScore = parseFloat(
      calculateScore(archetypes[0].weights, inputs).toFixed(3)
    );
    expect(first.score).toBe(expectedScore);
    expect(first.decision).toBe(getDecision(expectedScore).text);
  });
});

describe('calculatePublicOpinion', () => {
  const inputs: Inputs = {
    data_quality: 0.7,
    roi_visibility: 0.6,
    autonomy_scope: 0.4,
    time_pressure: 0.5,
    social_complexity: 0.3,
  };

  it('computes opinion metrics consistently', () => {
    const result = calculatePublicOpinion(inputs);
    const score = parseFloat(
      calculateScore(publicOpinionWeights, inputs).toFixed(3)
    );
    expect(result.score).toBe(score);
    expect(result.probabilities).toEqual(getPublicProbabilities(score));
    const highest = Object.entries(result.probabilities).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
    expect(result.mostLikely).toBe(highest);
    const decisionScore =
      highest === 'Full Speed Ahead'
        ? 0.9
        : highest === 'Proceed Strategically'
        ? 0.75
        : highest === 'Implement with Oversight'
        ? 0.6
        : highest === 'Request Clarification'
        ? 0.45
        : 0.2;
    expect(result.color).toBe(getDecision(decisionScore).color);
  });
});
