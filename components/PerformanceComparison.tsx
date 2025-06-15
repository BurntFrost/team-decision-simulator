"use client";

import React, { useState } from 'react';
import { NeuralNetworkBackground } from '@/components/ui/neural-network-background';
import { OptimizedNeuralBackground } from '@/components/ui/optimized-neural-background';
import { usePerformanceMonitor } from '@/lib/hooks/use-performance-monitor';

interface PerformanceComparisonProps {
  className?: string;
}

export const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({ 
  className = "" 
}) => {
  const [activeBackground, setActiveBackground] = useState<'original' | 'optimized'>('optimized');
  const { metrics, qualityLevel } = usePerformanceMonitor();

  const backgroundConfig = {
    nodeCount: 25,
    connectionDensity: 0.3,
    animated: true,
    useContext: false, // Standalone mode for comparison
  };

  return (
    <div className={`relative ${className}`}>
      {/* Background Selection Controls */}
      <div className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
        <h3 className="text-sm font-semibold text-white mb-2">Neural Background</h3>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setActiveBackground('original')}
            className={`px-3 py-1 rounded text-xs transition-all ${
              activeBackground === 'original'
                ? 'bg-blue-500 text-white'
                : 'bg-white/20 text-white/80 hover:bg-white/30'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setActiveBackground('optimized')}
            className={`px-3 py-1 rounded text-xs transition-all ${
              activeBackground === 'optimized'
                ? 'bg-blue-500 text-white'
                : 'bg-white/20 text-white/80 hover:bg-white/30'
            }`}
          >
            Optimized
          </button>
        </div>
        
        {/* Performance Metrics */}
        <div className="text-xs text-white/80 space-y-1">
          <div>FPS: <span className="font-mono">{metrics.fps}</span></div>
          <div>Memory: <span className="font-mono">{metrics.memoryUsage}MB</span></div>
          <div>Quality: <span className="font-mono">{qualityLevel}</span></div>
          <div className={`${metrics.isLowPerformance ? 'text-red-400' : 'text-green-400'}`}>
            {metrics.isLowPerformance ? '⚠️ Low Performance' : '✅ Good Performance'}
          </div>
        </div>
      </div>

      {/* Performance Comparison Info */}
      <div className="fixed bottom-4 left-4 z-50 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 max-w-sm">
        <h4 className="text-sm font-semibold text-white mb-2">
          {activeBackground === 'optimized' ? 'Optimized Features' : 'Original Features'}
        </h4>
        <div className="text-xs text-white/80 space-y-1">
          {activeBackground === 'optimized' ? (
            <>
              <div>• GPU-accelerated transforms</div>
              <div>• Reduced DOM elements</div>
              <div>• Performance-based quality scaling</div>
              <div>• Organic neural connections</div>
              <div>• Dendrite structures</div>
              <div>• Frame rate throttling</div>
              <div>• Reduced motion support</div>
            </>
          ) : (
            <>
              <div>• Multiple glow rings per node</div>
              <div>• Complex CSS animations</div>
              <div>• Heavy filter usage</div>
              <div>• Straight line connections</div>
              <div>• Fixed animation intensity</div>
              <div>• No performance scaling</div>
            </>
          )}
        </div>
      </div>

      {/* Render Active Background */}
      {activeBackground === 'original' ? (
        <NeuralNetworkBackground {...backgroundConfig} />
      ) : (
        <OptimizedNeuralBackground {...backgroundConfig} />
      )}
    </div>
  );
};

export default PerformanceComparison;
