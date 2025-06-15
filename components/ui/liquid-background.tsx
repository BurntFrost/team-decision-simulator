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
  const [isInteracting, setIsInteracting] = React.useState(false);

  // Prevent hydration mismatch by only rendering on client
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mouse interaction tracking for enhanced effects
  React.useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = () => {
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
    primary: "from-blue-300/12 via-blue-400/8 to-cyan-300/10",
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
    if (!neuralNetwork || !isMounted) return [];

    const nodeCount = 8; // Reduced for better performance
    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * 2 * Math.PI;
      const radius = 25 + (i % 2) * 15; // Simplified radius calculation
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;

      return {
        id: i,
        x: Math.max(15, Math.min(85, x)), // Keep within bounds
        y: Math.max(15, Math.min(85, y)),
        size: 2 + (i % 2), // Simplified size variation
        delay: i * 0.25,
        pulseSpeed: 2 + (i % 2),
      };
    });
  }, [neuralNetwork, isMounted]);

  // Generate connections between nearby nodes
  const neuralConnections = React.useMemo(() => {
    if (!neuralNetwork || !isMounted || neuralNodes.length === 0) return [];

    const connections = [];
    // Simplified connection logic - only connect adjacent nodes
    for (let i = 0; i < neuralNodes.length; i++) {
      const nextIndex = (i + 1) % neuralNodes.length;
      const node1 = neuralNodes[i];
      const node2 = neuralNodes[nextIndex];

      connections.push({
        id: `${i}-${nextIndex}`,
        x1: node1.x,
        y1: node1.y,
        x2: node2.x,
        y2: node2.y,
        delay: i * 0.15,
      });
    }
    return connections;
  }, [neuralNetwork, isMounted, neuralNodes]);

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
      
      {/* Liquid Glass Gradient Layers */}
      <div className="absolute inset-0 force-gpu-layer">
        {/* Primary liquid glass layer - top right */}
        <div
          className={cn(
            "absolute -top-20 -right-20 w-[120vw] h-[80vh] gpu-accelerated smooth-60fps",
            "bg-gradient-to-bl from-blue-300/10 via-cyan-200/6 to-transparent",
            "backdrop-blur-3xl border-l border-b border-white/10",
            "transform rotate-12 origin-top-right",
            animated && "animate-liquid-glass-flow",
            isInteracting && "scale-105 opacity-90"
          )}
          style={{
            transform: isInteracting
              ? `rotate(${12 + interactionMultiplier[interactionIntensity] * 2}deg) scale(${1.05 + interactionMultiplier[interactionIntensity] * 0.05})`
              : 'rotate(12deg)',
            transition: 'transform 0.6s ease-out',
            willChange: 'transform',
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          }}
        />

        {/* Secondary liquid glass layer - bottom left */}
        <div
          className={cn(
            "absolute -bottom-20 -left-20 w-[100vw] h-[70vh] gpu-accelerated smooth-60fps",
            "bg-gradient-to-tr from-blue-200/8 via-blue-300/6 to-transparent",
            "backdrop-blur-2xl border-r border-t border-white/8",
            "transform -rotate-8 origin-bottom-left",
            animated && "animate-liquid-glass-flow-reverse",
            isInteracting && "scale-105 opacity-85"
          )}
          style={{
            transform: isInteracting
              ? `rotate(${-8 - interactionMultiplier[interactionIntensity] * 1.5}deg) scale(${1.05 + interactionMultiplier[interactionIntensity] * 0.03})`
              : 'rotate(-8deg)',
            transition: 'transform 0.6s ease-out',
            animationDelay: '1.5s',
            willChange: 'transform',
            borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
          }}
        />

        {/* Tertiary accent layer - center */}
        <div
          className={cn(
            "absolute top-1/4 left-1/3 w-[60vw] h-[50vh] gpu-accelerated smooth-60fps",
            "bg-gradient-to-br from-cyan-300/6 via-blue-200/4 to-transparent",
            "backdrop-blur-xl border border-white/5",
            "transform rotate-3 origin-center",
            animated && "animate-liquid-glass-pulse",
            isInteracting && "scale-110 opacity-80"
          )}
          style={{
            transform: isInteracting
              ? `rotate(${3 + interactionMultiplier[interactionIntensity]}deg) scale(${1.1 + interactionMultiplier[interactionIntensity] * 0.02})`
              : 'rotate(3deg)',
            transition: 'transform 0.4s ease-out',
            animationDelay: '0.8s',
            willChange: 'transform',
            borderRadius: '50% 50% 80% 20% / 60% 40% 60% 40%',
          }}
        />

        {/* Subtle overlay gradients for depth */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-blue-500/2",
            "backdrop-blur-sm",
            animated && "animate-subtle-shift"
          )}
          style={{
            mixBlendMode: 'overlay',
            willChange: 'opacity',
          }}
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
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Neural nodes */}
          {neuralNodes.map((node) => (
            <div
              key={node.id}
              className={cn(
                "absolute rounded-full bg-gradient-to-r from-blue-300/40 to-blue-400/45 gpu-accelerated",
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
                  "absolute rounded-full bg-gradient-to-r from-blue-300/25 to-cyan-300/25",
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
