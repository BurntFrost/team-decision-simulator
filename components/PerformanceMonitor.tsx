"use client";

import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  enabled = false, 
  className = "" 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    frameRate: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      // Calculate frame rate every second
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Get memory usage if available
        const memory = (performance as any).memory;
        const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;

        setMetrics({
          renderTime: Math.round(currentTime - lastTime),
          memoryUsage,
          frameRate: fps,
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={`fixed top-4 right-4 bg-black/80 text-white p-2 rounded-lg text-xs font-mono z-50 ${className}`}>
      <div>FPS: {metrics.frameRate}</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
      <div>Render: {metrics.renderTime}ms</div>
    </div>
  );
};

export default PerformanceMonitor;
