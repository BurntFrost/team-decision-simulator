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
  private static types: Record<MBTIType, new () => BaseMBTIType> = {
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

  static create(type: MBTIType): BaseMBTIType {
    const TypeClass = this.types[type];
    if (!TypeClass) {
      throw new Error(`Unknown MBTI type: ${type}`);
    }
    return new TypeClass();
  }

  static getAllTypes(): MBTIType[] {
    return Object.keys(this.types) as MBTIType[];
  }

  static getArchetypeProfiles(): ArchetypeProfile[] {
    return this.getAllTypes().map((type) => {
      const instance = this.create(type);
      return {
        name: instance.getName(),
        weights: instance.getWeights(),
      };
    });
  }

  static getDescriptions(): Record<string, MBTIDescription> {
    return this.getAllTypes().reduce((acc, type) => {
      const instance = this.create(type);
      acc[type] = instance.getDescription();
      return acc;
    }, {} as Record<string, MBTIDescription>);
  }
}
