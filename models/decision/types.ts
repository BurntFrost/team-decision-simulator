// Basic Types - Updated with modern decision-making research
export type FactorKey =
  | "data_quality"
  | "roi_visibility"
  | "autonomy_scope"
  | "time_pressure"
  | "social_complexity"
  | "psychological_safety";

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

// Decision Types
export type Decision = {
  text: string;
  color: string;
};

export type SimulationResult = {
  name: string;
  score: number;
  decision: string;
  color: string;
};

export type PublicOpinionResult = {
  score: number;
  probabilities: { [key: string]: number };
  mostLikely: string;
  color: string;
};

// Personality Types
export type ArchetypeProfile = {
  name: string;
  weights: Weights;
};

export type MBTIDescription = {
  name: string;
  description: string;
  color: string;
  scientificFactors: {
    keyTraits: string[];
    decisionProcess: string;
    strengths: string[];
    challenges: string[];
    historicalContext: string;
    factorResponses: {
      [K in FactorKey]?: string;
    };
    researchInsight: string;
  };
};
