import { BaseMBTIType } from "./base";
import { MBTIType } from "./index";

// Lazy loading map for MBTI types to reduce initial bundle size
const lazyMBTITypes: Record<MBTIType, () => Promise<{ default: new () => BaseMBTIType }>> = {
  INTJ: () => import("./intj").then(m => ({ default: m.INTJ })),
  INTP: () => import("./intp").then(m => ({ default: m.INTP })),
  ENTJ: () => import("./entj").then(m => ({ default: m.ENTJ })),
  ENTP: () => import("./entp").then(m => ({ default: m.ENTP })),
  INFJ: () => import("./infj").then(m => ({ default: m.INFJ })),
  INFP: () => import("./infp").then(m => ({ default: m.INFP })),
  ENFJ: () => import("./enfj").then(m => ({ default: m.ENFJ })),
  ENFP: () => import("./enfp").then(m => ({ default: m.ENFP })),
  ISTJ: () => import("./istj").then(m => ({ default: m.ISTJ })),
  ISFJ: () => import("./isfj").then(m => ({ default: m.ISFJ })),
  ESTJ: () => import("./estj").then(m => ({ default: m.ESTJ })),
  ESFJ: () => import("./esfj").then(m => ({ default: m.ESFJ })),
  ISTP: () => import("./istp").then(m => ({ default: m.ISTP })),
  ISFP: () => import("./isfp").then(m => ({ default: m.ISFP })),
  ESTP: () => import("./estp").then(m => ({ default: m.ESTP })),
  ESFP: () => import("./esfp").then(m => ({ default: m.ESFP })),
};

// Cache for loaded types
const typeCache = new Map<MBTIType, new () => BaseMBTIType>();

/**
 * Lazy loader for MBTI types with caching
 */
export class LazyMBTILoader {
  /**
   * Load a specific MBTI type dynamically
   */
  static async loadType(type: MBTIType): Promise<new () => BaseMBTIType> {
    // Return from cache if already loaded
    if (typeCache.has(type)) {
      return typeCache.get(type)!;
    }

    const loader = lazyMBTITypes[type];
    if (!loader) {
      throw new Error(`Unknown MBTI type: ${type}`);
    }

    try {
      const module = await loader();
      const TypeClass = module.default;
      typeCache.set(type, TypeClass);
      return TypeClass;
    } catch (error) {
      throw new Error(`Failed to load MBTI type ${type}: ${error}`);
    }
  }

  /**
   * Preload multiple types for better performance
   */
  static async preloadTypes(types: MBTIType[]): Promise<void> {
    const loadPromises = types
      .filter(type => !typeCache.has(type))
      .map(type => this.loadType(type));
    
    await Promise.all(loadPromises);
  }

  /**
   * Preload all types (for when user navigates to Types tab)
   */
  static async preloadAllTypes(): Promise<void> {
    const allTypes = Object.keys(lazyMBTITypes) as MBTIType[];
    await this.preloadTypes(allTypes);
  }

  /**
   * Clear the cache (useful for testing)
   */
  static clearCache(): void {
    typeCache.clear();
  }

  /**
   * Get cache size for monitoring
   */
  static getCacheSize(): number {
    return typeCache.size;
  }
}
