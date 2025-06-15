"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useNeuralAnimationClasses } from "@/lib/contexts/neural-animation-context";
import { usePerformanceMonitor, useThrottledAnimationFrame } from "@/lib/hooks/use-performance-monitor";
import { generateDeterministicNetwork, type NeuralNode, type NeuralConnection, type NetworkConfig } from "@/lib/utils/neural-network-generator";

interface OptimizedNeuralBackgroundProps {
  className?: string;
  nodeCount?: number;
  connectionDensity?: number;
  animated?: boolean;
  useContext?: boolean;
  respectReducedMotion?: boolean;
}

// Component with context support
const OptimizedNeuralWithContext: React.FC<Omit<OptimizedNeuralBackgroundProps, 'useContext'>> = (props) => {
  const animationClasses = useNeuralAnimationClasses();
  return <OptimizedNeuralCore {...props} animationClasses={animationClasses} />;
};

// Core optimized component
const OptimizedNeuralCore: React.FC<OptimizedNeuralBackgroundProps & {
  animationClasses?: ReturnType<typeof useNeuralAnimationClasses>
}> = ({
  className,
  nodeCount = 25,
  connectionDensity = 0.3,
  animated = true,
  useContext = true,
  respectReducedMotion = true,
  animationClasses,
}) => {
  const [nodes, setNodes] = React.useState<NeuralNode[]>([]);
  const [connections, setConnections] = React.useState<NeuralConnection[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);
  const [animationTime, setAnimationTime] = React.useState(0);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { metrics, qualityLevel, animationConfig } = usePerformanceMonitor();
  
  // Check for reduced motion preference
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const shouldAnimate = animated && (!respectReducedMotion || !prefersReducedMotion);
  
  // Use performance-based configuration
  const finalConfig = React.useMemo(() => ({
    nodeCount: Math.min(nodeCount, animationConfig.nodeCount),
    connectionDensity: Math.min(connectionDensity, animationConfig.connectionDensity),
    clusterCount: 3,
    dendriteCount: 4,
    maxConnectionDistance: 40,
  }), [nodeCount, connectionDensity, animationConfig]);

  // Generate network deterministically to prevent hydration issues
  const generateNetwork = React.useCallback(() => {
    const network = generateDeterministicNetwork(finalConfig, 42);
    setNodes(network.nodes);
    setConnections(network.connections);
  }, [finalConfig]);

  // Initialize network on mount
  React.useEffect(() => {
    setIsMounted(true);
    generateNetwork();
  }, [generateNetwork]);

  // Optimized animation loop using requestAnimationFrame
  const animationCallback = React.useCallback((deltaTime: number) => {
    if (shouldAnimate) {
      setAnimationTime(prev => prev + deltaTime * 0.001); // Convert to seconds
    }
  }, [shouldAnimate]);

  const targetFPS = qualityLevel === 'high' ? 60 : qualityLevel === 'medium' ? 30 : 20;
  const { start, stop } = useThrottledAnimationFrame(animationCallback, targetFPS);

  // Start/stop animation based on conditions
  React.useEffect(() => {
    if (shouldAnimate && isMounted) {
      start();
    } else {
      stop();
    }
    
    return stop;
  }, [shouldAnimate, isMounted, start, stop]);

  // Get animation intensity based on context or standalone mode
  const getIntensityMultiplier = () => {
    if (!animationClasses) return 1;
    
    switch (animationClasses.intensity) {
      case 'burst': return 2.0;
      case 'intense': return 1.5;
      case 'active': return 1.2;
      case 'idle': return 0.8;
      default: return 1.0;
    }
  };

  // Calculate dynamic animation values
  const intensityMultiplier = getIntensityMultiplier();
  const pulsePhase = Math.sin(animationTime * 2) * 0.5 + 0.5; // 0-1 oscillation
  const wavePhase = animationTime * 0.5; // Slower wave for connections

  // Don't render during SSR
  if (!isMounted) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 -z-20 overflow-hidden pointer-events-none",
        className
      )}
      style={{
        '--neural-intensity': intensityMultiplier,
        '--pulse-phase': pulsePhase,
        '--wave-phase': wavePhase,
        '--animation-speed': shouldAnimate ? 1 : 0,
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{
          filter: `brightness(${1 + intensityMultiplier * 0.2}) saturate(${1 + intensityMultiplier * 0.3})`,
          transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
          willChange: shouldAnimate ? 'filter' : 'auto',
        }}
      >
        <defs>
          {/* Optimized gradients */}
          <radialGradient id="neuronGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(147, 197, 253, 0.9)" />
            <stop offset="70%" stopColor="rgba(196, 181, 253, 0.7)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.5)" />
          </radialGradient>
          
          <linearGradient id="axonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(147, 197, 253, 0.8)" />
            <stop offset="50%" stopColor="rgba(196, 181, 253, 0.6)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.4)" />
          </linearGradient>

          {/* Optimized glow filter */}
          <filter id="neuralGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Render connections (axons) */}
        <g className="neural-connections">
          {connections.map((connection, index) => {
            const signalProgress = ((wavePhase + connection.delay) % 2) / 2; // 0-1 progress along path
            const opacity = 0.3 + (connection.strength * intensityMultiplier * 0.4);
            
            return (
              <g key={connection.id}>
                {/* Axon path */}
                <path
                  d={connection.path}
                  stroke="url(#axonGradient)"
                  strokeWidth={0.3 + connection.strength * 0.2}
                  fill="none"
                  opacity={opacity}
                  className="neural-axon"
                  style={{
                    filter: shouldAnimate ? 'url(#neuralGlow)' : 'none',
                    strokeDasharray: shouldAnimate ? '2 1' : 'none',
                    strokeDashoffset: shouldAnimate ? -wavePhase * 3 : 0,
                    transform: 'translate3d(0, 0, 0)',
                  }}
                />
                
                {/* Neural signal pulse */}
                {shouldAnimate && (
                  <circle
                    r={0.8 + connection.strength * 0.4}
                    fill="rgba(147, 197, 253, 0.9)"
                    filter="url(#neuralGlow)"
                    opacity={0.7 + pulsePhase * 0.3}
                    style={{
                      transform: 'translate3d(0, 0, 0)',
                    }}
                  >
                    <animateMotion
                      dur={`${2 / intensityMultiplier}s`}
                      repeatCount="indefinite"
                      begin={`${connection.delay}s`}
                      path={connection.path}
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </g>

        {/* Render neurons */}
        <g className="neural-nodes">
          {nodes.map((node, index) => {
            const nodeIntensity = node.intensity * intensityMultiplier;
            const pulseFactor = 1 + (pulsePhase * nodeIntensity * 0.3);
            const nodeOpacity = 0.7 + (nodeIntensity * 0.3);
            
            return (
              <g key={node.id}>
                {/* Dendrites */}
                {node.dendrites.map((dendrite, dIndex) => (
                  <line
                    key={`dendrite-${dIndex}`}
                    x1={node.x}
                    y1={node.y}
                    x2={dendrite.x}
                    y2={dendrite.y}
                    stroke="rgba(196, 181, 253, 0.4)"
                    strokeWidth={0.2}
                    opacity={nodeOpacity * 0.6}
                    className="neural-dendrite"
                    style={{
                      transform: 'translate3d(0, 0, 0)',
                    }}
                  />
                ))}
                
                {/* Neuron soma (cell body) */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size * pulseFactor}
                  fill="url(#neuronGradient)"
                  opacity={nodeOpacity}
                  filter={shouldAnimate ? "url(#neuralGlow)" : "none"}
                  className="neural-soma"
                  style={{
                    transform: 'translate3d(0, 0, 0)',
                    transformOrigin: `${node.x}% ${node.y}%`,
                  }}
                />
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono">
          <div>FPS: {metrics.fps}</div>
          <div>Quality: {qualityLevel}</div>
          <div>Nodes: {nodes.length}</div>
          <div>Connections: {connections.length}</div>
        </div>
      )}
    </div>
  );
};

// Main export component
const OptimizedNeuralBackground: React.FC<OptimizedNeuralBackgroundProps> = (props) => {
  const { useContext: shouldUseContext = true, ...otherProps } = props;

  if (shouldUseContext) {
    try {
      return <OptimizedNeuralWithContext {...otherProps} />;
    } catch {
      return <OptimizedNeuralCore {...otherProps} useContext={false} />;
    }
  }

  return <OptimizedNeuralCore {...otherProps} useContext={false} />;
};

export { OptimizedNeuralBackground };
