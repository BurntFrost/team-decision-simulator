import { useEffect, useRef, useCallback, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  isLowPerformance: boolean;
}

/**
 * Hook for monitoring performance and adapting UI accordingly
 */
export function usePerformanceMonitor(enabled: boolean = false) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    isLowPerformance: false,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationIdRef = useRef<number>();

  const measurePerformance = useCallback(() => {
    const currentTime = performance.now();
    frameCountRef.current++;

    // Calculate FPS every second
    if (currentTime - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
      
      // Get memory usage if available
      const memory = (performance as any).memory;
      const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;

      const renderTime = Math.round(currentTime - lastTimeRef.current);
      const isLowPerformance = fps < 30 || memoryUsage > 100;

      setMetrics({
        fps,
        memoryUsage,
        renderTime,
        isLowPerformance,
      });

      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }

    if (enabled) {
      animationIdRef.current = requestAnimationFrame(measurePerformance);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      animationIdRef.current = requestAnimationFrame(measurePerformance);
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [enabled, measurePerformance]);

  return metrics;
}

/**
 * Hook for adaptive performance settings
 */
export function useAdaptivePerformance() {
  const metrics = usePerformanceMonitor(true);
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    if (metrics.fps < 20 || metrics.memoryUsage > 150) {
      setPerformanceLevel('low');
    } else if (metrics.fps < 40 || metrics.memoryUsage > 100) {
      setPerformanceLevel('medium');
    } else {
      setPerformanceLevel('high');
    }
  }, [metrics]);

  const getAnimationDuration = useCallback((baseMs: number) => {
    switch (performanceLevel) {
      case 'low': return Math.min(baseMs * 0.5, 100); // Faster animations
      case 'medium': return Math.min(baseMs * 0.75, 200);
      case 'high': return baseMs;
      default: return baseMs;
    }
  }, [performanceLevel]);

  const shouldReduceAnimations = performanceLevel === 'low';
  const shouldReduceEffects = performanceLevel !== 'high';

  return {
    performanceLevel,
    metrics,
    getAnimationDuration,
    shouldReduceAnimations,
    shouldReduceEffects,
  };
}

/**
 * Hook for optimized intersection observer
 */
export function useOptimizedIntersection(
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) {
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        callback(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return elementRef;
}

/**
 * Hook for frame-rate aware animations
 */
export function useFrameRateAware() {
  const [frameRate, setFrameRate] = useState(60);
  const lastFrameTime = useRef(performance.now());
  const frameCount = useRef(0);

  useEffect(() => {
    let animationId: number;

    const measureFrameRate = () => {
      const now = performance.now();
      frameCount.current++;

      if (now - lastFrameTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (now - lastFrameTime.current));
        setFrameRate(fps);
        frameCount.current = 0;
        lastFrameTime.current = now;
      }

      animationId = requestAnimationFrame(measureFrameRate);
    };

    animationId = requestAnimationFrame(measureFrameRate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const getOptimalAnimationDuration = useCallback((targetDuration: number) => {
    // Adjust animation duration based on frame rate
    if (frameRate < 30) return targetDuration * 0.5;
    if (frameRate < 45) return targetDuration * 0.75;
    return targetDuration;
  }, [frameRate]);

  return {
    frameRate,
    getOptimalAnimationDuration,
    isLowFrameRate: frameRate < 30,
  };
}
