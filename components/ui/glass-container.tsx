"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle" | "floating" | "premium" | "ultra";
  blur?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  shadow?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  interactive?: boolean;
  animated?: boolean;
  gradient?: boolean;
  shimmer?: boolean;
  depth?: "flat" | "raised" | "floating" | "deep";
  borderGlow?: boolean;
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
      shimmer = false,
      depth = "raised",
      borderGlow = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = "relative overflow-hidden transition-all duration-500 ease-out";

    const variantClasses = {
      default: "bg-white/10 backdrop-blur-md border border-white/20",
      strong: "bg-white/15 backdrop-blur-xl border border-white/30",
      subtle: "bg-white/5 backdrop-blur-sm border border-white/10",
      floating: "bg-white/12 backdrop-blur-lg border border-white/25 shadow-2xl",
      premium: "bg-gradient-to-br from-white/18 via-white/12 to-white/8 backdrop-blur-2xl border border-white/40",
      ultra: "bg-gradient-to-br from-white/25 via-white/15 to-white/10 backdrop-blur-3xl border border-white/50",
    };

    const blurClasses = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
      "2xl": "backdrop-blur-2xl",
      "3xl": "backdrop-blur-3xl",
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
      "3xl": "shadow-3xl",
    };

    const depthClasses = {
      flat: "",
      raised: "transform-gpu hover:translate-y-[-2px]",
      floating: "transform-gpu hover:translate-y-[-4px] hover:scale-[1.02]",
      deep: "transform-gpu hover:translate-y-[-6px] hover:scale-[1.03]",
    };

    const interactiveClasses = interactive
      ? cn(
          "cursor-pointer hover:shadow-3xl active:scale-[0.98] transition-all duration-300",
          depthClasses[depth]
        )
      : "";

    const animatedClasses = animated ? "animate-pulse-glow" : "";

    const shimmerClasses = shimmer ? "animate-glass-shimmer" : "";

    const borderGlowClasses = borderGlow
      ? "before:absolute before:inset-0 before:rounded-inherit before:p-[1px] before:bg-gradient-to-r before:from-blue-400/50 before:via-purple-500/50 before:to-cyan-400/50 before:mask-composite-subtract before:mask-[linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]"
      : "";

    const gradientOverlay = gradient && (
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
    );

    const shimmerOverlay = shimmer && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-glass-shimmer" />
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
          shimmer && "relative overflow-hidden",
          borderGlow && "relative",
          className
        )}
        {...props}
      >
        {/* Background gradient overlay */}
        {gradientOverlay}

        {/* Shimmer effect overlay */}
        {shimmerOverlay}

        {/* Border glow effect */}
        {borderGlow && (
          <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-cyan-400/20 blur-sm opacity-50 pointer-events-none" />
        )}

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Enhanced inner glow effects */}
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/8 via-transparent to-white/3 pointer-events-none" />
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-tl from-transparent via-white/5 to-transparent pointer-events-none" />

        {/* Multiple border highlights for depth */}
        <div className="absolute inset-0 rounded-inherit border border-white/15 pointer-events-none" />
        <div className="absolute inset-[1px] rounded-inherit border border-white/8 pointer-events-none" />

        {/* Subtle noise texture for realism */}
        <div
          className="absolute inset-0 rounded-inherit opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    );
  }
);

GlassContainer.displayName = "GlassContainer";

export { GlassContainer, type GlassContainerProps };
