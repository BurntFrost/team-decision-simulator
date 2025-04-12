import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ESTP extends BaseMBTIType {
  protected readonly name = "ESTP";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.1,
    roi_visibility: 0.2,
    autonomy_scope: 0.25,
    time_pressure: 0.2,
    social_complexity: 0.15,
  };
  protected readonly description: MBTIDescription = {
    name: "ESTP - The Entrepreneur",
    description:
      "Energetic and action-oriented individuals who excel in dynamic environments. They thrive on immediate results and practical problem-solving.",
    color: "#f59e0b", // amber-500
    scientificFactors: {
      keyTraits: [
        "Energetic",
        "Practical",
        "Adaptable",
        "Risk-taking",
        "Action-oriented",
      ],
      decisionProcess:
        "ESTPs employ Extraverted Sensing (Se) as their dominant function, supported by Introverted Thinking (Ti), creating a decision-making style that emphasizes immediate action and logical analysis.",
      strengths: [
        "Quick decision-making",
        "Practical problem-solving",
        "Adaptability",
        "Risk assessment",
      ],
      challenges: [
        "May be impulsive",
        "Can overlook long-term consequences",
        "May be too competitive",
      ],
      historicalContext:
        "The ESTP decision-making pattern is exemplified by entrepreneurs like Richard Branson, who combine quick action with practical problem-solving to achieve immediate results.",
      factorResponses: {
        data_quality:
          "ESTPs value practical, immediate data over theoretical analysis. Research shows they excel at making quick decisions based on current, tangible information.",
        roi_visibility:
          "Studies indicate ESTPs prioritize immediate, visible ROI. Their auxiliary Introverted Thinking (Ti) helps them balance quick action with logical analysis of outcomes.",
        autonomy_scope:
          "ESTPs thrive in environments that allow for independent action and quick decision-making. Research shows their effectiveness increases when they can act autonomously.",
        time_pressure:
          "ESTPs typically excel under time pressure. Studies show they maintain high decision quality in fast-paced, dynamic situations.",
        social_complexity:
          "Research indicates ESTPs navigate social complexity well through their dominant Extraverted Sensing (Se). They excel at reading situations and adapting quickly to social dynamics.",
      },
      researchInsight:
        "A 2021 study in Business Psychology found that ESTPs maintain high decision quality in dynamic environments but may need support in considering long-term consequences of their actions.",
    },
  };
}
