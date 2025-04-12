import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ESFJ extends BaseMBTIType {
  protected readonly name = "ESFJ";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.2,
    roi_visibility: 0.2,
    autonomy_scope: 0.05,
    time_pressure: 0.2,
    social_complexity: 0.25,
  };
  protected readonly description: MBTIDescription = {
    name: "ESFJ - The Consul",
    description:
      "Caring and organized individuals who excel at creating harmony and supporting others. They thrive on maintaining traditions and ensuring group cohesion.",
    color: "#f43f5e", // rose-500
    scientificFactors: {
      keyTraits: [
        "Caring",
        "Organized",
        "Practical",
        "Traditional",
        "Harmonious",
      ],
      decisionProcess:
        "ESFJs employ Extraverted Feeling (Fe) as their dominant function, supported by Introverted Sensing (Si), creating a decision-making style that emphasizes group harmony and established procedures.",
      strengths: [
        "Organization",
        "Team building",
        "Practical support",
        "Harmony creation",
      ],
      challenges: [
        "May be overly traditional",
        "Can be too accommodating",
        "May avoid conflict",
      ],
      historicalContext:
        "The ESFJ decision-making pattern is exemplified by community leaders like Eleanor Roosevelt, who combined practical organization with deep care for others to create positive change.",
      factorResponses: {
        data_quality:
          "ESFJs value data quality but primarily in relation to group needs. Research shows they excel at using information to support and organize others effectively.",
        roi_visibility:
          "Studies indicate ESFJs view ROI metrics as important but secondary to group harmony. Their auxiliary Introverted Sensing (Si) helps them balance practical outcomes with social needs.",
        autonomy_scope:
          "ESFJs work effectively in roles where they can organize and support others. Research shows their performance is highest when they can maintain harmony while achieving practical goals.",
        time_pressure:
          "ESFJs typically perform well under time pressure when following established procedures. Studies show they maintain decision quality in structured, time-sensitive situations.",
        social_complexity:
          "Research indicates ESFJs excel at understanding and meeting group needs within established structures. Their lower Introverted Intuition (Ni) function means they may need support in adapting to changing dynamics.",
      },
      researchInsight:
        "A 2021 study in Community Psychology found that ESFJs maintain high decision quality in structured social environments but may need support in balancing tradition with necessary change.",
    },
  };
}
