import {
  FactorKey,
  Weights,
  Inputs,
  Decision,
  SimulationResult,
  PublicOpinionResult,
} from "./types";
import { archetypes } from "./mbti/constants";
import { publicOpinionWeights } from "./constants";

// Calculate score based on weights and inputs
export const calculateScore = (weights: Weights, inputs: Inputs): number =>
  (Object.keys(inputs) as FactorKey[]).reduce(
    (sum, key) => sum + weights[key] * inputs[key],
    0
  );

// Get decision based on score
export const getDecision = (score: number): Decision => {
  if (score > 0.85) return { text: "Full Speed Ahead", color: "#22c55e" }; // Bright Green
  if (score > 0.65) return { text: "Proceed Strategically", color: "#4ade80" }; // Green
  if (score > 0.55)
    return { text: "Implement with Oversight", color: "#a3e635" }; // Lime
  if (score > 0.35) return { text: "Request Clarification", color: "#facc15" }; // Yellow
  return { text: "Delay or Disengage", color: "#f87171" }; // Red
};

// Calculate public decision probabilities based on total score
export const getPublicProbabilities = (
  score: number
): { [key: string]: number } => {
  // Base probabilities distribution based on the score
  let fullSpeed = 0;
  let proceed = 0;
  let implement = 0;
  let clarify = 0;
  let disengage = 0;

  // Distribute probabilities based on score ranges
  if (score > 0.85) {
    fullSpeed = Math.min(0.95, Math.max(0.6, score * 0.8));
    proceed = (1 - fullSpeed) * 0.6;
    implement = (1 - fullSpeed - proceed) * 0.7;
    clarify = (1 - fullSpeed - proceed - implement) * 0.8;
    disengage = 1 - fullSpeed - proceed - implement - clarify;
  } else if (score > 0.65) {
    proceed = Math.min(0.9, Math.max(0.5, score * 0.7));
    fullSpeed = (1 - proceed) * 0.3;
    implement = (1 - proceed - fullSpeed) * 0.5;
    clarify = (1 - proceed - fullSpeed - implement) * 0.7;
    disengage = 1 - proceed - fullSpeed - implement - clarify;
  } else if (score > 0.55) {
    implement = Math.min(0.85, Math.max(0.4, score * 0.6));
    proceed = (1 - implement) * 0.4;
    fullSpeed = (1 - implement - proceed) * 0.1;
    clarify = (1 - implement - proceed - fullSpeed) * 0.7;
    disengage = 1 - implement - proceed - fullSpeed - clarify;
  } else if (score > 0.35) {
    clarify = Math.min(0.8, Math.max(0.3, (1 - score) * 0.6));
    implement = (1 - clarify) * 0.3;
    proceed = (1 - clarify - implement) * 0.2;
    fullSpeed = (1 - clarify - implement - proceed) * 0.05;
    disengage = 1 - clarify - implement - proceed - fullSpeed;
  } else {
    disengage = Math.min(0.9, Math.max(0.5, (1 - score) * 0.8));
    clarify = (1 - disengage) * 0.6;
    implement = (1 - disengage - clarify) * 0.3;
    proceed = (1 - disengage - clarify - implement) * 0.1;
    fullSpeed = 1 - disengage - clarify - implement - proceed;
  }

  return {
    "Full Speed Ahead": parseFloat(fullSpeed.toFixed(3)),
    "Proceed Strategically": parseFloat(proceed.toFixed(3)),
    "Implement with Oversight": parseFloat(implement.toFixed(3)),
    "Request Clarification": parseFloat(clarify.toFixed(3)),
    "Delay or Disengage": parseFloat(disengage.toFixed(3)),
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
