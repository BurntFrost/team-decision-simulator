"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  isLowPerformance: boolean;
}

interface PerformanceConfig {
  targetFPS: number;
  lowFPSThreshold: number;
  memoryThreshold: number; // MB
  measurementInterval: number; // ms
}

const DEFAULT_CONFIG: PerformanceConfig = {
  targetFPS: 60,
  lowFPSThreshold: 30,
  memoryThreshold: 100,
  measurementInterval: 1000,
};

export const usePerformanceMonitor = (config: Partial<PerformanceConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    isLowPerformance: false,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationIdRef = useRef<number>();
  const measurementTimerRef = useRef<NodeJS.Timeout>();

  const measureFrame = useCallback(() => {
    const currentTime = performance.now();
    frameCountRef.current++;

    animationIdRef.current = requestAnimationFrame(measureFrame);
  }, []);

  const calculateMetrics = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    
    if (deltaTime >= finalConfig.measurementInterval) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
      const frameTime = deltaTime / frameCountRef.current;
      
      // Get memory usage if available
      const memory = (performance as any).memory;
      const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;
      
      const isLowPerformance = 
        fps < finalConfig.lowFPSThreshold || 
        memoryUsage > finalConfig.memoryThreshold;

      setMetrics({
        fps,
        frameTime,
        memoryUsage,
        isLowPerformance,
      });

      // Reset counters
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }
  }, [finalConfig]);

  useEffect(() => {
    // Start frame measurement
    animationIdRef.current = requestAnimationFrame(measureFrame);
    
    // Start metrics calculation
    measurementTimerRef.current = setInterval(calculateMetrics, finalConfig.measurementInterval);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (measurementTimerRef.current) {
        clearInterval(measurementTimerRef.current);
      }
    };
  }, [measureFrame, calculateMetrics, finalConfig.measurementInterval]);

  // Performance-based quality settings
  const getQualityLevel = useCallback(() => {
    if (metrics.fps >= 50) return 'high';
    if (metrics.fps >= 30) return 'medium';
    return 'low';
  }, [metrics.fps]);

  const getAnimationConfig = useCallback(() => {
    const quality = getQualityLevel();
    
    switch (quality) {
      case 'high':
        return {
          nodeCount: 30,
          connectionDensity: 0.4,
          animationIntensity: 1.0,
          particleCount: 20,
        };
      case 'medium':
        return {
          nodeCount: 20,
          connectionDensity: 0.3,
          animationIntensity: 0.7,
          particleCount: 12,
        };
      case 'low':
        return {
          nodeCount: 12,
          connectionDensity: 0.2,
          animationIntensity: 0.5,
          particleCount: 6,
        };
      default:
        return {
          nodeCount: 20,
          connectionDensity: 0.3,
          animationIntensity: 0.7,
          particleCount: 12,
        };
    }
  }, [getQualityLevel]);

  return {
    metrics,
    qualityLevel: getQualityLevel(),
    animationConfig: getAnimationConfig(),
    isMonitoring: !!animationIdRef.current,
  };
};

// Throttled animation frame hook for performance-conscious animations
export const useThrottledAnimationFrame = (callback: (deltaTime: number) => void, fps: number = 60) => {
  const callbackRef = useRef(callback);
  const frameIdRef = useRef<number>();
  const lastTimeRef = useRef(0);
  const intervalRef = useRef(1000 / fps);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Update interval when fps changes
  useEffect(() => {
    intervalRef.current = 1000 / fps;
  }, [fps]);

  const animate = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;

    if (deltaTime >= intervalRef.current) {
      callbackRef.current(deltaTime);
      lastTimeRef.current = currentTime;
    }

    frameIdRef.current = requestAnimationFrame(animate);
  }, []);

  const start = useCallback(() => {
    if (!frameIdRef.current) {
      lastTimeRef.current = performance.now();
      frameIdRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const stop = useCallback(() => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return stop; // Cleanup on unmount
  }, [stop]);

  return { start, stop, isRunning: !!frameIdRef.current };
};
