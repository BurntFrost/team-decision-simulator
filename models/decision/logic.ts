import {
  FactorKey,
  Weights,
  Inputs,
  Decision,
  SimulationResult,
  PublicOpinionResult,
} from "./types";
import { archetypes } from "./mbti/constants";
import { DECISION_THRESHOLDS, publicOpinionWeights } from "./constants";

// Calculate score based on weights and inputs
export const calculateScore = (weights: Weights, inputs: Inputs): number =>
  (Object.keys(inputs) as FactorKey[]).reduce(
    (sum, key) => sum + weights[key] * inputs[key],
    0
  );

// Get decision based on score
export const getDecision = (score: number): Decision => {
  const threshold = DECISION_THRESHOLDS.find(t => score > t.minScore) ?? DECISION_THRESHOLDS[DECISION_THRESHOLDS.length - 1];
  return { text: threshold.text, color: threshold.color };
};

// Distribution config: primary category gets a calculated probability,
// then remaining categories each take a fraction of what's left in order.
// The last category receives whatever remains (1 - sum of others).
type DistributionConfig = {
  primaryCalc: (score: number) => number;
  // Ordered list of [categoryName, fractionOfRemaining] — last entry gets the remainder
  allocation: [string, number][];
};

const PROBABILITY_DISTRIBUTIONS: { minScore: number; config: DistributionConfig }[] = [
  {
    minScore: 0.85,
    config: {
      primaryCalc: (s) => Math.min(0.95, Math.max(0.6, s * 0.8)),
      allocation: [
        ["Full Speed Ahead", -1], // -1 = primary
        ["Proceed Strategically", 0.6],
        ["Implement with Oversight", 0.7],
        ["Request Clarification", 0.8],
        ["Delay or Disengage", 1], // remainder
      ],
    },
  },
  {
    minScore: 0.65,
    config: {
      primaryCalc: (s) => Math.min(0.9, Math.max(0.5, s * 0.7)),
      allocation: [
        ["Proceed Strategically", -1],
        ["Full Speed Ahead", 0.3],
        ["Implement with Oversight", 0.5],
        ["Request Clarification", 0.7],
        ["Delay or Disengage", 1],
      ],
    },
  },
  {
    minScore: 0.55,
    config: {
      primaryCalc: (s) => Math.min(0.85, Math.max(0.4, s * 0.6)),
      allocation: [
        ["Implement with Oversight", -1],
        ["Proceed Strategically", 0.4],
        ["Full Speed Ahead", 0.1],
        ["Request Clarification", 0.7],
        ["Delay or Disengage", 1],
      ],
    },
  },
  {
    minScore: 0.35,
    config: {
      primaryCalc: (s) => Math.min(0.8, Math.max(0.3, (1 - s) * 0.6)),
      allocation: [
        ["Request Clarification", -1],
        ["Implement with Oversight", 0.3],
        ["Proceed Strategically", 0.2],
        ["Full Speed Ahead", 0.05],
        ["Delay or Disengage", 1],
      ],
    },
  },
  {
    minScore: -Infinity,
    config: {
      primaryCalc: (s) => Math.min(0.9, Math.max(0.5, (1 - s) * 0.8)),
      allocation: [
        ["Delay or Disengage", -1],
        ["Request Clarification", 0.6],
        ["Implement with Oversight", 0.3],
        ["Proceed Strategically", 0.1],
        ["Full Speed Ahead", 1],
      ],
    },
  },
];

// Calculate public decision probabilities based on total score
export const getPublicProbabilities = (
  score: number
): { [key: string]: number } => {
  const dist = PROBABILITY_DISTRIBUTIONS.find(d => score > d.minScore) ?? PROBABILITY_DISTRIBUTIONS[PROBABILITY_DISTRIBUTIONS.length - 1];
  const { primaryCalc, allocation } = dist.config;

  const primaryValue = primaryCalc(score);
  const result: { [key: string]: number } = {};
  let allocated = 0;

  for (let i = 0; i < allocation.length; i++) {
    const [name, factor] = allocation[i];
    if (factor === -1) {
      // Primary category
      result[name] = primaryValue;
      allocated += primaryValue;
    } else if (i === allocation.length - 1) {
      // Last category gets the remainder
      result[name] = 1 - allocated;
    } else {
      // Takes a fraction of what remains
      const value = (1 - allocated) * factor;
      result[name] = value;
      allocated += value;
    }
  }

  return {
    "Full Speed Ahead": parseFloat(result["Full Speed Ahead"].toFixed(3)),
    "Proceed Strategically": parseFloat(result["Proceed Strategically"].toFixed(3)),
    "Implement with Oversight": parseFloat(result["Implement with Oversight"].toFixed(3)),
    "Request Clarification": parseFloat(result["Request Clarification"].toFixed(3)),
    "Delay or Disengage": parseFloat(result["Delay or Disengage"].toFixed(3)),
  };
};

// Calculate simulation results for all archetypes
export const calculateResults = (inputs: Inputs): SimulationResult[] => {
  return archetypes.map((agent) => {
    const score = parseFloat(calculateScore(agent.weights, inputs).toFixed(3));
    const decision = getDecision(score);
    return {
      name: agent.name,
      score,
      decision: decision.text,
      color: decision.color,
    };
  });
};

// Calculate public opinion result
export const calculatePublicOpinion = (inputs: Inputs): PublicOpinionResult => {
  const score = parseFloat(
    calculateScore(publicOpinionWeights, inputs).toFixed(3)
  );
  const probabilities = getPublicProbabilities(score);

  // Find most likely public decision
  const mostLikelyDecision = Object.entries(probabilities).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  // Map decision to corresponding score for color determination
  const decisionScore =
    mostLikelyDecision === "Full Speed Ahead"
      ? 0.9
      : mostLikelyDecision === "Proceed Strategically"
      ? 0.75
      : mostLikelyDecision === "Implement with Oversight"
      ? 0.6
      : mostLikelyDecision === "Request Clarification"
      ? 0.45
      : 0.2; // Delay or Disengage

  const decisionColor = getDecision(decisionScore).color;

  return {
    score,
    probabilities,
    mostLikely: mostLikelyDecision,
    color: decisionColor,
  };
};

// Calculate majority decision
export const calculateMajorityDecision = (
  results: SimulationResult[]
): {
  decision: string;
  color: string;
  counts: Record<string, number>;
} => {
  const decisionCounts: Record<string, number> = results.reduce((acc, r) => {
    acc[r.decision] = (acc[r.decision] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDecisions = Object.entries(decisionCounts).sort(
    (a, b) => b[1] - a[1]
  );
  const majorityDecision = sortedDecisions[0]?.[0] || "";
  const majorityColor =
    results.find((r) => r.decision === majorityDecision)?.color || "#6b7280";

  return {
    decision: majorityDecision,
    color: majorityColor,
    counts: decisionCounts,
  };
};
