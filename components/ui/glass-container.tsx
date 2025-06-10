"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle" | "floating";
  blur?: "sm" | "md" | "lg" | "xl";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  shadow?: "sm" | "md" | "lg" | "xl" | "2xl";
  interactive?: boolean;
  animated?: boolean;
  gradient?: boolean;
  children: React.ReactNode;
}

const GlassContainer = React.forwardRef<HTMLDivElement, GlassContainerProps>(
  (
    {
      className,
      variant = "default",
      blur = "md",
      rounded = "xl",
      shadow = "md",
      interactive = false,
      animated = false,
      gradient = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = "relative overflow-hidden transition-all duration-300";
    
    const variantClasses = {
      default: "bg-white/10 backdrop-blur-md border border-white/20",
      strong: "bg-white/15 backdrop-blur-xl border border-white/30",
      subtle: "bg-white/5 backdrop-blur-sm border border-white/10",
      floating: "bg-white/12 backdrop-blur-lg border border-white/25 shadow-2xl",
    };

    const blurClasses = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md", 
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    };

    const roundedClasses = {
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg", 
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full",
    };

    const shadowClasses = {
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl", 
      "2xl": "shadow-2xl",
    };

    const interactiveClasses = interactive
      ? "cursor-pointer hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] hover:shadow-2xl"
      : "";

    const animatedClasses = animated ? "animate-pulse-glow" : "";

    const gradientOverlay = gradient && (
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
    );

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          blurClasses[blur],
          roundedClasses[rounded],
          shadowClasses[shadow],
          interactiveClasses,
          animatedClasses,
          className
        )}
        {...props}
      >
        {gradientOverlay}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Subtle inner glow effect */}
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Border highlight */}
        <div className="absolute inset-0 rounded-inherit border border-white/10 pointer-events-none" />
      </div>
    );
  }
);

GlassContainer.displayName = "GlassContainer";

export { GlassContainer, type GlassContainerProps };
