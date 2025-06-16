"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "liquid" | "pulse" | "dots";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "liquid",
  className
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-1", className)}>
        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse animation-delay-150"></div>
        <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full animate-pulse animation-delay-300"></div>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn(
        sizeClasses[size],
        "bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full animate-pulse",
        className
      )} />
    );
  }

  return (
    <div className={cn(
      sizeClasses[size],
      "relative",
      className
    )}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 animate-spin">
        <div className="absolute inset-1 rounded-full bg-white/90 backdrop-blur-sm"></div>
      </div>
      
      {/* Inner glow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-300/50 via-purple-300/50 to-cyan-300/50 animate-pulse"></div>
    </div>
  );
};

interface LoadingCardProps {
  className?: string;
  animated?: boolean;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  className,
  animated = true
}) => {
  return (
    <div className={cn(
      "bg-gradient-to-br from-white/15 via-white/10 to-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-glass",
      animated && "animate-pulse",
      className
    )}>
      {/* Header skeleton */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl animate-pulse"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gradient-to-r from-white/20 to-white/10 rounded-xl animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-white/15 to-white/8 rounded-lg animate-pulse w-3/4"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="h-8 bg-gradient-to-r from-white/15 to-white/8 rounded-2xl animate-pulse flex-1"></div>
          <div className="h-8 bg-gradient-to-r from-white/15 to-white/8 rounded-2xl animate-pulse flex-1"></div>
          <div className="h-8 bg-gradient-to-r from-white/15 to-white/8 rounded-2xl animate-pulse w-16"></div>
        </div>
        
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-white/12 to-white/6 rounded-lg animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-white/12 to-white/6 rounded-lg animate-pulse w-5/6"></div>
          <div className="h-4 bg-gradient-to-r from-white/12 to-white/6 rounded-lg animate-pulse w-4/5"></div>
        </div>
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Loading...",
  className
}) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-gradient-to-br from-white/20 via-white/10 to-white/20 backdrop-blur-2xl",
      "animate-fadeInBlur",
      className
    )}>
      <div className="text-center space-y-6 p-8 rounded-3xl bg-gradient-to-br from-white/25 via-white/15 to-white/25 backdrop-blur-xl border border-white/40 shadow-liquid">
        <LoadingSpinner size="xl" variant="liquid" />
        <div className="space-y-2">
          <p className="text-lg font-semibold text-glass-effect">{message}</p>
          <p className="text-sm text-subtle-glass">Please wait while we process your request</p>
        </div>
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
  animated = true
}) => {
  const variantClasses = {
    text: "h-4 rounded-lg",
    circular: "rounded-full",
    rectangular: "rounded-xl"
  };

  return (
    <div 
      className={cn(
        "bg-gradient-to-r from-white/15 via-white/20 to-white/15",
        variantClasses[variant],
        animated && "animate-pulse",
        className
      )}
      style={{ width, height }}
    />
  );
};

// Enhanced transition components
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 500,
  className
}) => {
  return (
    <div 
      className={cn("animate-fadeInBlur", className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 500,
  className
}) => {
  const directionClasses = {
    up: "animate-slideInUp",
    down: "animate-slideInDown", 
    left: "animate-slideInLeft",
    right: "animate-slideInRight"
  };

  return (
    <div 
      className={cn(directionClasses[direction], className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 300,
  className
}) => {
  return (
    <div 
      className={cn("animate-scaleIn", className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};
