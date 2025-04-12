import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class INFJ extends BaseMBTIType {
  protected readonly name = "INFJ";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.25,
    roi_visibility: 0.15,
    autonomy_scope: 0.15,
    time_pressure: 0.05,
    social_complexity: 0.2,
  };
  protected readonly description: MBTIDescription = {
    name: "INFJ - The Advocate",
    description:
      "Insightful and compassionate leaders who seek to make a positive impact. They excel at understanding complex human dynamics and creating meaningful change.",
    color: "#059669", // emerald-600
    scientificFactors: {
      keyTraits: [
        "Insightful",
        "Compassionate",
        "Strategic",
        "Determined",
        "Creative",
      ],
      decisionProcess:
        "INFJs employ Introverted Intuition (Ni) as their dominant function, supported by Extraverted Feeling (Fe), creating a decision-making style that emphasizes long-term vision and human impact.",
      strengths: [
        "Strategic vision",
        "Human understanding",
        "Creative problem-solving",
        "Change management",
      ],
      challenges: [
        "May take on too much responsibility",
        "Can be overly idealistic",
        "May struggle with conflict",
      ],
      historicalContext:
        "The INFJ decision-making pattern is exemplified by leaders like Martin Luther King Jr., who combined strategic vision with deep understanding of human needs to drive social change.",
      factorResponses: {
        data_quality:
          "INFJs value data quality but primarily in service of their vision. Research shows they excel at synthesizing complex information to support their strategic goals while considering human impact.",
        roi_visibility:
          "Studies indicate INFJs view ROI metrics as important but secondary to human and social impact. Their auxiliary Extraverted Feeling (Fe) drives them to consider broader implications.",
        autonomy_scope:
          "INFJs require autonomy to implement their vision effectively. Research shows their leadership effectiveness increases when they can align their work with their values and long-term goals.",
        time_pressure:
          "Under time pressure, INFJs may struggle as their Ni-Fe process requires time for thorough consideration of implications. Studies show they benefit from structured decision-making frameworks.",
        social_complexity:
          "Research indicates INFJs excel at navigating social complexity, using their strong intuition and empathy to understand and address diverse needs. Their lower Extraverted Thinking (Te) function means they may need support with practical implementation.",
      },
      researchInsight:
        "A 2021 study in Leadership & Organization Development found that INFJs maintain high decision quality in complex social environments but may need support in balancing idealism with practical constraints.",
    },
  };
}
