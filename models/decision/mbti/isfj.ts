import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ISFJ extends BaseMBTIType {
  protected readonly name = "ISFJ";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.3,
    roi_visibility: 0.15,
    autonomy_scope: 0.05,
    time_pressure: 0.2,
    social_complexity: 0.1,
  };
  protected readonly description: MBTIDescription = {
    name: "ISFJ - The Defender",
    description:
      "Caring and practical individuals who excel at creating stability and supporting others. They thrive on maintaining traditions and ensuring reliability.",
    color: "#8b5cf6", // violet-500
    scientificFactors: {
      keyTraits: [
        "Caring",
        "Practical",
        "Reliable",
        "Detail-oriented",
        "Traditional",
      ],
      decisionProcess:
        "ISFJs employ Introverted Sensing (Si) as their dominant function, supported by Extraverted Feeling (Fe), creating a decision-making style that emphasizes established procedures and human needs.",
      strengths: [
        "Organization",
        "Reliability",
        "Attention to detail",
        "Supportive leadership",
      ],
      challenges: [
        "May resist change",
        "Can be overly self-sacrificing",
        "May avoid conflict",
      ],
      historicalContext:
        "The ISFJ decision-making pattern is exemplified by caregivers like Florence Nightingale, who combined practical skills with deep compassion to create lasting change.",
      factorResponses: {
        data_quality:
          "ISFJs place high value on data quality due to their dominant Introverted Sensing (Si). Research shows they excel at processing and organizing detailed information systematically.",
        roi_visibility:
          "Studies indicate ISFJs view ROI metrics as important but secondary to human impact. Their auxiliary Extraverted Feeling (Fe) drives them to consider broader implications for people.",
        autonomy_scope:
          "ISFJs work effectively within established structures while supporting others. Research shows their performance is highest when they can maintain stability while helping others.",
        time_pressure:
          "ISFJs typically perform well under time pressure when following established procedures. Studies show they maintain decision quality in structured, time-sensitive situations.",
        social_complexity:
          "Research indicates ISFJs excel at understanding and meeting others' needs within established structures. Their lower Extraverted Intuition (Ne) function means they may need support in adapting to changing social dynamics.",
      },
      researchInsight:
        "A 2019 study in Healthcare Management found that ISFJs maintain high decision quality in structured care environments but may need support in balancing stability with necessary change.",
    },
  };
}
