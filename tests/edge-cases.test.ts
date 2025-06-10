import { describe, it, expect } from 'vitest';
import {
  calculateScore,
  getDecision,
  getPublicProbabilities,
  calculateResults,
  calculateMajorityDecision,
} from '../models/decision/logic';
import { Weights, Inputs } from '../models/decision/types';
import { MBTIFactory } from '../models/decision/mbti';

describe('Edge Cases and Input Validation', () => {
  describe('calculateScore edge cases', () => {
    it('handles extreme input values (0 and 1)', () => {
      const weights: Weights = {
        data_quality: 0.2,
        roi_visibility: 0.2,
        autonomy_scope: 0.2,
        time_pressure: 0.2,
        social_complexity: 0.1,
        psychological_safety: 0.1,
      };

      const extremeInputs: Inputs = {
        data_quality: 0,
        roi_visibility: 1,
        autonomy_scope: 0,
        time_pressure: 1,
        social_complexity: 0,
        psychological_safety: 1,
      };

      const score = calculateScore(weights, extremeInputs);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('handles negative weights correctly', () => {
      const weightsWithNegative: Weights = {
        data_quality: 0.3,
        roi_visibility: 0.3,
        autonomy_scope: 0.2,
        time_pressure: 0.1,
        social_complexity: -0.2, // Negative weight
        psychological_safety: 0.1,
      };

      const inputs: Inputs = {
        data_quality: 0.8,
        roi_visibility: 0.7,
        autonomy_scope: 0.6,
        time_pressure: 0.5,
        social_complexity: 0.9, // High social complexity should reduce score
        psychological_safety: 0.8,
      };

      const score = calculateScore(weightsWithNegative, inputs);
      expect(typeof score).toBe('number');
      expect(isFinite(score)).toBe(true);
    });
  });

  describe('getDecision boundary conditions', () => {
    it('handles exact threshold values', () => {
      // Thresholds are > not >=, so exact values fall into lower category
      expect(getDecision(0.85).text).toBe('Proceed Strategically');
      expect(getDecision(0.851).text).toBe('Full Speed Ahead');
      expect(getDecision(0.65).text).toBe('Implement with Oversight');
      expect(getDecision(0.651).text).toBe('Proceed Strategically');
      expect(getDecision(0.55).text).toBe('Request Clarification');
      expect(getDecision(0.551).text).toBe('Implement with Oversight');
      expect(getDecision(0.35).text).toBe('Delay or Disengage');
      expect(getDecision(0.351).text).toBe('Request Clarification');
    });

    it('handles extreme score values', () => {
      expect(getDecision(0).text).toBe('Delay or Disengage');
      expect(getDecision(1).text).toBe('Full Speed Ahead');
      expect(getDecision(-0.1).text).toBe('Delay or Disengage');
      expect(getDecision(1.1).text).toBe('Full Speed Ahead');
    });
  });

  describe('getPublicProbabilities validation', () => {
    it('probabilities always sum to 1 regardless of input', () => {
      const testScores = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1, -0.1, 1.1];
      
      testScores.forEach(score => {
        const probs = getPublicProbabilities(score);
        const sum = Object.values(probs).reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1, 2); // Use more lenient tolerance for floating point
        
        // All probabilities should be non-negative
        Object.values(probs).forEach(prob => {
          expect(prob).toBeGreaterThanOrEqual(0);
          expect(prob).toBeLessThanOrEqual(1);
        });
      });
    });
  });

  describe('MBTI Factory error handling', () => {
    it('throws error for invalid MBTI type', () => {
      expect(() => {
        // @ts-expect-error - Testing invalid type
        MBTIFactory.create('INVALID');
      }).toThrow('Unknown MBTI type: INVALID');
    });

    it('all MBTI types have valid weight structures', () => {
      const profiles = MBTIFactory.getArchetypeProfiles();
      
      profiles.forEach(profile => {
        expect(profile.name).toBeTruthy();
        expect(typeof profile.name).toBe('string');
        
        // Check all required weight properties exist
        const requiredKeys = [
          'data_quality',
          'roi_visibility', 
          'autonomy_scope',
          'time_pressure',
          'social_complexity',
          'psychological_safety'
        ];
        
        requiredKeys.forEach(key => {
          expect(profile.weights).toHaveProperty(key);
          expect(typeof profile.weights[key as keyof typeof profile.weights]).toBe('number');
          expect(isFinite(profile.weights[key as keyof typeof profile.weights])).toBe(true);
        });
      });
    });
  });

  describe('calculateResults consistency', () => {
    it('returns consistent results for same inputs', () => {
      const inputs: Inputs = {
        data_quality: 0.7,
        roi_visibility: 0.6,
        autonomy_scope: 0.5,
        time_pressure: 0.4,
        social_complexity: 0.3,
        psychological_safety: 0.8,
      };

      const results1 = calculateResults(inputs);
      const results2 = calculateResults(inputs);

      expect(results1).toEqual(results2);
      expect(results1.length).toBe(16); // Should have all 16 MBTI types

      // Each result should have valid structure
      results1.forEach(result => {
        expect(result.name).toBeTruthy();
        expect(typeof result.score).toBe('number');
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.decision).toBeTruthy();
        expect(result.color).toMatch(/^#[0-9a-f]{6}$/i); // Valid hex color
      });
    });
  });

  describe('calculateMajorityDecision edge cases', () => {
    it('handles empty results array', () => {
      const result = calculateMajorityDecision([]);

      expect(result.decision).toBe('');
      expect(result.color).toBe('#6b7280'); // Default color
      expect(result.counts).toEqual({});
    });

    it('handles results with no matching decision color', () => {
      const mockResults = [
        { name: 'Test', score: 0.5, decision: 'Unknown Decision', color: '#123456' }
      ];

      const result = calculateMajorityDecision(mockResults);
      expect(result.decision).toBe('Unknown Decision');
      expect(result.color).toBe('#123456'); // Should find the color from the result
    });
  });
});
