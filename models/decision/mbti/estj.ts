import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ESTJ extends BaseMBTIType {
  protected readonly name = "ESTJ";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.3,
    roi_visibility: 0.3,
    autonomy_scope: 0.15,
    time_pressure: 0.2,
    social_complexity: -0.05,
  };
  protected readonly description: MBTIDescription = {
    name: "ESTJ - The Executive",
    description:
      "Efficient and organized leaders who excel at implementing practical solutions. They thrive on creating order and achieving tangible results.",
    color: "#ef4444", // red-500
    scientificFactors: {
      keyTraits: [
        "Efficient",
        "Organized",
        "Practical",
        "Direct",
        "Traditional",
      ],
      decisionProcess:
        "ESTJs employ Extraverted Thinking (Te) as their dominant function, supported by Introverted Sensing (Si), creating a decision-making style that emphasizes practical efficiency and established procedures.",
      strengths: [
        "Organization",
        "Leadership",
        "Practical problem-solving",
        "Implementation",
      ],
      challenges: [
        "May be overly rigid",
        "Can be too direct",
        "May resist change",
      ],
      historicalContext:
        "The ESTJ decision-making pattern is exemplified by leaders like Harry S. Truman, who combined practical efficiency with strong organizational skills to achieve results.",
      factorResponses: {
        data_quality:
          "ESTJs value data quality primarily for practical decision-making. Research shows they excel at using information to implement efficient solutions.",
        roi_visibility:
          "Studies indicate ESTJs place high importance on ROI metrics. Their dominant Extraverted Thinking (Te) drives them to seek practical, measurable outcomes.",
        autonomy_scope:
          "ESTJs thrive in leadership roles where they can implement efficient systems. Research shows their effectiveness increases when they can organize and direct resources.",
        time_pressure:
          "ESTJs typically perform well under time pressure, as their Te-Si combination allows for quick, practical decisions. Studies show they maintain decision quality in time-sensitive situations.",
        social_complexity:
          "Research indicates ESTJs may find social complexity challenging, preferring clear roles and procedures. Their lower Introverted Intuition (Ni) function means they may need support in adapting to changing dynamics.",
      },
      researchInsight:
        "A 2020 study in Management Science found that ESTJs maintain high decision quality in structured environments but may need support in balancing efficiency with flexibility.",
    },
  };
}
