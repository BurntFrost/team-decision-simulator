"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LiquidBackgroundProps {
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "warm" | "cool" | "aurora";
  intensity?: "subtle" | "medium" | "strong";
  animated?: boolean;
  particles?: boolean;
  neuralNetwork?: boolean;
  interactionIntensity?: "low" | "medium" | "high";
}

const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
  className,
  variant = "primary",
  intensity = "medium",
  animated = true,
  particles = false,
  neuralNetwork = true,
  interactionIntensity = "medium",
}) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = React.useState(false);

  // Prevent hydration mismatch by only rendering on client
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mouse interaction tracking for enhanced effects
  React.useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsInteracting(true);
    };

    const handleMouseLeave = () => {
      setIsInteracting(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMounted]);
  const gradientVariants = {
    primary: "from-blue-400/20 via-purple-500/15 to-indigo-600/20",
    secondary: "from-pink-400/20 via-rose-500/15 to-red-500/20", 
    accent: "from-cyan-400/20 via-blue-500/15 to-teal-600/20",
    warm: "from-orange-400/20 via-pink-500/15 to-yellow-500/20",
    cool: "from-green-400/20 via-blue-500/15 to-purple-600/20",
    aurora: "from-green-400/15 via-blue-500/10 to-purple-600/15",
  };

  const intensityOpacity = {
    subtle: "opacity-30",
    medium: "opacity-50",
    strong: "opacity-70",
  };

  const interactionMultiplier = {
    low: 0.5,
    medium: 1,
    high: 1.5,
  };

  // Generate neural network nodes with deterministic positioning
  const neuralNodes = React.useMemo(() => {
    if (!neuralNetwork) return [];

    const nodeCount = 12;
    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * 2 * Math.PI;
      const radius = 30 + (i % 3) * 20; // Varying distances from center
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;

      return {
        id: i,
        x: Math.max(10, Math.min(90, x)), // Keep within bounds
        y: Math.max(10, Math.min(90, y)),
        size: 2 + (i % 3), // Varying sizes
        delay: i * 0.2,
        pulseSpeed: 2 + (i % 2),
      };
    });
  }, [neuralNetwork]);

  // Generate connections between nearby nodes
  const neuralConnections = React.useMemo(() => {
    if (!neuralNetwork || neuralNodes.length === 0) return [];

    const connections = [];
    for (let i = 0; i < neuralNodes.length; i++) {
      for (let j = i + 1; j < neuralNodes.length; j++) {
        const node1 = neuralNodes[i];
        const node2 = neuralNodes[j];
        const distance = Math.sqrt(
          Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
        );

        // Only connect nearby nodes
        if (distance < 35) {
          connections.push({
            id: `${i}-${j}`,
            x1: node1.x,
            y1: node1.y,
            x2: node2.x,
            y2: node2.y,
            delay: (i + j) * 0.1,
          });
        }
      }
    }
    return connections;
  }, [neuralNetwork, neuralNodes]);

  // Don't render during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden gpu-accelerated optimize-animations", className)}>
      {/* Main gradient background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br force-gpu-layer",
          gradientVariants[variant],
          intensityOpacity[intensity]
        )}
      />
      
      {/* Animated liquid blobs */}
      <div className="absolute inset-0 force-gpu-layer">
        {/* Large blob 1 */}
        <div
          className={cn(
            "absolute -top-40 -right-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl gpu-accelerated smooth-60fps",
            "bg-gradient-to-br from-blue-400/30 to-purple-600/30",
            animated && "animate-pulse floating",
            isInteracting && "animate-liquid-flow"
          )}
          style={{
            transform: isInteracting ? `scale(${1 + interactionMultiplier[interactionIntensity] * 0.1})` : undefined,
            transition: 'transform 0.3s ease-out',
            willChange: 'transform',
          }}
        />

        {/* Large blob 2 */}
        <div
          className={cn(
            "absolute -bottom-40 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl",
            "bg-gradient-to-tr from-pink-400/30 to-blue-500/30",
            animated && "animate-pulse floating-delayed",
            isInteracting && "animate-liquid-flow"
          )}
          style={{
            transform: isInteracting ? `scale(${1 + interactionMultiplier[interactionIntensity] * 0.08})` : undefined,
            transition: 'transform 0.3s ease-out',
            animationDelay: '1s',
          }}
        />

        {/* Medium blob 1 */}
        <div
          className={cn(
            "absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-lg",
            "bg-gradient-to-bl from-indigo-400/25 to-cyan-500/25",
            animated && "liquid-morph floating"
          )}
        />

        {/* Medium blob 2 */}
        <div
          className={cn(
            "absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-lg",
            "bg-gradient-to-tl from-purple-400/25 to-pink-500/25",
            animated && "liquid-morph floating-delayed"
          )}
        />

        {/* Small accent blobs */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 w-32 h-32 rounded-full mix-blend-multiply filter blur-md",
            "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 transform -translate-x-1/2 -translate-y-1/2",
            animated && "pulse-glow floating"
          )}
        />
      </div>

      {/* Neural Network Visualization */}
      {neuralNetwork && (
        <div className="absolute inset-0 overflow-hidden force-gpu-layer">
          {/* Neural connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none gpu-accelerated">
            {neuralConnections.map((connection) => (
              <line
                key={connection.id}
                x1={`${connection.x1}%`}
                y1={`${connection.y1}%`}
                x2={`${connection.x2}%`}
                y2={`${connection.y2}%`}
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                opacity="0.3"
                className={cn(
                  animated && "animate-pulse smooth-60fps",
                  isInteracting && "opacity-60"
                )}
                style={{
                  animationDelay: `${connection.delay}s`,
                  animationDuration: '3s',
                  willChange: 'opacity',
                }}
              />
            ))}

            {/* Gradient definition for neural connections */}
            <defs>
              <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Neural nodes */}
          {neuralNodes.map((node) => (
            <div
              key={node.id}
              className={cn(
                "absolute rounded-full bg-gradient-to-r from-blue-400/60 to-purple-500/60 gpu-accelerated",
                "border border-white/30 backdrop-blur-sm optimized-blur",
                animated && "animate-pulse smooth-60fps",
                isInteracting && "scale-125 shadow-lg shadow-blue-500/25"
              )}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${node.size * 4}px`,
                height: `${node.size * 4}px`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${node.delay}s`,
                animationDuration: `${node.pulseSpeed}s`,
                transition: 'all 0.3s ease-out',
                willChange: 'transform, opacity',
              }}
            >
              {/* Inner glow effect */}
              <div
                className="absolute inset-0 rounded-full bg-white/20 animate-ping gpu-accelerated"
                style={{
                  animationDelay: `${node.delay + 0.5}s`,
                  animationDuration: '2s',
                  willChange: 'transform, opacity',
                }}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Enhanced Particle system overlay */}
      {particles && (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => {
            // Use deterministic positioning based on index to prevent hydration issues
            const left = ((i * 37) % 100); // Pseudo-random but deterministic
            const top = ((i * 73) % 100);
            const delay = (i * 0.15) % 3;
            const duration = 3 + ((i * 0.1) % 2);
            const particleId = `particle-${left}-${top}`; // More unique key

            return (
              <div
                key={particleId}
                className={cn(
                  "absolute rounded-full bg-gradient-to-r from-blue-400/30 to-purple-500/30",
                  "border border-white/20 backdrop-blur-sm",
                  animated && "animate-pulse",
                  isInteracting && "scale-150 opacity-80"
                )}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  transition: 'all 0.3s ease-out',
                }}
              >
                {/* Particle glow effect */}
                <div
                  className="absolute inset-0 rounded-full bg-white/40 animate-ping"
                  style={{
                    animationDelay: `${delay + 1}s`,
                    animationDuration: '3s',
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export { LiquidBackground };
