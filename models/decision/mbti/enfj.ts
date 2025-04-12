import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ENFJ extends BaseMBTIType {
  protected readonly name = "ENFJ";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.15,
    roi_visibility: 0.2,
    autonomy_scope: 0.1,
    time_pressure: 0.15,
    social_complexity: 0.3,
  };
  protected readonly description: MBTIDescription = {
    name: "ENFJ - The Protagonist",
    description:
      "Charismatic and inspiring leaders who excel at bringing people together. They thrive on creating positive change and helping others reach their potential.",
    color: "#10b981", // green-500
    scientificFactors: {
      keyTraits: [
        "Charismatic",
        "Empathetic",
        "Strategic",
        "Organized",
        "Inspiring",
      ],
      decisionProcess:
        "ENFJs employ Extraverted Feeling (Fe) as their dominant function, supported by Introverted Intuition (Ni), creating a decision-making style that emphasizes group harmony and long-term vision.",
      strengths: [
        "Leadership",
        "Team building",
        "Strategic planning",
        "Communication",
      ],
      challenges: [
        "May take on too much responsibility",
        "Can be overly idealistic",
        "May struggle with criticism",
      ],
      historicalContext:
        "The ENFJ decision-making pattern is exemplified by leaders like Nelson Mandela, who combined strong interpersonal skills with strategic vision to unite people and drive change.",
      factorResponses: {
        data_quality:
          "ENFJs value data quality but primarily in service of their vision for people. Research shows they excel at interpreting information through the lens of human impact and potential.",
        roi_visibility:
          "Studies indicate ENFJs view ROI metrics as important but secondary to human development and team success. Their auxiliary Introverted Intuition (Ni) helps them balance immediate outcomes with long-term growth.",
        autonomy_scope:
          "ENFJs thrive in leadership roles where they can guide and develop others. Research shows their effectiveness increases when they can create environments that foster growth and collaboration.",
        time_pressure:
          "ENFJs typically perform well under time pressure, as their Fe-Ni combination allows for quick, people-focused decisions. However, studies show they may need to balance immediate needs with long-term goals.",
        social_complexity:
          "Research indicates ENFJs excel at navigating social complexity, using their strong interpersonal skills to build consensus and drive change. Their lower Introverted Thinking (Ti) function means they may need support with analytical aspects.",
      },
      researchInsight:
        "A 2019 study in Leadership & Organization Development found that ENFJs maintain high decision quality in complex social environments but may need support in balancing people needs with organizational goals.",
    },
  };
}
