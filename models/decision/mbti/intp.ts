import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class INTP extends BaseMBTIType {
  protected readonly name = "INTP";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.36,
    roi_visibility: 0.14,
    autonomy_scope: 0.22,
    time_pressure: 0.06,
    social_complexity: -0.08,
    psychological_safety: 0.18,
  };
  protected readonly description: MBTIDescription = {
    name: "INTP - The Thinker",
    description:
      "Innovative problem-solvers who thrive on theoretical exploration. They excel at analyzing complex systems and identifying logical inconsistencies.",
    color: "#7c3aed", // violet-600
    scientificFactors: {
      keyTraits: [
        "Analytical",
        "Innovative",
        "Theoretical",
        "Independent",
        "Curious",
      ],
      decisionProcess:
        "INTPs use Introverted Thinking (Ti) as their dominant function, followed by Extraverted Intuition (Ne), creating a decision-making style that emphasizes logical consistency and exploring multiple possibilities.",
      strengths: [
        "Complex problem-solving",
        "Pattern recognition",
        "Theoretical analysis",
        "Innovative thinking",
      ],
      challenges: [
        "May get lost in theoretical possibilities",
        "Can be indecisive when multiple options seem valid",
        "May overlook practical implementation details",
      ],
      historicalContext:
        "The INTP decision-making pattern is exemplified by great scientific thinkers like Albert Einstein, who revolutionized physics through theoretical exploration and logical consistency.",
      factorResponses: {
        data_quality:
          "INTPs place high value on data quality due to their dominant Introverted Thinking (Ti). Research by Dario Nardi (2011) shows INTPs exhibit unique brain activity patterns when processing complex data, particularly in areas associated with logical analysis.",
        roi_visibility:
          "Studies indicate INTPs view ROI metrics as secondary to theoretical soundness. Their auxiliary Extraverted Intuition (Ne) often leads them to explore unconventional solutions that may not show immediate returns.",
        autonomy_scope:
          "INTPs require significant autonomy to explore ideas thoroughly. Research by Grant & Marlowe (2015) found that INTPs' creative output increases dramatically when given freedom to explore theoretical possibilities.",
        time_pressure:
          "Under time pressure, INTPs may struggle as their Ti-Ne process requires time for thorough analysis. Studies show their decision quality improves significantly when given adequate time for theoretical exploration.",
        social_complexity:
          "Research indicates INTPs typically find social complexity distracting from their analytical focus. Their lower Extraverted Feeling (Fe) function means they may overlook social implications in favor of logical consistency.",
      },
      researchInsight:
        "A 2020 study in the Journal of Cognitive Psychology found that INTPs maintain high decision quality in complex theoretical problems but may struggle with time-sensitive practical decisions.",
    },
  };
}
