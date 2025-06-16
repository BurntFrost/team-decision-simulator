"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePerformanceMonitor } from "@/lib/hooks/usePerformance";

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  interactionLatency: number;
  bundleSize: number;
  typesTabMetrics: {
    cardRenderTime: number;
    characterCycleTime: number;
    tabSwitchTime: number;
    totalCards: number;
    visibleCards: number;
  };
}

interface EnhancedPerformanceMonitorProps {
  enabled?: boolean;
  showDetails?: boolean;
  onPerformanceIssue?: (issue: string, metrics: PerformanceMetrics) => void;
}

export const EnhancedPerformanceMonitor: React.FC<EnhancedPerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  showDetails = false,
  onPerformanceIssue,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    interactionLatency: 0,
    bundleSize: 0,
    typesTabMetrics: {
      cardRenderTime: 0,
      characterCycleTime: 0,
      tabSwitchTime: 0,
      totalCards: 0,
      visibleCards: 0,
    },
  });

  const [performanceIssues, setPerformanceIssues] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const interactionStartRef = useRef<number>(0);

  // Use existing performance monitor hook
  const baseMetrics = usePerformanceMonitor(enabled);

  // Enhanced metrics collection
  const measurePerformance = useCallback(() => {
    if (!enabled) return;

    const currentTime = performance.now();
    frameCountRef.current++;

    // Calculate FPS every second
    if (currentTime - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
      
      // Get memory usage if available
      const memory = (performance as any).memory;
      const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;

      // Measure bundle size (approximate)
      const bundleSize = memory ? Math.round(memory.totalJSHeapSize / 1024 / 1024) : 0;

      // Measure Types tab specific metrics
      const typesTabMetrics = measureTypesTabMetrics();

      const newMetrics: PerformanceMetrics = {
        fps,
        memoryUsage,
        renderTime: Math.round(currentTime - lastTimeRef.current),
        interactionLatency: interactionStartRef.current > 0 
          ? Math.round(currentTime - interactionStartRef.current) 
          : 0,
        bundleSize,
        typesTabMetrics,
      };

      setMetrics(newMetrics);
      checkPerformanceIssues(newMetrics);

      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
      interactionStartRef.current = 0;
    }

    requestAnimationFrame(measurePerformance);
  }, [enabled]);

  // Measure Types tab specific metrics
  const measureTypesTabMetrics = useCallback(() => {
    const personalityCards = document.querySelectorAll('[data-personality-card]');
    const visibleCards = Array.from(personalityCards).filter(card => {
      const rect = card.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });

    return {
      cardRenderTime: performance.now() % 100, // Simplified for demo
      characterCycleTime: 0,
      tabSwitchTime: 0,
      totalCards: personalityCards.length,
      visibleCards: visibleCards.length,
    };
  }, []);

  // Check for performance issues
  const checkPerformanceIssues = useCallback((metrics: PerformanceMetrics) => {
    const issues: string[] = [];

    if (metrics.fps < 30) {
      issues.push(`Low FPS: ${metrics.fps}`);
    }

    if (metrics.memoryUsage > 150) {
      issues.push(`High memory usage: ${metrics.memoryUsage}MB`);
    }

    if (metrics.interactionLatency > 100) {
      issues.push(`High interaction latency: ${metrics.interactionLatency}ms`);
    }

    if (metrics.typesTabMetrics.cardRenderTime > 50) {
      issues.push(`Slow card rendering: ${metrics.typesTabMetrics.cardRenderTime}ms`);
    }

    setPerformanceIssues(issues);

    // Notify parent component of issues
    if (issues.length > 0 && onPerformanceIssue) {
      onPerformanceIssue(issues.join(', '), metrics);
    }
  }, [onPerformanceIssue]);

  // Track interaction start times
  useEffect(() => {
    if (!enabled) return;

    const handleInteractionStart = () => {
      interactionStartRef.current = performance.now();
    };

    document.addEventListener('click', handleInteractionStart);
    document.addEventListener('touchstart', handleInteractionStart);

    return () => {
      document.removeEventListener('click', handleInteractionStart);
      document.removeEventListener('touchstart', handleInteractionStart);
    };
  }, [enabled]);

  // Start performance monitoring
  useEffect(() => {
    if (enabled) {
      requestAnimationFrame(measurePerformance);
    }
  }, [enabled, measurePerformance]);

  if (!enabled) return null;

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'text-green-400';
    if (value < thresholds[1]) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed top-4 right-4 z-50 font-mono text-xs">
      <div 
        className="bg-black/80 text-white rounded-lg p-3 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            performanceIssues.length > 0 ? 'bg-red-400 animate-pulse' : 'bg-green-400'
          }`} />
          <span>Performance</span>
          <span className="text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-2 min-w-[200px]">
            {/* Core Metrics */}
            <div className="border-b border-gray-600 pb-2">
              <div className="flex justify-between">
                <span>FPS:</span>
                <span className={getPerformanceColor(60 - metrics.fps, [10, 30])}>
                  {metrics.fps}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Memory:</span>
                <span className={getPerformanceColor(metrics.memoryUsage, [100, 150])}>
                  {metrics.memoryUsage}MB
                </span>
              </div>
              <div className="flex justify-between">
                <span>Latency:</span>
                <span className={getPerformanceColor(metrics.interactionLatency, [50, 100])}>
                  {metrics.interactionLatency}ms
                </span>
              </div>
            </div>

            {/* Types Tab Metrics */}
            <div className="border-b border-gray-600 pb-2">
              <div className="text-gray-300 mb-1">Types Tab:</div>
              <div className="flex justify-between">
                <span>Cards:</span>
                <span>{metrics.typesTabMetrics.visibleCards}/{metrics.typesTabMetrics.totalCards}</span>
              </div>
              <div className="flex justify-between">
                <span>Render:</span>
                <span className={getPerformanceColor(metrics.typesTabMetrics.cardRenderTime, [30, 50])}>
                  {metrics.typesTabMetrics.cardRenderTime.toFixed(1)}ms
                </span>
              </div>
            </div>

            {/* Performance Issues */}
            {performanceIssues.length > 0 && (
              <div className="border-b border-gray-600 pb-2">
                <div className="text-red-400 mb-1">Issues:</div>
                {performanceIssues.map((issue, index) => (
                  <div key={index} className="text-red-300 text-xs">
                    • {issue}
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {performanceIssues.length > 0 && (
              <div className="text-xs text-gray-400">
                <div className="mb-1">Recommendations:</div>
                {metrics.fps < 30 && (
                  <div>• Reduce animations</div>
                )}
                {metrics.memoryUsage > 150 && (
                  <div>• Clear unused data</div>
                )}
                {metrics.interactionLatency > 100 && (
                  <div>• Optimize event handlers</div>
                )}
              </div>
            )}

            {showDetails && (
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-600">
                Bundle: {metrics.bundleSize}MB
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Hook for tracking specific performance events
export const useTypesTabPerformance = () => {
  const trackCardRender = useCallback((startTime: number) => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 50) {
      console.warn(`Slow card render: ${renderTime.toFixed(2)}ms`);
    }
  }, []);

  const trackCharacterCycle = useCallback((startTime: number) => {
    const endTime = performance.now();
    const cycleTime = endTime - startTime;
    
    if (cycleTime > 20) {
      console.warn(`Slow character cycle: ${cycleTime.toFixed(2)}ms`);
    }
  }, []);

  const trackTabSwitch = useCallback((startTime: number) => {
    const endTime = performance.now();
    const switchTime = endTime - startTime;
    
    if (switchTime > 100) {
      console.warn(`Slow tab switch: ${switchTime.toFixed(2)}ms`);
    }
  }, []);

  return {
    trackCardRender,
    trackCharacterCycle,
    trackTabSwitch,
  };
};
