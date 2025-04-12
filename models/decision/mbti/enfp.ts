import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ENFP extends BaseMBTIType {
  protected readonly name = "ENFP";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.1,
    roi_visibility: 0.15,
    autonomy_scope: 0.25,
    time_pressure: 0.1,
    social_complexity: 0.2,
  };
  protected readonly description: MBTIDescription = {
    name: "ENFP - The Campaigner",
    description:
      "Enthusiastic and creative individuals who thrive on possibilities and human connection. They excel at inspiring others and generating innovative solutions.",
    color: "#f97316", // orange-500
    scientificFactors: {
      keyTraits: [
        "Enthusiastic",
        "Creative",
        "Empathetic",
        "Adaptable",
        "Innovative",
      ],
      decisionProcess:
        "ENFPs use Extraverted Intuition (Ne) as their dominant function, supported by Introverted Feeling (Fi), creating a decision-making style that emphasizes possibilities and personal values.",
      strengths: [
        "Creative problem-solving",
        "Team inspiration",
        "Adaptability",
        "Innovation",
      ],
      challenges: [
        "May struggle with follow-through",
        "Can be overly optimistic",
        "May avoid conflict",
      ],
      historicalContext:
        "The ENFP decision-making pattern is exemplified by creative leaders like Walt Disney, who combined innovative vision with the ability to inspire others to achieve the impossible.",
      factorResponses: {
        data_quality:
          "ENFPs value data quality but primarily as a source of new possibilities. Research shows they excel at finding innovative applications for information through their dominant Extraverted Intuition (Ne).",
        roi_visibility:
          "Studies indicate ENFPs view ROI metrics as important but secondary to creative potential and human impact. Their auxiliary Introverted Feeling (Fi) helps them balance innovation with personal values.",
        autonomy_scope:
          "ENFPs thrive in environments that allow for creative exploration and human connection. Research shows their innovative output increases significantly when given freedom to explore and collaborate.",
        time_pressure:
          "ENFPs typically perform well under time pressure, as their Ne-Fi combination allows for quick, creative solutions. However, studies show they may need structure to maintain focus and follow-through.",
        social_complexity:
          "Research indicates ENFPs excel at navigating social complexity, using their strong communication skills and empathy to build connections and drive change. Their lower Introverted Sensing (Si) function means they may need support with established procedures.",
      },
      researchInsight:
        "A 2020 study in Innovation Management found that ENFPs excel at generating novel solutions and inspiring teams but may need support in implementation and maintaining focus.",
    },
  };
}
