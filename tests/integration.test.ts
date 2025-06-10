import { describe, it, expect } from 'vitest';
import {
  calculateResults,
  calculatePublicOpinion,
  calculateMajorityDecision,
  getPublicProbabilities,
} from '../models/decision/logic';
import { Inputs } from '../models/decision/types';
import { presetScenarios } from '../models/decision/constants';

describe('Integration Tests', () => {
  describe('End-to-end simulation workflow', () => {
    it('processes complete simulation from inputs to final results', () => {
      const inputs: Inputs = {
        data_quality: 0.8,
        roi_visibility: 0.7,
        autonomy_scope: 0.6,
        time_pressure: 0.4,
        social_complexity: 0.3,
        psychological_safety: 0.9,
      };

      // Step 1: Calculate MBTI results
      const mbtiResults = calculateResults(inputs);
      expect(mbtiResults).toHaveLength(16);

      // Step 2: Calculate public opinion
      const publicOpinion = calculatePublicOpinion(inputs);
      expect(publicOpinion.score).toBeGreaterThanOrEqual(0);
      expect(publicOpinion.score).toBeLessThanOrEqual(1);

      // Step 3: Calculate majority decision
      const majorityDecision = calculateMajorityDecision(mbtiResults);
      expect(majorityDecision.decision).toBeTruthy();
      expect(majorityDecision.color).toMatch(/^#[0-9a-f]{6}$/i);

      // Step 4: Verify consistency
      const totalVotes = Object.values(majorityDecision.counts).reduce((a, b) => a + b, 0);
      expect(totalVotes).toBe(16); // All MBTI types should vote
    });

    it('handles all preset scenarios correctly', () => {
      Object.entries(presetScenarios).forEach(([scenarioName, scenario]) => {
        const mbtiResults = calculateResults(scenario);
        const publicOpinion = calculatePublicOpinion(scenario);
        const majorityDecision = calculateMajorityDecision(mbtiResults);

        // All scenarios should produce valid results
        expect(mbtiResults).toHaveLength(16);
        expect(publicOpinion.score).toBeGreaterThanOrEqual(0);
        expect(publicOpinion.score).toBeLessThanOrEqual(1);
        expect(majorityDecision.decision).toBeTruthy();

        // Public opinion probabilities should sum to 1
        const probSum = Object.values(publicOpinion.probabilities).reduce((a, b) => a + b, 0);
        expect(probSum).toBeCloseTo(1, 2); // Use more lenient tolerance for floating point
      });
    });
  });

  describe('Cross-validation between components', () => {
    it('public opinion and MBTI results show logical consistency', () => {
      // High-confidence scenario
      const highConfidenceInputs: Inputs = {
        data_quality: 0.9,
        roi_visibility: 0.9,
        autonomy_scope: 0.8,
        time_pressure: 0.2,
        social_complexity: 0.1,
        psychological_safety: 0.9,
      };

      const mbtiResults = calculateResults(highConfidenceInputs);
      const publicOpinion = calculatePublicOpinion(highConfidenceInputs);

      // High confidence should lead to more positive decisions
      const positiveDecisions = mbtiResults.filter(r => 
        r.decision === 'Full Speed Ahead' || r.decision === 'Proceed Strategically'
      );
      expect(positiveDecisions.length).toBeGreaterThan(mbtiResults.length / 2);

      // Public opinion should also be positive
      expect(publicOpinion.score).toBeGreaterThan(0.6);
    });

    it('low-confidence scenario produces cautious decisions', () => {
      // Low-confidence scenario
      const lowConfidenceInputs: Inputs = {
        data_quality: 0.2,
        roi_visibility: 0.1,
        autonomy_scope: 0.3,
        time_pressure: 0.9,
        social_complexity: 0.8,
        psychological_safety: 0.2,
      };

      const mbtiResults = calculateResults(lowConfidenceInputs);
      const publicOpinion = calculatePublicOpinion(lowConfidenceInputs);

      // Low confidence should lead to more cautious decisions
      const cautiousDecisions = mbtiResults.filter(r => 
        r.decision === 'Request Clarification' || r.decision === 'Delay or Disengage'
      );
      expect(cautiousDecisions.length).toBeGreaterThan(mbtiResults.length / 3);

      // Public opinion should also be cautious
      expect(publicOpinion.score).toBeLessThan(0.5);
    });
  });

  describe('Data consistency and validation', () => {
    it('all MBTI types produce unique but valid results', () => {
      const inputs: Inputs = {
        data_quality: 0.5,
        roi_visibility: 0.5,
        autonomy_scope: 0.5,
        time_pressure: 0.5,
        social_complexity: 0.5,
        psychological_safety: 0.5,
      };

      const results = calculateResults(inputs);
      const names = results.map(r => r.name);
      const uniqueNames = new Set(names);

      // All MBTI types should be unique
      expect(uniqueNames.size).toBe(16);

      // All scores should be valid numbers
      results.forEach(result => {
        expect(typeof result.score).toBe('number');
        expect(isFinite(result.score)).toBe(true);
        expect(result.score).toBeGreaterThanOrEqual(0);
      });
    });

    it('probability distributions are mathematically sound', () => {
      const testScores = [0.1, 0.3, 0.5, 0.7, 0.9];
      
      testScores.forEach(score => {
        const probs = getPublicProbabilities(score);
        
        // Check that probabilities sum to 1
        const sum = Object.values(probs).reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1, 2); // Use more lenient tolerance for floating point
        
        // Check that all probabilities are valid
        Object.values(probs).forEach(prob => {
          expect(prob).toBeGreaterThanOrEqual(0);
          expect(prob).toBeLessThanOrEqual(1);
          expect(isFinite(prob)).toBe(true);
        });
        
        // Check that the highest probability aligns with the score
        const sortedProbs = Object.entries(probs).sort((a, b) => b[1] - a[1]);
        const highestDecision = sortedProbs[0][0];
        
        if (score > 0.8) {
          expect(['Full Speed Ahead', 'Proceed Strategically']).toContain(highestDecision);
        } else if (score < 0.3) {
          expect(['Delay or Disengage', 'Request Clarification']).toContain(highestDecision);
        }
      });
    });
  });
});
