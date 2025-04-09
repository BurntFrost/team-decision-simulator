import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Types for the charts component
type ChartProps = {
  results: SimulationResult[];
  radarData: Record<string, any>[];
  archetypes: Array<{
    name: string;
    weights: Record<string, number>;
  }>;
  mbtiDescriptions: Record<string, {
    name: string;
    description: string;
    color: string;
  }>;
};

// Types
type FactorKey = 'data_quality' | 'roi_visibility' | 'autonomy_scope' | 'time_pressure' | 'social_complexity';

type FactorInfo = {
  label: string;
  description: string;
  lowDesc: string;
  highDesc: string;
};

type FactorInfoMap = {
  [K in FactorKey]: FactorInfo;
};

type Weights = {
  [K in FactorKey]: number;
};

type Inputs = Weights;

type SimulationResult = {
  name: string;
  score: number;
  decision: string;
  color: string;
};

type SliderInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: string) => void;
  info: FactorInfo;
};

// Factor explanations for tooltips
const factorInfo: FactorInfoMap = {
  data_quality: {
    label: "Data Quality",
    description: "How reliable, complete, and accurate is the available information?",
    lowDesc: "Unreliable, incomplete, or dubious data",
    highDesc: "Complete, verified, and trustworthy data"
  },
  roi_visibility: {
    label: "ROI Visibility",
    description: "How clear and measurable are the expected returns?",
    lowDesc: "Unclear benefits, hard to measure outcomes",
    highDesc: "Clear, quantifiable returns with specific metrics"
  },
  autonomy_scope: {
    label: "Autonomy & Scope",
    description: "How much control will you have over execution?",
    lowDesc: "Dependent on others with limited control",
    highDesc: "Full authority within well-defined boundaries"
  },
  time_pressure: {
    label: "Time Pressure",
    description: "How urgent is this decision?",
    lowDesc: "Plenty of time, minimal urgency",
    highDesc: "Immediate decision required, high urgency"
  },
  social_complexity: {
    label: "Social Complexity",
    description: "How many stakeholders are involved and how aligned are they?",
    lowDesc: "Few stakeholders with aligned interests",
    highDesc: "Many stakeholders with conflicting agendas"
  },
};

const archetypes = [
  { name: 'INTJ', weights: { data_quality: 0.35, roi_visibility: 0.30, autonomy_scope: 0.20, time_pressure: 0.10, social_complexity: -0.15 } },
  { name: 'ISTJ', weights: { data_quality: 0.40, roi_visibility: 0.20, autonomy_scope: 0.15, time_pressure: 0.15, social_complexity: -0.10 } },
  { name: 'ENTJ', weights: { data_quality: 0.25, roi_visibility: 0.35, autonomy_scope: 0.20, time_pressure: 0.15, social_complexity: -0.05 } },
  { name: 'INTP', weights: { data_quality: 0.40, roi_visibility: 0.15, autonomy_scope: 0.20, time_pressure: 0.05, social_complexity: -0.10 } }
];

// Preset scenarios for quick selection
const presetScenarios = {
  "High Quality Data": { data_quality: 0.9, roi_visibility: 0.6, autonomy_scope: 0.7, time_pressure: 0.3, social_complexity: 0.2 },
  "Time Critical": { data_quality: 0.6, roi_visibility: 0.5, autonomy_scope: 0.4, time_pressure: 0.9, social_complexity: 0.3 },
  "Limited Information": { data_quality: 0.3, roi_visibility: 0.4, autonomy_scope: 0.5, time_pressure: 0.6, social_complexity: 0.4 },
  "Complex Stakeholders": { data_quality: 0.5, roi_visibility: 0.6, autonomy_scope: 0.4, time_pressure: 0.2, social_complexity: 0.8 },
};

// Add these descriptions near the presetScenarios constant
const presetDescriptions = {
  "High Quality Data": "Scenario with reliable, complete data and clear metrics for evaluation",
  "Time Critical": "Urgent decision needed with significant time pressure and immediate impact",
  "Limited Information": "Decision context with incomplete or uncertain data and unclear outcomes",
  "Complex Stakeholders": "Multiple stakeholders involved with diverse and potentially conflicting interests"
};

const defaultInputs = {
  data_quality: 0.8,
  roi_visibility: 0.6,
  autonomy_scope: 0.7,
  time_pressure: 0.3,
  social_complexity: 0.2,
};

const calculateScore = (weights: Weights, inputs: Inputs): number =>
  (Object.keys(inputs) as FactorKey[]).reduce((sum, key) => sum + weights[key] * inputs[key], 0);

const getDecision = (score: number) => {
  if (score > 0.65) return { text: 'Proceed Strategically', color: '#4ade80' }; // Green
  if (score > 0.45) return { text: 'Request Clarification', color: '#facc15' }; // Yellow
  return { text: 'Delay or Disengage', color: '#f87171' }; // Red
};

// Enhanced Slider Input Component with tooltips
const SliderInput: React.FC<SliderInputProps> = ({ id, label, value, onChange, info }) => (
  <div className="flex flex-col mb-4">
    <div className="flex justify-between items-center mb-1">
      <label htmlFor={id} className="font-medium text-md">{info.label}</label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm text-gray-500 cursor-help">ⓘ</span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-medium">{info.description}</p>
            <div className="mt-2 text-sm grid grid-cols-2 gap-2">
              <div><span className="font-bold">Low:</span> {info.lowDesc}</div>
              <div><span className="font-bold">High:</span> {info.highDesc}</div>
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
        onChange={e => onChange(e.target.value)}
        className="flex-grow"
      />
      <span className="w-12 text-right font-mono">{(value * 100).toFixed(0)}%</span>
    </div>
  </div>
);

// Dynamically import Recharts components with no SSR
const Charts = dynamic<ChartProps>(() => import('@/components/TeamDecisionCharts'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
});

// MBTI type descriptions
const mbtiDescriptions = {
  INTJ: {
    name: "INTJ - The Architect",
    description: "Strategic planners who rely on data and logic. They excel at identifying patterns and developing long-term solutions.",
    color: "#2563eb" // blue-600
  },
  ISTJ: {
    name: "ISTJ - The Inspector",
    description: "Detail-oriented and systematic. They prefer established processes and make decisions based on proven methods.",
    color: "#16a34a" // green-600
  },
  ENTJ: {
    name: "ENTJ - The Commander",
    description: "Natural leaders who focus on efficiency and results. They excel at strategic thinking and implementing systematic improvements.",
    color: "#9333ea" // purple-600
  },
  INTP: {
    name: "INTP - The Logician",
    description: "Analytical problem-solvers who value precision. They excel at identifying logical inconsistencies and developing theoretical solutions.",
    color: "#ea580c" // orange-600
  }
};

// Add type for MBTI keys
type MBTIType = 'INTJ' | 'ISTJ' | 'ENTJ' | 'INTP';

// Enhanced Tabs Component
export const StyledTabs: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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

export default function TeamDecisionDashboard() {
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [showRadar, setShowRadar] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Format radar data for the personality types
  const radarData = Object.keys(factorInfo).map(key => {
    const dataPoint: Record<string, any> = { factor: factorInfo[key as FactorKey].label };
    archetypes.forEach(arch => {
      dataPoint[arch.name] = arch.weights[key as FactorKey];
    });
    return dataPoint;
  });

  // Trigger simulation by calculating scores and decisions
  const handleSimulate = () => {
    const newResults = archetypes.map(agent => {
      const score = parseFloat(calculateScore(agent.weights, inputs).toFixed(3));
      const decision = getDecision(score);
      return { 
        name: agent.name, 
        score, 
        decision: decision.text,
        color: decision.color
      };
    });
    setResults(newResults);
  };

  // Reset inputs and clear simulation results
  const handleReset = () => {
    setInputs(defaultInputs);
    setResults([]);
  };

  const handleInputChange = (key: FactorKey, value: string) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  const applyPreset = (presetName: keyof typeof presetScenarios) => {
    setInputs(presetScenarios[presetName]);
    setActivePreset(presetName);
  };

  // Compute majority decision from simulation results
  const decisionCounts: Record<string, number> = results.reduce((acc, r) => {
    acc[r.decision] = (acc[r.decision] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const majorityDecision = Object.entries(decisionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  const majorityColor = results.find(r => r.decision === majorityDecision)?.color || '#6b7280';

  return (
    <div className="p-6 space-y-6 bg-[#f5f7fa]">
      <div className="flex justify-between items-center bg-[#4455a6] text-white p-6 rounded-xl shadow-lg">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <h2 className="text-3xl font-bold cursor-help">Team Decision Simulator</h2>
            </TooltipTrigger>
            <TooltipContent 
              className="bg-white text-[#4455a6] p-4 max-w-[400px] space-y-2"
              side="bottom"
            >
              <p className="font-semibold">When to use:</p>
              <ul className="list-disc pl-4 text-sm space-y-1">
                <li>Making complex team decisions with multiple stakeholders</li>
                <li>Evaluating decisions under different conditions (time pressure, data quality)</li>
                <li>Understanding how different personality types might approach a decision</li>
              </ul>
              <p className="font-semibold mt-3">How it works:</p>
              <p className="text-sm">Adjust the sliders to match your situation's characteristics, or use preset scenarios. The simulator will show how different personality types would likely approach the decision, helping teams make more balanced choices.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex flex-wrap gap-2">
          {Object.keys(presetScenarios).map(scenario => {
            const isActive = scenario === activePreset;
            return (
              <Button 
                key={scenario} 
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={cn(
                  "relative transition-all duration-200 font-semibold",
                  "bg-white text-[#4455a6] border-white",
                  "hover:bg-[#e2e8f0] hover:text-[#4455a6]",
                  isActive && "bg-[#2563eb] text-white border-[#2563eb] ring-2 ring-white ring-offset-2 ring-offset-[#4455a6]"
                )}
                onClick={() => applyPreset(scenario as keyof typeof presetScenarios)}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-block w-full">{scenario}</span>
                    </TooltipTrigger>
                    <TooltipContent 
                      className="bg-white text-[#4455a6] p-2 text-sm max-w-[200px] text-center"
                      side="bottom"
                    >
                      {presetDescriptions[scenario as keyof typeof presetDescriptions]}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {Object.keys(inputs).map((key) => (
              <SliderInput
                key={key}
                id={key}
                label={key}
                value={inputs[key as FactorKey]}
                onChange={(value) => handleInputChange(key as FactorKey, value)}
                info={factorInfo[key as FactorKey]}
              />
            ))}
          </div>
          <div className="flex space-x-4 mt-6">
            <Button 
              onClick={handleSimulate} 
              className="w-32 bg-[#4455a6] hover:bg-[#3a4a8f] text-white font-semibold"
            >
              Simulate
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="border-[#4455a6] text-[#4455a6] hover:bg-[#4455a6] hover:text-white font-semibold"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {mounted && results.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="mb-6 p-6 rounded-xl bg-[#4455a6] text-white">
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <h3 className="text-2xl font-bold cursor-help">
                      Team Decision: <span className="text-white">{majorityDecision}</span>
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="bg-white text-[#4455a6] p-4 max-w-[400px] space-y-2"
                    side="bottom"
                  >
                    <p className="font-semibold">How this decision was reached:</p>
                    <ul className="list-disc pl-4 text-sm space-y-1">
                      <li>Each personality type evaluates the situation based on their decision-making preferences</li>
                      <li>The final decision represents the majority recommendation across all personality types</li>
                      <li>A stronger consensus indicates higher confidence in the recommendation</li>
                    </ul>
                    <p className="font-semibold mt-3">Decision Types:</p>
                    <ul className="list-disc pl-4 text-sm space-y-1">
                      <li><span className="text-green-600 font-medium">Proceed Strategically</span>: High confidence in positive outcome</li>
                      <li><span className="text-yellow-500 font-medium">Request Clarification</span>: More information needed</li>
                      <li><span className="text-red-500 font-medium">Delay or Disengage</span>: Significant risks or concerns identified</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-bold mb-4 text-[#4455a6]">Decision Breakdown</h4>
                <div className="space-y-4 bg-white rounded-xl p-6 shadow-inner">
                  {Object.entries(decisionCounts).map(([decision, count]) => {
                    const typesWithThisDecision = results
                      .filter(r => r.decision === decision)
                      .map(r => ({
                        name: r.name,
                        color: mbtiDescriptions[r.name as MBTIType].color,
                        description: mbtiDescriptions[r.name as MBTIType].name
                      }));

                    return (
                      <div key={decision} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: results.find(r => r.decision === decision)?.color }}></div>
                          <span className="font-bold text-[#4455a6]">{decision}: {count}</span>
                        </div>
                        <div className="ml-5 flex flex-wrap gap-2">
                          {typesWithThisDecision.map(type => (
                            <div
                              key={type.name}
                              className="text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 bg-white shadow-sm"
                              style={{ 
                                borderLeft: `3px solid ${type.color}`,
                                backgroundColor: `${type.color}10`
                              }}
                            >
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }}></span>
                              <span className="font-medium">{type.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-4 text-[#4455a6]">Simulation Analysis</h4>
                <div className="bg-white rounded-xl p-4 shadow-inner">
                  <Charts 
                    results={results}
                    radarData={radarData}
                    archetypes={archetypes}
                    mbtiDescriptions={mbtiDescriptions}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-4 text-[#4455a6]">MBTI Type Profiles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(mbtiDescriptions).map(([type, info]) => (
                    <div 
                      key={type} 
                      className="p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow"
                      style={{ borderLeft: `4px solid ${info.color}` }}
                    >
                      <h4 className="font-bold mb-2" style={{ color: info.color }}>
                        {info.name}
                      </h4>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}