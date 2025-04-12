// Types
export type FactorKey = 'data_quality' | 'roi_visibility' | 'autonomy_scope' | 'time_pressure' | 'social_complexity';

export type FactorInfo = {
  label: string;
  description: string;
  lowDesc: string;
  highDesc: string;
};

export type FactorInfoMap = {
  [K in FactorKey]: FactorInfo;
};

export type Weights = {
  [K in FactorKey]: number;
};

export type Inputs = Weights;

export type SimulationResult = {
  name: string;
  score: number;
  decision: string;
  color: string;
};

export type Decision = {
  text: string;
  color: string;
};

export type ArchetypeProfile = {
  name: string;
  weights: Weights;
};

export type MBTIDescription = {
  name: string;
  description: string;
  color: string;
};

export type PublicOpinionResult = {
  score: number;
  probabilities: { [key: string]: number };
  mostLikely: string;
  color: string;
};

// Constants
export const factorInfo: FactorInfoMap = {
  data_quality: {
    label: "Data Quality",
    description: "How reliable, complete, and accurate is the available information?",
    lowDesc: "Unreliable, incomplete, or dubious data",
    highDesc: "Complete, verified, and trustworthy data"
  },
  roi_visibility: {
    label: "ROI Visibility",
    description: "How clear and measurable are the expected returns?",
    lowDesc: "Unclear benefits, hard to measure outcomes",
    highDesc: "Clear, quantifiable returns with specific metrics"
  },
  autonomy_scope: {
    label: "Autonomy & Scope",
    description: "How much control will you have over execution?",
    lowDesc: "Dependent on others with limited control",
    highDesc: "Full authority within well-defined boundaries"
  },
  time_pressure: {
    label: "Time Pressure",
    description: "How urgent is this decision?",
    lowDesc: "Plenty of time, minimal urgency",
    highDesc: "Immediate decision required, high urgency"
  },
  social_complexity: {
    label: "Social Complexity",
    description: "How many stakeholders are involved and how aligned are they?",
    lowDesc: "Few stakeholders with aligned interests",
    highDesc: "Many stakeholders with conflicting agendas"
  },
};

export const archetypes: ArchetypeProfile[] = [
  { name: 'INTJ', weights: { data_quality: 0.35, roi_visibility: 0.30, autonomy_scope: 0.20, time_pressure: 0.10, social_complexity: -0.15 } },
  { name: 'ISTJ', weights: { data_quality: 0.40, roi_visibility: 0.20, autonomy_scope: 0.15, time_pressure: 0.15, social_complexity: -0.10 } },
  { name: 'ENTJ', weights: { data_quality: 0.25, roi_visibility: 0.35, autonomy_scope: 0.20, time_pressure: 0.15, social_complexity: -0.05 } },
  { name: 'INTP', weights: { data_quality: 0.40, roi_visibility: 0.15, autonomy_scope: 0.20, time_pressure: 0.05, social_complexity: -0.10 } }
];

export const mbtiDescriptions: Record<string, MBTIDescription> = {
  INTJ: {
    name: "INTJ - The Architect",
    description: "Strategic planners who rely on data and logic. They excel at identifying patterns and developing long-term solutions.",
    color: "#2563eb" // blue-600
  },
  ISTJ: {
    name: "ISTJ - The Inspector",
    description: "Detail-oriented and systematic. They prefer established processes and make decisions based on proven methods.",
    color: "#16a34a" // green-600
  },
  ENTJ: {
    name: "ENTJ - The Commander",
    description: "Natural leaders who focus on efficiency and results. They excel at strategic thinking and implementing systematic improvements.",
    color: "#9333ea" // purple-600
  },
  INTP: {
    name: "INTP - The Logician",
    description: "Analytical problem-solvers who value precision. They excel at identifying logical inconsistencies and developing theoretical solutions.",
    color: "#ea580c" // orange-600
  }
};

export const publicOpinionWeights: Weights = {
  data_quality: 0.15,       // General public relies less on data quality
  roi_visibility: 0.35,     // Public strongly focuses on clear returns
  autonomy_scope: 0.10,     // Public cares less about autonomy
  time_pressure: 0.30,      // Public is highly influenced by urgency
  social_complexity: -0.25  // Public strongly avoids social complexity
};

export const presetScenarios: Record<string, Inputs> = {
  "High Quality Data": { data_quality: 0.9, roi_visibility: 0.6, autonomy_scope: 0.7, time_pressure: 0.3, social_complexity: 0.2 },
  "Time Critical": { data_quality: 0.6, roi_visibility: 0.5, autonomy_scope: 0.4, time_pressure: 0.9, social_complexity: 0.3 },
  "Limited Information": { data_quality: 0.3, roi_visibility: 0.4, autonomy_scope: 0.5, time_pressure: 0.6, social_complexity: 0.4 },
  "Complex Stakeholders": { data_quality: 0.5, roi_visibility: 0.6, autonomy_scope: 0.4, time_pressure: 0.2, social_complexity: 0.8 },
};

export const presetDescriptions: Record<string, string> = {
  "High Quality Data": "Scenario with reliable, complete data and clear metrics for evaluation",
  "Time Critical": "Urgent decision needed with significant time pressure and immediate impact",
  "Limited Information": "Decision context with incomplete or uncertain data and unclear outcomes",
  "Complex Stakeholders": "Multiple stakeholders involved with diverse and potentially conflicting interests"
};

export const defaultInputs: Inputs = {
  data_quality: 0.8,
  roi_visibility: 0.6,
  autonomy_scope: 0.7,
  time_pressure: 0.3,
  social_complexity: 0.2,
};

// Calculate score
export const calculateScore = (weights: Weights, inputs: Inputs): number =>
  (Object.keys(inputs) as FactorKey[]).reduce((sum, key) => sum + weights[key] * inputs[key], 0);

// Get decision based on score
export const getDecision = (score: number): Decision => {
  if (score > 0.65) return { text: 'Proceed Strategically', color: '#4ade80' }; // Green
  if (score > 0.45) return { text: 'Request Clarification', color: '#facc15' }; // Yellow
  return { text: 'Delay or Disengage', color: '#f87171' }; // Red
};

// Public decision probabilities based on total score
export const getPublicProbabilities = (score: number): { [key: string]: number } => {
  // Base probabilities - adjusted based on the score
  let proceed = Math.min(0.95, Math.max(0.05, score * 0.8 + 0.1));
  
  // The remaining probability is split between the other options based on score
  const remaining = 1 - proceed;
  let clarify, disengage;
  
  if (score > 0.65) {
    // High score - more likely to proceed, less likely to disengage
    clarify = remaining * 0.8;
    disengage = remaining * 0.2;
  } else if (score > 0.45) {
    // Medium score - clarification is most likely fallback
    clarify = remaining * 0.65;
    disengage = remaining * 0.35;
  } else {
    // Low score - disengage is most likely fallback
    clarify = remaining * 0.3;
    disengage = remaining * 0.7;
  }
  
  return {
    "Proceed Strategically": parseFloat(proceed.toFixed(3)),
    "Request Clarification": parseFloat(clarify.toFixed(3)),
    "Delay or Disengage": parseFloat(disengage.toFixed(3))
  };
};

// Calculate simulation results for all archetypes
export const calculateResults = (inputs: Inputs): SimulationResult[] => {
  return archetypes.map(agent => {
    const score = parseFloat(calculateScore(agent.weights, inputs).toFixed(3));
    const decision = getDecision(score);
    return { 
      name: agent.name, 
      score, 
      decision: decision.text,
      color: decision.color
    };
  });
};

// Calculate public opinion result
export const calculatePublicOpinion = (inputs: Inputs): PublicOpinionResult => {
  const score = parseFloat(calculateScore(publicOpinionWeights, inputs).toFixed(3));
  const probabilities = getPublicProbabilities(score);
  
  // Find most likely public decision
  const mostLikelyDecision = Object.entries(probabilities).sort((a, b) => b[1] - a[1])[0][0];
  const decisionColor = getDecision(
    mostLikelyDecision === "Proceed Strategically" ? 0.7 :
    mostLikelyDecision === "Request Clarification" ? 0.55 : 0.3
  ).color;
  
  return {
    score,
    probabilities,
    mostLikely: mostLikelyDecision,
    color: decisionColor
  };
};

// Format radar data for personality types
export const formatRadarData = (): Record<string, any>[] => {
  return Object.keys(factorInfo).map(key => {
    const dataPoint: Record<string, any> = { factor: factorInfo[key as FactorKey].label };
    archetypes.forEach(arch => {
      dataPoint[arch.name] = arch.weights[key as FactorKey];
    });
    return dataPoint;
  });
};

// Calculate majority decision
export const calculateMajorityDecision = (results: SimulationResult[]): {
  decision: string;
  color: string;
  counts: Record<string, number>;
} => {
  const decisionCounts: Record<string, number> = results.reduce((acc, r) => {
    acc[r.decision] = (acc[r.decision] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedDecisions = Object.entries(decisionCounts).sort((a, b) => b[1] - a[1]);
  const majorityDecision = sortedDecisions[0]?.[0] || '';
  const majorityColor = results.find(r => r.decision === majorityDecision)?.color || '#6b7280';
  
  return {
    decision: majorityDecision,
    color: majorityColor,
    counts: decisionCounts
  };
}; 