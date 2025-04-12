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

// Preset scenarios for decision situations
export const presetScenarios = {
  "High Quality Data": {
    data_quality: 0.9,
    roi_visibility: 0.6,
    autonomy_scope: 0.7,
    time_pressure: 0.3,
    social_complexity: 0.2,
  },
  "Time Critical": {
    data_quality: 0.6,
    roi_visibility: 0.5,
    autonomy_scope: 0.4,
    time_pressure: 0.9,
    social_complexity: 0.3,
  },
  "Limited Information": {
    data_quality: 0.3,
    roi_visibility: 0.4,
    autonomy_scope: 0.5,
    time_pressure: 0.6,
    social_complexity: 0.4,
  },
  "Complex Stakeholders": {
    data_quality: 0.5,
    roi_visibility: 0.6,
    autonomy_scope: 0.4,
    time_pressure: 0.2,
    social_complexity: 0.8,
  },
};

// Descriptions for preset scenarios
export const presetDescriptions = {
  "High Quality Data":
    "Scenario with reliable, complete data and clear metrics for evaluation",
  "Time Critical":
    "Urgent decision needed with significant time pressure and immediate impact",
  "Limited Information":
    "Decision context with incomplete or uncertain data and unclear outcomes",
  "Complex Stakeholders":
    "Multiple stakeholders involved with diverse and potentially conflicting interests",
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
