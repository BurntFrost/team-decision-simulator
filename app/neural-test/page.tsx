"use client";

import React from 'react';
import { PerformanceComparison } from '@/components/PerformanceComparison';
import { useNeuralInteraction } from '@/lib/contexts/neural-animation-context';

export default function NeuralTestPage() {
  const { onClick, onHover } = useNeuralInteraction();

  return (
    <div className="min-h-screen relative">
      {/* Performance Comparison Background */}
      <PerformanceComparison />
      
      {/* Content to test interactions */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Optimized Neural Network Background
          </h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Performance Improvements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/90">
              <div className="space-y-2">
                <h3 className="font-medium text-blue-300">Rendering Optimizations</h3>
                <ul className="space-y-1 text-xs">
                  <li>• Reduced DOM elements (1 circle vs 4 per neuron)</li>
                  <li>• GPU-accelerated transforms</li>
                  <li>• Efficient SVG structure</li>
                  <li>• CSS custom properties for dynamic values</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-purple-300">Animation Improvements</h3>
                <ul className="space-y-1 text-xs">
                  <li>• RequestAnimationFrame-based timing</li>
                  <li>• Performance-based quality scaling</li>
                  <li>• Frame rate throttling</li>
                  <li>• Reduced motion accessibility</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Scientific Accuracy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/90">
              <div className="space-y-2">
                <h3 className="font-medium text-green-300">Neural Structure</h3>
                <ul className="space-y-1 text-xs">
                  <li>• Soma (cell body) representation</li>
                  <li>• Dendrite branches from neurons</li>
                  <li>• Organic axon pathways</li>
                  <li>• Realistic network clustering</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-yellow-300">Signal Transmission</h3>
                <ul className="space-y-1 text-xs">
                  <li>• Directional signal flow</li>
                  <li>• Synaptic connection points</li>
                  <li>• Variable transmission speeds</li>
                  <li>• Neural activity patterns</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Test Interactions</h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onClick}
                onMouseEnter={onHover}
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-white transition-all duration-200 backdrop-blur-sm"
              >
                Trigger Neural Activity
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg text-white transition-all duration-200 backdrop-blur-sm"
              >
                Reload Page
              </button>
            </div>
          </div>

          <div className="text-xs text-white/60 max-w-lg mx-auto">
            <p>
              Use the controls in the top-left to switch between the original and optimized neural network backgrounds. 
              Monitor the performance metrics to see the improvements in FPS, memory usage, and overall responsiveness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
