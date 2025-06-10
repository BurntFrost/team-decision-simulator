import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ISTJ extends BaseMBTIType {
  protected readonly name = "ISTJ";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.35,
    roi_visibility: 0.22,
    autonomy_scope: 0.16,
    time_pressure: 0.14,
    social_complexity: -0.08,
    psychological_safety: 0.12,
  };
  protected readonly description: MBTIDescription = {
    name: "ISTJ - The Logistician",
    description:
      "Practical and responsible individuals who excel at creating order and structure. They thrive on clear procedures and reliable systems.",
    color: "#64748b", // slate-500
    scientificFactors: {
      keyTraits: [
        "Practical",
        "Organized",
        "Reliable",
        "Detail-oriented",
        "Traditional",
      ],
      decisionProcess:
        "ISTJs employ Introverted Sensing (Si) as their dominant function, supported by Extraverted Thinking (Te), creating a decision-making style that emphasizes established procedures and practical efficiency.",
      strengths: [
        "Organization",
        "Reliability",
        "Attention to detail",
        "Practical problem-solving",
      ],
      challenges: [
        "May resist change",
        "Can be overly rigid",
        "May overlook possibilities",
      ],
      historicalContext:
        "The ISTJ decision-making pattern is exemplified by administrators like Queen Elizabeth I, who combined practical wisdom with strong organizational skills to maintain stability and order.",
      factorResponses: {
        data_quality:
          "ISTJs place high value on data quality due to their dominant Introverted Sensing (Si). Research shows they excel at processing and organizing detailed information systematically.",
        roi_visibility:
          "Studies indicate ISTJs view ROI metrics as crucial for decision-making. Their auxiliary Extraverted Thinking (Te) drives them to seek practical, measurable outcomes.",
        autonomy_scope:
          "ISTJs work effectively within established structures. Research shows their performance is highest when they have clear procedures and responsibilities.",
        time_pressure:
          "ISTJs typically perform well under time pressure when following established procedures. Studies show they maintain decision quality in structured, time-sensitive situations.",
        social_complexity:
          "Research indicates ISTJs may find social complexity challenging, preferring clear roles and responsibilities. Their lower Extraverted Intuition (Ne) function means they may need support in adapting to changing social dynamics.",
      },
      researchInsight:
        "A 2018 study in Organizational Behavior found that ISTJs maintain high decision quality in structured environments but may need support in adapting to rapid change and ambiguity.",
    },
  };
}
