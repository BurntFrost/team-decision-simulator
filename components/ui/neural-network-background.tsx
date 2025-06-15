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
  nodeCount = 25,
  connectionDensity = 0.3,
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
        size: 2 + seedSize,
        delay: seedDelay,
        intensity: 0.3 + (seedIntensity / 100),
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

        // Only connect nearby nodes based on density
        if (distance < 30 && connectionSeed < connectionDensity) {
          const strengthSeed = ((i * 19 + j * 29) % 60) / 100;
          const delaySeed = ((i * 11 + j * 13) % 200) / 100;

          newConnections.push({
            id: `connection-${i}-${j}`,
            from: nodeA,
            to: nodeB,
            strength: 0.2 + strengthSeed,
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
        "motion-reduce:opacity-30 motion-reduce:animate-none",
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
          {/* Gradient definitions for nodes */}
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(147, 197, 253, 0.8)" />
            <stop offset="70%" stopColor="rgba(196, 181, 253, 0.6)" />
            <stop offset="100%" stopColor="rgba(147, 197, 253, 0.2)" />
          </radialGradient>
          
          {/* Gradient for connections */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(147, 197, 253, 0.1)" />
            <stop offset="50%" stopColor="rgba(196, 181, 253, 0.4)" />
            <stop offset="100%" stopColor="rgba(147, 197, 253, 0.1)" />
          </linearGradient>

          {/* Filter for glow effect */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Render connections */}
        {connections.map((connection) => (
          <g key={connection.id}>
            {/* Connection line */}
            <line
              x1={connection.from.x}
              y1={connection.from.y}
              x2={connection.to.x}
              y2={connection.to.y}
              stroke="url(#connectionGradient)"
              strokeWidth="0.1"
              strokeDasharray="2 1"
              className={animated ? "animate-neural-connection" : ""}
              style={{
                animationDelay: `${connection.delay}s`,
                opacity: connection.strength,
              }}
            />
            
            {/* Energy pulse along connection */}
            {animated && (
              <circle
                r="0.3"
                fill="rgba(147, 197, 253, 0.8)"
                filter="url(#glow)"
                className="animate-energy-pulse"
                style={{
                  animationDelay: `${connection.delay}s`,
                }}
              >
                <animateMotion
                  dur="2.5s"
                  repeatCount="indefinite"
                  begin={`${connection.delay}s`}
                >
                  <mpath>
                    <path d={`M ${connection.from.x} ${connection.from.y} L ${connection.to.x} ${connection.to.y}`} />
                  </mpath>
                </animateMotion>
              </circle>
            )}
          </g>
        ))}

        {/* Render nodes */}
        {nodes.map((node, index) => (
          <g key={node.id}>
            {/* Node glow */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size * 1.5}
              fill="rgba(147, 197, 253, 0.1)"
              className={animated ? "animate-synaptic-burst" : ""}
              style={{
                animationDelay: `${node.delay}s`,
              }}
            />
            
            {/* Main node */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="url(#nodeGradient)"
              filter="url(#glow)"
              className={getNodeAnimationClass(node, index)}
              style={{
                animationDelay: `${node.delay}s`,
                opacity: node.intensity,
              }}
            />
          </g>
        ))}
      </svg>

      {/* Subtle overlay for depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5 mix-blend-overlay"
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
