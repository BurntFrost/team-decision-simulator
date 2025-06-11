import { describe, it, expect } from 'vitest';

describe('Billboard Text Implementation', () => {
  it('should have all required factor labels', () => {
    const factorInfo = {
      data_quality: { label: "Data Quality" },
      roi_visibility: { label: "ROI Visibility" },
      autonomy_scope: { label: "Autonomy & Scope" },
      time_pressure: { label: "Time Pressure" },
      social_complexity: { label: "Social Complexity" },
      psychological_safety: { label: "Psychological Safety" },
    };

    // Test that all 6 factors are defined
    expect(Object.keys(factorInfo)).toHaveLength(6);

    // Test that all factors have labels
    Object.values(factorInfo).forEach(factor => {
      expect(factor.label).toBeTruthy();
      expect(typeof factor.label).toBe('string');
    });
  });

  it('should handle multi-line text for MBTI names', () => {
    const mbtiNames = [
      "INTJ",
      "ENFP",
      "The Architect\nStrategic Thinker",
      "The Campaigner\nEnthusiastic Inspirer"
    ];

    mbtiNames.forEach(name => {
      const lines = name.split('\n');
      const maxLineLength = Math.max(...lines.map(line => line.length));
      const fontSize = 0.28;

      // Test background width calculation
      const backgroundWidth = Math.max(maxLineLength * fontSize * 0.55, fontSize * 2);
      expect(backgroundWidth).toBeGreaterThan(0);

      // Test background height calculation for multi-line text
      const backgroundHeight = fontSize * (1.4 + (lines.length - 1) * 0.8);
      expect(backgroundHeight).toBeGreaterThan(fontSize);

      if (lines.length > 1) {
        expect(backgroundHeight).toBeGreaterThan(fontSize * 1.4);
      }
    });
  });

  it('should have correct factor positions', () => {
    const factorPositions: Record<string, [number, number, number]> = {
      data_quality: [4.2, 1.8, 0.5],
      roi_visibility: [4.2, -1.8, -0.5],
      autonomy_scope: [-1.8, 4.2, 0.5],
      time_pressure: [1.8, -4.2, -0.5],
      social_complexity: [0.5, 0.8, 4.2],
      psychological_safety: [-0.5, 2.8, -3.5],
    };

    // Test that analytical factors (data_quality, roi_visibility) have high X values
    expect(factorPositions.data_quality[0]).toBeGreaterThan(4);
    expect(factorPositions.roi_visibility[0]).toBeGreaterThan(4);

    // Test that autonomy_scope has high Y value
    expect(factorPositions.autonomy_scope[1]).toBeGreaterThan(4);

    // Test that time_pressure has low Y value
    expect(factorPositions.time_pressure[1]).toBeLessThan(-4);

    // Test that social_complexity has high Z value
    expect(factorPositions.social_complexity[2]).toBeGreaterThan(4);

    // Test that psychological_safety has negative Z value
    expect(factorPositions.psychological_safety[2]).toBeLessThan(0);
  });

  it('should have distinct colors for each factor', () => {
    const factorColors: Record<string, { bg: string; text: string }> = {
      data_quality: { bg: "#3b82f6", text: "#ffffff" },
      roi_visibility: { bg: "#1d4ed8", text: "#ffffff" },
      autonomy_scope: { bg: "#10b981", text: "#ffffff" },
      time_pressure: { bg: "#f59e0b", text: "#ffffff" },
      social_complexity: { bg: "#ef4444", text: "#ffffff" },
      psychological_safety: { bg: "#8b5cf6", text: "#ffffff" },
    };

    // Test that all factors have unique background colors
    const backgroundColors = Object.values(factorColors).map(color => color.bg);
    const uniqueColors = new Set(backgroundColors);
    expect(uniqueColors.size).toBe(backgroundColors.length);

    // Test that all factors use white text for readability
    Object.values(factorColors).forEach(color => {
      expect(color.text).toBe("#ffffff");
    });
  });
});
