// Re-export types and constants for backward compatibility
export * from "@/models/decision/types";
export * from "@/models/decision/constants";
export * from "@/models/decision/mbti/constants";
export * from "@/models/decision/logic";

import type { FactorKey, ArchetypeProfile } from "@/models/decision/types";

// Re-export specific functions for visualization data formatting
export const formatRadarData = (): Record<string, any>[] => {
  const { factorInfo } = require("@/models/decision/constants");
  const { archetypes } = require("@/models/decision/mbti/constants");

  return Object.keys(factorInfo).map((key) => {
    const dataPoint: Record<string, any> = {
      factor: factorInfo[key as FactorKey].label,
    };
    archetypes.forEach((arch: ArchetypeProfile) => {
      dataPoint[arch.name] = arch.weights[key as FactorKey];
    });
    return dataPoint;
  });
};
