"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "minimal" | "glow";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  offset?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  children: React.ReactNode;
}

const FloatingPanel = React.forwardRef<HTMLDivElement, FloatingPanelProps>(
  (
    {
      className,
      variant = "default",
      position = "center",
      offset = "md",
      animated = true,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = "fixed z-50 transition-all duration-300";
    
    const variantClasses = {
      default: "glass-strong shadow-2xl border-white/30",
      elevated: "glass-strong shadow-3xl border-white/40 backdrop-blur-2xl",
      minimal: "glass border-white/20 shadow-lg",
      glow: "glass-strong shadow-2xl border-white/30 pulse-glow",
    };

    const positionClasses = {
      "top-left": "top-4 left-4",
      "top-right": "top-4 right-4", 
      "bottom-left": "bottom-4 left-4",
      "bottom-right": "bottom-4 right-4",
      center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    };

    const offsetClasses = {
      sm: "m-2",
      md: "m-4",
      lg: "m-6", 
      xl: "m-8",
    };

    const animatedClasses = animated 
      ? "animate-in fade-in-0 zoom-in-95 duration-300" 
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          positionClasses[position],
          offsetClasses[offset],
          animatedClasses,
          "rounded-2xl p-4",
          className
        )}
        {...props}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 rounded-2xl pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Subtle border highlight */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
      </div>
    );
  }
);

FloatingPanel.displayName = "FloatingPanel";

export { FloatingPanel, type FloatingPanelProps };
