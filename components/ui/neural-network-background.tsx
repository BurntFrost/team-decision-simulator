"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useNeuralAnimationClasses } from "@/lib/contexts/neural-animation-context";

interface NeuralNode {
  id: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  intensity: number;
}

interface NeuralConnection {
  id: string;
  from: NeuralNode;
  to: NeuralNode;
  strength: number;
  delay: number;
}

interface NeuralNetworkBackgroundProps {
  className?: string;
  nodeCount?: number;
  connectionDensity?: number;
  animated?: boolean;
  useContext?: boolean; // Whether to use animation context or standalone mode
}

// Component with context support
const NeuralNetworkWithContext: React.FC<Omit<NeuralNetworkBackgroundProps, 'useContext'>> = (props) => {
  const animationClasses = useNeuralAnimationClasses();
  return <NeuralNetworkCore {...props} animationClasses={animationClasses} />;
};

// Core component without context dependency
const NeuralNetworkCore: React.FC<NeuralNetworkBackgroundProps & {
  animationClasses?: ReturnType<typeof useNeuralAnimationClasses>
}> = ({
  className,
  nodeCount = 35, // Enhanced from 25 to 35 for more visual density
  connectionDensity = 0.5, // Enhanced from 0.3 to 0.5 for more connections
  animated = true,
  useContext = true,
  animationClasses,
}) => {
  const [nodes, setNodes] = React.useState<NeuralNode[]>([]);
  const [connections, setConnections] = React.useState<NeuralConnection[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch by only rendering on client
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate neural network nodes (memoized for performance)
  // Use deterministic positioning to prevent hydration mismatches
  const generateNodes = React.useCallback((): NeuralNode[] => {
    const newNodes: NeuralNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      // Use deterministic pseudo-random values based on index
      const seedX = (i * 37) % 100;
      const seedY = (i * 73) % 100;
      const seedSize = (i * 13) % 4;
      const seedDelay = (i * 17) % 3;
      const seedIntensity = (i * 23) % 70;

      newNodes.push({
        id: `node-${i}`,
        x: seedX,
        y: seedY,
        size: 4 + seedSize, // Enhanced from 3 to 4 for maximum visibility
        delay: seedDelay,
        intensity: 0.8 + (seedIntensity / 100), // Enhanced from 0.6 to 0.8 for maximum intensity
      });
    }

    return newNodes;
  }, [nodeCount]);

  React.useEffect(() => {
    setNodes(generateNodes());
  }, [generateNodes]);

  // Generate connections between nodes (optimized for performance)
  // Use deterministic connection logic to prevent hydration mismatches
  const generateConnections = React.useCallback((): NeuralConnection[] => {
    if (nodes.length === 0) return [];

    const newConnections: NeuralConnection[] = [];
    const maxConnections = Math.min(50, nodes.length * 2); // Limit total connections for performance
    let connectionCount = 0;

    for (let i = 0; i < nodes.length && connectionCount < maxConnections; i++) {
      for (let j = i + 1; j < nodes.length && connectionCount < maxConnections; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];

        // Calculate distance between nodes
        const distance = Math.sqrt(
          Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
        );

        // Use deterministic connection logic based on node indices
        const connectionSeed = ((i * 31 + j * 47) % 100) / 100;

        // Enhanced connection range and strength for maximum visual impact
        if (distance < 40 && connectionSeed < connectionDensity) { // Enhanced from 30 to 40 for longer connections
          const strengthSeed = ((i * 19 + j * 29) % 40) / 100; // Reduced randomness for stronger base
          const delaySeed = ((i * 11 + j * 13) % 200) / 100;

          newConnections.push({
            id: `connection-${i}-${j}`,
            from: nodeA,
            to: nodeB,
            strength: 0.8 + strengthSeed, // Enhanced from 0.6 to 0.8 for maximum visibility
            delay: delaySeed,
          });
          connectionCount++;
        }
      }
    }

    return newConnections;
  }, [nodes, connectionDensity]);

  React.useEffect(() => {
    setConnections(generateConnections());
  }, [generateConnections]);

  const getIntensityClass = () => {
    if (animationClasses) {
      return animationClasses.intensityClass;
    }
    // Fallback for standalone mode
    return "opacity-50 animate-neural-network-active";
  };

  const getNodeAnimationClass = (node: NeuralNode, index: number) => {
    if (!animated) return "";

    if (animationClasses) {
      return animationClasses.getNodeAnimationClass(index);
    }

    // Fallback for standalone mode
    const baseClass = "animate-neural-node";
    let delayClass = "";
    if (index % 3 === 0) {
      delayClass = "animate-neural-node-delayed";
    } else if (index % 3 === 1) {
      delayClass = "animate-neural-node-slow";
    }

    return `${baseClass} ${delayClass}`.trim();
  };

  // Don't render during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 -z-20 overflow-hidden pointer-events-none",
        // Removed accessibility constraints for maximum visual impact
        getIntensityClass(),
        className
      )}
      aria-hidden="true"
    >
      {/* SVG Neural Network */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Maximum impact gradient definitions for nodes */}
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(147, 197, 253, 1)" />
            <stop offset="30%" stopColor="rgba(196, 181, 253, 1)" />
            <stop offset="70%" stopColor="rgba(59, 130, 246, 0.9)" />
            <stop offset="100%" stopColor="rgba(147, 197, 253, 0.8)" />
          </radialGradient>

          {/* Maximum impact gradient for connections */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(147, 197, 253, 0.6)" />
            <stop offset="25%" stopColor="rgba(196, 181, 253, 0.9)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 1)" />
            <stop offset="75%" stopColor="rgba(196, 181, 253, 0.9)" />
            <stop offset="100%" stopColor="rgba(147, 197, 253, 0.6)" />
          </linearGradient>

          {/* Maximum impact glow filter */}
          <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Ultra-intense glow filter for burst effects */}
          <filter id="glowIntense" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="20" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 0"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Animated gradient for dynamic effects */}
          <radialGradient id="nodeGradientAnimated" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(147, 197, 253, 1)">
              <animate attributeName="stop-color" values="rgba(147, 197, 253, 1);rgba(196, 181, 253, 1);rgba(59, 130, 246, 1);rgba(147, 197, 253, 1)" dur="2s" repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" stopColor="rgba(196, 181, 253, 1)">
              <animate attributeName="stop-color" values="rgba(196, 181, 253, 1);rgba(59, 130, 246, 1);rgba(147, 197, 253, 1);rgba(196, 181, 253, 1)" dur="2s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)">
              <animate attributeName="stop-color" values="rgba(59, 130, 246, 0.8);rgba(147, 197, 253, 0.8);rgba(196, 181, 253, 0.8);rgba(59, 130, 246, 0.8)" dur="2s" repeatCount="indefinite"/>
            </stop>
          </radialGradient>
        </defs>

        {/* Render connections */}
        {connections.map((connection) => (
          <g key={connection.id}>
            {/* Enhanced connection line - 3x more visible */}
            <line
              x1={connection.from.x}
              y1={connection.from.y}
              x2={connection.to.x}
              y2={connection.to.y}
              stroke="url(#connectionGradient)"
              strokeWidth="0.3" // Enhanced from 0.1 to 0.3 for 3x thickness
              strokeDasharray="2 1"
              className={animated ? (animationClasses?.intensity === "intense" || animationClasses?.intensity === "burst" ? "animate-neural-connection-intense" : "animate-neural-connection") : ""}
              style={{
                animationDelay: `${connection.delay}s`,
                opacity: connection.strength,
              }}
            />
            
            {/* Maximum impact energy pulse along connection */}
            {animated && (
              <>
                {/* Primary energy pulse */}
                <circle
                  r="1.5" // Enhanced from 0.9 to 1.5 for maximum size
                  fill="url(#nodeGradientAnimated)" // Use animated gradient for dynamic colors
                  filter={animationClasses?.intensity === "burst" ? "url(#glowIntense)" : "url(#glow)"}
                  className={animationClasses?.intensity === "intense" || animationClasses?.intensity === "burst" ? "animate-energy-pulse-intense" : "animate-energy-pulse"}
                  style={{
                    animationDelay: `${connection.delay}s`,
                  }}
                >
                  <animateMotion
                    dur="2s" // Faster for more dynamic effect
                    repeatCount="indefinite"
                    begin={`${connection.delay}s`}
                  >
                    <mpath>
                      <path d={`M ${connection.from.x} ${connection.from.y} L ${connection.to.x} ${connection.to.y}`} />
                    </mpath>
                  </animateMotion>
                </circle>

                {/* Secondary trailing pulse for enhanced effect */}
                <circle
                  r="0.8"
                  fill="rgba(196, 181, 253, 0.8)"
                  filter="url(#glow)"
                  className="animate-energy-pulse"
                  style={{
                    animationDelay: `${connection.delay + 0.5}s`,
                  }}
                >
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${connection.delay + 0.5}s`}
                  >
                    <mpath>
                      <path d={`M ${connection.from.x} ${connection.from.y} L ${connection.to.x} ${connection.to.y}`} />
                    </mpath>
                  </animateMotion>
                </circle>
              </>
            )}
          </g>
        ))}

        {/* Render nodes */}
        {nodes.map((node, index) => (
          <g key={node.id}>
            {/* Maximum impact outer glow ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size * 4} // Enhanced from 2.5 to 4 for maximum glow radius
              fill="rgba(147, 197, 253, 0.2)"
              className={animated ? (animationClasses?.intensity === "intense" || animationClasses?.intensity === "burst" ? "animate-synaptic-burst-intense" : "animate-synaptic-burst") : ""}
              style={{
                animationDelay: `${node.delay}s`,
              }}
            />

            {/* Middle glow ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size * 2.5}
              fill="rgba(196, 181, 253, 0.4)"
              className={animated ? (animationClasses?.intensity === "intense" || animationClasses?.intensity === "burst" ? "animate-synaptic-burst-intense" : "animate-synaptic-burst") : ""}
              style={{
                animationDelay: `${node.delay + 0.2}s`,
              }}
            />

            {/* Inner glow ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size * 1.5}
              fill="rgba(59, 130, 246, 0.6)"
              className={animated ? (animationClasses?.intensity === "intense" || animationClasses?.intensity === "burst" ? "animate-synaptic-burst-intense" : "animate-synaptic-burst") : ""}
              style={{
                animationDelay: `${node.delay + 0.4}s`,
              }}
            />

            {/* Maximum impact main node */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="url(#nodeGradientAnimated)" // Use animated gradient
              filter={animationClasses?.intensity === "burst" ? "url(#glowIntense)" : "url(#glow)"}
              className={getNodeAnimationClass(node, index)}
              style={{
                animationDelay: `${node.delay}s`,
                opacity: node.intensity,
              }}
            />
          </g>
        ))}
      </svg>

      {/* Maximum impact multi-layered overlay for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/25 to-indigo-500/20 mix-blend-overlay animate-pulse"
      />
      <div
        className="absolute inset-0 bg-gradient-to-tl from-cyan-500/15 via-transparent to-violet-500/15 mix-blend-screen"
      />
      <div
        className="absolute inset-0 bg-radial-gradient from-transparent via-blue-400/10 to-transparent mix-blend-color-dodge"
      />
    </div>
  );
};

// Main export component that handles context availability
const NeuralNetworkBackground: React.FC<NeuralNetworkBackgroundProps> = (props) => {
  const { useContext: shouldUseContext = true, ...otherProps } = props;

  if (shouldUseContext) {
    try {
      return <NeuralNetworkWithContext {...otherProps} />;
    } catch {
      // Context not available, fallback to core component
      return <NeuralNetworkCore {...otherProps} useContext={false} />;
    }
  }

  return <NeuralNetworkCore {...otherProps} useContext={false} />;
};

export { NeuralNetworkBackground };
