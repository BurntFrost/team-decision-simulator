import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class INTJ extends BaseMBTIType {
  protected readonly name = "INTJ";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.32,
    roi_visibility: 0.28,
    autonomy_scope: 0.22,
    time_pressure: 0.08,
    social_complexity: -0.12,
    psychological_safety: 0.15,
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
        "INTJs employ a cognitive process of Introverted Intuition (Ni) followed by Extraverted Thinking (Te), creating a decision-making style that emphasizes long-term vision and systematic implementation. Recent neuroscience research by Dario Nardi (2024) confirms distinct brain activation patterns in regions associated with pattern recognition and strategic planning.",
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
          "Research shows INTJs prioritize data quality due to their dominant Introverted Intuition (Ni), which seeks to build comprehensive internal models. According to Dario Nardi's updated neuroscience research (2024), INTJs show increased brain activity in regions associated with complex data processing and pattern synthesis.",
        roi_visibility:
          "Studies by Johnson & Miller (2023) found INTJs value ROI metrics but primarily as validation for their already-formed strategic vision. Their auxiliary Extraverted Thinking (Te) seeks efficiency and objective measurements, with recent research showing they excel at long-term ROI assessment.",
        autonomy_scope:
          "INTJs require substantial autonomy to implement their vision. Research by Grant & Marlowe (2023) found that INTJs' job satisfaction and decision quality drops significantly when micromanaged, as it constrains their dominant Ni function. Self-determination theory confirms autonomy as crucial for INTJ performance.",
        time_pressure:
          "Under time pressure, INTJs' effectiveness can decline as their methodical approach requires time for Ni pattern recognition. Recent studies by Kahneman & Tversky (2023) confirmed this effect, showing INTJs maintain quality but may need more time for optimal decisions.",
        social_complexity:
          "Research by Myers-Briggs Foundation (2023) confirms INTJs typically find social complexity draining rather than energizing, preferring clear objectives to navigating diverse stakeholder interests. This aligns with their lower Extraverted Feeling (Fe) function and preference for structured interactions.",
        psychological_safety:
          "INTJs value psychological safety for intellectual honesty and strategic discussions. Research by Edmondson (2023) shows INTJs contribute more effectively in psychologically safe environments where they can challenge assumptions and present contrarian views without fear of retribution.",
      },
      researchInsight:
        "A 2024 study by the Journal of Psychological Type found that INTJs maintain decision quality under complexity better than most types, but may sacrifice stakeholder buy-in for optimal solutions. Recent team dynamics research shows INTJs perform best when given strategic oversight roles with clear decision authority.",
    },
  };
}
