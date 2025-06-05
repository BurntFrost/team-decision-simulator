import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import * as DecisionService from "@/lib/decisionMatrixService";
// Import react-icons
import { FaBrain, FaCheck, FaInfoCircle } from "react-icons/fa";
import {
  BsFileText,
  BsGrid1X2,
  BsPeople,
  BsGear,
  BsClockFill,
  BsGeoAlt,
} from "react-icons/bs";
import { IoMdAnalytics } from "react-icons/io";
import {
  MdOutlineAssessment,
  MdFactCheck,
  MdPsychology,
  MdOutlineLeaderboard,
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
          <div className="mt-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      <input
        id={id}
        type="range"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={value}
        aria-label={info.label}
        aria-describedby={`${id}-info`}
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow appearance-none h-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007aff]/20"
        style={{
          WebkitAppearance: "none",
          background: `linear-gradient(to right, #007aff ${
            value * 100
          }%, #e5e5ea ${value * 100}%)`,
          height: "0.75rem",
          borderRadius: "999px",
        }}
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
  const [preview, setPreview] = useState<{ decision: string; color: string }>({
    decision: "",
    color: "#6b7280",
  });

  // Easter egg opacity and mouse tracking
  const [eggOpacity, setEggOpacity] = useState(0);
  const lastMouse = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleBrainMouseEnter = () => {
    setEggOpacity(0);
    lastMouse.current = null;
  };

  const handleBrainMouseLeave = () => {
    setEggOpacity(0);
    lastMouse.current = null;
  };

  const handleBrainMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const now = performance.now();
    if (lastMouse.current) {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      const dt = now - lastMouse.current.time || 1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dist / dt; // pixels per ms
      setEggOpacity((o) => Math.min(o + speed * 0.1, 1));
    }
    lastMouse.current = { x: e.clientX, y: e.clientY, time: now };
  };

  // Load stored session data on mount
  useEffect(() => {
    const storedMBTI = sessionStorage.getItem("userMBTI");
    const storedInputs = sessionStorage.getItem("inputs");
    const storedPreset = sessionStorage.getItem("activePreset");

    if (storedMBTI && mbtiTypes.includes(storedMBTI as MBTIType)) {
      setUserMBTI(storedMBTI as MBTIType);
    }
    if (storedInputs) {
      try {
        setInputs(JSON.parse(storedInputs));
      } catch {}
    }
    if (storedPreset) {
      setActivePreset(storedPreset);
    }
  }, [mbtiTypes]);

  // Persist session data when values change
  useEffect(() => {
    sessionStorage.setItem("userMBTI", userMBTI);
  }, [userMBTI]);

  useEffect(() => {
    sessionStorage.setItem("inputs", JSON.stringify(inputs));
  }, [inputs]);

  useEffect(() => {
    if (activePreset) {
      sessionStorage.setItem("activePreset", activePreset);
    } else {
      sessionStorage.removeItem("activePreset");
    }
  }, [activePreset]);


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
        <div className="absolute top-2 right-4 flex items-center gap-2 text-sm sm:text-base">
          <label htmlFor="user-mbti" className="mr-2">
            Your MBTI type:
          </label>
          <select
            id="user-mbti"
            value={userMBTI}
            onChange={(e) => setUserMBTI(e.target.value as MBTIType)}
            className="text-gray-800 rounded-md px-3 py-1.5 text-base"
          >
            {mbtiTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="relative flex flex-col gap-2 mb-2">
          <div
            className="flex items-center gap-2 mb-2 relative"
            onMouseEnter={handleBrainMouseEnter}
            onMouseMove={handleBrainMouseMove}
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
          <p className="text-sm sm:text-base text-white/80 max-w-3xl relative">
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    <>
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
                          {/* Top 3 Decisions */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                            {Object.entries(
                              results.reduce((acc, curr) => {
                                acc[curr.decision] =
                                  (acc[curr.decision] || 0) + 1;
                                return acc;
                              }, {} as Record<string, number>)
                            )
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 3)
                              .map(([decision, count], index) => {
                                const percentage =
                                  (count / results.length) * 100;
                                const color =
                                  results.find((r) => r.decision === decision)
                                    ?.color || "#94a3b8";
                                return (
                                  <div
                                    key={decision}
                                    className="bg-white/20 p-4 sm:p-6 rounded-xl relative overflow-hidden border border-white/30"
                                  >
                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                                      #{index + 1}
                                    </div>
                                    <div className="relative z-10">
                                      <span className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 block">
                                        {decision}
                                      </span>
                                      <div className="flex items-end gap-2">
                                        <div className="text-2xl sm:text-3xl font-bold">
                                          {count}
                                        </div>
                                        <div className="text-sm text-white/70 mb-1">
                                          ({percentage.toFixed(1)}%)
                                        </div>
                                      </div>
                                      <div className="text-xs text-white/60 mt-1">
                                        MBTI types
                                      </div>
                                    </div>
                                    <div
                                      className="absolute bottom-0 left-0 h-1.5 transition-all duration-500"
                                      style={{
                                        width: `${percentage}%`,
                                        backgroundColor: color,
                                      }}
                                    ></div>
                                  </div>
                                );
                              })}
                          </div>

                          {/* All Decisions Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              {
                                decision: "Full Speed Ahead",
                                color: "#34c759",
                                count: results.filter(
                                  (r) => r.decision === "Full Speed Ahead"
                                ).length,
                              },
                              {
                                decision: "Proceed Strategically",
                                color: "#30d158",
                                count: results.filter(
                                  (r) => r.decision === "Proceed Strategically"
                                ).length,
                              },
                              {
                                decision: "Implement with Oversight",
                                color: "#ffcc00",
                                count: results.filter(
                                  (r) =>
                                    r.decision === "Implement with Oversight"
                                ).length,
                              },
                              {
                                decision: "Request Clarification",
                                color: "#ff9500",
                                count: results.filter(
                                  (r) => r.decision === "Request Clarification"
                                ).length,
                              },
                              {
                                decision: "Delay or Disengage",
                                color: "#ff3b30",
                                count: results.filter(
                                  (r) => r.decision === "Delay or Disengage"
                                ).length,
                              },
                              {
                                decision: "Public Opinion",
                                color: publicResult?.color || "#8e8e93",
                                count: publicResult ? 1 : 0,
                                isPublic: true,
                              },
                            ]
                              // Filter out options with 0 count, except for Public Opinion which should always show
                              .filter(
                                ({ count, isPublic }) => count > 0 || isPublic
                              )
                              .map(({ decision, color, count, isPublic }) => {
                                const percentage = isPublic
                                  ? 100
                                  : (count / results.length) * 100;
                                return (
                                  <div
                                    key={decision}
                                    className="bg-white/10 p-3 rounded-xl relative overflow-hidden"
                                  >
                                    <div className="relative z-10">
                                      <span className="text-sm font-medium text-white/90 mb-2 block">
                                        {decision}
                                      </span>
                                      <div className="flex items-end gap-2">
                                        {isPublic ? (
                                          <div className="text-lg font-bold">
                                            {publicResult?.mostLikely || "N/A"}
                                          </div>
                                        ) : (
                                          <>
                                            <div className="text-lg font-bold">
                                              {count}
                                            </div>
                                            <div className="text-xs text-white/70 mb-1">
                                              ({percentage.toFixed(1)}%)
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      <div className="text-xs text-white/60 mt-1">
                                        {isPublic
                                          ? "Consensus View"
                                          : "MBTI types"}
                                      </div>
                                    </div>
                                    <div
                                      className="absolute bottom-0 left-0 h-1 transition-all duration-500"
                                      style={{
                                        width: `${percentage}%`,
                                        backgroundColor: color,
                                      }}
                                    ></div>
                                  </div>
                                );
                              })}
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
                    </>
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
                <TabsContent
                  value="personalities"
                  className="space-y-4 relative"
                >
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden">
                    <div className="absolute bottom-10 right-10 w-[120px] h-[120px] bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-full blur-xl"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(DecisionService.mbtiDescriptions).map(
                      ([type, info]) => {
                        const famousPerson = getRandomFamousPerson(type);
                        const img = getMBTIImage(type);
                        return (
                          <div
                            key={type}
                            className={cn(
                              "p-4 rounded-xl shadow-sm bg-white",
                              type === userMBTI
                                ? "border-2 border-[#007aff]"
                                : "border border-gray-100"
                            )}
                            style={{ borderLeft: `4px solid ${info.color}` }}
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={img}
                                alt={`${type} icon`}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h4
                                  className="font-bold mb-2"
                                  style={{ color: info.color }}
                                >
                                  {info.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {info.description}
                                </p>
                              </div>
                            </div>
                            {type === userMBTI && (
                              <p className="text-xs font-semibold text-[#007aff] mt-1">
                                Your Type
                              </p>
                            )}
                            <p className="text-xs mt-2 italic text-gray-500">
                              {famousPerson &&
                                `Famous example: ${famousPerson}`}
                            </p>
                          </div>
                        );
                      }
                    )}
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
