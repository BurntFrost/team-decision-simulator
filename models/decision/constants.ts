import { FactorInfoMap, ArchetypeProfile, MBTIDescription } from "./types";

// Factor information with descriptions
export const factorInfo: FactorInfoMap = {
  data_quality: {
    label: "Data Quality",
    description:
      "How reliable, complete, and accurate is the available information?",
    lowDesc: "Unreliable, incomplete, or dubious data",
    highDesc: "Complete, verified, and trustworthy data",
  },
  roi_visibility: {
    label: "ROI Visibility",
    description: "How clear and measurable are the expected returns?",
    lowDesc: "Unclear benefits, hard to measure outcomes",
    highDesc: "Clear, quantifiable returns with specific metrics",
  },
  autonomy_scope: {
    label: "Autonomy & Scope",
    description: "How much control will you have over execution?",
    lowDesc: "Dependent on others with limited control",
    highDesc: "Full authority within well-defined boundaries",
  },
  time_pressure: {
    label: "Time Pressure",
    description: "How urgent is this decision?",
    lowDesc: "Plenty of time, minimal urgency",
    highDesc: "Immediate decision required, high urgency",
  },
  social_complexity: {
    label: "Social Complexity",
    description: "How many stakeholders are involved and how aligned are they?",
    lowDesc: "Few stakeholders with aligned interests",
    highDesc: "Many stakeholders with conflicting agendas",
  },
};

// Descriptions for preset scenarios
export const presetDescriptions = {
  "Buying a Car":
    "Deciding whether to purchase a new or used car, considering budget, needs, and long-term value",
  "Moving to a New City":
    "Evaluating a potential move, weighing job opportunities, cost of living, and quality of life",
  "Starting a Side Hustle":
    "Assessing the viability of starting a part-time business or freelance work",
  "Home Renovation":
    "Planning home improvements, balancing budget, functionality, and aesthetic goals",
  "Career Development":
    "Choosing between different professional development paths or educational opportunities",
  "Major Purchase":
    "Making a significant financial decision like buying electronics, furniture, or appliances",
  "Health & Fitness":
    "Deciding on a new health routine, diet plan, or fitness program",
  "Relationship Decision":
    "Navigating important relationship choices or commitments",
};

// Default weights for each scenario
export const presetScenarios = {
  "Buying a Car": {
    data_quality: 0.8,
    roi_visibility: 0.7,
    autonomy_scope: 0.6,
    time_pressure: 0.4,
    social_complexity: 0.3,
  },
  "Moving to a New City": {
    data_quality: 0.6,
    roi_visibility: 0.5,
    autonomy_scope: 0.8,
    time_pressure: 0.4,
    social_complexity: 0.7,
  },
  "Starting a Side Hustle": {
    data_quality: 0.7,
    roi_visibility: 0.6,
    autonomy_scope: 0.9,
    time_pressure: 0.3,
    social_complexity: 0.5,
  },
  "Home Renovation": {
    data_quality: 0.8,
    roi_visibility: 0.7,
    autonomy_scope: 0.5,
    time_pressure: 0.4,
    social_complexity: 0.6,
  },
  "Career Development": {
    data_quality: 0.7,
    roi_visibility: 0.8,
    autonomy_scope: 0.6,
    time_pressure: 0.5,
    social_complexity: 0.4,
  },
  "Major Purchase": {
    data_quality: 0.8,
    roi_visibility: 0.7,
    autonomy_scope: 0.4,
    time_pressure: 0.3,
    social_complexity: 0.2,
  },
  "Health & Fitness": {
    data_quality: 0.6,
    roi_visibility: 0.5,
    autonomy_scope: 0.9,
    time_pressure: 0.4,
    social_complexity: 0.3,
  },
  "Relationship Decision": {
    data_quality: 0.5,
    roi_visibility: 0.4,
    autonomy_scope: 0.7,
    time_pressure: 0.6,
    social_complexity: 0.8,
  },
};

// Default input values
export const defaultInputs = {
  data_quality: 0.8,
  roi_visibility: 0.6,
  autonomy_scope: 0.7,
  time_pressure: 0.3,
  social_complexity: 0.2,
};

// Public opinion weights
export const publicOpinionWeights = {
  data_quality: 0.15, // General public relies less on data quality
  roi_visibility: 0.35, // Public strongly focuses on clear returns
  autonomy_scope: 0.1, // Public cares less about autonomy
  time_pressure: 0.3, // Public is highly influenced by urgency
  social_complexity: -0.25, // Public strongly avoids social complexity
};
