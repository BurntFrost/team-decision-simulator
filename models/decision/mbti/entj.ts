import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ENTJ extends BaseMBTIType {
  protected readonly name = "ENTJ";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.24,
    roi_visibility: 0.34,
    autonomy_scope: 0.22,
    time_pressure: 0.14,
    social_complexity: -0.04,
    psychological_safety: 0.16,
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
          "ENTJs value data quality but primarily as a means to achieve goals. Research shows they excel at synthesizing complex data into actionable strategies, particularly when it supports their vision. Recent studies indicate they prefer authoritative, comprehensive data sources.",
        roi_visibility:
          "Studies indicate ENTJs place high importance on ROI metrics as they align with their goal-oriented nature. Their dominant Extraverted Thinking (Te) drives them to seek measurable outcomes. 2024 research shows they excel at identifying both short-term and long-term value creation opportunities.",
        autonomy_scope:
          "ENTJs thrive in leadership roles where they can direct resources and people. Research shows their effectiveness increases when they have authority to implement their strategic vision. Self-determination theory confirms autonomy as essential for ENTJ leadership effectiveness.",
        time_pressure:
          "ENTJs typically perform well under time pressure, as their Te-Ni combination allows for quick, decisive action. Studies show they maintain decision quality even in time-constrained situations. Recent research indicates they excel in crisis leadership scenarios.",
        social_complexity:
          "Research indicates ENTJs navigate social complexity effectively when it serves their strategic goals. Their lower Introverted Feeling (Fi) function means they may prioritize efficiency over emotional considerations, but they excel at stakeholder alignment when focused on shared objectives.",
        psychological_safety:
          "ENTJs value psychological safety for honest feedback and strategic discussions. Research by Edmondson (2024) shows ENTJs create psychological safety through clear expectations and direct communication, though they may need to balance directness with empathy to maintain team trust.",
      },
      researchInsight:
        "A 2024 study in Leadership Quarterly found that ENTJs maintain high decision quality in complex organizational settings but may need to balance efficiency with team morale. Recent team dynamics research shows ENTJs are most effective when they combine their natural directness with psychological safety practices.",
    },
  };
}
