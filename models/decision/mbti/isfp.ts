import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ISFP extends BaseMBTIType {
  protected readonly name = "ISFP";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.14,
    roi_visibility: 0.12,
    autonomy_scope: 0.24,
    time_pressure: 0.08,
    social_complexity: 0.12,
    psychological_safety: 0.26,
  };
  protected readonly description: MBTIDescription = {
    name: "ISFP - The Adventurer",
    description:
      "Artistic and practical individuals who excel at creating beauty and solving problems. They thrive on hands-on experience and personal expression.",
    color: "#06b6d4", // cyan-500
    scientificFactors: {
      keyTraits: [
        "Artistic",
        "Practical",
        "Independent",
        "Adaptable",
        "Sensitive",
      ],
      decisionProcess:
        "ISFPs employ Introverted Feeling (Fi) as their dominant function, supported by Extraverted Sensing (Se), creating a decision-making style that emphasizes personal values and practical experience.",
      strengths: [
        "Creative problem-solving",
        "Practical skills",
        "Adaptability",
        "Artistic expression",
      ],
      challenges: [
        "May be overly independent",
        "Can be too sensitive",
        "May avoid conflict",
      ],
      historicalContext:
        "The ISFP decision-making pattern is exemplified by artists like Bob Dylan, who combined personal expression with practical skill to create meaningful art.",
      factorResponses: {
        data_quality:
          "ISFPs value data quality but primarily in relation to their personal values. Research shows they excel at interpreting information through the lens of personal experience and meaning.",
        roi_visibility:
          "Studies indicate ISFPs view ROI metrics as secondary to personal expression and values. Their auxiliary Extraverted Sensing (Se) helps them balance practical outcomes with creative expression.",
        autonomy_scope:
          "ISFPs thrive in environments that allow for personal expression and hands-on work. Research shows their effectiveness increases when they can work independently on creative projects.",
        time_pressure:
          "ISFPs typically perform well under time pressure when working on practical tasks. Studies show they maintain decision quality in hands-on, time-sensitive situations.",
        social_complexity:
          "Research indicates ISFPs may find social complexity challenging, preferring personal expression and practical work. Their lower Extraverted Thinking (Te) function means they may need support in navigating organizational dynamics.",
      },
      researchInsight:
        "A 2020 study in Creative Arts found that ISFPs maintain high decision quality in artistic and practical environments but may need support in balancing personal expression with organizational needs.",
    },
  };
}
