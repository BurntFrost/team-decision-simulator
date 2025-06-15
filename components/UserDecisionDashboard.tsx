"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { GlassContainer } from "@/components/ui/glass-container";
import { LiquidBackground } from "@/components/ui/liquid-background";
import dynamic from "next/dynamic";
import Image from "next/image";
import { cn } from "@/lib/utils";
import * as DecisionService from "@/lib/decisionMatrixService";
import { Slider } from "@/components/ui/slider";
import MBTI3DWrapper from "@/components/MBTI3DWrapper";
import { useDebounce } from "@/lib/hooks/useDebounce";
// Import react-icons
import { FaBrain, FaCheck } from "react-icons/fa";
import { BsFileText, BsClockFill, BsGeoAlt } from "react-icons/bs";
import { IoMdAnalytics } from "react-icons/io";
import {
  MdOutlineAssessment,
  MdFactCheck,
  MdPsychology,
} from "react-icons/md";
// Import Lucide icons for enhanced brain options
import { Brain, Zap } from "lucide-react";

// Enhanced Brain Icon Component with multiple visual options
interface EnhancedBrainIconProps {
  variant?: 'gradient' | 'animated' | 'glow' | 'pulse' | 'modern' | 'premium' | 'liquid' | 'neural';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  neuralActivity?: boolean;
}

const EnhancedBrainIcon: React.FC<EnhancedBrainIconProps> = ({
  variant = 'gradient',
  size = 'md',
  className = '',
  onClick,
  interactive = false,
  neuralActivity = false
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [pulseIntensity, setPulseIntensity] = React.useState(1);

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
    '2xl': 'h-12 w-12',
    '3xl': 'h-16 w-16'
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
    case 'gradient':
      return (
        <div
          className={`relative ${onClick ? 'cursor-pointer' : ''} group`}
          onClick={handleClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? 'Brain icon button' : 'Brain icon'}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Brain className={`${baseClasses} text-white relative z-10 drop-shadow-lg group-hover:scale-110 group-hover:rotate-3`} />
        </div>
      );

    case 'animated':
      return (
        <div
          className={`relative ${onClick ? 'cursor-pointer' : ''} group`}
          onClick={handleClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? 'Brain icon button' : 'Brain icon'}
        >
          <Brain className={`${baseClasses} text-white animate-pulse group-hover:animate-bounce drop-shadow-lg`} />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping group-hover:bg-blue-400"></div>
        </div>
      );

    case 'glow':
      return (
        <div
          className={`relative ${onClick ? 'cursor-pointer' : ''} group`}
          onClick={handleClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? 'Brain icon button' : 'Brain icon'}
        >
          <div className="absolute inset-0 bg-white rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300 animate-pulse"></div>
          <Brain className={`${baseClasses} text-white relative z-10 drop-shadow-2xl group-hover:scale-105`} />
        </div>
      );

    case 'pulse':
      return (
        <div
          className={`relative ${onClick ? 'cursor-pointer' : ''} group`}
          onClick={handleClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? 'Brain icon button' : 'Brain icon'}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 bg-white/10 rounded-full animate-ping animation-delay-75"></div>
          <Brain className={`${baseClasses} text-white relative z-10 group-hover:scale-110 drop-shadow-lg`} />
        </div>
      );

    case 'modern':
      return (
        <div
          className={`relative ${onClick ? 'cursor-pointer' : ''} group`}
          onClick={handleClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? 'Brain icon button' : 'Brain icon'}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
          <div className="relative z-10 p-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 group-hover:bg-white/20 transition-all duration-300">
            <Brain className={`${baseClasses} text-white group-hover:scale-105`} />
          </div>
          <Zap className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      );

    case 'premium':
      return (
        <div
          className={`relative ${onClick ? 'cursor-pointer' : ''} group`}
          onClick={handleClick}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? 'Brain icon button' : 'Brain icon'}
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
            <Brain className={`${baseClasses} text-white drop-shadow-2xl group-hover:scale-110 group-hover:rotate-2 transition-all duration-300 filter brightness-125`} />
          </div>

          {/* Enhanced sparkle effects on hover */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 motion-safe:group-hover:animate-ping transition-opacity duration-300"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-200 rounded-full opacity-0 group-hover:opacity-80 motion-safe:group-hover:animate-ping motion-safe:[animation-delay:0.3s] transition-opacity duration-300"></div>
        </div>
      );

    case 'liquid':
      return (
        <div
          className={`relative ${onClick ? 'cursor-pointer' : ''} group`}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? 'Brain icon button' : 'Brain icon'}
        >
          {/* Liquid glass container */}
          <div className="relative p-2 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl group-hover:shadow-4xl transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-1">
            {/* Liquid morphing background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-500/30 to-cyan-400/30 rounded-2xl blur-sm opacity-60 group-hover:opacity-90 transition-opacity duration-500 animate-liquid-flow"></div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-glass-shimmer rounded-2xl"></div>

            {/* Brain icon */}
            <Brain
              className={`${baseClasses} text-white relative z-10 drop-shadow-2xl group-hover:scale-105 group-hover:rotate-1`}
              style={{
                filter: `brightness(${1 + (isHovered ? 0.3 : 0)}) saturate(${1 + (isHovered ? 0.2 : 0)})`,
                transform: `scale(${pulseIntensity})`,
              }}
            />

            {/* Neural activity indicators */}
            {neuralActivity && (
              <>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-neural-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-400 rounded-full animate-neural-pulse animation-delay-150"></div>
                <div className="absolute top-1 -left-1 w-1 h-1 bg-cyan-400 rounded-full animate-neural-pulse animation-delay-300"></div>
              </>
            )}
          </div>
        </div>
      );

    case 'neural':
      return (
        <div
          className={`relative ${onClick ? 'cursor-pointer' : ''} group`}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={onClick ? 'Brain icon button' : 'Brain icon'}
        >
          {/* Neural network background */}
          <div className="absolute -inset-6 opacity-40 group-hover:opacity-70 transition-opacity duration-500">
            {/* Neural connections */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
          <div className="relative p-1 bg-gradient-to-br from-white/15 via-white/10 to-white/8 backdrop-blur-lg border border-white/25 rounded-xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
            <Brain
              className={`${baseClasses} text-white relative z-10 drop-shadow-lg group-hover:brightness-125`}
              style={{
                filter: `hue-rotate(${isHovered ? '10deg' : '0deg'}) saturate(${1 + (pulseIntensity - 1) * 0.5})`,
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
  <div role="list" aria-label="Progress" className={cn("flex w-full", className)}>
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

// Mapping of MBTI types to famous people examples
const famousPeopleByMBTI: Record<string, string[]> = {
  INTJ: [
    "Elon Musk",
    "Mark Zuckerberg",
    "Stephen Hawking",
    "Nikola Tesla",
    "Michelle Obama",
  ],
  ENTJ: [
    "Steve Jobs",
    "Margaret Thatcher",
    "Jack Welch",
    "Gordon Ramsay",
    "Jim Carrey",
  ],
  INTP: [
    "Albert Einstein",
    "Larry Page",
    "Bill Gates",
    "Isaac Newton",
    "Marie Curie",
  ],
  ENTP: [
    "Leonardo da Vinci",
    "Richard Feynman",
    "Barack Obama",
    "Thomas Edison",
    "Celine Dion",
  ],
  INFJ: [
    "Martin Luther King Jr.",
    "Nelson Mandela",
    "Mahatma Gandhi",
    "Taylor Swift",
    "Plato",
  ],
  ENFJ: [
    "Oprah Winfrey",
    "Barack Obama",
    "Jennifer Lawrence",
    "Maya Angelou",
    "Neil deGrasse Tyson",
  ],
  INFP: [
    "J.R.R. Tolkien",
    "William Shakespeare",
    "Johnny Depp",
    "Princess Diana",
    "Bob Dylan",
  ],
  ENFP: [
    "Robin Williams",
    "Walt Disney",
    "Robert Downey Jr.",
    "Ellen DeGeneres",
    "Mark Twain",
  ],
  ISTJ: [
    "Jeff Bezos",
    "Queen Elizabeth II",
    "Warren Buffett",
    "George Washington",
    "Hermione Granger",
  ],
  ESTJ: [
    "Henry Ford",
    "Sheryl Sandberg",
    "Martha Stewart",
    "John D. Rockefeller",
    "Sonia Sotomayor",
  ],
  ISFJ: [
    "Mother Teresa",
    "Kate Middleton",
    "Beyoncé",
    "Rosa Parks",
    "Dr. Fauci",
  ],
  ESFJ: [
    "Taylor Swift",
    "Jennifer Garner",
    "Bill Clinton",
    "Hugh Jackman",
    "Steve Harvey",
  ],
  ISTP: [
    "Michael Jordan",
    "Tom Cruise",
    "Clint Eastwood",
    "Amelia Earhart",
    "Erwin Rommel",
  ],
  ESTP: [
    "Donald Trump",
    "Ernest Hemingway",
    "Madonna",
    "Eddie Murphy",
    "Winston Churchill",
  ],
  ISFP: [
    "Michael Jackson",
    "Frida Kahlo",
    "Keanu Reeves",
    "David Bowie",
    "Marilyn Monroe",
  ],
  ESFP: [
    "Adele",
    'Dwayne "The Rock" Johnson',
    "Jamie Foxx",
    "Miley Cyrus",
    "Elvis Presley",
  ],
};

// Mapping of MBTI types to characters from The Office
const officeCharactersByMBTI: Record<string, string[]> = {
  INTJ: ["Oscar Martinez"],
  ENTJ: ["Jan Levinson"],
  INTP: ["Gabe Lewis"],
  ENTP: ["Jim Halpert"],
  INFJ: ["Toby Flenderson"],
  ENFJ: ["Andy Bernard"],
  INFP: ["Erin Hannon"],
  ENFP: ["Michael Scott"],
  ISTJ: ["Dwight Schrute"],
  ESTJ: ["Angela Martin"],
  ISFJ: ["Pam Beesly"],
  ESFJ: ["Phyllis Vance"],
  ISTP: ["Stanley Hudson"],
  ESTP: ["Todd Packer"],
  ISFP: ["Holly Flax"],
  ESFP: ["Kelly Kapoor"],
};

// Mapping of MBTI types to characters from Harry Potter
const harryPotterCharactersByMBTI: Record<string, string[]> = {
  INTJ: ["Severus Snape", "Tom Riddle"],
  ENTJ: ["Hermione Granger", "McGonagall"],
  INTP: ["Luna Lovegood", "Newt Scamander"],
  ENTP: ["Fred Weasley", "George Weasley"],
  INFJ: ["Dumbledore", "Remus Lupin"],
  ENFJ: ["Harry Potter", "Molly Weasley"],
  INFP: ["Dobby", "Neville Longbottom"],
  ENFP: ["Ron Weasley", "Tonks"],
  ISTJ: ["Percy Weasley", "Barty Crouch Sr."],
  ESTJ: ["Dolores Umbridge", "Vernon Dursley"],
  ISFJ: ["Hagrid", "Mrs. Weasley"],
  ESFJ: ["Cedric Diggory", "Fleur Delacour"],
  ISTP: ["Sirius Black", "Mad-Eye Moody"],
  ESTP: ["Draco Malfoy", "Gilderoy Lockhart"],
  ISFP: ["Cho Chang", "Lavender Brown"],
  ESFP: ["Peeves", "Rita Skeeter"],
};

// Character pools organized by franchise for cycling functionality
const characterPoolsByMBTI: Record<string, Record<string, string[]>> = {
  INTJ: {
    "The Office": ["Oscar Martinez", "Toby Flenderson"],
    "Harry Potter": ["Severus Snape", "Professor McGonagall", "Hermione Granger"],
    "Marvel": ["Doctor Strange", "Vision", "Tony Stark", "Doctor Doom", "Thanos", "Ultron"],
    "DC": ["Batman", "Martian Manhunter", "Cyborg", "Lex Luthor", "Brainiac", "The Riddler"]
  },
  ENTJ: {
    "The Office": ["Jan Levinson", "Charles Miner"],
    "Harry Potter": ["Hermione Granger", "Dolores Umbridge", "Voldemort"],
    "Marvel": ["Nick Fury", "Captain America", "Carol Danvers", "Magneto", "Kingpin", "Norman Osborn"],
    "DC": ["Wonder Woman", "Amanda Waller", "Ra's al Ghul", "Darkseid", "General Zod", "Lex Luthor"]
  },
  INTP: {
    "The Office": ["Gabe Lewis", "Ryan Howard"],
    "Harry Potter": ["Luna Lovegood", "Xenophilius Lovegood", "Ollivander"],
    "Marvel": ["Tony Stark", "Bruce Banner", "Reed Richards", "Green Goblin", "Ultron", "Doctor Octopus"],
    "DC": ["Mr. Terrific", "Cyborg", "The Atom", "The Riddler", "Scarecrow", "Calculator"]
  },
  ENTP: {
    "The Office": ["Jim Halpert", "Todd Packer"],
    "Harry Potter": ["Fred Weasley", "George Weasley", "Gilderoy Lockhart"],
    "Marvel": ["Spider-Man", "Deadpool", "Star-Lord", "Loki", "Mysterio", "Green Goblin"],
    "DC": ["The Flash", "Green Lantern", "Booster Gold", "The Joker", "Trickster", "Captain Cold"]
  },
  INFJ: {
    "The Office": ["Toby Flenderson", "Karen Filippelli"],
    "Harry Potter": ["Dumbledore", "Remus Lupin", "Newt Scamander"],
    "Marvel": ["Professor X", "Daredevil", "Vision", "Mystique", "Silver Surfer", "Magneto"],
    "DC": ["Superman", "Raven", "Martian Manhunter", "Two-Face", "Poison Ivy", "Mr. Freeze"]
  },
  ENFJ: {
    "The Office": ["Andy Bernard", "Holly Flax"],
    "Harry Potter": ["Harry Potter", "Molly Weasley", "Minerva McGonagall"],
    "Marvel": ["Captain Marvel", "Storm", "Captain America", "Emma Frost", "Venom", "Loki"],
    "DC": ["Aquaman", "Starfire", "Wonder Woman", "Catwoman", "Black Manta", "Talia al Ghul"]
  },
  INFP: {
    "The Office": ["Erin Hannon", "Pam Beesly"],
    "Harry Potter": ["Dobby", "Luna Lovegood", "Neville Longbottom"],
    "Marvel": ["Wanda Maximoff", "Peter Parker", "Groot", "Bucky Barnes", "Gambit", "Rogue"],
    "DC": ["Beast Boy", "Shazam", "Zatanna", "Harley Quinn", "Mr. Freeze", "Clayface"]
  },
  ENFP: {
    "The Office": ["Michael Scott", "Kelly Kapoor"],
    "Harry Potter": ["Ron Weasley", "Tonks", "Hagrid"],
    "Marvel": ["Star-Lord", "Ant-Man", "Human Torch", "Rocket Raccoon", "Carnage", "Deadpool"],
    "DC": ["Booster Gold", "Plastic Man", "The Flash", "Captain Cold", "Clayface", "Trickster"]
  },
  ISTJ: {
    "The Office": ["Dwight Schrute", "Oscar Martinez"],
    "Harry Potter": ["Percy Weasley", "Barty Crouch Sr.", "Kingsley Shacklebolt"],
    "Marvel": ["Captain America", "Hawkeye", "Falcon", "Red Skull", "Taskmaster", "Winter Soldier"],
    "DC": ["Commissioner Gordon", "Green Arrow", "Alfred Pennyworth", "Deathstroke", "Penguin", "Two-Face"]
  },
  ESTJ: {
    "The Office": ["Angela Martin", "Jan Levinson"],
    "Harry Potter": ["Dolores Umbridge", "Vernon Dursley", "Cornelius Fudge"],
    "Marvel": ["J. Jonah Jameson", "Maria Hill", "Nick Fury", "Norman Osborn", "Baron Zemo", "Kingpin"],
    "DC": ["Amanda Waller", "Alfred Pennyworth", "General Zod", "Lex Luthor", "Commissioner Gordon"]
  },
  ISFJ: {
    "The Office": ["Pam Beesly", "Phyllis Vance"],
    "Harry Potter": ["Hagrid", "Mrs. Weasley", "Neville Longbottom"],
    "Marvel": ["Aunt May", "Pepper Potts", "Captain America", "Sandman", "Lizard", "Rhino"],
    "DC": ["Martha Kent", "Lois Lane", "Alfred Pennyworth", "Killer Croc", "Calendar Man", "Clayface"]
  },
  ESFJ: {
    "The Office": ["Phyllis Vance", "Meredith Palmer"],
    "Harry Potter": ["Cedric Diggory", "Cho Chang", "Fleur Delacour"],
    "Marvel": ["Spider-Man", "Falcon", "Captain Marvel", "Electro", "Rhino", "Shocker"],
    "DC": ["Supergirl", "Batgirl", "Wonder Woman", "Cheetah", "Mirror Master", "Livewire"]
  },
  ISTP: {
    "The Office": ["Stanley Hudson", "Creed Bratton"],
    "Harry Potter": ["Sirius Black", "Mad-Eye Moody", "Kingsley Shacklebolt"],
    "Marvel": ["Wolverine", "Punisher", "Black Widow", "Winter Soldier", "Bullseye", "Crossbones"],
    "DC": ["Batman", "Red Hood", "Green Arrow", "Deadshot", "Bane", "Deathstroke"]
  },
  ESTP: {
    "The Office": ["Todd Packer", "Roy Anderson"],
    "Harry Potter": ["Draco Malfoy", "James Potter", "Sirius Black"],
    "Marvel": ["Thor", "Gambit", "Iron Man", "Sabretooth", "Juggernaut", "Venom"],
    "DC": ["Guy Gardner", "Lobo", "Hal Jordan", "Captain Boomerang", "Gorilla Grodd", "Parasite"]
  },
  ISFP: {
    "The Office": ["Holly Flax", "Erin Hannon"],
    "Harry Potter": ["Cho Chang", "Lavender Brown", "Colin Creevey"],
    "Marvel": ["Groot", "Mantis", "Wanda Maximoff", "Rogue", "Quicksilver", "Gambit"],
    "DC": ["Nightwing", "Zatanna", "Beast Boy", "Scarecrow", "Mad Hatter", "Poison Ivy"]
  },
  ESFP: {
    "The Office": ["Kelly Kapoor", "Meredith Palmer"],
    "Harry Potter": ["Rita Skeeter", "Gilderoy Lockhart", "Peeves"],
    "Marvel": ["Deadpool", "Human Torch", "Spider-Man", "Shocker", "Toad", "Carnage"],
    "DC": ["The Flash", "Impulse", "Plastic Man", "Trickster", "Captain Cold", "Mirror Master"]
  },
};

// Franchise categories for consistent ordering
const franchiseCategories = [
  "The Office",
  "Harry Potter",
  "Marvel",
  "DC"
];

// Helper function to get current character for display
const getCurrentCharacterForFranchise = (
  mbtiType: string,
  franchise: string,
  characterIndices: Record<string, Record<string, number>>
): { name: string; franchise: string } => {
  const pool = characterPoolsByMBTI[mbtiType]?.[franchise] || [];
  if (pool.length === 0) return { name: "Unknown", franchise };

  const currentIndex = characterIndices[mbtiType]?.[franchise] || 0;
  const characterName = pool[currentIndex % pool.length];

  return { name: characterName, franchise };
};

// Helper function to get all current characters for an MBTI type
const getCurrentCharactersForMBTI = (
  mbtiType: string,
  characterIndices: Record<string, Record<string, number>>
): Array<{ name: string; franchise: string }> => {
  return franchiseCategories.map(franchise =>
    getCurrentCharacterForFranchise(mbtiType, franchise, characterIndices)
  );
};

// Office Departments mapping for MBTI types
const officeDepartmentsByMBTI: Record<
  string,
  {
    department: string;
    color: string;
    role: string;
    traits: string[];
  }
> = {
  // Management - Leadership and strategic oversight
  ENFP: {
    department: "Management",
    color: "#1e40af", // Blue
    role: "Regional Manager",
    traits: ["charismatic", "enthusiastic", "people-focused", "creative"],
  },
  ENTJ: {
    department: "Management",
    color: "#1e40af",
    role: "Corporate Executive",
    traits: ["strategic", "decisive", "results-oriented", "authoritative"],
  },
  ENFJ: {
    department: "Management",
    color: "#1e40af",
    role: "Regional Director",
    traits: ["inspiring", "collaborative", "goal-oriented", "diplomatic"],
  },
  // Sales - Revenue generation and client relations
  ENTP: {
    department: "Sales",
    color: "#059669", // Green
    role: "Sales Representative",
    traits: ["persuasive", "adaptable", "relationship-building", "innovative"],
  },
  ESTP: {
    department: "Sales",
    color: "#059669",
    role: "Traveling Salesman",
    traits: ["aggressive", "competitive", "action-oriented", "opportunistic"],
  },
  ISTJ: {
    department: "Sales",
    color: "#059669",
    role: "Top Salesman",
    traits: ["persistent", "methodical", "reliable", "detail-focused"],
  },
  // Accounting - Financial oversight and compliance
  INTJ: {
    department: "Accounting",
    color: "#7c2d12", // Brown
    role: "Senior Accountant",
    traits: ["analytical", "precise", "logical", "independent"],
  },
  ESTJ: {
    department: "Accounting",
    color: "#7c2d12",
    role: "Head of Accounting",
    traits: ["organized", "efficient", "rule-following", "authoritative"],
  },
  ISTP: {
    department: "Accounting",
    color: "#7c2d12",
    role: "Financial Analyst",
    traits: ["practical", "logical", "independent", "problem-solving"],
  },
  // Reception/Admin - Support and coordination
  ISFJ: {
    department: "Reception",
    color: "#be185d", // Pink
    role: "Receptionist",
    traits: ["supportive", "organized", "helpful", "detail-oriented"],
  },
  INFP: {
    department: "Reception",
    color: "#be185d",
    role: "Reception Assistant",
    traits: ["caring", "adaptable", "creative", "people-focused"],
  },
  ESFJ: {
    department: "Reception",
    color: "#be185d",
    role: "Office Coordinator",
    traits: ["social", "organized", "supportive", "team-oriented"],
  },
  // HR - People management and compliance
  INFJ: {
    department: "HR",
    color: "#7c3aed", // Purple
    role: "HR Representative",
    traits: ["empathetic", "principled", "conflict-resolution", "systematic"],
  },
  ISFP: {
    department: "HR",
    color: "#7c3aed",
    role: "HR Liaison",
    traits: ["compassionate", "flexible", "people-focused", "harmonious"],
  },
  // Customer Service - Client support and relations
  ESFP: {
    department: "Customer Service",
    color: "#ea580c", // Orange
    role: "Customer Service Rep",
    traits: ["energetic", "people-oriented", "spontaneous", "enthusiastic"],
  },
  // Corporate/Special Projects - Strategic initiatives
  INTP: {
    department: "Corporate",
    color: "#6b7280", // Gray
    role: "Corporate Liaison",
    traits: ["analytical", "strategic", "independent", "innovative"],
  },
};

// Department information and characteristics
const officeDepartmentInfo: Record<string, {
  description: string;
  motto: string;
  characteristics: string[];
}> = {
  Management: {
    description: "Visionary leaders who drive company culture and strategic direction through inspiration and decisive action.",
    motto: "That's what she said... about leadership excellence!",
    characteristics: ["Strategic thinking", "Team motivation", "Decision authority", "Cultural influence"]
  },
  Sales: {
    description: "Results-driven professionals who build relationships and close deals through persistence and adaptability.",
    motto: "Bears. Beets. Battlestar Galactica. Sales.",
    characteristics: ["Revenue focus", "Client relationships", "Competitive drive", "Adaptability"]
  },
  Accounting: {
    description: "Detail-oriented analysts who ensure financial accuracy and compliance through systematic processes.",
    motto: "Actually, the numbers don't lie.",
    characteristics: ["Precision", "Compliance", "Analytical thinking", "Process adherence"]
  },
  Reception: {
    description: "Supportive coordinators who maintain office operations and provide excellent internal customer service.",
    motto: "Dunder Mifflin, this is Pam... I mean, how can we help?",
    characteristics: ["Organization", "Communication", "Support", "Coordination"]
  },
  HR: {
    description: "People-focused professionals who balance employee needs with company policies and conflict resolution.",
    motto: "I'm not superstitious, but I am a little stitious about HR policies.",
    characteristics: ["Employee relations", "Policy enforcement", "Conflict resolution", "Compliance"]
  },
  "Customer Service": {
    description: "Energetic representatives who maintain client satisfaction through enthusiasm and problem-solving.",
    motto: "OMG, like, customer satisfaction is totally our thing!",
    characteristics: ["Client satisfaction", "Problem solving", "Energy", "Responsiveness"]
  },
  Corporate: {
    description: "Strategic thinkers who analyze company operations and implement corporate initiatives.",
    motto: "Synergy and optimization through strategic corporate alignment.",
    characteristics: ["Strategic analysis", "Process improvement", "Corporate alignment", "Innovation"]
  },
};

// Helper function to get Office department for a MBTI type
const getOfficeDepartment = (mbtiType: string): string => {
  return officeDepartmentsByMBTI[mbtiType]?.department || "Unknown";
};

// Group MBTI results by Office departments
const groupResultsByOfficeDepartments = (results: DecisionService.SimulationResult[]) => {
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

const getMBTIImage = (mbtiType: string): string => {
  const seed = mbtiImageSeeds[mbtiType] || mbtiType.toLowerCase();
  return `https://picsum.photos/seed/${seed}/100/100`;
};

// Helper function to get franchise colors
const getFranchiseColors = (franchise: string): { backgroundColor: string; color: string } => {
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
  getFranchiseColors: (franchise: string) => { backgroundColor: string; color: string };
}

// Memoized component to prevent unnecessary re-renders
const EnhancedPersonalityCard: React.FC<EnhancedPersonalityCardProps> = React.memo(({
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

  // Debounced hover handlers to improve performance
  const debouncedSetHovered = useDebounce((hovered: boolean) => {
    setIsHovered(hovered);
  }, 100);

  // Handle card click to shuffle all characters
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent triggering when clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    shuffleAllCharacters(type);
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl transition-all duration-700 ease-out cursor-pointer transform-gpu",
        isHovered ? "scale-[1.03] -translate-y-2 shadow-4xl" : "shadow-2xl",
        isUserType
          ? "ring-2 ring-[#007aff] ring-offset-4 ring-offset-white/50"
          : ""
      )}
      onMouseEnter={() => debouncedSetHovered(true)}
      onMouseLeave={() => debouncedSetHovered(false)}
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
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
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
            {info.scientificFactors.keyTraits.slice(0, 3).map((trait: string, index: number) => (
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
                  {info.scientificFactors.strengths.map((strength: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-xs bg-gradient-to-r from-green-50/80 to-green-100/80 text-green-700 rounded-xl border border-green-200/50 backdrop-blur-sm shadow-sm hover:scale-105 transition-transform duration-200"
                    >
                      {strength}
                    </span>
                  ))}
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
                    {info.scientificFactors.challenges.map((challenge: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-xs bg-gradient-to-r from-amber-50/80 to-amber-100/80 text-amber-700 rounded-xl border border-amber-200/50 backdrop-blur-sm shadow-sm hover:scale-105 transition-transform duration-200"
                      >
                        {challenge}
                      </span>
                    ))}
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
                const pool = characterPoolsByMBTI[type]?.[character.franchise] || [];
                const hasMultiple = pool.length > 1;
                const colors = getFranchiseColors(character.franchise);

                return (
                  <button
                    key={character.franchise}
                    onClick={() => hasMultiple && cycleCharacter(type, character.franchise)}
                    className={cn(
                      "p-3 rounded-2xl text-left transition-all duration-300 border border-white/30 bg-white/40 backdrop-blur-md shadow-lg transform-gpu",
                      hasMultiple
                        ? "hover:scale-105 hover:shadow-xl hover:bg-white/50 cursor-pointer"
                        : "cursor-default",
                      "hover:-translate-y-0.5"
                    )}
                    disabled={!hasMultiple}
                    title={hasMultiple ? `Click to cycle through ${character.franchise} characters` : character.name}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate flex items-center gap-1">
                          {character.name}
                          {hasMultiple && (
                            <span className="text-purple-500 opacity-70 animate-spin">↻</span>
                          )}
                        </p>
                        <p
                          className="text-xs font-medium mt-2 px-3 py-1 rounded-xl text-center backdrop-blur-sm border border-white/20 shadow-sm"
                          style={{
                            backgroundColor: `${colors.backgroundColor}40`,
                            color: colors.color,
                            borderColor: `${colors.backgroundColor}60`
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
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>Explore Details</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Check if character examples have actually changed (not just length)
  const characterExamplesChanged =
    prevProps.characterExamples.length !== nextProps.characterExamples.length ||
    prevProps.characterExamples.some((char, index) =>
      char.name !== nextProps.characterExamples[index]?.name ||
      char.franchise !== nextProps.characterExamples[index]?.franchise
    );

  return (
    prevProps.type === nextProps.type &&
    prevProps.isUserType === nextProps.isUserType &&
    !characterExamplesChanged &&
    prevProps.img === nextProps.img
  );
});

EnhancedPersonalityCard.displayName = 'EnhancedPersonalityCard';

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

// Enhanced Slider Input Component with liquid glass styling
const SliderInput: React.FC<SliderInputProps> = ({
  id,
  label,
  value,
  onChange,
  info,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="flex flex-col mb-6 p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:bg-white/25">
      <div className="flex justify-between items-center mb-3">
        <label
          htmlFor={id}
          className="font-semibold text-md text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          {info.label}
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-label={`More information about ${info.label}`}
              className="text-sm text-gray-600 cursor-help bg-white/40 backdrop-blur-md w-8 h-8 flex items-center justify-center rounded-full border border-white/30 hover:bg-white/50 hover:scale-110 transition-all duration-300 shadow-lg"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className={`transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`}>ⓘ</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            id={`${id}-info`}
            className="max-w-xs bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-2xl p-4"
          >
            <p className="font-semibold text-gray-800 mb-3">{info.description}</p>
            <div className="mt-3 text-sm grid grid-cols-1 xs:grid-cols-2 gap-3">
              <div className="bg-white/30 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-lg">
                <span className="font-bold text-gray-800">Low:</span>{" "}
                <span className="text-gray-700">{info.lowDesc}</span>
              </div>
              <div className="bg-white/30 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-lg">
                <span className="font-bold text-gray-800">High:</span>{" "}
                <span className="text-gray-700">{info.highDesc}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-grow relative">
          <Slider
            id={id}
            min={0}
            max={1}
            step={0.05}
            value={value}
            onChange={(_, v) => onChange((Array.isArray(v) ? v[0] : v).toString())}
            aria-label={info.label}
            aria-describedby={`${id}-info`}
            className="flex-grow"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {/* Enhanced visual feedback */}
          {isFocused && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-cyan-400/20 rounded-lg blur-sm animate-pulse pointer-events-none"></div>
          )}
        </div>

        <div className="w-16 text-right">
          <span className="font-mono text-lg font-bold bg-gradient-to-r from-[#007aff] to-[#5856d6] bg-clip-text text-transparent filter drop-shadow-sm">
            {(value * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-lg"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
};

// Dynamically import Recharts components with no SSR
const Charts = dynamic(() => import("@/components/UserDecisionCharts"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center">
      <div className="text-[#4455a6] animate-pulse">
        Loading visualization...
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

// Harry Potter Houses mapping for MBTI types
const harryPotterHousesByMBTI: Record<
  string,
  {
    house: string;
    color: string;
    traits: string[];
  }
> = {
  // Gryffindor - brave, daring, chivalrous
  ENFJ: {
    house: "Gryffindor",
    color: "#740001", // Gryffindor red
    traits: ["bravery", "courage", "determination", "leadership"],
  },
  ENTJ: {
    house: "Gryffindor",
    color: "#740001",
    traits: ["bravery", "leadership", "boldness", "confidence"],
  },
  ESFP: {
    house: "Gryffindor",
    color: "#740001",
    traits: ["courage", "adventurous", "enthusiastic", "spontaneous"],
  },
  ESTP: {
    house: "Gryffindor",
    color: "#740001",
    traits: ["boldness", "risk-taking", "action-oriented", "adaptable"],
  },
  // Hufflepuff - loyal, patient, fair, hard-working
  ISFJ: {
    house: "Hufflepuff",
    color: "#FFD800", // Hufflepuff yellow
    traits: ["loyalty", "patience", "fairness", "hard-working"],
  },
  ESFJ: {
    house: "Hufflepuff",
    color: "#FFD800",
    traits: ["loyalty", "supportive", "caring", "inclusive"],
  },
  ISFP: {
    house: "Hufflepuff",
    color: "#FFD800",
    traits: ["patience", "kindness", "harmony", "authenticity"],
  },
  ENFP: {
    house: "Hufflepuff",
    color: "#FFD800",
    traits: ["enthusiasm", "inclusivity", "optimism", "empathy"],
  },
  // Ravenclaw - intelligent, wise, creative
  INTJ: {
    house: "Ravenclaw",
    color: "#0E1A40", // Ravenclaw blue
    traits: ["intelligence", "strategy", "independence", "vision"],
  },
  INTP: {
    house: "Ravenclaw",
    color: "#0E1A40",
    traits: ["wisdom", "analysis", "creativity", "logic"],
  },
  INFJ: {
    house: "Ravenclaw",
    color: "#0E1A40",
    traits: ["insight", "intuition", "wisdom", "idealism"],
  },
  INFP: {
    house: "Ravenclaw",
    color: "#0E1A40",
    traits: ["creativity", "individuality", "depth", "authenticity"],
  },
  // Slytherin - ambitious, cunning, resourceful
  ESTJ: {
    house: "Slytherin",
    color: "#1A472A", // Slytherin green
    traits: ["ambition", "leadership", "efficiency", "determination"],
  },
  ISTJ: {
    house: "Slytherin",
    color: "#1A472A",
    traits: ["resourcefulness", "persistence", "strategy", "reliability"],
  },
  ENTP: {
    house: "Slytherin",
    color: "#1A472A",
    traits: ["cunning", "adaptability", "innovation", "persuasion"],
  },
  ISTP: {
    house: "Slytherin",
    color: "#1A472A",
    traits: ["resourcefulness", "pragmatism", "independence", "efficiency"],
  },
};

// Example characters and quotes for each Hogwarts house
const hogwartsHouseInfo: Record<string, { characters: string[]; quote: string }> = {
  Gryffindor: {
    characters: ["Harry Potter", "Hermione Granger", "Ron Weasley"],
    quote: "Daring, nerve, and chivalry set Gryffindors apart.",
  },
  Hufflepuff: {
    characters: ["Cedric Diggory", "Nymphadora Tonks", "Pomona Sprout"],
    quote: "Those patient Hufflepuffs are true and unafraid of toil.",
  },
  Ravenclaw: {
    characters: ["Luna Lovegood", "Cho Chang", "Garrick Ollivander"],
    quote: "Wit beyond measure is man's greatest treasure.",
  },
  Slytherin: {
    characters: ["Severus Snape", "Draco Malfoy", "Tom Riddle"],
    quote: "Those cunning folk use any means to achieve their ends.",
  },
};

// Helper function to get Harry Potter house for a MBTI type
const getHarryPotterHouse = (mbtiType: string): string => {
  return harryPotterHousesByMBTI[mbtiType]?.house || "Unknown";
};

// Group MBTI results by Hogwarts houses
const groupResultsByHogwartsHouses = (results: DecisionService.SimulationResult[]) => {
  const houseGroups: Record<
    string,
    {
      name: string;
      color: string;
      count: number;
      types: string[];
      decisions: Record<string, number>;
      averageScore: number;
    }
  > = {
    Gryffindor: {
      name: "Gryffindor",
      color: "#740001",
      count: 0,
      types: [],
      decisions: {},
      averageScore: 0,
    },
    Hufflepuff: {
      name: "Hufflepuff",
      color: "#FFD800",
      count: 0,
      types: [],
      decisions: {},
      averageScore: 0,
    },
    Ravenclaw: {
      name: "Ravenclaw",
      color: "#0E1A40",
      count: 0,
      types: [],
      decisions: {},
      averageScore: 0,
    },
    Slytherin: {
      name: "Slytherin",
      color: "#1A472A",
      count: 0,
      types: [],
      decisions: {},
      averageScore: 0,
    },
  };

  // Group results by house
  let totalScores: Record<string, number> = {
    Gryffindor: 0,
    Hufflepuff: 0,
    Ravenclaw: 0,
    Slytherin: 0,
  };

  results.forEach((result) => {
    const house = getHarryPotterHouse(result.name);
    if (houseGroups[house]) {
      houseGroups[house].count++;
      houseGroups[house].types.push(result.name);
      houseGroups[house].decisions[result.decision] =
        (houseGroups[house].decisions[result.decision] || 0) + 1;
      totalScores[house] += result.score;
    }
  });

  // Calculate average scores
  Object.keys(houseGroups).forEach((house) => {
    if (houseGroups[house].count > 0) {
      houseGroups[house].averageScore =
        totalScores[house] / houseGroups[house].count;
    }
  });

  return houseGroups;
};

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
                  {Object.entries(house.decisions).map(
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
                            {count}/{house.count}
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
                      width: `${house.averageScore * 100}%`,
                      backgroundColor: house.color,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>0%</span>
                  <span
                    className="font-medium"
                    style={{ color: house.color }}
                  >
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
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null);

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
        Welcome to Dunder Mifflin Scranton! See how different office departments approach decisions
        based on their workplace roles and team dynamics. That&apos;s what she said... about decision analysis!
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {Object.values(officeDepartmentsData).filter(dept => dept.count > 0).map((department) => {
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
                hoveredDepartment && !isHighlighted ? "opacity-50" : "opacity-100"
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
          {["Proceed Strategically", "Request Clarification", "Delay or Disengage"].map((decision) => {
            const decisionColor =
              decision === "Proceed Strategically"
                ? "#4ade80"
                : decision === "Request Clarification"
                ? "#facc15"
                : "#f87171";

            return (
              <div key={decision} className="space-y-2">
                <h4 className="font-medium text-sm" style={{ color: decisionColor }}>
                  {decision}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.values(officeDepartmentsData)
                    .filter(dept => dept.count > 0)
                    .map((department) => {
                      const count = department.decisions[decision] || 0;
                      const percentage = department.count > 0 ? (count / department.count) * 100 : 0;

                      return (
                        <div
                          key={department.name}
                          className="flex items-center justify-between p-2 rounded"
                          style={{ backgroundColor: `${department.color}10` }}
                        >
                          <span className="text-xs font-medium" style={{ color: department.color }}>
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
              <p
                className="font-medium mb-1"
                style={{ color: deptData.color }}
              >
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
  const [preview, setPreview] = useState<{ decision: string; color: string }>({
    decision: "",
    color: "#6b7280",
  });



  // Character cycling state - tracks current index for each MBTI type and franchise
  const [characterIndices, setCharacterIndices] = useState<Record<string, Record<string, number>>>(() => {
    const initialIndices: Record<string, Record<string, number>> = {};
    mbtiTypes.forEach(mbtiType => {
      initialIndices[mbtiType] = {};
      franchiseCategories.forEach(franchise => {
        initialIndices[mbtiType][franchise] = 0;
      });
    });
    return initialIndices;
  });

  // Function to cycle to next character in a franchise for a specific MBTI type
  const cycleCharacter = (mbtiType: string, franchise: string) => {
    setCharacterIndices(prev => {
      const pool = characterPoolsByMBTI[mbtiType]?.[franchise] || [];
      if (pool.length <= 1) return prev; // No cycling needed if only one character

      const currentIndex = prev[mbtiType]?.[franchise] || 0;
      const nextIndex = (currentIndex + 1) % pool.length;

      return {
        ...prev,
        [mbtiType]: {
          ...prev[mbtiType],
          [franchise]: nextIndex
        }
      };
    });
  };

  // Function to shuffle all characters for a specific MBTI type
  const shuffleAllCharacters = (mbtiType: string) => {
    setCharacterIndices(prev => {
      const newIndices = { ...prev[mbtiType] };

      // Shuffle each franchise's character index
      franchiseCategories.forEach(franchise => {
        const pool = characterPoolsByMBTI[mbtiType]?.[franchise] || [];
        if (pool.length > 1) {
          // Generate a random index different from the current one
          const currentIndex = prev[mbtiType]?.[franchise] || 0;
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * pool.length);
          } while (newIndex === currentIndex && pool.length > 1);
          newIndices[franchise] = newIndex;
        }
      });

      return {
        ...prev,
        [mbtiType]: newIndices
      };
    });
  };

  // Random famous person for each MBTI type, generated once per mount
  const famousPeopleMap = useMemo(() => {
    const map: Record<string, string> = {};
    mbtiTypes.forEach((t) => {
      map[t] = getRandomFamousPerson(t);
    });
    return map;
  }, [mbtiTypes]);



  useEffect(() => {
    setMounted(true);
  }, []);

  // Update preview decision whenever inputs change
  useEffect(() => {
    const previewResults = DecisionService.calculateResults(inputs);
    const { decision, color } =
      DecisionService.calculateMajorityDecision(previewResults);
    setPreview({ decision, color });
  }, [inputs]);

  // Format radar data
  const radarData = DecisionService.formatRadarData();

  // Trigger simulation by calculating scores and decisions
  const handleSimulate = () => {
    // Calculate results for personality types
    const newResults = DecisionService.calculateResults(inputs);

    // Calculate public opinion
    const publicOpinion = DecisionService.calculatePublicOpinion(inputs);

    setResults(newResults);
    setPublicResult(publicOpinion);

    // Switch to results tab after simulation
    setActiveTab("results");
  };

  // Reset inputs and clear simulation results
  const handleReset = () => {
    setInputs(DecisionService.defaultInputs);
    setResults([]);
    setPublicResult(null);
    setActivePreset(null);
  };

  const handleInputChange = (key: DecisionService.FactorKey, value: string) => {
    setInputs((prev) => {
      const updated = { ...prev, [key]: parseFloat(value) };
      return updated;
    });

    // Clear active preset when manually adjusting inputs
    if (activePreset) {
      setActivePreset(null);
    }
  };

  const applyPreset = (
    presetName: keyof typeof DecisionService.presetScenarios
  ) => {
    setInputs(DecisionService.presetScenarios[presetName]);
    setActivePreset(presetName);
    setActiveTab("factors");
  };

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
        color:
          results.find((r) => r.decision === decision)?.color || "#94a3b8",
      }))
      .sort((a, b) => b.count - a.count);
  }, [decisionCounts, results]);

  return (
    <div className="min-h-screen safe-area-inset-bottom relative overflow-hidden">
      {/* Enhanced Neural Network Background */}
      <LiquidBackground
        variant="primary"
        intensity="medium"
        animated={true}
        particles={true}
        neuralNetwork={true}
        interactionIntensity="medium"
        className="z-0"
      />

      {/* Unified Header and Main Container */}
      <GlassContainer
        variant="premium"
        rounded="3xl"
        shadow="4xl"
        shimmer={true}
        borderGlow={true}
        animated={true}
        className="bg-white/8 border-white/25 overflow-hidden gpu-accelerated"
      >
        <div className="absolute inset-0 bg-grid opacity-5"></div>

        {/* Header Section */}
        <header className="relative">
          <div className="bg-gradient-to-r from-slate-800/90 via-blue-900/90 to-indigo-900/90 p-4 sm:p-6 rounded-t-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10 rounded-t-3xl"></div>
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-[200px] h-[100px] bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-2xl"></div>

            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Brand Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div>
                    <EnhancedBrainIcon
                      variant="liquid"
                      size="3xl"
                      className="flex-shrink-0"
                      interactive={true}
                      neuralActivity={true}
                    />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-liquid-gradient drop-shadow-lg">
                    MBTI Brain
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-enhanced-contrast max-w-2xl leading-relaxed">
                  Explore how different personality types approach your decisions.
                  Select a scenario, adjust factors, and discover diverse perspectives.
                </p>
              </div>

              {/* User Controls */}
              <div className="flex flex-col items-start sm:items-end">
                <label
                  htmlFor="user-mbti"
                  className="text-xs font-medium text-white/70 mb-1"
                >
                  Your MBTI Type
                </label>
                <Select
                  value={userMBTI}
                  onValueChange={(v) => setUserMBTI(v as MBTIType)}
                >
                  <SelectTrigger id="user-mbti" className="w-32 bg-white/10 border-white/20 text-white">
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
            </div>
          </div>
        </header>

        {/* Main Content */}
        <CardContent className="p-0 relative">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
            }}
            className="w-full"
          >
            {/* Navigation Tabs */}
            <div className="bg-white/12 backdrop-blur-xl border-b border-white/20 px-4 py-4">
              <TabsList className="grid w-full grid-cols-4 mb-0 p-1.5 h-auto overflow-hidden">
                <TabsTrigger
                  value="scenarios"
                  className="rounded-full py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#007aff] data-[state=active]:font-medium"
                >
                  <div className="flex flex-col items-center gap-1">
                    <MdOutlineAssessment className="h-4 w-4" />
                    <span className="text-xs">Scenarios</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="factors"
                  className="rounded-full py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#007aff] data-[state=active]:font-medium"
                >
                  <div className="flex flex-col items-center gap-1">
                    <MdFactCheck className="h-4 w-4" />
                    <span className="text-xs">Factors</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="rounded-full py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#007aff] data-[state=active]:font-medium"
                >
                  <div className="flex flex-col items-center gap-1">
                    <IoMdAnalytics className="h-4 w-4" />
                    <span className="text-xs">Results</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="personalities"
                  className="rounded-full py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#007aff] data-[state=active]:font-medium"
                >
                  <div className="flex flex-col items-center gap-1">
                    <MdPsychology className="h-4 w-4" />
                    <span className="text-xs">Types</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 overflow-auto">
              {/* Scenarios Tab */}
              <TabsContent
                value="scenarios"
                className="space-y-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 relative"
              >
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden">
                  <div className="absolute top-10 right-10 w-[150px] h-[150px] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-xl"></div>
                </div>
                <div className="space-y-6">
                  {Object.entries(DecisionService.presetCategories).map(
                    ([category, scenarios]) => (
                      <div key={category}>
                        <h2 className="font-semibold text-[#1d1d1f] mb-1">
                          {category}
                        </h2>
                        <p className="text-xs text-gray-600 mb-3">
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
                                  "cursor-pointer transition-all duration-200 hover:shadow-md border",
                                  isActive
                                    ? "border-[#007aff] bg-[#007aff]/5"
                                    : "border-gray-100"
                                )}
                                onClick={() => {
                                  applyPreset(
                                    scenario as keyof typeof DecisionService.presetScenarios
                                  );
                                }}
                              >
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-[#1d1d1f]">
                                    {scenario}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-2">
                                    {
                                      DecisionService.presetDescriptions[
                                        scenario as keyof typeof DecisionService.presetDescriptions
                                      ]
                                    }
                                  </p>
                                  {isActive && (
                                    <div className="mt-3 text-xs bg-[#007aff] text-white px-3 py-1 rounded-full inline-block">
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
              <TabsContent value="factors" className="space-y-6 relative">
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden">
                  <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-full blur-xl"></div>
                </div>
                  {activePreset && (
                    <div className="mb-6 p-3 bg-[#007aff]/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="text-[#007aff] bg-[#007aff]/10 p-2 rounded-full">
                        <FaCheck className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-[#1d1d1f]">
                          Using preset: {activePreset}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                          Values are pre-set for this scenario. Adjust any
                          slider to customize.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sm border-[#007aff] text-[#007aff] rounded-full px-4 py-2"
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                    </div>
                  )}

                  {preview.decision && (
                    <div className="flex justify-center mb-4">
                      <span className="text-sm">Likely decision:</span>
                      <span
                        className="ml-2 text-sm font-medium px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: preview.color }}
                      >
                        {preview.decision}
                      </span>
                    </div>
                  )}

                {/* Combined 3D Visualization and Factor Controls */}
                <GlassContainer
                  variant="premium"
                  rounded="2xl"
                  shadow="3xl"
                  shimmer={true}
                  depth="floating"
                  className="p-4 sm:p-6 gpu-accelerated"
                >
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
                    {/* 3D Visualization Section - Takes 2/3 of space on large screens */}
                    <div className="xl:col-span-2 space-y-4">
                      <div className="mb-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-glass-effect mb-3 tracking-tight">
                          MBTI Decision Factors in 3D Space
                        </h2>
                        <p className="text-sm text-subtle-glass leading-relaxed">
                          Explore how different personality types prioritize decision factors.
                          Your current settings are shown as a red ring. Hover over points to see details.
                        </p>
                      </div>
                      <div className="relative">
                        <MBTI3DWrapper
                          archetypes={DecisionService.archetypes}
                          mbtiDescriptions={DecisionService.mbtiDescriptions}
                          userInputs={inputs}
                          userMBTI={userMBTI}
                          className="relative"
                        />
                      </div>
                    </div>

                    {/* Factor Controls Section - Takes 1/3 of space on large screens */}
                    <div className="xl:col-span-1 space-y-4 xl:border-l xl:border-white/20 xl:pl-6">
                      <div className="mb-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-glass-effect mb-3 tracking-tight">
                          Adjust Decision Factors
                        </h2>
                        <p className="text-sm text-subtle-glass leading-relaxed">
                          Move the sliders to see how your position changes in the 3D space in real-time.
                        </p>
                      </div>
                      <div className="space-y-3 xl:space-y-4">
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
                  </div>
                </GlassContainer>

                  <div className="flex justify-center sm:justify-end mt-6">
                    <Button
                      onClick={() => {
                        handleSimulate();
                      }}
                      variant="liquid"
                      size="lg"
                      className="w-full sm:w-auto hover-liquid"
                    >
                      Run Simulation
                    </Button>
                  </div>
                </TabsContent>

              {/* Results Tab */}
              <TabsContent value="results" className="space-y-6 relative">
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden">
                  <div className="absolute top-10 right-10 w-[180px] h-[180px] bg-gradient-to-bl from-blue-500 to-purple-600 rounded-full blur-xl"></div>
                </div>
                  {results.length > 0 ? (
                    <Tabs value={resultsSubTab} onValueChange={setResultsSubTab} className="w-full space-y-4">
                      <TabsList className="grid w-full grid-cols-3 bg-[#f2f2f7] p-1 rounded-full h-auto overflow-hidden">
                        <TabsTrigger value="analysis" className="rounded-full py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#007aff] data-[state=active]:font-medium">Analysis</TabsTrigger>
                        <TabsTrigger value="office" className="rounded-full py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#007aff] data-[state=active]:font-medium">Office</TabsTrigger>
                        <TabsTrigger value="houses" className="rounded-full py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#007aff] data-[state=active]:font-medium">Houses</TabsTrigger>
                      </TabsList>
                      <TabsContent value="analysis" className="space-y-6">
                      <div className="bg-gradient-to-r from-[#007aff] to-[#5856d6] text-white p-4 sm:p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg tracking-tight">
                          Decision Analysis
                        </h2>
                          {userResult && (
                            <div className="mb-4 text-sm">
                              <span>Your ({userMBTI}) decision:</span>
                              <span
                                className="ml-2 px-2 py-1 rounded-full text-white"
                                style={{ backgroundColor: userResult.color }}
                              >
                                {userResult.decision}
                              </span>
                            </div>
                          )}

                        <div className="space-y-6">
                          <div className="space-y-2 text-sm">
                            <div>
                              Most common decision:
                              <span
                                className="ml-1 px-2 py-1 rounded-full text-white"
                                style={{ backgroundColor: majorityColor }}
                              >
                                {majorityDecision || "N/A"}
                              </span>
                              {majorityDecision && (
                                <span className="ml-1">
                                  ({((decisionCounts[majorityDecision] / results.length) * 100).toFixed(1)}%)
                                </span>
                              )}
                            </div>
                            {publicResult && (
                              <div>
                                Public opinion favors:
                                <span
                                  className="ml-1 px-2 py-1 rounded-full text-white"
                                  style={{ backgroundColor: publicResult.color }}
                                >
                                  {publicResult.mostLikely}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                            {decisionBreakdown.map(({ decision, count, percentage, color }, index) => (
                              <div
                                key={decision}
                                className="bg-white/10 p-3 rounded-xl relative overflow-hidden border border-white/30"
                              >
                                {index < 3 && (
                                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                                    #{index + 1}
                                  </div>
                                )}
                                <div className="relative z-10">
                                  <span className="text-sm font-medium text-white/90 mb-2 block">{decision}</span>
                                  <div className="flex items-end gap-2">
                                    <div className="text-lg font-bold">{count}</div>
                                    <div className="text-xs text-white/70 mb-1">({percentage.toFixed(1)}%)</div>
                                  </div>
                                  <div className="text-xs text-white/60 mt-1">
                                    MBTI types
                                  </div>
                                  {index < 2 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {results
                                        .filter((r) => r.decision === decision)
                                        .map((r) => (
                                          <span
                                            key={r.name}
                                            className="px-2 py-0.5 text-[10px] bg-white/20 rounded-full"
                                          >
                                            {r.name}
                                          </span>
                                        ))}
                                    </div>
                                  )}
                                </div>
                                <div
                                  className="absolute bottom-0 left-0 h-1 transition-all duration-500"
                                  style={{ width: `${percentage}%`, backgroundColor: color }}
                                ></div>
                              </div>
                            ))}
                            {publicResult && (
                              <div
                                key="public"
                                className="bg-white/10 p-3 rounded-xl relative overflow-hidden border border-white/30"
                              >
                                <div className="relative z-10">
                                  <span className="text-sm font-medium text-white/90 mb-2 block">Public Opinion</span>
                                  <div className="flex items-end gap-2">
                                    <div className="text-lg font-bold">{publicResult.mostLikely}</div>
                                  </div>
                                  <div className="text-xs text-white/60 mt-1">Consensus View</div>
                                </div>
                                <div
                                  className="absolute bottom-0 left-0 h-1 transition-all duration-500"
                                  style={{ width: `100%`, backgroundColor: publicResult.color }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                          </div>
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
                      <div className="mb-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#1d1d1f] mb-2">
                          Detailed Analysis
                        </h3>
                          <p className="text-gray-600 text-sm">
                            The charts below show how different MBTI
                            personalities analyze and approach this decision.
                          </p>
                        </div>
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
                    <div className="text-center py-12 px-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="text-[#8e8e93] mb-4">
                        <BsFileText className="h-12 w-12 mx-auto" />
                      </div>
                      <p className="text-[#1d1d1f] font-medium">
                        No simulation results yet
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Run a simulation to see results
                      </p>
                      <Button
                        onClick={() => setActiveTab("factors")}
                        className="mt-4 bg-[#007aff] hover:bg-[#0066cc] text-white rounded-full px-6 py-2 shadow-sm transition-all active:scale-95"
                      >
                        Go to Factors
                      </Button>
                    </div>
                  )}
                </TabsContent>


              {/* Personalities Tab */}
              <TabsContent value="personalities" className="space-y-6 relative">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden">
                  <div className="absolute top-20 right-20 w-[200px] h-[200px] bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-20 left-20 w-[150px] h-[150px] bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full blur-2xl"></div>
                </div>

                {/* Section Header */}
                <div className="text-center space-y-3 relative z-10">
                  <h2 className="text-2xl font-bold text-liquid-gradient drop-shadow-lg tracking-tight">
                    MBTI Personality Types
                  </h2>
                  <p className="text-enhanced-contrast max-w-2xl mx-auto leading-relaxed">
                    Explore the 16 personality types and their unique decision-making approaches.
                    Each type brings distinct cognitive preferences and scientific insights to complex decisions.
                  </p>
                </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {Object.entries(DecisionService.mbtiDescriptions).map(([type, info]) => {
                          const characterExamples = getCurrentCharactersForMBTI(type, characterIndices);
                          const img = getMBTIImage(type);
                          const isUserType = type === userMBTI;

                          return (
                            <EnhancedPersonalityCard
                              key={type}
                              type={type}
                              info={info}
                              img={img}
                              isUserType={isUserType}
                              characterExamples={characterExamples}
                              characterPoolsByMBTI={characterPoolsByMBTI}
                              cycleCharacter={cycleCharacter}
                              shuffleAllCharacters={shuffleAllCharacters}
                              getFranchiseColors={getFranchiseColors}
                            />
                          );
                        })}
                    </div>
                  </div>
                </TabsContent>




            </div>
          </Tabs>
        </CardContent>
      </GlassContainer>
    </div>
  );
}
