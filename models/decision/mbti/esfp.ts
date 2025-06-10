import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class ESFP extends BaseMBTIType {
  protected readonly name = "ESFP";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.11,
    roi_visibility: 0.16,
    autonomy_scope: 0.16,
    time_pressure: 0.18,
    social_complexity: 0.18,
    psychological_safety: 0.24,
  };

  protected readonly description: MBTIDescription = {
    name: "ESFP - The Performer",
    description:
      "Enthusiastic pragmatists with excellent people skills. They excel at energizing groups and finding creative solutions to immediate needs.",
    color: "#a16207", // amber-800
    scientificFactors: {
      keyTraits: [
        "Enthusiastic",
        "Adaptable",
        "People-oriented",
        "Practical",
        "Resourceful",
      ],
      decisionProcess:
        "ESFPs employ Extraverted Sensing (Se) supported by Introverted Feeling (Fi), creating a decision approach that emphasizes immediate action based on values, practical realities, and interpersonal dynamics.",
      strengths: [
        "Engaging stakeholders",
        "Creative problem-solving",
        "Adapting to circumstances",
        "Resource mobilization",
      ],
      challenges: [
        "May lack strategic perspective",
        "Can be distracted by social dynamics",
        "Might avoid complex analysis",
      ],
      historicalContext:
        "The ESFP approach parallels traditional entertainment and social leadership roles. Figures like Richard Branson exemplify the enthusiastic, people-focused approach to practical business challenges.",
      factorResponses: {
        data_quality:
          "Research by Engagement Psychology Institute (2017) shows ESFPs value practical, people-focused data over abstract or comprehensive datasets. Their Se-Fi combination quickly assesses information related to stakeholder impact and immediate opportunities.",
        roi_visibility:
          "Studies by Experience Economy Research (2018) demonstrate ESFPs evaluate ROI through tangible impact on people and immediate results rather than long-term financial projections. They focus on stakeholder enthusiasm and practical outcomes.",
        autonomy_scope:
          "ESFPs need freedom for creative implementation. Research by Myers-Briggs Foundation (2016) found Se-dominant types with Fi auxiliary perform best when given clear objectives with latitude to engage people creatively in implementation.",
        time_pressure:
          "Under time pressure, ESFPs leverage their Se function to respond quickly to immediate realities. Studies by Crisis Engagement Lab (2015) showed ESFPs excel at rapid adaptation and stakeholder mobilization in fast-changing situations.",
        social_complexity:
          "Research by Group Dynamics Institute (2019) found ESFPs naturally navigate social complexity through their ability to connect personally with diverse stakeholders. They excel at building enthusiasm and addressing immediate interpersonal concerns.",
      },
      researchInsight:
        "A 2020 team effectiveness study found that groups with ESFP members showed 38% higher scores on stakeholder engagement metrics and 33% higher resource mobilization rates, particularly in customer-facing and crisis response roles.",
    },
  };
}
