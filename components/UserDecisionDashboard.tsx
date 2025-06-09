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
import dynamic from "next/dynamic";
import Image from "next/image";
import { cn } from "@/lib/utils";
import * as DecisionService from "@/lib/decisionMatrixService";
import { Slider } from "@/components/ui/slider";
// Import react-icons
import { FaBrain, FaCheck } from "react-icons/fa";
import { BsFileText, BsClockFill, BsGeoAlt } from "react-icons/bs";
import { IoMdAnalytics } from "react-icons/io";
import {
  MdOutlineAssessment,
  MdFactCheck,
  MdPsychology,
} from "react-icons/md";

// iOS Status Bar Component
const IOSStatusBar = () => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-[#007aff] text-white px-4 py-2 flex justify-between items-center">
      <div className="text-xs font-bold">{time}</div>
      <div className="flex items-center space-x-1">
        <div className="w-3 h-3" aria-hidden="true">
          <BsClockFill className="w-full h-full" />
        </div>
        <div className="w-4 h-4" aria-hidden="true">
          <BsGeoAlt className="w-full h-full" />
        </div>
        <div className="w-6 h-5" aria-hidden="true">
          <div className="h-full relative">
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center px-0.5">
              <div className="h-2 rounded-sm w-1 bg-white mx-0.5"></div>
              <div className="h-3 rounded-sm w-1 bg-white mx-0.5"></div>
              <div className="h-4 rounded-sm w-1 bg-white mx-0.5"></div>
              <div className="h-2.5 rounded-sm w-1 bg-white mx-0.5"></div>
            </div>
          </div>
        </div>
        <div className="w-6 h-3 border border-white rounded-sm relative" aria-hidden="true">
          <div className="absolute right-0 top-0 bottom-0 bg-white w-3 mr-px my-px rounded-sm"></div>
        </div>
      </div>
    </div>
  );
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

// Combined character examples for display
const characterExamplesByMBTI: Record<string, Array<{name: string, franchise: string}>> = {
  INTJ: [
    { name: "Oscar Martinez", franchise: "The Office" },
    { name: "Severus Snape", franchise: "Harry Potter" }
  ],
  ENTJ: [
    { name: "Jan Levinson", franchise: "The Office" },
    { name: "Hermione Granger", franchise: "Harry Potter" }
  ],
  INTP: [
    { name: "Gabe Lewis", franchise: "The Office" },
    { name: "Luna Lovegood", franchise: "Harry Potter" }
  ],
  ENTP: [
    { name: "Jim Halpert", franchise: "The Office" },
    { name: "Fred Weasley", franchise: "Harry Potter" }
  ],
  INFJ: [
    { name: "Toby Flenderson", franchise: "The Office" },
    { name: "Dumbledore", franchise: "Harry Potter" }
  ],
  ENFJ: [
    { name: "Andy Bernard", franchise: "The Office" },
    { name: "Harry Potter", franchise: "Harry Potter" }
  ],
  INFP: [
    { name: "Erin Hannon", franchise: "The Office" },
    { name: "Dobby", franchise: "Harry Potter" }
  ],
  ENFP: [
    { name: "Michael Scott", franchise: "The Office" },
    { name: "Ron Weasley", franchise: "Harry Potter" }
  ],
  ISTJ: [
    { name: "Dwight Schrute", franchise: "The Office" },
    { name: "Percy Weasley", franchise: "Harry Potter" }
  ],
  ESTJ: [
    { name: "Angela Martin", franchise: "The Office" },
    { name: "Dolores Umbridge", franchise: "Harry Potter" }
  ],
  ISFJ: [
    { name: "Pam Beesly", franchise: "The Office" },
    { name: "Hagrid", franchise: "Harry Potter" }
  ],
  ESFJ: [
    { name: "Phyllis Vance", franchise: "The Office" },
    { name: "Cedric Diggory", franchise: "Harry Potter" }
  ],
  ISTP: [
    { name: "Stanley Hudson", franchise: "The Office" },
    { name: "Sirius Black", franchise: "Harry Potter" }
  ],
  ESTP: [
    { name: "Todd Packer", franchise: "The Office" },
    { name: "Draco Malfoy", franchise: "Harry Potter" }
  ],
  ISFP: [
    { name: "Holly Flax", franchise: "The Office" },
    { name: "Cho Chang", franchise: "Harry Potter" }
  ],
  ESFP: [
    { name: "Kelly Kapoor", franchise: "The Office" },
    { name: "Rita Skeeter", franchise: "Harry Potter" }
  ],
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

// Slider Input Component with tooltips
const SliderInput: React.FC<SliderInputProps> = ({
  id,
  label,
  value,
  onChange,
  info,
}) => (
  <div className="flex flex-col mb-5">
    <div className="flex justify-between items-center mb-2">
      <label htmlFor={id} className="font-medium text-md text-[#1d1d1f]">
        {info.label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            aria-label={`More information about ${info.label}`}
            className="text-sm text-gray-500 cursor-help bg-[#f2f2f7] w-6 h-6 flex items-center justify-center rounded-full"
          >
            ⓘ
          </button>
        </PopoverTrigger>
        <PopoverContent
          id={`${id}-info`}
          className="max-w-xs bg-[#f5f5f7] border border-[#e6e6e6] shadow-lg rounded-xl p-3"
        >
          <p className="font-medium text-[#1d1d1f]">{info.description}</p>
          <div className="mt-2 text-sm grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div className="bg-[#f9f9fb] p-2 rounded-lg border border-[#e6e6e6]">
              <span className="font-bold text-[#1d1d1f]">Low:</span>{" "}
              {info.lowDesc}
            </div>
            <div className="bg-[#f9f9fb] p-2 rounded-lg border border-[#e6e6e6]">
              <span className="font-bold text-[#1d1d1f]">High:</span>{" "}
              {info.highDesc}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <div className="flex items-center space-x-4">
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
      />
      <span className="w-12 text-right font-mono text-[#007aff] font-semibold">
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  </div>
);

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

  // Easter egg opacity and mouse tracking
  const [eggOpacity, setEggOpacity] = useState(0);

  // Random famous person for each MBTI type, generated once per mount
  const famousPeopleMap = useMemo(() => {
    const map: Record<string, string> = {};
    mbtiTypes.forEach((t) => {
      map[t] = getRandomFamousPerson(t);
    });
    return map;
  }, [mbtiTypes]);

  const handleBrainMouseEnter = () => {
    setEggOpacity(1);
  };

  const handleBrainMouseLeave = () => {
    setEggOpacity(0);
  };

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
    <div className="bg-[#f5f5f7] min-h-screen safe-area-inset-bottom relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[30%] left-[-5%] w-[400px] h-[400px] opacity-[0.08] text-blue-900 dark:text-blue-300 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full blur-3xl"></div>
        <div className="absolute top-[5%] right-[-10%] w-[300px] h-[300px] opacity-[0.1] text-blue-900 dark:text-blue-300 bg-gradient-to-tl from-blue-800 to-purple-700 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[5%] left-[10%] w-[250px] h-[250px] opacity-[0.09] text-blue-900 dark:text-blue-300 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[200px] h-[200px] opacity-[0.08] text-blue-900 dark:text-blue-300 bg-gradient-to-bl from-blue-700 to-indigo-800 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[40%] right-[20%] w-[500px] h-[500px] opacity-[0.07] text-blue-900 dark:text-blue-300 bg-gradient-to-tr from-purple-700 to-blue-800 rounded-full blur-3xl"></div>
      </div>

      {/* iOS-style Hero Section with App Description */}
      <div className="bg-gradient-to-r from-[#007aff] to-[#5856d6] text-white p-4 pt-6 sm:p-6 sm:pt-8 rounded-b-[2rem] shadow-sm relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="absolute top-0 right-0 w-[200px] h-[200px] opacity-[0.15] bg-gradient-to-br from-white/20 to-white/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[150px] opacity-[0.15] bg-gradient-to-tr from-white/20 to-white/10 rounded-full blur-lg"></div>
        <div className="relative flex flex-col gap-2 mb-2">
          <div
            className="flex items-center gap-2 mb-2 relative"
            onMouseEnter={handleBrainMouseEnter}
            onMouseLeave={handleBrainMouseLeave}
          >
            <FaBrain className="h-6 w-6 text-white/90" />
            <h2 className="text-xl sm:text-2xl font-bold text-white/95">
              MBTI Brain
            </h2>
            <div
              className="absolute left-full ml-2 text-white text-sm pointer-events-none transition-opacity"
              style={{ opacity: eggOpacity }}
            >
              🎉
            </div>
          </div>
          <p className="text-sm iphone16:text-base sm:text-base text-white/80 max-w-3xl relative">
            Explore how different personality types approach your decisions.
            Select a scenario, adjust factors, and discover diverse
            perspectives.
          </p>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="px-3 py-4 sm:p-6 -mt-6 relative z-20">
        <Card className="border-none shadow-xl bg-white rounded-[1.5rem] overflow-hidden relative">
          <div className="absolute inset-0 bg-grid opacity-10"></div>
          <CardContent className="p-0 relative">
            <div className="px-4 pt-4 flex justify-end">
              <div className="w-32 flex flex-col items-start">
                <label
                  htmlFor="user-mbti"
                  className="text-xs font-medium text-gray-600 mb-1"
                >
                  MBTI Type
                </label>
                <Select
                  value={userMBTI}
                  onValueChange={(v) => setUserMBTI(v as MBTIType)}
                >
                  <SelectTrigger id="user-mbti">
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 pt-4">
                <TabsList className="grid w-full grid-cols-4 mb-2 bg-[#f2f2f7] p-1 rounded-full h-auto overflow-hidden">
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
                          <h4 className="font-semibold text-[#1d1d1f] mb-1">
                            {category}
                          </h4>
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
                                  onClick={() =>
                                    applyPreset(
                                      scenario as keyof typeof DecisionService.presetScenarios
                                    )
                                  }
                                >
                                  <CardContent className="p-4">
                                    <h5 className="font-semibold text-[#1d1d1f]">
                                      {scenario}
                                    </h5>
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

                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 gap-4">
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

                  <div className="flex justify-center sm:justify-end mt-6">
                    <Button
                      onClick={handleSimulate}
                      className="bg-[#007aff] hover:bg-[#0066cc] text-white rounded-full px-8 py-3 shadow-sm w-full sm:w-auto transition-all active:scale-95"
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
                          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                            Decision Analysis
                          </h3>
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
                          <h4 className="text-lg sm:text-xl font-semibold text-[#1d1d1f] mb-2">
                            Detailed Analysis
                          </h4>
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
                <TabsContent value="personalities" className="space-y-4 relative">
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden">
                    <div className="absolute bottom-10 right-10 w-[120px] h-[120px] bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-full blur-xl"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(DecisionService.mbtiDescriptions).map(([type, info]) => {
                          const characterExamples = characterExamplesByMBTI[type] || [];
                          const img = getMBTIImage(type);
                          return (
                            <div
                              key={type}
                              className={cn(
                                "p-4 rounded-xl shadow-sm bg-white",
                                type === userMBTI ? "border-2 border-[#007aff]" : "border border-gray-100"
                              )}
                              style={{ borderLeft: `4px solid ${info.color}` }}
                            >
                              <div className="flex items-start gap-3">
                                <Image src={img} alt={`${type} icon`} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                                <div className="flex-1">
                                  <h4 className="font-bold mb-2" style={{ color: info.color }}>
                                    {info.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">{info.description}</p>
                                </div>
                              </div>
                              {type === userMBTI && (
                                <p className="text-xs font-semibold text-[#007aff] mt-1">Your Type</p>
                              )}

                              {/* Character Examples Section */}
                              {characterExamples.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-xs font-medium text-gray-700 mb-2">Character Examples:</p>
                                  <div className="space-y-1">
                                    {characterExamples.map((character, index) => (
                                      <div key={index} className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-gray-800">{character.name}</span>
                                        <span
                                          className="px-2 py-1 rounded-full text-xs font-medium"
                                          style={{
                                            backgroundColor: character.franchise === "The Office" ? "#e3f2fd" : "#f3e5f5",
                                            color: character.franchise === "The Office" ? "#1976d2" : "#7b1fa2"
                                          }}
                                        >
                                          {character.franchise}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </TabsContent>




              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
