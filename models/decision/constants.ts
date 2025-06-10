import { FactorInfoMap } from "./types";

// Factor information with descriptions - Updated with modern decision-making research
export const factorInfo: FactorInfoMap = {
  data_quality: {
    label: "Data Quality",
    description:
      "How reliable, complete, and accurate is the available information? Research shows data quality significantly impacts decision confidence and outcomes.",
    lowDesc: "Unreliable, incomplete, or dubious data sources",
    highDesc: "Complete, verified, and trustworthy data with clear provenance",
  },
  roi_visibility: {
    label: "ROI Visibility",
    description: "How clear and measurable are the expected returns? Behavioral economics research emphasizes the importance of clear outcome metrics.",
    lowDesc: "Unclear benefits, hard to measure outcomes",
    highDesc: "Clear, quantifiable returns with specific success metrics",
  },
  autonomy_scope: {
    label: "Autonomy & Scope",
    description: "How much control will you have over execution? Self-determination theory shows autonomy is crucial for motivation and decision quality.",
    lowDesc: "Dependent on others with limited control over implementation",
    highDesc: "Full authority within well-defined boundaries and clear accountability",
  },
  time_pressure: {
    label: "Time Pressure",
    description: "How urgent is this decision? Research on decision-making under pressure shows varying impacts across personality types and complexity levels.",
    lowDesc: "Plenty of time for deliberation, minimal urgency",
    highDesc: "Immediate decision required, high time pressure",
  },
  social_complexity: {
    label: "Social Complexity",
    description: "How many stakeholders are involved and how aligned are they? Team dynamics research shows stakeholder alignment significantly affects implementation success.",
    lowDesc: "Few stakeholders with aligned interests and clear communication",
    highDesc: "Many stakeholders with conflicting agendas and complex dynamics",
  },
  psychological_safety: {
    label: "Psychological Safety",
    description: "Can team members express concerns and ideas without fear of negative consequences? Google's Project Aristotle identified this as the top factor for team effectiveness.",
    lowDesc: "Low trust environment, fear of speaking up or making mistakes",
    highDesc: "High trust environment where diverse perspectives are welcomed and valued",
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

// Group scenarios into categories for easier browsing
export const presetCategories: Record<string, (keyof typeof presetScenarios)[]> = {
  "Career Choices": [
    "Moving to a New City",
    "Career Development",
    "Starting a Side Hustle",
  ],
  "Financial Decisions": [
    "Buying a Car",
    "Major Purchase",
    "Home Renovation",
  ],
  "Personal Growth": ["Health & Fitness"],
  Relationships: ["Relationship Decision"],
};

export const presetCategoryDescriptions: Record<string, string> = {
  "Career Choices": "Explore options related to jobs and professional moves.",
  "Financial Decisions": "Evaluate significant purchases and investments.",
  "Personal Growth": "Focus on health, wellness, and self-improvement.",
  Relationships: "Considerations for important relationships.",
};

// Default weights for each scenario - Updated with psychological safety factor
export const presetScenarios = {
  "Buying a Car": {
    data_quality: 0.8,
    roi_visibility: 0.7,
    autonomy_scope: 0.6,
    time_pressure: 0.4,
    social_complexity: 0.3,
    psychological_safety: 0.2,
  },
  "Moving to a New City": {
    data_quality: 0.6,
    roi_visibility: 0.5,
    autonomy_scope: 0.8,
    time_pressure: 0.4,
    social_complexity: 0.7,
    psychological_safety: 0.5,
  },
  "Starting a Side Hustle": {
    data_quality: 0.7,
    roi_visibility: 0.6,
    autonomy_scope: 0.9,
    time_pressure: 0.3,
    social_complexity: 0.5,
    psychological_safety: 0.4,
  },
  "Home Renovation": {
    data_quality: 0.8,
    roi_visibility: 0.7,
    autonomy_scope: 0.5,
    time_pressure: 0.4,
    social_complexity: 0.6,
    psychological_safety: 0.3,
  },
  "Career Development": {
    data_quality: 0.7,
    roi_visibility: 0.8,
    autonomy_scope: 0.6,
    time_pressure: 0.5,
    social_complexity: 0.4,
    psychological_safety: 0.7,
  },
  "Major Purchase": {
    data_quality: 0.8,
    roi_visibility: 0.7,
    autonomy_scope: 0.4,
    time_pressure: 0.3,
    social_complexity: 0.2,
    psychological_safety: 0.1,
  },
  "Health & Fitness": {
    data_quality: 0.6,
    roi_visibility: 0.5,
    autonomy_scope: 0.9,
    time_pressure: 0.4,
    social_complexity: 0.3,
    psychological_safety: 0.6,
  },
  "Relationship Decision": {
    data_quality: 0.5,
    roi_visibility: 0.4,
    autonomy_scope: 0.7,
    time_pressure: 0.6,
    social_complexity: 0.8,
    psychological_safety: 0.9,
  },
};

// Default input values - Updated with psychological safety
export const defaultInputs = {
  data_quality: 0.8,
  roi_visibility: 0.6,
  autonomy_scope: 0.7,
  time_pressure: 0.3,
  social_complexity: 0.2,
  psychological_safety: 0.6,
};

// Public opinion weights - Updated based on behavioral research
export const publicOpinionWeights = {
  data_quality: 0.12, // General public relies less on data quality, more on intuition
  roi_visibility: 0.32, // Public strongly focuses on clear, immediate returns
  autonomy_scope: 0.08, // Public cares less about autonomy, prefers guidance
  time_pressure: 0.28, // Public is highly influenced by urgency and FOMO
  social_complexity: -0.22, // Public strongly avoids social complexity
  psychological_safety: 0.15, // Public values feeling safe but may not prioritize it consciously
};
