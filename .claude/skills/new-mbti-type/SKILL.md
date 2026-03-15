---
name: new-mbti-type
description: Scaffold a new MBTI personality type implementation with weights, description, and factory registration
disable-model-invocation: true
---

# New MBTI Type

Scaffold a new MBTI personality type following the project's factory pattern.

## Steps

1. **Create the type file** at `models/decision/mbti/{type_lowercase}.ts` using the template below
2. **Register in factory** — Add import and entry in `models/decision/mbti/index.ts`:
   - Add `import { TYPE } from "./type";` with the other imports
   - Add `TYPE` to the `MBTIFactory.types` record
   - Add `"TYPE"` to the `MBTIType` union
3. **Add to archetypes** — Add an entry in `models/decision/mbti/constants.ts` in the `archetypes` array with name and weights
4. **Run tests** — `npm test` to verify nothing breaks

## Type File Template

```typescript
import { BaseMBTIType } from "./base";
import { ArchetypeProfile, MBTIDescription } from "../types";

export class TYPE extends BaseMBTIType {
  protected readonly name = "TYPE";
  protected readonly weights: ArchetypeProfile["weights"] = {
    data_quality: 0.0,      // How much this type values reliable data
    roi_visibility: 0.0,    // Importance of clear, measurable returns
    autonomy_scope: 0.0,    // Need for control over execution
    time_pressure: 0.0,     // Response to urgency (can be negative)
    social_complexity: 0.0, // Comfort with stakeholder navigation (can be negative)
    psychological_safety: 0.0, // Need for safe environment to contribute
  };
  protected readonly description: MBTIDescription = {
    name: "TYPE - The Archetype Name",
    description: "Brief personality description.",
    color: "#hexcolor",
    scientificFactors: {
      keyTraits: [],
      decisionProcess: "",
      strengths: [],
      challenges: [],
      historicalContext: "",
      factorResponses: {},
      researchInsight: "",
    },
  };
}
```

## Weight Guidelines

- Weights typically range from -0.15 to 0.35
- Absolute sum of weights should be roughly 0.85–1.0
- Negative weights mean the factor works against the type's decision confidence
- Align weights with the type's cognitive function stack (Ni/Ne/Si/Se + Ti/Te/Fi/Fe)
