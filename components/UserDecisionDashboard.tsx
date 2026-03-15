"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAdaptivePerformance } from "@/lib/hooks/usePerformance";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { PerformanceOptimizedTypesTab } from "@/components/PerformanceOptimizedTypesTab";
import { EnhancedPerformanceMonitor } from "@/components/EnhancedPerformanceMonitor";
import dynamic from "next/dynamic";
import Image from "next/image";
import { cn } from "@/lib/utils";
import * as DecisionService from "@/lib/decisionMatrixService";
import { Slider } from "@/components/ui/slider";
import { famousPeopleByMBTI, officeCharactersByMBTI, harryPotterCharactersByMBTI, characterPoolsByMBTI, franchiseCategories, harryPotterHousesByMBTI, hogwartsHouseInfo, officeDepartmentsByMBTI, officeDepartmentInfo, getHarryPotterHouse, groupResultsByHogwartsHouses } from "@/lib/mbtiData";

// Import react-icons
import { FaBrain, FaCheck } from "react-icons/fa";
import { BsFileText, BsClockFill, BsGeoAlt } from "react-icons/bs";
import { IoMdAnalytics } from "react-icons/io";
import { MdOutlineAssessment, MdFactCheck, MdPsychology } from "react-icons/md";
// Import Lucide icons for enhanced brain options
import { Brain, Zap } from "lucide-react";

// Enhanced Brain Icon Component with multiple visual options
interface EnhancedBrainIconProps {
  variant?:
    | "gradient"
    | "animated"
    | "glow"
    | "pulse"
    | "modern"
    | "premium"
    | "liquid"
    | "neural"
    | "purple";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  neuralActivity?: boolean;
}

const EnhancedBrainIcon: React.FC<EnhancedBrainIconProps> = ({
  variant = "gradient",
  size = "md",
  className = "",
  onClick,
  interactive = false,
  neuralActivity = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [pulseIntensity, setPulseIntensity] = React.useState(1);

  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-10 w-10",
    "2xl": "h-12 w-12",
    "3xl": "h-16 w-16",
  };

  const baseClasses = `${sizeClasses[size]} transition-all duration-500 ease-out transform-gpu ${className}`;

  // Enhanced neural activity simulation
  React.useEffect(() => {
    if (neuralActivity) {
      const interval = setInterval(() => {
        setPulseIntensity(Math.random() * 0.5 + 0.75); // Random intensity between 0.75 and 1.25
      }, 2000 + Math.random() * 1000); // Random interval between 2-3 seconds

      return () => clearInterval(interval);
    }
  }, [neuralActivity]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  switch (variant) {
    case "gradient":
      return (
        <div
          className={`relative ${onClick ? "cursor-pointer" : ""} group`}
          onClick={handleClick}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? "Brain icon button" : "Brain icon"}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Brain
            className={`${baseClasses} text-white relative z-10 drop-shadow-lg group-hover:scale-110 group-hover:rotate-3`}
          />
        </div>
      );

    case "animated":
      return (
        <div
          className={`relative ${onClick ? "cursor-pointer" : ""} group`}
          onClick={handleClick}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? "Brain icon button" : "Brain icon"}
        >
          <Brain
            className={`${baseClasses} text-white animate-pulse group-hover:animate-bounce drop-shadow-lg`}
          />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping group-hover:bg-blue-400"></div>
        </div>
      );

    case "glow":
      return (
        <div
          className={`relative ${onClick ? "cursor-pointer" : ""} group`}
          onClick={handleClick}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? "Brain icon button" : "Brain icon"}
        >
          <div className="absolute inset-0 bg-white rounded-full smooth-blur opacity-30 group-hover:opacity-35 transition-opacity duration-300 animate-pulse gpu-accelerated"></div>
          <Brain
            className={`${baseClasses} text-white relative z-10 drop-shadow-2xl gpu-accelerated`}
          />
        </div>
      );

    case "pulse":
      return (
        <div
          className={`relative ${onClick ? "cursor-pointer" : ""} group`}
          onClick={handleClick}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? "Brain icon button" : "Brain icon"}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 bg-white/10 rounded-full animate-ping animation-delay-75"></div>
          <Brain
            className={`${baseClasses} text-white relative z-10 drop-shadow-lg`}
          />
        </div>
      );

    case "modern":
      return (
        <div
          className={`relative ${onClick ? "cursor-pointer" : ""} group`}
          onClick={handleClick}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? "Brain icon button" : "Brain icon"}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg smooth-blur opacity-50 group-hover:opacity-55 transition-all duration-300 gpu-accelerated"></div>
          <div className="relative z-10 p-1 bg-white/10 optimized-blur rounded-lg border border-white/20 group-hover:bg-white/12 transition-all duration-300 gpu-accelerated">
            <Brain className={`${baseClasses} text-white gpu-accelerated`} />
          </div>
          <Zap className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      );

    case "premium":
      return (
        <div
          className={`relative ${onClick ? "cursor-pointer" : ""} group`}
          onClick={handleClick}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? "Brain icon button" : "Brain icon"}
        >
          {/* Outermost glow ring - largest and most intense */}
          <div className="absolute -inset-4 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 rounded-full blur-2xl opacity-80 motion-safe:animate-pulse motion-safe:[animation-duration:2.5s] group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Outer glow ring - enhanced intensity */}
          <div className="absolute -inset-2 bg-gradient-to-br from-blue-300 via-purple-400 to-indigo-500 rounded-full blur-xl opacity-70 motion-safe:animate-pulse motion-safe:[animation-duration:3s] motion-safe:[animation-delay:0.5s] group-hover:opacity-90 transition-opacity duration-500"></div>

          {/* Middle glow ring - more prominent */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400 rounded-full blur-lg opacity-60 motion-safe:animate-pulse motion-safe:[animation-duration:2s] motion-safe:[animation-delay:1s] group-hover:opacity-80 transition-opacity duration-500"></div>

          {/* Inner bright glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-100 to-purple-100 rounded-full blur-md opacity-40 motion-safe:animate-pulse motion-safe:[animation-duration:1.8s] motion-safe:[animation-delay:1.5s] group-hover:opacity-60 transition-opacity duration-500"></div>

          {/* Brain icon */}
          <div className="relative z-10">
            {/* Primary brain icon */}
            <Brain
              className={`${baseClasses} text-white drop-shadow-2xl group-hover:scale-110 group-hover:rotate-2 transition-all duration-300 filter brightness-125`}
            />
          </div>

          {/* Enhanced sparkle effects on hover */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 motion-safe:group-hover:animate-ping transition-opacity duration-300"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-200 rounded-full opacity-0 group-hover:opacity-80 motion-safe:group-hover:animate-ping motion-safe:[animation-delay:0.3s] transition-opacity duration-300"></div>
        </div>
      );

    case "liquid":
      return (
        <div
          className={`relative ${onClick ? "cursor-pointer" : ""} group`}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? "Brain icon button" : "Brain icon"}
        >
          {/* Liquid glass container */}
          <div className="relative p-2 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl transition-all duration-700 gpu-accelerated liquid-glass-optimized touch-responsive hover-optimized">
            {/* Liquid morphing background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300/25 via-cyan-300/25 to-blue-400/25 rounded-2xl blur-sm opacity-50 group-hover:opacity-55 transition-opacity duration-500 animate-liquid-flow"></div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-700 animate-glass-shimmer rounded-2xl"></div>

            {/* Brain icon */}
            <Brain
              className={`${baseClasses} text-white relative z-10 drop-shadow-2xl gpu-accelerated smooth-60fps`}
              style={{
                filter: `brightness(${1 + (isHovered ? 0.05 : 0)}) saturate(${
                  1 + (isHovered ? 0.05 : 0)
                })`,
                transform: `scale(${pulseIntensity})`,
                willChange: "transform, filter",
              }}
            />
          </div>
        </div>
      );

    case "neural":
      return (
        <div
          className={`relative ${onClick ? "cursor-pointer" : ""} group`}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? "Brain icon button" : "Brain icon"}
        >
          {/* Neural network background */}
          <div className="absolute -inset-6 opacity-40 group-hover:opacity-45 transition-opacity duration-500">
            {/* Neural connections */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient
                  id="neuralGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Animated neural pathways */}
              <path
                d="M20,20 Q50,10 80,30 Q90,50 70,80 Q50,90 30,70 Q10,50 20,20"
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                fill="none"
                className="animate-connection-flow"
                strokeDasharray="5,5"
              />
              <path
                d="M80,20 Q50,30 20,50 Q30,80 60,70 Q90,60 80,20"
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                fill="none"
                className="animate-connection-flow animation-delay-150"
                strokeDasharray="3,7"
              />
            </svg>

            {/* Neural nodes */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-neural-pulse"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-500 rounded-full animate-neural-pulse animation-delay-75"></div>
            <div className="absolute top-1/2 left-1 w-1 h-1 bg-cyan-400 rounded-full animate-neural-pulse animation-delay-150"></div>
            <div className="absolute top-1 right-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-neural-pulse animation-delay-300"></div>
          </div>

          {/* Central brain container */}
          <div className="relative p-1 bg-gradient-to-br from-white/15 via-white/10 to-white/8 backdrop-blur-lg border border-white/25 rounded-xl shadow-xl transition-all duration-500">
            <Brain
              className={`${baseClasses} text-white relative z-10 drop-shadow-lg group-hover:brightness-105`}
              style={{
                filter: `hue-rotate(${isHovered ? "10deg" : "0deg"}) saturate(${
                  1 + (pulseIntensity - 1) * 0.5
                })`,
                transform: `scale(${0.95 + pulseIntensity * 0.05})`,
              }}
            />
          </div>

          {/* Synaptic activity */}
          {neuralActivity && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 w-px h-4 bg-gradient-to-b from-blue-400 to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 right-1/3 w-px h-3 bg-gradient-to-t from-purple-400 to-transparent animate-pulse animation-delay-150"></div>
              <div className="absolute left-0 top-1/3 w-3 h-px bg-gradient-to-r from-cyan-400 to-transparent animate-pulse animation-delay-300"></div>
            </div>
          )}
        </div>
      );

    case "purple":
      return (
        <div
          className={`relative ${onClick ? "cursor-pointer" : ""} group`}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? "Brain icon button" : "Brain icon"}
        >
          {/* Purple ripple effects */}
          <div className="absolute -inset-8 pointer-events-none">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-purple-ripple opacity-0 group-hover:opacity-20"></div>
            <div className="absolute inset-2 bg-purple-400/15 rounded-full animate-purple-ripple animation-delay-150 opacity-0 group-hover:opacity-15"></div>
            <div className="absolute inset-4 bg-purple-300/10 rounded-full animate-purple-ripple animation-delay-300 opacity-0 group-hover:opacity-10"></div>
          </div>

          {/* Optimized purple glow rings */}
          <div className="absolute -inset-6 rounded-full purple-glow-primary motion-safe:animate-smooth-glow group-hover:opacity-65 transition-opacity duration-500"></div>
          <div className="absolute -inset-3 rounded-full purple-glow-secondary motion-safe:animate-smooth-glow motion-safe:[animation-delay:0.8s] group-hover:opacity-55 transition-opacity duration-500"></div>

          {/* Neural network background with purple theme */}
          <div className="absolute -inset-4 opacity-30 group-hover:opacity-35 transition-opacity duration-500">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient
                  id="purpleNeuralGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* Animated neural connections */}
              <line
                x1="20"
                y1="30"
                x2="80"
                y2="70"
                stroke="url(#purpleNeuralGradient)"
                strokeWidth="1"
                className="animate-purple-neural-activity"
              />
              <line
                x1="30"
                y1="80"
                x2="70"
                y2="20"
                stroke="url(#purpleNeuralGradient)"
                strokeWidth="1"
                className="animate-purple-neural-activity animation-delay-75"
              />
              <line
                x1="10"
                y1="60"
                x2="90"
                y2="40"
                stroke="url(#purpleNeuralGradient)"
                strokeWidth="1"
                className="animate-purple-neural-activity animation-delay-150"
              />
              <line
                x1="40"
                y1="10"
                x2="60"
                y2="90"
                stroke="url(#purpleNeuralGradient)"
                strokeWidth="1"
                className="animate-purple-neural-activity animation-delay-300"
              />
            </svg>

            {/* Purple neural nodes */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full animate-neural-pulse shadow-lg shadow-purple-500/50"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-500 rounded-full animate-neural-pulse animation-delay-75 shadow-lg shadow-purple-600/50"></div>
            <div className="absolute top-1/2 left-1 w-1 h-1 bg-purple-300 rounded-full animate-neural-pulse animation-delay-150 shadow-lg shadow-purple-400/50"></div>
            <div className="absolute top-1 right-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-neural-pulse animation-delay-300 shadow-lg shadow-indigo-500/50"></div>
          </div>

          {/* Central brain container with purple glass effect */}
          <div className="relative p-1 bg-gradient-to-br from-purple-500/20 via-purple-400/15 to-indigo-500/10 optimized-blur border border-purple-300/30 rounded-xl shadow-xl shadow-purple-500/20 group-hover:shadow-xl group-hover:shadow-purple-500/22 transition-all duration-500 gpu-accelerated">
            <Brain
              className={`${baseClasses} text-white relative z-10 drop-shadow-lg group-hover:brightness-105`}
              style={{
                filter: isHovered
                  ? `hue-rotate(5deg) saturate(${
                      1 + (pulseIntensity - 1) * 0.3
                    })`
                  : `saturate(${1 + (pulseIntensity - 1) * 0.3})`,
                transform: `translateZ(0) scale(${
                  0.95 + pulseIntensity * 0.03
                })`,
                willChange: "transform, filter",
              }}
            />
            {/* Separate drop shadow element for better performance */}
            <div
              className="absolute inset-0 pointer-events-none rounded-xl"
              style={{
                boxShadow:
                  "0 0 4px rgba(139, 92, 246, 0.3), 0 0 8px rgba(139, 92, 246, 0.15)",
                opacity: pulseIntensity * 0.4,
                transform: "translateZ(0)",
              }}
            />
          </div>

          {/* Enhanced synaptic activity with purple theme */}
          {neuralActivity && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 w-px h-4 bg-gradient-to-b from-purple-400 to-transparent animate-pulse shadow-sm shadow-purple-400/50"></div>
              <div className="absolute bottom-0 right-1/3 w-px h-3 bg-gradient-to-t from-purple-500 to-transparent animate-pulse animation-delay-150 shadow-sm shadow-purple-500/50"></div>
              <div className="absolute left-0 top-1/3 w-3 h-px bg-gradient-to-r from-purple-300 to-transparent animate-pulse animation-delay-300 shadow-sm shadow-purple-300/50"></div>
              <div className="absolute right-0 bottom-1/4 w-2 h-px bg-gradient-to-l from-indigo-400 to-transparent animate-pulse animation-delay-75 shadow-sm shadow-indigo-400/50"></div>
            </div>
          )}
        </div>
      );

    default:
      return <Brain className={`${baseClasses} text-white`} />;
  }
};

// Custom Stepper Component
const StepperContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    role="list"
    aria-label="Progress"
    className={cn("flex w-full", className)}
  >
    {children}
  </div>
);

const StepperStep = ({
  isActive,
  isCompleted,
  stepNumber,
  title,
  description,
}: {
  isActive: boolean;
  isCompleted: boolean;
  stepNumber: number;
  title: string;
  description: string;
}) => (
  <div
    role="listitem"
    aria-current={isActive ? "step" : undefined}
    aria-label={`Step ${stepNumber}: ${title}`}
    className="flex-1 relative"
  >
    <div className="flex items-center">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white",
          isActive
            ? "border-[#4455a6] text-[#4455a6]"
            : isCompleted
            ? "border-green-500 bg-green-500 text-white"
            : "border-gray-300 text-gray-400"
        )}
      >
        {isCompleted ? (
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span>{stepNumber}</span>
        )}
      </div>
      <div
        className={cn(
          "flex-1 h-0.5",
          isCompleted ? "bg-green-500" : "bg-gray-200"
        )}
      ></div>
    </div>
    <div className="mt-2">
      <div
        className={cn(
          "text-sm font-medium",
          isActive
            ? "text-[#4455a6]"
            : isCompleted
            ? "text-green-600"
            : "text-gray-500"
        )}
      >
        {title}
      </div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  </div>
);




// Helper function to get Office department for a MBTI type
const getOfficeDepartment = (mbtiType: string): string => {
  return officeDepartmentsByMBTI[mbtiType]?.department || "Unknown";
};

// Group MBTI results by Office departments
const groupResultsByOfficeDepartments = (
  results: DecisionService.SimulationResult[]
) => {
  const departmentGroups: Record<
    string,
    {
      name: string;
      color: string;
      count: number;
      types: string[];
      characters: string[];
      decisions: Record<string, number>;
      averageScore: number;
    }
  > = {
    Management: {
      name: "Management",
      color: "#1e40af",
      count: 0,
      types: [],
      characters: [],
      decisions: {},
      averageScore: 0,
    },
    Sales: {
      name: "Sales",
      color: "#059669",
      count: 0,
      types: [],
      characters: [],
      decisions: {},
      averageScore: 0,
    },
    Accounting: {
      name: "Accounting",
      color: "#7c2d12",
      count: 0,
      types: [],
      characters: [],
      decisions: {},
      averageScore: 0,
    },
    Reception: {
      name: "Reception",
      color: "#be185d",
      count: 0,
      types: [],
      characters: [],
      decisions: {},
      averageScore: 0,
    },
    HR: {
      name: "HR",
      color: "#7c3aed",
      count: 0,
      types: [],
      characters: [],
      decisions: {},
      averageScore: 0,
    },
    "Customer Service": {
      name: "Customer Service",
      color: "#ea580c",
      count: 0,
      types: [],
      characters: [],
      decisions: {},
      averageScore: 0,
    },
    Corporate: {
      name: "Corporate",
      color: "#6b7280",
      count: 0,
      types: [],
      characters: [],
      decisions: {},
      averageScore: 0,
    },
  };

  // Group results by department
  let totalScores: Record<string, number> = {
    Management: 0,
    Sales: 0,
    Accounting: 0,
    Reception: 0,
    HR: 0,
    "Customer Service": 0,
    Corporate: 0,
  };

  results.forEach((result) => {
    const department = getOfficeDepartment(result.name);
    if (departmentGroups[department]) {
      departmentGroups[department].count++;
      departmentGroups[department].types.push(result.name);

      // Add characters for this MBTI type
      const characters = officeCharactersByMBTI[result.name] || [];
      departmentGroups[department].characters.push(...characters);

      departmentGroups[department].decisions[result.decision] =
        (departmentGroups[department].decisions[result.decision] || 0) + 1;
      totalScores[department] += result.score;
    }
  });

  // Calculate average scores
  Object.keys(departmentGroups).forEach((department) => {
    if (departmentGroups[department].count > 0) {
      departmentGroups[department].averageScore =
        totalScores[department] / departmentGroups[department].count;
    }
  });

  return departmentGroups;
};

// Helper function to get a random famous person for a given MBTI type
const getRandomFamousPerson = (mbtiType: string): string => {
  const people = famousPeopleByMBTI[mbtiType] || [];
  if (people.length === 0) return "";

  return people[Math.floor(Math.random() * people.length)];
};

// Mapping of MBTI types to placeholder image seeds
const mbtiImageSeeds: Record<string, string> = {
  INTJ: "architect",
  ENTJ: "leader",
  INTP: "scientist",
  ENTP: "inventor",
  INFJ: "visionary",
  ENFJ: "coach",
  INFP: "poet",
  ENFP: "creative",
  ISTJ: "organizer",
  ESTJ: "executive",
  ISFJ: "caregiver",
  ESFJ: "supporter",
  ISTP: "craftsman",
  ESTP: "entrepreneur",
  ISFP: "artist",
  ESFP: "performer",
};

// Enhanced Personality Card Component with Liquid Glass Design
interface EnhancedPersonalityCardProps {
  type: string;
  info: any;
  img: string;
  isUserType: boolean;
  characterExamples: Array<{ name: string; franchise: string }>;
  characterPoolsByMBTI: any;
  cycleCharacter: (type: string, franchise: string) => void;
  shuffleAllCharacters: (type: string) => void;
  getFranchiseColors: (franchise: string) => {
    backgroundColor: string;
    color: string;
  };
}

// Memoized component to prevent unnecessary re-renders
const EnhancedPersonalityCard: React.FC<EnhancedPersonalityCardProps> =
  React.memo(
    ({
      type,
      info,
      img,
      isUserType,
      characterExamples,
      characterPoolsByMBTI,
      cycleCharacter,
      shuffleAllCharacters,
      getFranchiseColors,
    }) => {
      const [isExpanded, setIsExpanded] = useState(false);
      const [isHovered, setIsHovered] = useState(false);

      // Direct hover handlers without debouncing to prevent flickering
      const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
      }, []);

      const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
      }, []);

      // Handle card click to shuffle all characters
      const handleCardClick = (e: React.MouseEvent) => {
        // Prevent triggering when clicking on interactive elements
        const target = e.target as HTMLElement;
        if (target.tagName === "BUTTON" || target.closest("button")) {
          return;
        }
        shuffleAllCharacters(type);
      };

      return (
        <div
          className={cn(
            "group relative overflow-hidden rounded-3xl transition-all duration-300 ease-out cursor-pointer transform-gpu",
            isHovered ? "scale-[1.02] -translate-y-1 shadow-4xl" : "shadow-2xl",
            isUserType
              ? "ring-2 ring-[#007aff] ring-offset-4 ring-offset-white/50"
              : ""
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          title="Click to shuffle character examples"
        >
          {/* Enhanced Liquid Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-white/8 via-transparent to-white/12 backdrop-blur-xl"></div>

          {/* Dynamic color overlay based on personality type */}
          <div
            className="absolute inset-0 opacity-8 bg-gradient-to-br from-transparent via-current/20 to-current/10 transition-opacity duration-500"
            style={{ color: info.color }}
          ></div>

          {/* Enhanced border effects */}
          <div className="absolute inset-0 rounded-3xl border border-white/30 pointer-events-none"></div>
          <div className="absolute inset-[1px] rounded-3xl border border-white/15 pointer-events-none"></div>

          {/* Interactive glow effect */}
          {isHovered && (
            <div
              className="absolute inset-0 rounded-3xl opacity-20 bg-gradient-to-r from-transparent via-current/30 to-transparent animate-glass-shimmer transition-opacity duration-700"
              style={{ color: info.color }}
            ></div>
          )}

          {/* Subtle noise texture for realism */}
          <div
            className="absolute inset-0 rounded-3xl opacity-[0.02] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 p-6 space-y-5">
            {/* Header Section */}
            <div className="flex items-start gap-4">
              <div className="relative">
                {/* Enhanced image container with liquid glass effect */}
                <div className="relative p-1 bg-gradient-to-br from-white/25 via-white/15 to-white/10 backdrop-blur-lg rounded-3xl shadow-xl">
                  <Image
                    src={img}
                    alt={`${type} icon`}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-2xl object-cover shadow-lg"
                  />
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none"></div>
                </div>

                {isUserType && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#007aff] to-[#5856d6] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h4
                    className="text-xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent filter drop-shadow-sm"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${info.color}, ${info.color}dd)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {info.name}
                  </h4>
                  {isUserType && (
                    <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-[#007aff] to-[#5856d6] text-white rounded-full shadow-lg animate-pulse">
                      Your Type
                    </span>
                  )}
                </div>
                <p className="text-gray-800 leading-relaxed text-sm font-medium bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  {info.description}
                </p>
              </div>
            </div>

            {/* Enhanced Scientific Factors Preview */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {info.scientificFactors.keyTraits
                  .slice(0, 3)
                  .map((trait: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 text-xs font-medium rounded-2xl bg-white/40 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/50 hover:scale-105 transition-all duration-300 transform-gpu"
                      style={{ color: info.color }}
                    >
                      {trait}
                    </span>
                  ))}
                {info.scientificFactors.keyTraits.length > 3 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-4 py-2 text-xs font-medium rounded-2xl bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-md border border-white/25 text-gray-700 hover:from-white/40 hover:to-white/30 hover:scale-105 transition-all duration-300 transform-gpu shadow-lg"
                  >
                    +{info.scientificFactors.keyTraits.length - 3} more
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Expandable Scientific Details */}
            {isExpanded && (
              <div className="space-y-5 pt-5 border-t border-white/30 bg-white/20 backdrop-blur-sm rounded-2xl p-4 -mx-2">
                <div className="grid grid-cols-1 gap-4">
                  {/* Enhanced Decision Process */}
                  <div className="space-y-3 p-3 bg-white/30 backdrop-blur-md rounded-xl border border-white/20">
                    <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full shadow-lg animate-pulse"
                        style={{ backgroundColor: info.color }}
                      ></span>
                      Decision Process
                    </h5>
                    <p className="text-xs text-gray-700 leading-relaxed pl-6 bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      {info.scientificFactors.decisionProcess}
                    </p>
                  </div>

                  {/* Enhanced Strengths */}
                  <div className="space-y-3 p-3 bg-white/30 backdrop-blur-md rounded-xl border border-white/20">
                    <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg animate-pulse"></span>
                      Strengths
                    </h5>
                    <div className="flex flex-wrap gap-2 pl-6">
                      {info.scientificFactors.strengths.map(
                        (strength: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 text-xs bg-gradient-to-r from-green-50/80 to-green-100/80 text-green-700 rounded-xl border border-green-200/50 backdrop-blur-sm shadow-sm hover:scale-105 transition-transform duration-200"
                          >
                            {strength}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Enhanced Challenges */}
                  {info.scientificFactors.challenges && (
                    <div className="space-y-3 p-3 bg-white/30 backdrop-blur-md rounded-xl border border-white/20">
                      <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg animate-pulse"></span>
                        Challenges
                      </h5>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {info.scientificFactors.challenges.map(
                          (challenge: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 text-xs bg-gradient-to-r from-amber-50/80 to-amber-100/80 text-amber-700 rounded-xl border border-amber-200/50 backdrop-blur-sm shadow-sm hover:scale-105 transition-transform duration-200"
                            >
                              {challenge}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Character Examples Section */}
            {characterExamples.length > 0 && (
              <div className="pt-5 border-t border-white/30 space-y-4">
                <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 shadow-lg animate-pulse"></span>
                  Character Examples
                  <span className="text-xs text-gray-600 font-normal bg-white/40 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20">
                    (click card to shuffle all, click character to cycle)
                  </span>
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  {characterExamples.map((character, index) => {
                    const pool =
                      characterPoolsByMBTI[type]?.[character.franchise] || [];
                    const hasMultiple = pool.length > 1;
                    const colors = getFranchiseColors(character.franchise);

                    return (
                      <button
                        key={character.franchise}
                        onClick={() =>
                          hasMultiple &&
                          cycleCharacter(type, character.franchise)
                        }
                        className={cn(
                          "p-3 rounded-2xl text-left transition-all duration-300 border border-white/30 bg-white/40 backdrop-blur-md shadow-lg transform-gpu",
                          hasMultiple
                            ? "hover:scale-105 hover:shadow-xl hover:bg-white/50 cursor-pointer"
                            : "cursor-default",
                          "hover:-translate-y-0.5"
                        )}
                        disabled={!hasMultiple}
                        title={
                          hasMultiple
                            ? `Click to cycle through ${character.franchise} characters`
                            : character.name
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate flex items-center gap-1">
                              {character.name}
                              {hasMultiple && (
                                <span className="text-purple-500 opacity-70 animate-spin">
                                  ↻
                                </span>
                              )}
                            </p>
                            <p
                              className="text-xs font-medium mt-2 px-3 py-1 rounded-xl text-center backdrop-blur-sm border border-white/20 shadow-sm"
                              style={{
                                backgroundColor: `${colors.backgroundColor}40`,
                                color: colors.color,
                                borderColor: `${colors.backgroundColor}60`,
                              }}
                            >
                              {character.franchise}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Enhanced Expand/Collapse Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-2xl bg-gradient-to-r from-white/50 to-white/40 backdrop-blur-lg border border-white/30 hover:from-white/60 hover:to-white/50 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-lg transform-gpu"
                style={{ color: info.color }}
              >
                {isExpanded ? (
                  <>
                    <span>Show Less</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Explore Details</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    },
    (prevProps, nextProps) => {
      // Custom comparison function for React.memo
      // Check if character examples have actually changed (not just length)
      const characterExamplesChanged =
        prevProps.characterExamples.length !==
          nextProps.characterExamples.length ||
        prevProps.characterExamples.some(
          (char, index) =>
            char.name !== nextProps.characterExamples[index]?.name ||
            char.franchise !== nextProps.characterExamples[index]?.franchise
        );

      return (
        prevProps.type === nextProps.type &&
        prevProps.isUserType === nextProps.isUserType &&
        !characterExamplesChanged &&
        prevProps.img === nextProps.img
      );
    }
  );

EnhancedPersonalityCard.displayName = "EnhancedPersonalityCard";

// Types for the charts component
type ChartProps = {
  results: DecisionService.SimulationResult[];
  radarData: Record<string, any>[];
  archetypes: DecisionService.ArchetypeProfile[];
  mbtiDescriptions: Record<string, DecisionService.MBTIDescription>;
  inputs: DecisionService.Inputs;
  publicResult?: DecisionService.PublicOpinionResult | null;
  publicWeights: Record<DecisionService.FactorKey, number>;
};

type SliderInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: string) => void;
  info: DecisionService.FactorInfo;
};

// Clean Slider Input Component
const SliderInput: React.FC<SliderInputProps> = ({
  id,
  label,
  value,
  onChange,
  info,
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-800"
        >
          {info.label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-indigo-600 w-10 text-right tabular-nums">
            {(value * 100).toFixed(0)}%
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <button
                aria-label={`More information about ${info.label}`}
                className="text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-xs"
              >
                ⓘ
              </button>
            </PopoverTrigger>
            <PopoverContent
              id={`${id}-info`}
              className="max-w-xs rounded-xl p-4"
            >
              <p className="font-medium text-gray-900 text-sm mb-2">
                {info.description}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded-lg p-2">
                  <span className="font-medium text-gray-700">Low:</span>{" "}
                  <span className="text-gray-600">{info.lowDesc}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <span className="font-medium text-gray-700">High:</span>{" "}
                  <span className="text-gray-600">{info.highDesc}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Slider
        id={id}
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(_, v) =>
          onChange((Array.isArray(v) ? v[0] : v).toString())
        }
        aria-label={info.label}
        aria-describedby={`${id}-info`}
      />
    </div>
  );
};

// Optimized dynamic imports with better loading states
const Charts = dynamic(() => import("@/components/UserDecisionCharts"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-[#4455a6] text-sm font-medium">
          Loading visualization...
        </div>
      </div>
    </div>
  ),
});

// Enhanced Tabs Component
export const StyledTabs: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="w-full overflow-hidden">
    <style jsx>{`
      :global([data-state="active"]) {
        background-color: hsl(var(--primary) / 0.1) !important;
        color: hsl(var(--primary)) !important;
        font-weight: 600;
      }
    `}</style>
    {children}
  </div>
);

// Add type for MBTI keys
type MBTIType =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

// Houses Content Component
const HousesContent: React.FC<{
  results: DecisionService.SimulationResult[];
  mbtiDescriptions: Record<string, DecisionService.MBTIDescription>;
}> = ({ results, mbtiDescriptions }) => {
  const [hoveredHouse, setHoveredHouse] = useState<string | null>(null);

  const handleHouseMouseEnter = (house: string) => {
    setHoveredHouse(house);
  };

  const handleHouseMouseLeave = () => {
    setHoveredHouse(null);
  };

  // Generate data for house-based visualization
  const hogwartsHousesData = groupResultsByHogwartsHouses(results);

  return (
    <div className="space-y-6">
      <div className="mb-4 text-sm text-[#4455a6] font-medium bg-[#4455a6]/5 p-3 rounded-lg">
        The Hogwarts Sorting Hat has categorized MBTI personality types into
        four houses. See how each house approaches decisions differently based
        on their core traits.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {Object.values(hogwartsHousesData).map((house) => {
          // Find majority decision for this house
          const houseDecisions = Object.entries(house.decisions);
          const majorityDecision =
            houseDecisions.length > 0
              ? houseDecisions.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
              : "No decision";

          const isHighlighted = hoveredHouse === house.name;

          return (
            <div
              key={house.name}
              className={`p-4 rounded-xl shadow-sm transition-all duration-300 ${
                hoveredHouse && !isHighlighted ? "opacity-50" : "opacity-100"
              }`}
              style={{
                backgroundColor: `${house.color}15`,
                borderLeft: `4px solid ${house.color}`,
              }}
              onMouseEnter={() => handleHouseMouseEnter(house.name)}
              onMouseLeave={handleHouseMouseLeave}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: house.color }}
                ></div>
                <h3
                  className="font-bold text-lg"
                  style={{ color: house.color }}
                >
                  {house.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Personalities:</p>
                  <div className="flex flex-wrap gap-1">
                    {house.types.map((type) => (
                      <span
                        key={type}
                        className="text-xs font-medium px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: `${mbtiDescriptions[type].color}20`,
                          color: mbtiDescriptions[type].color,
                        }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Decisions:</p>
                  {Object.entries(house.decisions).map(([decision, count]) => {
                    const decisionColor =
                      decision === "Proceed Strategically"
                        ? "#4ade80"
                        : decision === "Request Clarification"
                        ? "#facc15"
                        : "#f87171";

                    return (
                      <div
                        key={decision}
                        className="flex items-center justify-between text-xs mb-1"
                      >
                        <span
                          style={{ color: decisionColor }}
                          className="font-medium"
                        >
                          {decision}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          {count}/{house.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">
                  Average Confidence:
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${house.averageScore * 100}%`,
                      backgroundColor: house.color,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>0%</span>
                  <span className="font-medium" style={{ color: house.color }}>
                    {(house.averageScore * 100).toFixed(1)}%
                  </span>
                  <span>100%</span>
                </div>
              </div>

              <div
                className="mt-4 p-3 rounded-lg"
                style={{ backgroundColor: `${house.color}10` }}
              >
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: house.color }}
                >
                  House Verdict: {majorityDecision}
                </p>
                <p className="text-xs text-gray-600">
                  {house.name === "Gryffindor" &&
                    "Bold and decisive, Gryffindors lean toward action over caution."}
                  {house.name === "Hufflepuff" &&
                    "Patient and methodical, Hufflepuffs seek balanced, fair solutions."}
                  {house.name === "Ravenclaw" &&
                    "Analytical and thoughtful, Ravenclaws base decisions on thorough evaluation."}
                  {house.name === "Slytherin" &&
                    "Strategic and ambitious, Slytherins evaluate both risks and opportunities carefully."}
                </p>
                <p className="text-[10px] italic text-gray-500 mt-1">
                  {hogwartsHouseInfo[house.name]?.quote}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: `${hogwartsHousesData.Gryffindor.color}15`,
          }}
        >
          <p
            className="font-medium mb-1"
            style={{ color: hogwartsHousesData.Gryffindor.color }}
          >
            Gryffindor Traits
          </p>
          <p className="text-xs text-gray-600">
            Brave, daring, chivalrous, determined, and bold
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            Characters: {hogwartsHouseInfo.Gryffindor.characters.join(", ")}
          </p>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: `${hogwartsHousesData.Hufflepuff.color}15`,
          }}
        >
          <p
            className="font-medium mb-1"
            style={{ color: hogwartsHousesData.Hufflepuff.color }}
          >
            Hufflepuff Traits
          </p>
          <p className="text-xs text-gray-600">
            Loyal, patient, fair, hard-working, and inclusive
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            Characters: {hogwartsHouseInfo.Hufflepuff.characters.join(", ")}
          </p>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: `${hogwartsHousesData.Ravenclaw.color}15`,
          }}
        >
          <p
            className="font-medium mb-1"
            style={{ color: hogwartsHousesData.Ravenclaw.color }}
          >
            Ravenclaw Traits
          </p>
          <p className="text-xs text-gray-600">
            Intelligent, wise, creative, analytical, and thoughtful
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            Characters: {hogwartsHouseInfo.Ravenclaw.characters.join(", ")}
          </p>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: `${hogwartsHousesData.Slytherin.color}15`,
          }}
        >
          <p
            className="font-medium mb-1"
            style={{ color: hogwartsHousesData.Slytherin.color }}
          >
            Slytherin Traits
          </p>
          <p className="text-xs text-gray-600">
            Ambitious, cunning, resourceful, strategic, and determined
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            Characters: {hogwartsHouseInfo.Slytherin.characters.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

// Office Content Component
const OfficeContent: React.FC<{
  results: DecisionService.SimulationResult[];
  mbtiDescriptions: Record<string, DecisionService.MBTIDescription>;
}> = ({ results, mbtiDescriptions }) => {
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(
    null
  );

  const handleDepartmentMouseEnter = (department: string) => {
    setHoveredDepartment(department);
  };

  const handleDepartmentMouseLeave = () => {
    setHoveredDepartment(null);
  };

  // Generate data for department-based visualization
  const officeDepartmentsData = groupResultsByOfficeDepartments(results);

  return (
    <div className="space-y-6">
      <div className="mb-4 text-sm text-[#007aff] font-medium bg-[#007aff]/5 p-3 rounded-lg">
        Welcome to Dunder Mifflin Scranton! See how different office departments
        approach decisions based on their workplace roles and team dynamics.
        That&apos;s what she said... about decision analysis!
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {Object.values(officeDepartmentsData)
          .filter((dept) => dept.count > 0)
          .map((department) => {
            // Find majority decision for this department
            const departmentDecisions = Object.entries(department.decisions);
            const majorityDecision =
              departmentDecisions.length > 0
                ? departmentDecisions.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
                : "No decision";

            const isHighlighted = hoveredDepartment === department.name;

            return (
              <div
                key={department.name}
                className={`p-4 rounded-xl shadow-sm transition-all duration-300 ${
                  hoveredDepartment && !isHighlighted
                    ? "opacity-50"
                    : "opacity-100"
                }`}
                style={{
                  backgroundColor: `${department.color}15`,
                  borderLeft: `4px solid ${department.color}`,
                }}
                onMouseEnter={() => handleDepartmentMouseEnter(department.name)}
                onMouseLeave={handleDepartmentMouseLeave}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: department.color }}
                  ></div>
                  <h3
                    className="font-bold text-lg"
                    style={{ color: department.color }}
                  >
                    {department.name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Personalities:</p>
                    <div className="flex flex-wrap gap-1">
                      {department.types.map((type) => (
                        <span
                          key={type}
                          className="text-xs font-medium px-2 py-1 rounded-md"
                          style={{
                            backgroundColor: `${mbtiDescriptions[type].color}20`,
                            color: mbtiDescriptions[type].color,
                          }}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Characters: {department.characters.join(", ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Decisions:</p>
                    {Object.entries(department.decisions).map(
                      ([decision, count]) => {
                        const decisionColor =
                          decision === "Proceed Strategically"
                            ? "#4ade80"
                            : decision === "Request Clarification"
                            ? "#facc15"
                            : "#f87171";

                        return (
                          <div
                            key={decision}
                            className="flex items-center justify-between text-xs mb-1"
                          >
                            <span
                              style={{ color: decisionColor }}
                              className="font-medium"
                            >
                              {decision}
                            </span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded">
                              {count}/{department.count}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Average Confidence:
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${department.averageScore * 100}%`,
                        backgroundColor: department.color,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>0%</span>
                    <span
                      className="font-medium"
                      style={{ color: department.color }}
                    >
                      {(department.averageScore * 100).toFixed(1)}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>

                <div
                  className="mt-4 p-3 rounded-lg"
                  style={{ backgroundColor: `${department.color}10` }}
                >
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: department.color }}
                  >
                    Department Verdict: {majorityDecision}
                  </p>
                  <p className="text-xs text-gray-600">
                    {officeDepartmentInfo[department.name]?.description}
                  </p>
                  <p className="text-[10px] italic text-gray-500 mt-1">
                    &quot;{officeDepartmentInfo[department.name]?.motto}&quot;
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {/* Department Comparison Chart */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-bold text-[#007aff] mb-3">
          Department Decision Comparison
        </h3>

        <div className="space-y-4">
          {[
            "Proceed Strategically",
            "Request Clarification",
            "Delay or Disengage",
          ].map((decision) => {
            const decisionColor =
              decision === "Proceed Strategically"
                ? "#4ade80"
                : decision === "Request Clarification"
                ? "#facc15"
                : "#f87171";

            return (
              <div key={decision} className="space-y-2">
                <h4
                  className="font-medium text-sm"
                  style={{ color: decisionColor }}
                >
                  {decision}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.values(officeDepartmentsData)
                    .filter((dept) => dept.count > 0)
                    .map((department) => {
                      const count = department.decisions[decision] || 0;
                      const percentage =
                        department.count > 0
                          ? (count / department.count) * 100
                          : 0;

                      return (
                        <div
                          key={department.name}
                          className="flex items-center justify-between p-2 rounded"
                          style={{ backgroundColor: `${department.color}10` }}
                        >
                          <span
                            className="text-xs font-medium"
                            style={{ color: department.color }}
                          >
                            {department.name}
                          </span>
                          <span className="text-xs font-mono">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department Traits Section */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
        {Object.entries(officeDepartmentInfo).map(([deptName, info]) => {
          const deptData = officeDepartmentsData[deptName];
          if (!deptData || deptData.count === 0) return null;

          return (
            <div
              key={deptName}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: `${deptData.color}15`,
              }}
            >
              <p className="font-medium mb-1" style={{ color: deptData.color }}>
                {deptName} Characteristics
              </p>
              <p className="text-xs text-gray-600 mb-2">
                {info.characteristics.join(", ")}
              </p>
              <p className="text-[10px] text-gray-500 italic">
                &quot;{info.motto}&quot;
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function UserDecisionDashboard() {
  const [mounted, setMounted] = useState(false);

  // Performance monitoring and adaptive settings
  const {
    performanceLevel,
    shouldReduceAnimations,
    shouldReduceEffects,
    getAnimationDuration,
  } = useAdaptivePerformance();
  const mbtiTypes: MBTIType[] = DecisionService.archetypes.map(
    (a) => a.name as MBTIType
  );
  const [userMBTI, setUserMBTI] = useState<MBTIType>(mbtiTypes[0]);
  const [inputs, setInputs] = useState<DecisionService.Inputs>(
    DecisionService.defaultInputs
  );
  const [results, setResults] = useState<DecisionService.SimulationResult[]>(
    []
  );
  const [publicResult, setPublicResult] =
    useState<DecisionService.PublicOpinionResult | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("scenarios");
  const [mbtiSubTab, setMbtiSubTab] = useState("descriptions");
  const [resultsSubTab, setResultsSubTab] = useState("analysis");

  // Character cycling state - tracks current index for each MBTI type and franchise
  const [characterIndices, setCharacterIndices] = useState<
    Record<string, Record<string, number>>
  >(() => {
    const initialIndices: Record<string, Record<string, number>> = {};
    mbtiTypes.forEach((mbtiType) => {
      initialIndices[mbtiType] = {};
      franchiseCategories.forEach((franchise) => {
        initialIndices[mbtiType][franchise] = 0;
      });
    });
    return initialIndices;
  });

  // Optimized function to cycle to next character in a franchise for a specific MBTI type
  const cycleCharacter = useCallback((mbtiType: string, franchise: string) => {
    setCharacterIndices((prev) => {
      const pool = characterPoolsByMBTI[mbtiType]?.[franchise] || [];
      if (pool.length <= 1) return prev; // No cycling needed if only one character

      const currentIndex = prev[mbtiType]?.[franchise] || 0;
      const nextIndex = (currentIndex + 1) % pool.length;

      // Only update if there's actually a change
      if (prev[mbtiType]?.[franchise] === nextIndex) return prev;

      return {
        ...prev,
        [mbtiType]: {
          ...prev[mbtiType],
          [franchise]: nextIndex,
        },
      };
    });
  }, []);

  // Optimized function to shuffle all characters for a specific MBTI type
  const shuffleAllCharacters = useCallback((mbtiType: string) => {
    setCharacterIndices((prev) => {
      const currentIndices = prev[mbtiType] || {};
      const newIndices: Record<string, number> = {};
      let hasChanges = false;

      // Shuffle each franchise's character index
      franchiseCategories.forEach((franchise) => {
        const pool = characterPoolsByMBTI[mbtiType]?.[franchise] || [];
        if (pool.length > 1) {
          // Generate a random index different from the current one
          const currentIndex = currentIndices[franchise] || 0;
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * pool.length);
          } while (newIndex === currentIndex && pool.length > 1);
          newIndices[franchise] = newIndex;
          if (newIndex !== currentIndex) hasChanges = true;
        } else {
          newIndices[franchise] = currentIndices[franchise] || 0;
        }
      });

      // Only update state if there are actual changes
      if (!hasChanges) return prev;

      return {
        ...prev,
        [mbtiType]: newIndices,
      };
    });
  }, []);

  // Random famous person for each MBTI type, generated once per mount
  const famousPeopleMap = useMemo(() => {
    const map: Record<string, string> = {};
    mbtiTypes.forEach((t) => {
      map[t] = getRandomFamousPerson(t);
    });
    return map;
  }, [mbtiTypes]);

  // Memoized helper function to get current character for display
  const getCurrentCharacterForFranchise = useCallback(
    (
      mbtiType: string,
      franchise: string,
      characterIndices: Record<string, Record<string, number>>
    ): { name: string; franchise: string } => {
      const pool = characterPoolsByMBTI[mbtiType]?.[franchise] || [];
      if (pool.length === 0) return { name: "Unknown", franchise };

      const currentIndex = characterIndices[mbtiType]?.[franchise] || 0;
      const characterName = pool[currentIndex % pool.length];

      return { name: characterName, franchise };
    },
    []
  );

  // Memoized helper function to get all current characters for an MBTI type
  const getCurrentCharactersForMBTI = useCallback(
    (
      mbtiType: string,
      characterIndices: Record<string, Record<string, number>>
    ): Array<{ name: string; franchise: string }> => {
      return franchiseCategories.map((franchise) =>
        getCurrentCharacterForFranchise(mbtiType, franchise, characterIndices)
      );
    },
    [getCurrentCharacterForFranchise]
  );

  // Memoized MBTI image generation
  const getMBTIImage = useMemo(() => {
    const imageCache: Record<string, string> = {};
    return (mbtiType: string): string => {
      if (!imageCache[mbtiType]) {
        const seed = mbtiImageSeeds[mbtiType] || mbtiType.toLowerCase();
        imageCache[mbtiType] = `https://picsum.photos/seed/${seed}/100/100`;
      }
      return imageCache[mbtiType];
    };
  }, []);

  // Memoized helper function to get franchise colors
  const getFranchiseColors = useCallback(
    (franchise: string): { backgroundColor: string; color: string } => {
      switch (franchise) {
        case "The Office":
          return { backgroundColor: "#e3f2fd", color: "#1976d2" };
        case "Harry Potter":
          return { backgroundColor: "#f3e5f5", color: "#7b1fa2" };
        case "Marvel":
          return { backgroundColor: "#ffebee", color: "#c62828" };
        case "DC":
          return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
        default:
          return { backgroundColor: "#f5f5f5", color: "#666666" };
      }
    },
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoized preview calculation to prevent unnecessary recalculations
  const preview = useMemo(() => {
    const previewResults = DecisionService.calculateResults(inputs);
    const { decision, color } =
      DecisionService.calculateMajorityDecision(previewResults);
    return { decision, color };
  }, [inputs]);

  // Format radar data
  const radarData = DecisionService.formatRadarData();

  // Optimized simulation handler with memoized calculations
  const handleSimulate = useCallback(() => {
    // Calculate results for personality types
    const newResults = DecisionService.calculateResults(inputs);

    // Calculate public opinion
    const publicOpinion = DecisionService.calculatePublicOpinion(inputs);

    setResults(newResults);
    setPublicResult(publicOpinion);

    // Switch to results tab after simulation
    setActiveTab("results");
  }, [inputs]);

  // Optimized reset handler
  const handleReset = useCallback(() => {
    setInputs(DecisionService.defaultInputs);
    setResults([]);
    setPublicResult(null);
    setActivePreset(null);
  }, []);

  // Optimized input change handler with immediate UI update and debounced calculation
  const handleInputChange = useCallback(
    (key: DecisionService.FactorKey, value: string) => {
      const numericValue = parseFloat(value);

      // Immediate UI update for responsiveness
      setInputs((prev) => ({ ...prev, [key]: numericValue }));

      // Clear active preset when manually adjusting inputs
      if (activePreset) {
        setActivePreset(null);
      }
    },
    [activePreset]
  );

  const applyPreset = useCallback(
    (presetName: keyof typeof DecisionService.presetScenarios) => {
      setInputs(DecisionService.presetScenarios[presetName]);
      setActivePreset(presetName);
      setActiveTab("factors");
    },
    []
  );

  // Compute majority decision from simulation results
  const majorityDecisionData =
    results.length > 0
      ? DecisionService.calculateMajorityDecision(results)
      : { decision: "", color: "", counts: {} };

  const userResult = results.find((r) => r.name === userMBTI);

  const {
    decision: majorityDecision,
    color: majorityColor,
    counts: decisionCounts,
  } = majorityDecisionData;

  const decisionBreakdown = useMemo(() => {
    return Object.entries(decisionCounts)
      .map(([decision, count]) => ({
        decision,
        count,
        percentage: (count / results.length) * 100,
        color: results.find((r) => r.decision === decision)?.color || "#94a3b8",
      }))
      .sort((a, b) => b.count - a.count);
  }, [decisionCounts, results]);

  return (
    <div className="min-h-screen safe-area-inset-bottom px-4 py-6">
      {/* Main card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Header Section */}
        <header className="px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl flex-shrink-0">
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">MBTI Brain</h1>
              <p className="text-sm text-gray-500">
                See how personality types approach decisions
              </p>
            </div>
          </div>

          {/* User type selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="user-mbti"
              className="text-sm font-medium text-gray-600 whitespace-nowrap"
            >
              Your type:
            </label>
            <Select
              value={userMBTI}
              onValueChange={(v) => setUserMBTI(v as MBTIType)}
            >
              <SelectTrigger
                id="user-mbti"
                className="w-28 bg-white border-gray-200 text-gray-900 text-sm h-9"
              >
                <SelectValue aria-label={userMBTI}>{userMBTI}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {mbtiTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Navigation Tabs */}
            <div className="border-b border-gray-100 px-2">
              <TabsList className="grid w-full grid-cols-4 h-11 bg-transparent p-0 rounded-none">
                <TabsTrigger
                  value="scenarios"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 font-medium transition-colors h-full"
                >
                  <div className="flex items-center gap-1.5">
                    <MdOutlineAssessment className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Scenarios</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="factors"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 font-medium transition-colors h-full"
                >
                  <div className="flex items-center gap-1.5">
                    <MdFactCheck className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Factors</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 font-medium transition-colors h-full"
                >
                  <div className="flex items-center gap-1.5">
                    <IoMdAnalytics className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Results</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="personalities"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 font-medium transition-colors h-full"
                >
                  <div className="flex items-center gap-1.5">
                    <MdPsychology className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Types</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="p-5 sm:p-6">
              {/* Scenarios Tab */}
              <TabsContent value="scenarios" className="space-y-6">
                <div className="space-y-6">
                  {Object.entries(DecisionService.presetCategories).map(
                    ([category, scenarios]) => (
                      <div key={category}>
                        <h2 className="text-base font-semibold text-gray-900 mb-0.5">
                          {category}
                        </h2>
                        <p className="text-sm text-gray-500 mb-3">
                          {
                            DecisionService.presetCategoryDescriptions[
                              category as keyof typeof DecisionService.presetCategoryDescriptions
                            ]
                          }
                        </p>
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3">
                          {scenarios.map((scenario) => {
                            const isActive = scenario === activePreset;
                            return (
                              <Card
                                key={scenario}
                                className={cn(
                                  "cursor-pointer transition-all duration-150 hover:shadow-sm",
                                  isActive
                                    ? "border-indigo-400 bg-indigo-50 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                                onClick={() => {
                                  applyPreset(
                                    scenario as keyof typeof DecisionService.presetScenarios
                                  );
                                }}
                              >
                                <CardContent className="p-4">
                                  <h3 className="font-medium text-gray-900 text-sm">
                                    {scenario}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    {
                                      DecisionService.presetDescriptions[
                                        scenario as keyof typeof DecisionService.presetDescriptions
                                      ]
                                    }
                                  </p>
                                  {isActive && (
                                    <div className="mt-2.5 flex items-center gap-1 text-xs font-medium text-indigo-600">
                                      <FaCheck className="h-3 w-3" />
                                      Selected
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </TabsContent>

              {/* Factors Tab */}
              <TabsContent value="factors" className="space-y-5">
                {activePreset && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FaCheck className="h-3.5 w-3.5 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-900">
                          Preset: {activePreset}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-700/70 mt-0.5 ml-5">
                        Adjust any slider to customize.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-indigo-300 text-indigo-700 hover:bg-indigo-100 rounded-lg h-8 px-3"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </div>
                )}

                {preview.decision && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Likely outcome:</span>
                    <span
                      className="text-sm font-medium px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: preview.color }}
                    >
                      {preview.decision}
                    </span>
                  </div>
                )}

                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-0.5">
                    Decision Factors
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Adjust six cognitive dimensions that shape how personality types approach decisions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.keys(inputs).map((key) => (
                      <SliderInput
                        key={key}
                        id={key}
                        label={key}
                        value={inputs[key as DecisionService.FactorKey]}
                        onChange={(value) =>
                          handleInputChange(
                            key as DecisionService.FactorKey,
                            value
                          )
                        }
                        info={
                          DecisionService.factorInfo[
                            key as DecisionService.FactorKey
                          ]
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <Button
                    onClick={handleSimulate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-10 rounded-xl font-medium text-sm shadow-sm transition-colors"
                  >
                    Run Simulation
                  </Button>
                </div>
              </TabsContent>

              {/* Results Tab */}
              <TabsContent value="results" className="space-y-5">
                {results.length > 0 ? (
                  <Tabs
                    value={resultsSubTab}
                    onValueChange={setResultsSubTab}
                    className="w-full space-y-4"
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl h-auto">
                      <TabsTrigger
                        value="analysis"
                        className="rounded-lg py-1.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 data-[state=active]:font-medium text-gray-600"
                      >
                        Analysis
                      </TabsTrigger>
                      <TabsTrigger
                        value="office"
                        className="rounded-lg py-1.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 data-[state=active]:font-medium text-gray-600"
                      >
                        Office
                      </TabsTrigger>
                      <TabsTrigger
                        value="houses"
                        className="rounded-lg py-1.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 data-[state=active]:font-medium text-gray-600"
                      >
                        Houses
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="analysis" className="space-y-5">
                      {/* Summary card */}
                      <div className="bg-indigo-600 text-white p-5 rounded-2xl">
                        <h2 className="text-lg font-semibold mb-4">Decision Summary</h2>
                        <div className="space-y-2 text-sm mb-4">
                          {userResult && (
                            <div className="flex items-center gap-2">
                              <span className="text-indigo-200">Your type ({userMBTI}):</span>
                              <span
                                className="px-2.5 py-0.5 rounded-full text-white text-xs font-medium"
                                style={{ backgroundColor: userResult.color }}
                              >
                                {userResult.decision}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-indigo-200">Most common:</span>
                            <span
                              className="px-2.5 py-0.5 rounded-full text-white text-xs font-medium"
                              style={{ backgroundColor: majorityColor }}
                            >
                              {majorityDecision || "N/A"}
                            </span>
                            {majorityDecision && (
                              <span className="text-indigo-300 text-xs">
                                ({((decisionCounts[majorityDecision] / results.length) * 100).toFixed(1)}%)
                              </span>
                            )}
                          </div>
                          {publicResult && (
                            <div className="flex items-center gap-2">
                              <span className="text-indigo-200">Public opinion:</span>
                              <span
                                className="px-2.5 py-0.5 rounded-full text-white text-xs font-medium"
                                style={{ backgroundColor: publicResult.color }}
                              >
                                {publicResult.mostLikely}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
                          {decisionBreakdown.map(({ decision, count, percentage, color }, index) => (
                            <div
                              key={decision}
                              className="bg-white/10 rounded-xl p-3 relative overflow-hidden"
                            >
                              <div className="flex items-start justify-between mb-1">
                                <span className="text-sm font-medium text-white/90">{decision}</span>
                                {index === 0 && (
                                  <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">#1</span>
                                )}
                              </div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-bold">{count}</span>
                                <span className="text-xs text-white/60">types · {percentage.toFixed(0)}%</span>
                              </div>
                              {index < 2 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {results.filter(r => r.decision === decision).map(r => (
                                    <span key={r.name} className="text-[10px] bg-white/15 px-1.5 py-0.5 rounded-full">{r.name}</span>
                                  ))}
                                </div>
                              )}
                              <div
                                className="absolute bottom-0 left-0 h-0.5 transition-all duration-500"
                                style={{ width: `${percentage}%`, backgroundColor: color }}
                              />
                            </div>
                          ))}
                          {publicResult && (
                            <div className="bg-white/10 rounded-xl p-3">
                              <span className="text-sm font-medium text-white/90 block mb-1">Public Opinion</span>
                              <span className="text-2xl font-bold">{publicResult.mostLikely}</span>
                              <div className="text-xs text-white/60 mt-0.5">Consensus View</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Charts */}
                      <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Detailed Breakdown</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          How different MBTI types approach this decision
                        </p>
                        <div className="w-full max-w-full overflow-hidden">
                          <Charts
                            results={results}
                            radarData={radarData}
                            archetypes={DecisionService.archetypes}
                            mbtiDescriptions={DecisionService.mbtiDescriptions}
                            inputs={inputs}
                            publicResult={publicResult}
                            publicWeights={DecisionService.publicOpinionWeights}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="office" className="space-y-4">
                      <OfficeContent
                        results={results}
                        mbtiDescriptions={DecisionService.mbtiDescriptions}
                      />
                    </TabsContent>
                    <TabsContent value="houses" className="space-y-4">
                      <HousesContent
                        results={results}
                        mbtiDescriptions={DecisionService.mbtiDescriptions}
                      />
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BsFileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-900">No results yet</p>
                    <p className="text-sm text-gray-500 mt-1 mb-5">
                      Choose a scenario and run the simulation
                    </p>
                    <Button
                      onClick={() => setActiveTab("factors")}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-5 h-9 text-sm"
                    >
                      Go to Factors
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Personalities Tab */}
              <TabsContent value="personalities">
                <PerformanceOptimizedTypesTab
                  userMBTI={userMBTI}
                  characterIndices={characterIndices}
                  characterPoolsByMBTI={characterPoolsByMBTI}
                  cycleCharacter={cycleCharacter}
                  shuffleAllCharacters={shuffleAllCharacters}
                  getFranchiseColors={getFranchiseColors}
                  getCurrentCharactersForMBTI={getCurrentCharactersForMBTI}
                  getMBTIImage={getMBTIImage}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      <EnhancedPerformanceMonitor
        enabled={process.env.NODE_ENV === "development"}
        showDetails={true}
        onPerformanceIssue={(issue, metrics) => {
          console.warn("Performance issue:", issue, metrics);
        }}
      />
    </div>
  );
}
