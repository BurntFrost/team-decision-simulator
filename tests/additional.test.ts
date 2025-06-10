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
import { publicOpinionWeights, factorInfo, presetScenarios } from '../models/decision/constants';
import { MBTIFactory } from '../models/decision/mbti';

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
    psychological_safety: 0.5,
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
    psychological_safety: 0.6,
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

  it('handles specific decision types in public opinion', () => {
    // Test scenario that should result in "Full Speed Ahead" being most likely
    // Focus on highest weighted positive factors: ROI (0.32) and time pressure (0.28)
    const highConfidenceInputs: Inputs = {
      data_quality: 1.0,
      roi_visibility: 1.0,
      autonomy_scope: 0.0,
      time_pressure: 1.0,
      social_complexity: 0.0,
      psychological_safety: 1.0,
    };

    const fullSpeedResult = calculatePublicOpinion(highConfidenceInputs);
    expect(fullSpeedResult.mostLikely).toBe('Full Speed Ahead');
    expect(fullSpeedResult.color).toBe(getDecision(0.9).color);

    // Test scenario that should result in "Proceed Strategically" being most likely
    const moderateConfidenceInputs: Inputs = {
      data_quality: 0.5,
      roi_visibility: 0.9,
      autonomy_scope: 0.3,
      time_pressure: 0.7,
      social_complexity: 0.0,
      psychological_safety: 0.6,
    };

    const proceedResult = calculatePublicOpinion(moderateConfidenceInputs);
    expect(proceedResult.mostLikely).toBe('Proceed Strategically');
    expect(proceedResult.color).toBe(getDecision(0.75).color);
  });
});

describe('Psychological Safety Factor Integration', () => {
  it('all MBTI types include psychological safety factor', () => {
    const profiles = MBTIFactory.getArchetypeProfiles();

    profiles.forEach(profile => {
      expect(profile.weights).toHaveProperty('psychological_safety');
      expect(typeof profile.weights.psychological_safety).toBe('number');
      // Psychological safety should be a reasonable value between -0.5 and 0.5
      expect(profile.weights.psychological_safety).toBeGreaterThanOrEqual(-0.5);
      expect(profile.weights.psychological_safety).toBeLessThanOrEqual(0.5);
    });
  });

  it('preset scenarios include psychological safety factor', () => {
    Object.values(presetScenarios).forEach(scenario => {
      expect(scenario).toHaveProperty('psychological_safety');
      expect(typeof scenario.psychological_safety).toBe('number');
      // Psychological safety in scenarios should be between 0 and 1
      expect(scenario.psychological_safety).toBeGreaterThanOrEqual(0);
      expect(scenario.psychological_safety).toBeLessThanOrEqual(1);
    });
  });

  it('factor info includes psychological safety', () => {
    expect(factorInfo).toHaveProperty('psychological_safety');
    expect(factorInfo.psychological_safety.label).toBe('Psychological Safety');
    expect(factorInfo.psychological_safety.description).toContain('Project Aristotle');
  });

  it('public opinion weights include psychological safety', () => {
    expect(publicOpinionWeights).toHaveProperty('psychological_safety');
    expect(typeof publicOpinionWeights.psychological_safety).toBe('number');
  });
});
