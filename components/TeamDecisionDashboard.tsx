import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import * as DecisionService from '@/lib/decisionMatrixService';

// Custom Stepper Component
const StepperContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("flex w-full", className)}>
    {children}
  </div>
);

const StepperStep = ({ 
  isActive, 
  isCompleted, 
  stepNumber, 
  title, 
  description 
}: { 
  isActive: boolean, 
  isCompleted: boolean, 
  stepNumber: number, 
  title: string, 
  description: string 
}) => (
  <div className="flex-1 relative">
    <div className="flex items-center">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white",
        isActive ? "border-[#4455a6] text-[#4455a6]" : 
        isCompleted ? "border-green-500 bg-green-500 text-white" : 
        "border-gray-300 text-gray-400"
      )}>
        {isCompleted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <span>{stepNumber}</span>
        )}
      </div>
      <div className={cn(
        "flex-1 h-0.5",
        isCompleted ? "bg-green-500" : "bg-gray-200"
      )}></div>
    </div>
    <div className="mt-2">
      <div className={cn(
        "text-sm font-medium",
        isActive ? "text-[#4455a6]" : 
        isCompleted ? "text-green-600" : 
        "text-gray-500"
      )}>{title}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  </div>
);

// Mapping of MBTI types to famous people examples
const famousPeopleByMBTI: Record<string, string[]> = {
  'INTJ': ['Elon Musk', 'Mark Zuckerberg', 'Stephen Hawking', 'Nikola Tesla', 'Michelle Obama'],
  'ENTJ': ['Steve Jobs', 'Margaret Thatcher', 'Jack Welch', 'Gordon Ramsay', 'Jim Carrey'],
  'INTP': ['Albert Einstein', 'Larry Page', 'Bill Gates', 'Isaac Newton', 'Marie Curie'],
  'ENTP': ['Leonardo da Vinci', 'Richard Feynman', 'Barack Obama', 'Thomas Edison', 'Celine Dion'],
  'INFJ': ['Martin Luther King Jr.', 'Nelson Mandela', 'Mahatma Gandhi', 'Taylor Swift', 'Plato'],
  'ENFJ': ['Oprah Winfrey', 'Barack Obama', 'Jennifer Lawrence', 'Maya Angelou', 'Neil deGrasse Tyson'],
  'INFP': ['J.R.R. Tolkien', 'William Shakespeare', 'Johnny Depp', 'Princess Diana', 'Bob Dylan'],
  'ENFP': ['Robin Williams', 'Walt Disney', 'Robert Downey Jr.', 'Ellen DeGeneres', 'Mark Twain'],
  'ISTJ': ['Jeff Bezos', 'Queen Elizabeth II', 'Warren Buffett', 'George Washington', 'Hermione Granger'],
  'ESTJ': ['Henry Ford', 'Sheryl Sandberg', 'Martha Stewart', 'John D. Rockefeller', 'Sonia Sotomayor'],
  'ISFJ': ['Mother Teresa', 'Kate Middleton', 'Beyoncé', 'Rosa Parks', 'Dr. Fauci'],
  'ESFJ': ['Taylor Swift', 'Jennifer Garner', 'Bill Clinton', 'Hugh Jackman', 'Steve Harvey'],
  'ISTP': ['Michael Jordan', 'Tom Cruise', 'Clint Eastwood', 'Amelia Earhart', 'Erwin Rommel'],
  'ESTP': ['Donald Trump', 'Ernest Hemingway', 'Madonna', 'Eddie Murphy', 'Winston Churchill'],
  'ISFP': ['Michael Jackson', 'Frida Kahlo', 'Keanu Reeves', 'David Bowie', 'Marilyn Monroe'],
  'ESFP': ['Adele', 'Dwayne "The Rock" Johnson', 'Jamie Foxx', 'Miley Cyrus', 'Elvis Presley']
};

// Helper function to get a random famous person for a given MBTI type
const getRandomFamousPerson = (mbtiType: string): string => {
  const people = famousPeopleByMBTI[mbtiType] || [];
  if (people.length === 0) return '';
  
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

// Add type for MBTI keys
type MBTIType = 'INTJ' | 'ISTJ' | 'ENTJ' | 'INTP';

export default function TeamDecisionDashboard() {
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState<DecisionService.Inputs>(DecisionService.defaultInputs);
  const [results, setResults] = useState<DecisionService.SimulationResult[]>([]);
  const [publicResult, setPublicResult] = useState<DecisionService.PublicOpinionResult | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  
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
    
    // Move to results step after simulation
    setActiveStep(3);
  };

  // Reset inputs and clear simulation results
  const handleReset = () => {
    setInputs(DecisionService.defaultInputs);
    setResults([]);
    setPublicResult(null);
    setActivePreset(null);
    setActiveStep(1);
  };

  const handleInputChange = (key: DecisionService.FactorKey, value: string) => {
    setInputs(prev => {
      const updated = { ...prev, [key]: parseFloat(value) };
      return updated;
    });
    
    // Clear active preset when manually adjusting inputs
    if (activePreset) {
      setActivePreset(null);
    }
  };

  const applyPreset = (presetName: keyof typeof DecisionService.presetScenarios) => {
    setInputs(DecisionService.presetScenarios[presetName]);
    setActivePreset(presetName);
    setActiveStep(2);
  };

  // Compute majority decision from simulation results
  const majorityDecisionData = results.length > 0 
    ? DecisionService.calculateMajorityDecision(results)
    : { decision: '', color: '', counts: {} };
  
  const { decision: majorityDecision, color: majorityColor, counts: decisionCounts } = majorityDecisionData;

  return (
    <div className="p-6 space-y-6 bg-[#f5f7fa]">
      {/* Hero Section with App Description */}
      <div className="bg-[#4455a6] text-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold">Team Decision Simulator</h2>
        <p className="mt-2 text-white/80 max-w-3xl">
          This tool helps teams make better decisions by simulating how different personality types 
          would approach your specific situation. Follow the steps below to get a balanced perspective 
          on your decision.
        </p>
        
        <div className="mt-6 bg-white/10 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">When to use this tool:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="bg-white text-[#4455a6] rounded-full p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Complex decisions with multiple stakeholders</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-white text-[#4455a6] rounded-full p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Strategic planning with uncertain variables</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-white text-[#4455a6] rounded-full p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Building consensus across diverse team members</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Step by Step Guide */}
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-[#4455a6]/5 pb-2">
          <CardTitle className="text-xl text-[#4455a6]">Follow These Steps</CardTitle>
          <CardDescription>Complete each step to get your team decision recommendation</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Custom Stepper */}
          <StepperContainer className="mb-8">
            <StepperStep 
              isActive={activeStep === 1}
              isCompleted={activeStep > 1}
              stepNumber={1}
              title="Choose a Scenario"
              description="Select a preset or customize"
            />
            
            <StepperStep 
              isActive={activeStep === 2}
              isCompleted={activeStep > 2}
              stepNumber={2}
              title="Adjust Factors"
              description="Customize decision variables"
            />
            
            <StepperStep 
              isActive={activeStep === 3}
              isCompleted={activeStep > 3}
              stepNumber={3}
              title="Review Results"
              description="Analyze personality insights"
            />
          </StepperContainer>
          
          {/* Step 1: Choose a Scenario */}
          {activeStep === 1 && (
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-4 text-[#4455a6]">Step 1: Choose a Scenario</h3>
              <p className="text-gray-600 mb-6">Select a preset scenario that best matches your situation, or create a custom one:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Object.keys(DecisionService.presetScenarios).map(scenario => {
                  const isActive = scenario === activePreset;
                  return (
                    <Card 
                      key={scenario} 
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                        isActive ? "border-[#4455a6] bg-[#4455a6]/5" : "border-transparent"
                      )}
                      onClick={() => applyPreset(scenario as keyof typeof DecisionService.presetScenarios)}
                    >
                      <CardContent className="p-5">
                        <h4 className="font-semibold text-[#4455a6]">{scenario}</h4>
                        <p className="text-sm text-gray-600 mt-2">
                          {DecisionService.presetDescriptions[scenario as keyof typeof DecisionService.presetDescriptions]}
                        </p>
                        
                        {isActive && (
                          <div className="mt-3 text-xs bg-[#4455a6] text-white px-3 py-1 rounded-full inline-block">
                            Selected
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <div className="flex justify-between mt-8">
                <span></span>
                <Button 
                  onClick={() => setActiveStep(2)}
                  className="bg-[#4455a6] hover:bg-[#3a4a8f]"
                >
                  Continue to Adjust Factors
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 2: Adjust Factors */}
          {activeStep === 2 && (
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-4 text-[#4455a6]">Step 2: Adjust Decision Factors</h3>
              <p className="text-gray-600 mb-6">
                Fine-tune these factors to match your specific situation. Each factor influences how different personality
                types will approach the decision.
              </p>
              
              {activePreset && (
                <div className="mb-6 p-3 bg-[#4455a6]/5 rounded-lg flex items-center">
                  <div className="mr-3 text-[#4455a6]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium">Using preset: {activePreset}</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Values are pre-set for this scenario. Adjust any slider to customize.
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
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {Object.keys(inputs).map((key) => (
                    <SliderInput
                      key={key}
                      id={key}
                      label={key}
                      value={inputs[key as DecisionService.FactorKey]}
                      onChange={(value) => handleInputChange(key as DecisionService.FactorKey, value)}
                      info={DecisionService.factorInfo[key as DecisionService.FactorKey]}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep(1)}
                  className="border-[#4455a6] text-[#4455a6]"
                >
                  Back to Scenarios
                </Button>
                <Button 
                  onClick={handleSimulate}
                  className="bg-[#4455a6] hover:bg-[#3a4a8f]"
                >
                  Run Simulation
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 3: Review Results */}
          {activeStep === 3 && results.length > 0 && (
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-4 text-[#4455a6]">Step 3: Review Decision Results</h3>
              <p className="text-gray-600 mb-6">
                Here's how different personality types would approach this decision based on your inputs.
                The final recommendation represents the majority opinion.
              </p>
              
              <div className="bg-[#4455a6] text-white p-6 rounded-xl mb-8">
                <div className="flex items-center">
                  <div className="mr-6">
                    <span className="text-white/70 text-sm">Team Recommendation</span>
                    <h3 className="text-2xl font-bold">
                      {majorityDecision}
                    </h3>
                  </div>
                  
                  <div className="flex-1 h-14 p-3 bg-white/10 rounded-lg flex items-center">
                    {Object.entries(decisionCounts).map(([decision, count], index) => {
                      const color = decision === "Proceed Strategically" ? "#4ade80" : 
                                    decision === "Request Clarification" ? "#facc15" : "#f87171";
                      const percentage = (count / results.length) * 100;
                      
                      return (
                        <div 
                          key={decision} 
                          className="h-full rounded-md flex items-center justify-center font-medium text-xs transition-all duration-500"
                          style={{ 
                            backgroundColor: color, 
                            width: `${percentage}%`,
                            marginRight: index < Object.entries(decisionCounts).length - 1 ? '4px' : '0'
                          }}
                          title={`${decision}: ${count} personalities (${percentage.toFixed(0)}%)`}
                        >
                          {percentage >= 15 && `${percentage.toFixed(0)}%`}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="ml-6 text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <span className="text-white/70 text-sm">Confidence</span>
                            <p className="text-xl font-bold">{(Object.values(decisionCounts)[0] / results.length * 100).toFixed(0)}%</p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-sm">
                            Percentage of personality types that agree with the majority decision.
                            Higher confidence means stronger consensus.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                {publicResult && (
                  <div className="mt-6 pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white/70 text-sm">Public Opinion</span>
                        <div className="flex items-center mt-1">
                          <span className="font-semibold">{publicResult.mostLikely}</span>
                          <span 
                            className="ml-2 rounded-full px-2 py-0.5 text-xs font-bold"
                            style={{ backgroundColor: publicResult.color, color: '#000' }}
                          >
                            {(publicResult.probabilities[publicResult.mostLikely] * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-1/2 h-6 bg-white/10 rounded-full overflow-hidden">
                        {Object.entries(publicResult.probabilities).map(([decision, prob], i) => {
                          const bgColor = decision === "Proceed Strategically" ? "#4ade80" : 
                                        decision === "Request Clarification" ? "#facc15" : "#f87171";
                          const width = `${prob * 100}%`;
                          let leftOffset = 0;
                          
                          if (i > 0) {
                            leftOffset = Object.entries(publicResult.probabilities)
                              .slice(0, i)
                              .reduce((sum, [_, p]) => sum + p, 0) * 100;
                          }
                          
                          return (
                            <div 
                              key={decision} 
                              className="h-full inline-block"
                              style={{ 
                                width, 
                                backgroundColor: bgColor,
                                position: 'relative',
                                left: `${leftOffset}%`
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <h4 className="text-lg font-semibold mb-4 text-[#4455a6]">Personality Breakdown</h4>
              <div className="space-y-4 bg-white rounded-xl p-6 shadow-inner mb-8">
                {Object.entries(decisionCounts).map(([decision, count]) => {
                  const typesWithThisDecision = results
                    .filter(r => r.decision === decision)
                    .map(r => ({
                      name: r.name,
                      color: DecisionService.mbtiDescriptions[r.name as MBTIType].color,
                      description: DecisionService.mbtiDescriptions[r.name as MBTIType].name,
                      famousPerson: getRandomFamousPerson(r.name)
                    }));

                  return (
                    <div key={decision} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: results.find(r => r.decision === decision)?.color }}></div>
                        <span className="font-bold text-[#4455a6]">{decision}: {count}</span>
                        
                        {publicResult && publicResult.mostLikely === decision && (
                          <span className="ml-2 inline-block bg-[#4455a6]/10 text-[#4455a6] text-xs px-2 py-0.5 rounded-full">
                            Most likely public choice ({(publicResult.probabilities[decision] * 100).toFixed(0)}%)
                          </span>
                        )}
                      </div>
                      <div className="ml-5 flex flex-wrap gap-2">
                        {typesWithThisDecision.map(type => (
                          <div
                            key={type.name}
                            className="text-sm px-3 py-1.5 rounded-lg flex flex-col items-start gap-1 bg-white shadow-sm"
                            style={{ 
                              borderLeft: `3px solid ${type.color}`,
                              backgroundColor: `${type.color}10`
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }}></span>
                              <span className="font-medium">{type.description}</span>
                            </div>
                            {type.famousPerson && (
                              <span className="text-xs text-gray-600 pl-4">Like {type.famousPerson}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <h4 className="text-lg font-semibold mb-4 text-[#4455a6]">Detailed Analysis</h4>
              <div className="bg-white rounded-xl p-4 shadow-inner">
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
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveStep(2)}
                  className="border-[#4455a6] text-[#4455a6]"
                >
                  Adjust Factors
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="border-[#4455a6] text-[#4455a6]"
                >
                  Start Over
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Bottom section - Only shown if no simulation run yet */}
      {(!mounted || results.length === 0) && (
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-[#4455a6]/5">
            <CardTitle className="text-xl text-[#4455a6]">About Personality Types</CardTitle>
            <CardDescription>How different MBTI types approach decision-making</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(DecisionService.mbtiDescriptions).map(([type, info]) => {
                const famousPerson = getRandomFamousPerson(type);
                return (
                  <div 
                    key={type} 
                    className="p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow"
                    style={{ borderLeft: `4px solid ${info.color}` }}
                  >
                    <h4 className="font-bold mb-2" style={{ color: info.color }}>
                      {info.name}
                    </h4>
                    <p className="text-sm text-gray-600">{info.description}</p>
                    {famousPerson && (
                      <p className="text-xs mt-2 italic text-gray-500">
                        Famous example: <span className="font-medium">{famousPerson}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}