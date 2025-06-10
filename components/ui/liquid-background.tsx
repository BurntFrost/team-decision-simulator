"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LiquidBackgroundProps {
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "warm" | "cool" | "aurora";
  intensity?: "subtle" | "medium" | "strong";
  animated?: boolean;
  particles?: boolean;
}

const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
  className,
  variant = "primary",
  intensity = "medium",
  animated = true,
  particles = false,
}) => {
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

  const animationClass = animated ? "animate-pulse" : "";

  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Main gradient background */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          gradientVariants[variant],
          intensityOpacity[intensity]
        )}
      />
      
      {/* Animated liquid blobs */}
      <div className="absolute inset-0">
        {/* Large blob 1 */}
        <div 
          className={cn(
            "absolute -top-40 -right-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl",
            "bg-gradient-to-br from-blue-400/30 to-purple-600/30",
            animated && "animate-pulse floating"
          )}
        />
        
        {/* Large blob 2 */}
        <div 
          className={cn(
            "absolute -bottom-40 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl",
            "bg-gradient-to-tr from-pink-400/30 to-blue-500/30",
            animated && "animate-pulse floating-delayed"
          )}
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
      
      {/* Particle system overlay */}
      {particles && (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-1 h-1 bg-white/20 rounded-full",
                animated && "animate-pulse"
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
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
