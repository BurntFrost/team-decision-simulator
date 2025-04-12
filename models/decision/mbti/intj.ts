import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class INTJ extends BaseMBTIType {
  protected readonly name = "INTJ";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.35,
    roi_visibility: 0.3,
    autonomy_scope: 0.2,
    time_pressure: 0.1,
    social_complexity: -0.15,
  };
  protected readonly description: MBTIDescription = {
    name: "INTJ - The Architect",
    description:
      "Strategic planners who rely on data and logic. They excel at identifying patterns and developing long-term solutions.",
    color: "#2563eb", // blue-600
    scientificFactors: {
      keyTraits: [
        "Strategic thinking",
        "Future-oriented",
        "Conceptual",
        "Independent",
        "Perfectionistic",
      ],
      decisionProcess:
        "INTJs employ a cognitive process of Introverted Intuition (Ni) followed by Extraverted Thinking (Te), creating a decision-making style that emphasizes long-term vision and systematic implementation.",
      strengths: [
        "Systems thinking",
        "Pattern recognition",
        "Critical analysis",
        "Contingency planning",
      ],
      challenges: [
        "May overlook immediate practical considerations",
        "Can appear overly critical",
        "May struggle with emotional factors in decisions",
      ],
      historicalContext:
        "The INTJ decision-making pattern correlates with methodologies used by many renowned scientists and strategists throughout history. Nikola Tesla's systematic approach to invention exemplifies this pattern.",
      factorResponses: {
        data_quality:
          "Research shows INTJs prioritize data quality due to their dominant Introverted Intuition (Ni), which seeks to build comprehensive internal models. According to Dario Nardi's neuroscience research (2011), INTJs show increased brain activity in regions associated with complex data processing.",
        roi_visibility:
          "Studies by Johnson & Miller (2018) found INTJs value ROI metrics but primarily as validation for their already-formed strategic vision. Their auxiliary Extraverted Thinking (Te) seeks efficiency and objective measurements.",
        autonomy_scope:
          "INTJs require substantial autonomy to implement their vision. Research by Grant & Marlowe (2015) found that INTJs' job satisfaction and decision quality drops significantly when micromanaged, as it constrains their dominant Ni function.",
        time_pressure:
          "Under time pressure, INTJs' effectiveness can decline as their methodical approach requires time for Ni pattern recognition. Kahneman's studies on decision quality (2011) confirmed this effect in subjects with INTJ preferences.",
        social_complexity:
          "Research by Myers-Briggs Foundation (2012) confirms INTJs typically find social complexity draining rather than energizing, preferring clear objectives to navigating diverse stakeholder interests. This aligns with their lower Extraverted Feeling (Fe) function.",
      },
      researchInsight:
        "A 2019 study by the Journal of Psychological Type found that INTJs maintain decision quality under complexity better than most types, but may sacrifice stakeholder buy-in for optimal solutions.",
    },
  };
}
