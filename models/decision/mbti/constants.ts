import { MBTIFactory } from "./index";

// MBTI Archetypes with their decision weights
export const archetypes = MBTIFactory.getArchetypeProfiles();

// Re-export from shared data (canonical source)
export { famousPeopleByMBTI } from "@/lib/mbtiData";

// MBTI type descriptions with scientific factors
export const mbtiDescriptions = MBTIFactory.getDescriptions();
