import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ENTJ extends BaseMBTIType {
  protected readonly name = "ENTJ";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.25,
    roi_visibility: 0.35,
    autonomy_scope: 0.2,
    time_pressure: 0.15,
    social_complexity: -0.05,
  };
  protected readonly description: MBTIDescription = {
    name: "ENTJ - The Commander",
    description:
      "Strategic leaders who excel at organizing people and resources to achieve goals. They thrive on challenges and are natural decision-makers.",
    color: "#dc2626", // red-600
    scientificFactors: {
      keyTraits: [
        "Strategic",
        "Decisive",
        "Organized",
        "Goal-oriented",
        "Assertive",
      ],
      decisionProcess:
        "ENTJs employ Extraverted Thinking (Te) as their dominant function, supported by Introverted Intuition (Ni), creating a decision-making style that emphasizes efficiency and long-term strategic planning.",
      strengths: [
        "Strategic planning",
        "Resource organization",
        "Goal achievement",
        "Leadership",
      ],
      challenges: [
        "May overlook emotional factors",
        "Can be overly directive",
        "May rush to implement solutions",
      ],
      historicalContext:
        "The ENTJ decision-making pattern is exemplified by historical leaders like Napoleon Bonaparte, who combined strategic vision with decisive action to achieve ambitious goals.",
      factorResponses: {
        data_quality:
          "ENTJs value data quality but primarily as a means to achieve goals. Research shows they excel at synthesizing complex data into actionable strategies, particularly when it supports their vision.",
        roi_visibility:
          "Studies indicate ENTJs place high importance on ROI metrics as they align with their goal-oriented nature. Their dominant Extraverted Thinking (Te) drives them to seek measurable outcomes.",
        autonomy_scope:
          "ENTJs thrive in leadership roles where they can direct resources and people. Research shows their effectiveness increases when they have authority to implement their strategic vision.",
        time_pressure:
          "ENTJs typically perform well under time pressure, as their Te-Ni combination allows for quick, decisive action. Studies show they maintain decision quality even in time-constrained situations.",
        social_complexity:
          "Research indicates ENTJs navigate social complexity effectively when it serves their strategic goals. Their lower Introverted Feeling (Fi) function means they may prioritize efficiency over emotional considerations.",
      },
      researchInsight:
        "A 2018 study in Leadership Quarterly found that ENTJs maintain high decision quality in complex organizational settings but may need to balance efficiency with team morale.",
    },
  };
}
