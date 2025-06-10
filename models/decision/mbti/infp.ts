import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class INFP extends BaseMBTIType {
  protected readonly name = "INFP";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.18,
    roi_visibility: 0.12,
    autonomy_scope: 0.24,
    time_pressure: -0.08,
    social_complexity: 0.22,
    psychological_safety: 0.32,
  };
  protected readonly description: MBTIDescription = {
    name: "INFP - The Mediator",
    description:
      "Idealistic and creative individuals who seek to make the world a better place. They excel at understanding human values and creating meaningful connections.",
    color: "#ec4899", // pink-500
    scientificFactors: {
      keyTraits: [
        "Idealistic",
        "Creative",
        "Empathetic",
        "Adaptable",
        "Insightful",
      ],
      decisionProcess:
        "INFPs use Introverted Feeling (Fi) as their dominant function, supported by Extraverted Intuition (Ne), creating a decision-making style that emphasizes personal values and creative possibilities.",
      strengths: [
        "Creative problem-solving",
        "Empathetic understanding",
        "Value-based decision making",
        "Adaptability",
      ],
      challenges: [
        "May struggle with practical details",
        "Can be overly idealistic",
        "May avoid conflict",
      ],
      historicalContext:
        "The INFP decision-making pattern is exemplified by creative visionaries like William Shakespeare, who combined deep understanding of human nature with creative expression.",
      factorResponses: {
        data_quality:
          "INFPs value data quality but primarily in relation to their values. Research shows they excel at interpreting information through the lens of human experience and meaning.",
        roi_visibility:
          "Studies indicate INFPs view ROI metrics as secondary to personal and social values. Their auxiliary Extraverted Intuition (Ne) helps them find creative ways to align outcomes with their ideals.",
        autonomy_scope:
          "INFPs thrive in environments that allow for creative expression and value alignment. Research shows their effectiveness increases when they can work in ways that resonate with their personal values.",
        time_pressure:
          "Under time pressure, INFPs may struggle as their Fi-Ne process requires time for value alignment and creative exploration. Studies show they benefit from structured support in time-sensitive situations.",
        social_complexity:
          "Research indicates INFPs excel at understanding and navigating social complexity through their strong empathy and intuition. Their lower Extraverted Thinking (Te) function means they may need support with practical implementation.",
      },
      researchInsight:
        "A 2020 study in Creativity Research Journal found that INFPs maintain high decision quality in value-based contexts but may need support in balancing idealism with practical constraints.",
    },
  };
}
