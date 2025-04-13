import React, { useState, useEffect } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import * as DecisionService from "@/lib/decisionMatrixService";

// Custom Stepper Component
const StepperContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("flex w-full", className)}>{children}</div>;

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
  <div className="flex-1 relative">
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
  <div className="flex flex-col mb-4">
    <div className="flex justify-between items-center mb-1">
      <label htmlFor={id} className="font-medium text-md">
        {info.label}
      </label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm text-gray-500 cursor-help">ⓘ</span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-medium">{info.description}</p>
            <div className="mt-2 text-sm grid grid-cols-2 gap-2">
              <div>
                <span className="font-bold">Low:</span> {info.lowDesc}
              </div>
              <div>
                <span className="font-bold">High:</span> {info.highDesc}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div className="flex items-center space-x-4">
      <input
        id={id}
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow"
      />
      <span className="w-12 text-right font-mono">
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
  <div className="w-full">
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
type MBTIType = "INTJ" | "ISTJ" | "ENTJ" | "INTP";

export default function UserDecisionDashboard() {
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const {
    decision: majorityDecision,
    color: majorityColor,
    counts: decisionCounts,
  } = majorityDecisionData;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-[#e6f0ff] via-[#d9e6ff] to-[#ccdcff] min-h-screen">
      {/* Hero Section with App Description */}
      <div className="bg-gradient-to-r from-[#4455a6] via-[#3a4a8f] to-[#2f3f7a] text-white p-8 rounded-xl shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white/90"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white/90"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white/90"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white/90">
            MBTI Decision Simulator
          </h2>
        </div>
        <p className="mt-2 text-white/80 max-w-3xl relative">
          Get insights into your decision-making process by exploring how
          different MBTI personality types would approach your situation. Select
          a scenario, adjust the factors, and discover diverse perspectives to
          help you make more informed choices.
        </p>
      </div>

      {/* Main Content with Tabs */}
      <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <CardContent className="p-6 relative">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gradient-to-r from-[#f0f4ff] to-[#e8edff] p-1 rounded-lg shadow-sm">
              <TabsTrigger
                value="scenarios"
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#4455a6] data-[state=active]:font-semibold rounded-md transition-all duration-200 hover:bg-white/50"
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Scenarios
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="factors"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#4455a6] data-[state=active]:font-semibold rounded-md transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Factors
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#4455a6] data-[state=active]:font-semibold rounded-md transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Results
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="personalities"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#4455a6] data-[state=active]:font-semibold rounded-md transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Personalities
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Scenarios Tab */}
            <TabsContent
              value="scenarios"
              className="space-y-6 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.keys(DecisionService.presetScenarios).map(
                  (scenario) => {
                    const isActive = scenario === activePreset;
                    return (
                      <Card
                        key={scenario}
                        className={cn(
                          "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                          isActive
                            ? "border-[#4455a6] bg-[#4455a6]/5"
                            : "border-transparent"
                        )}
                        onClick={() =>
                          applyPreset(
                            scenario as keyof typeof DecisionService.presetScenarios
                          )
                        }
                      >
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-[#4455a6]">
                            {scenario}
                          </h4>
                          <p className="text-sm text-gray-600 mt-2">
                            {
                              DecisionService.presetDescriptions[
                                scenario as keyof typeof DecisionService.presetDescriptions
                              ]
                            }
                          </p>

                          {isActive && (
                            <div className="mt-3 text-xs bg-[#4455a6] text-white px-3 py-1 rounded-full inline-block">
                              Selected
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </div>
            </TabsContent>

            {/* Factors Tab */}
            <TabsContent value="factors" className="space-y-6">
              {activePreset && (
                <div className="mb-6 p-3 bg-[#4455a6]/5 rounded-lg flex items-center">
                  <div className="mr-3 text-[#4455a6]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium">
                      Using preset: {activePreset}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      Values are pre-set for this scenario. Adjust any slider to
                      customize.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm border-[#4455a6] text-[#4455a6]"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              )}

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
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

              <div className="flex justify-end">
                <Button
                  onClick={handleSimulate}
                  className="bg-[#4455a6] hover:bg-[#3a4a8f]"
                >
                  Run Simulation
                </Button>
              </div>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-6">
              {results.length > 0 ? (
                <>
                  <div className="bg-[#4455a6] text-white p-8 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold mb-6">
                      Decision Analysis
                    </h3>
                    <div className="space-y-6">
                      {/* Top 3 Decisions */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        {Object.entries(
                          results.reduce((acc, curr) => {
                            acc[curr.decision] = (acc[curr.decision] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        )
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 3)
                          .map(([decision, count], index) => {
                            const percentage = (count / results.length) * 100;
                            const color =
                              results.find((r) => r.decision === decision)
                                ?.color || "#94a3b8";
                            return (
                              <div
                                key={decision}
                                className="bg-white/20 p-6 rounded-xl relative overflow-hidden border-2 border-white/30"
                              >
                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                                  #{index + 1}
                                </div>
                                <div className="relative z-10">
                                  <span className="text-lg font-bold text-white mb-3 block">
                                    {decision}
                                  </span>
                                  <div className="flex items-end gap-2">
                                    <div className="text-3xl font-bold">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          {
                            decision: "Full Speed Ahead",
                            color: "#22c55e",
                            count: results.filter(
                              (r) => r.decision === "Full Speed Ahead"
                            ).length,
                          },
                          {
                            decision: "Proceed Strategically",
                            color: "#4ade80",
                            count: results.filter(
                              (r) => r.decision === "Proceed Strategically"
                            ).length,
                          },
                          {
                            decision: "Implement with Oversight",
                            color: "#a3e635",
                            count: results.filter(
                              (r) => r.decision === "Implement with Oversight"
                            ).length,
                          },
                          {
                            decision: "Request Clarification",
                            color: "#facc15",
                            count: results.filter(
                              (r) => r.decision === "Request Clarification"
                            ).length,
                          },
                          {
                            decision: "Delay or Disengage",
                            color: "#f87171",
                            count: results.filter(
                              (r) => r.decision === "Delay or Disengage"
                            ).length,
                          },
                          {
                            decision: "Public Opinion",
                            color: publicResult?.color || "#94a3b8",
                            count: publicResult ? 1 : 0,
                            isPublic: true,
                          },
                        ].map(({ decision, color, count, isPublic }) => {
                          const percentage = isPublic
                            ? 100
                            : (count / results.length) * 100;
                          return (
                            <div
                              key={decision}
                              className="bg-white/10 p-4 rounded-xl relative overflow-hidden"
                            >
                              <div className="relative z-10">
                                <span className="text-sm font-medium text-white/90 mb-2 block">
                                  {decision}
                                </span>
                                <div className="flex items-end gap-2">
                                  {isPublic ? (
                                    <div className="text-xl font-bold">
                                      {publicResult?.mostLikely || "N/A"}
                                    </div>
                                  ) : (
                                    <>
                                      <div className="text-xl font-bold">
                                        {count}
                                      </div>
                                      <div className="text-xs text-white/70 mb-1">
                                        ({percentage.toFixed(1)}%)
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="text-xs text-white/60 mt-1">
                                  {isPublic ? "Consensus View" : "MBTI types"}
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

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">
                        Detailed Analysis
                      </h4>
                      <p className="text-gray-600 text-sm">
                        The charts below show how different MBTI personalities
                        analyze and approach this decision.
                      </p>
                    </div>
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
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Run a simulation to see results
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Personalities Tab */}
            <TabsContent value="personalities" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(DecisionService.mbtiDescriptions).map(
                  ([type, info]) => {
                    const famousPerson = getRandomFamousPerson(type);
                    return (
                      <div
                        key={type}
                        className="p-4 rounded-xl shadow-md bg-white"
                        style={{ borderLeft: `4px solid ${info.color}` }}
                      >
                        <div className="flex items-center justify-between">
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
                        <p className="text-xs mt-2 italic text-gray-500">
                          {famousPerson && `Famous example: ${famousPerson}`}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
