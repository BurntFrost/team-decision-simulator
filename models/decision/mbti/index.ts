import { BaseMBTIType } from "./base";
import { INTJ } from "./intj";
import { INTP } from "./intp";
import { ENTJ } from "./entj";
import { ENTP } from "./entp";
import { INFJ } from "./infj";
import { INFP } from "./infp";
import { ENFJ } from "./enfj";
import { ENFP } from "./enfp";
import { ISTJ } from "./istj";
import { ISFJ } from "./isfj";
import { ESTJ } from "./estj";
import { ESFJ } from "./esfj";
import { ISTP } from "./istp";
import { ISFP } from "./isfp";
import { ESTP } from "./estp";
import { ESFP } from "./esfp";
import { ArchetypeProfile, MBTIDescription } from "../types";

export type MBTIType =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

export class MBTIFactory {
  private static readonly types: Record<MBTIType, new () => BaseMBTIType> = {
    INTJ,
    INTP,
    ENTJ,
    ENTP,
    INFJ,
    INFP,
    ENFJ,
    ENFP,
    ISTJ,
    ISFJ,
    ESTJ,
    ESFJ,
    ISTP,
    ISFP,
    ESTP,
    ESFP,
  };

  // Cache for expensive computations
  private static _archetypeProfiles: ArchetypeProfile[] | null = null;
  private static _descriptions: Record<string, MBTIDescription> | null = null;
  private static _allTypes: MBTIType[] | null = null;

  static create(type: MBTIType): BaseMBTIType {
    const TypeClass = this.types[type];
    if (!TypeClass) {
      throw new Error(`Unknown MBTI type: ${type}`);
    }
    return new TypeClass();
  }

  static getAllTypes(): MBTIType[] {
    this._allTypes ??= Object.keys(this.types) as MBTIType[];
    return this._allTypes;
  }

  static getArchetypeProfiles(): ArchetypeProfile[] {
    this._archetypeProfiles ??= this.getAllTypes().map((type) => {
      const instance = this.create(type);
      return {
        name: instance.getName(),
        weights: instance.getWeights(),
      };
    });
    return this._archetypeProfiles;
  }

  static getDescriptions(): Record<string, MBTIDescription> {
    this._descriptions ??= this.getAllTypes().reduce((acc, type) => {
      const instance = this.create(type);
      acc[type] = instance.getDescription();
      return acc;
    }, {} as Record<string, MBTIDescription>);
    return this._descriptions;
  }

  // Method to clear cache if needed (for testing or dynamic updates)
  static clearCache(): void {
    this._archetypeProfiles = null;
    this._descriptions = null;
    this._allTypes = null;
  }
}
