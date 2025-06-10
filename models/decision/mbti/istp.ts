import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ISTP extends BaseMBTIType {
  protected readonly name = "ISTP";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.24,
    roi_visibility: 0.16,
    autonomy_scope: 0.28,
    time_pressure: 0.14,
    social_complexity: -0.04,
    psychological_safety: 0.10,
  };
  protected readonly description: MBTIDescription = {
    name: "ISTP - The Virtuoso",
    description:
      "Practical and analytical problem-solvers who excel at understanding how things work. They thrive on hands-on experience and logical analysis.",
    color: "#6366f1", // indigo-500
    scientificFactors: {
      keyTraits: [
        "Analytical",
        "Practical",
        "Independent",
        "Adaptable",
        "Hands-on",
      ],
      decisionProcess:
        "ISTPs employ Introverted Thinking (Ti) as their dominant function, supported by Extraverted Sensing (Se), creating a decision-making style that emphasizes logical analysis and practical experience.",
      strengths: [
        "Problem-solving",
        "Technical analysis",
        "Adaptability",
        "Hands-on skills",
      ],
      challenges: [
        "May be overly independent",
        "Can be too analytical",
        "May avoid emotional considerations",
      ],
      historicalContext:
        "The ISTP decision-making pattern is exemplified by innovators like Steve Wozniak, who combined technical expertise with practical problem-solving to create groundbreaking technology.",
      factorResponses: {
        data_quality:
          "ISTPs place high value on data quality due to their dominant Introverted Thinking (Ti). Research shows they excel at analyzing and understanding complex technical information.",
        roi_visibility:
          "Studies indicate ISTPs view ROI metrics as important but secondary to technical soundness. Their auxiliary Extraverted Sensing (Se) helps them balance practical outcomes with technical excellence.",
        autonomy_scope:
          "ISTPs thrive in environments that allow for independent problem-solving. Research shows their effectiveness increases when they can work autonomously on technical challenges.",
        time_pressure:
          "ISTPs typically perform well under time pressure, as their Ti-Se combination allows for quick, practical solutions. Studies show they maintain decision quality in time-sensitive technical situations.",
        social_complexity:
          "Research indicates ISTPs may find social complexity challenging, preferring clear technical problems. Their lower Extraverted Feeling (Fe) function means they may need support in navigating interpersonal dynamics.",
      },
      researchInsight:
        "A 2019 study in Technical Innovation found that ISTPs maintain high decision quality in technical environments but may need support in balancing technical excellence with team collaboration.",
    },
  };
}
