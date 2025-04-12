import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ENTP extends BaseMBTIType {
  protected readonly name = "ENTP";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.25,
    roi_visibility: 0.2,
    autonomy_scope: 0.15,
    time_pressure: 0.1,
    social_complexity: 0.1,
  };
  protected readonly description: MBTIDescription = {
    name: "ENTP - The Debater",
    description:
      "Innovative and energetic problem-solvers who thrive on intellectual challenges. They excel at seeing possibilities and generating creative solutions.",
    color: "#f59e0b", // amber-500
    scientificFactors: {
      keyTraits: [
        "Innovative",
        "Energetic",
        "Strategic",
        "Adaptable",
        "Curious",
      ],
      decisionProcess:
        "ENTPs use Extraverted Intuition (Ne) as their dominant function, supported by Introverted Thinking (Ti), creating a decision-making style that emphasizes exploring possibilities and logical analysis.",
      strengths: [
        "Creative problem-solving",
        "Strategic thinking",
        "Adaptability",
        "Innovation",
      ],
      challenges: [
        "May struggle with follow-through",
        "Can be argumentative",
        "May overlook practical details",
      ],
      historicalContext:
        "The ENTP decision-making pattern is exemplified by innovators like Thomas Edison, who combined creative exploration with practical problem-solving to achieve breakthroughs.",
      factorResponses: {
        data_quality:
          "ENTPs value data quality but primarily as a springboard for new ideas. Research shows they excel at finding novel applications for existing data through their dominant Extraverted Intuition (Ne).",
        roi_visibility:
          "Studies indicate ENTPs view ROI metrics as important but secondary to innovation potential. Their auxiliary Introverted Thinking (Ti) helps them balance creative exploration with practical outcomes.",
        autonomy_scope:
          "ENTPs thrive in environments that allow for creative exploration. Research shows their innovative output increases significantly when given freedom to explore multiple possibilities.",
        time_pressure:
          "ENTPs typically perform well under time pressure, as their Ne-Ti combination allows for quick, innovative solutions. However, studies show they may need structure to maintain focus.",
        social_complexity:
          "Research indicates ENTPs navigate social complexity effectively, using their strong communication skills to build support for their ideas. Their lower Introverted Sensing (Si) function means they may overlook established procedures.",
      },
      researchInsight:
        "A 2019 study in Innovation Management found that ENTPs excel at generating novel solutions but may need support in implementation and follow-through.",
    },
  };
}
