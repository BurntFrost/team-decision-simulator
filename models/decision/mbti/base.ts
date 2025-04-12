import { ArchetypeProfile, MBTIDescription } from "../types";

export abstract class BaseMBTIType {
  protected abstract readonly name: string;
  protected abstract readonly weights: ArchetypeProfile["weights"];
  protected abstract readonly description: MBTIDescription;

  getName(): string {
    return this.name;
  }

  getWeights(): ArchetypeProfile["weights"] {
    return this.weights;
  }

  getDescription(): MBTIDescription {
    return this.description;
  }
}
