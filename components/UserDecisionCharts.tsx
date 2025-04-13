import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid,
  Sankey,
  Tooltip,
  Rectangle,
  ReferenceLine,
  Layer,
  Curve,
  Line,
  Dot,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { StyledTabs } from "./UserDecisionDashboard";
import * as DecisionService from "@/lib/decisionMatrixService";

// Import specific types
import {
  FactorKey,
  SimulationResult,
  ArchetypeProfile,
  MBTIDescription,
  PublicOpinionResult,
} from "@/lib/decisionMatrixService";

// MBTI Type Definitions and Helper Functions
interface MBTITypeInfo {
  description: string;
  color: string;
  famousPeople: string[];
}

const MBTI_INFO: Record<string, MBTITypeInfo> = {
  INTJ: {
    description:
      "Strategic, innovative thinkers who value logic and systematic planning",
    color: "#2563eb", // Blue
    famousPeople: ["Elon Musk", "Stephen Hawking", "Nikola Tesla"],
  },
  ENTJ: {
    description:
      "Natural leaders who excel at strategic planning and execution",
    color: "#7c3aed", // Purple
    famousPeople: ["Steve Jobs", "Margaret Thatcher", "Gordon Ramsay"],
  },
  INTP: {
    description:
      "Logical, creative problem solvers with a thirst for knowledge",
    color: "#059669", // Green
    famousPeople: ["Albert Einstein", "Bill Gates", "Larry Page"],
  },
  ENTP: {
    description: "Quick-thinking innovators who love intellectual challenges",
    color: "#ea580c", // Orange
    famousPeople: ["Mark Twain", "Thomas Edison", "Leonardo da Vinci"],
  },
  INFJ: {
    description: "Insightful idealists driven by deep personal values",
    color: "#be185d", // Pink
    famousPeople: ["Martin Luther King Jr.", "Nelson Mandela", "Carl Jung"],
  },
  ENFJ: {
    description:
      "Charismatic leaders focused on personal growth and development",
    color: "#0891b2", // Cyan
    famousPeople: ["Barack Obama", "Oprah Winfrey", "Morgan Freeman"],
  },
  INFP: {
    description: "Creative idealists guided by their core values and beliefs",
    color: "#4338ca", // Indigo
    famousPeople: ["William Shakespeare", "J.R.R. Tolkien", "Vincent van Gogh"],
  },
  ENFP: {
    description: "Enthusiastic creatives who love exploring possibilities",
    color: "#b91c1c", // Red
    famousPeople: ["Robin Williams", "Walt Disney", "Mark Twain"],
  },
  ISTJ: {
    description: "Practical, fact-minded individuals who value reliability",
    color: "#1e40af", // Dark Blue
    famousPeople: ["Jeff Bezos", "Queen Elizabeth II", "George Washington"],
  },
  ESTJ: {
    description:
      "Efficient organizers who excel at implementing practical solutions",
    color: "#166534", // Dark Green
    famousPeople: ["John D. Rockefeller", "Henry Ford", "Judge Judy"],
  },
  ISFJ: {
    description: "Dedicated caretakers who value tradition and security",
    color: "#86198f", // Dark Purple
    famousPeople: ["Mother Teresa", "Kate Middleton", "George H.W. Bush"],
  },
  ESFJ: {
    description: "Caring, social individuals who value harmony and cooperation",
    color: "#9f1239", // Dark Pink
    famousPeople: ["Taylor Swift", "Bill Clinton", "Sally Field"],
  },
  ISTP: {
    description: "Versatile problem-solvers with a practical approach",
    color: "#854d0e", // Dark Yellow
    famousPeople: ["Tom Cruise", "Clint Eastwood", "Michael Jordan"],
  },
  ESTP: {
    description: "Action-oriented realists who thrive on spontaneity",
    color: "#b45309", // Dark Orange
    famousPeople: ["Donald Trump", "Madonna", "Ernest Hemingway"],
  },
  ISFP: {
    description: "Gentle creatives who live in the moment",
    color: "#0f766e", // Dark Teal
    famousPeople: ["Michael Jackson", "Britney Spears", "David Beckham"],
  },
  ESFP: {
    description: "Enthusiastic performers who love life and spontaneity",
    color: "#6b21a8", // Dark Violet
    famousPeople: ["Marilyn Monroe", "Elvis Presley", "Jamie Oliver"],
  },
};

const getMBTIDescription = (mbtiType: string): string => {
  return MBTI_INFO[mbtiType]?.description || "Description not available";
};

const getMBTIColor = (mbtiType: string): string => {
  return MBTI_INFO[mbtiType]?.color || "#64748b"; // Default to slate if not found
};

const getRandomFamousPerson = (mbtiType: string): string => {
  const people = [
    ...(MBTI_INFO[mbtiType]?.famousPeople || []),
    ...(famousPeopleByMBTI[mbtiType] || []),
  ];
  return people.length > 0
    ? people[Math.floor(Math.random() * people.length)]
    : "";
};

// Add type for heat map data row
interface HeatMapDataRow {
  name: string;
  totalScore: number;
  [key: string]: string | number; // Allow dynamic factor names
}

export type Props = {
  results: SimulationResult[];
  radarData: Record<string, any>[];
  archetypes: ArchetypeProfile[];
  mbtiDescriptions: Record<string, MBTIDescription>;
  inputs: DecisionService.Inputs;
  publicResult?: PublicOpinionResult | null;
  publicWeights: Record<FactorKey, number>;
};

// Define types for our Sankey nodes and links
interface SankeyNode {
  name: string;
  color?: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
  // Additional metadata for tooltips
  factorName?: string;
  personalityName?: string;
  decisionName?: string;
  weight?: number;
  inputValue?: number;
  isPositive?: boolean;
  confidence?: number;
  color?: string;
  mbtiColor?: string;
}

// Define a custom type for what we're adding to nodes for coloring
interface ExtendedSankeyNode extends SankeyNode {
  // Node properties
  index?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  depth?: number;
  value?: number;
  fill?: string;

  // Link properties
  source?: number;
  target?: number;

  // Our custom properties
  factorName?: string;
  personalityName?: string;
  decisionName?: string;
  weight?: number;
  inputValue?: number;
  isPositive?: boolean;
  confidence?: number;
}

// Add a mapping of MBTI types to famous people examples
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
    "Bill Gates",
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

// Helper functions for data processing
const generateDecisionFlowData = (
  archetypes: Props["archetypes"],
  results: Props["results"],
  mbtiDescriptions: Props["mbtiDescriptions"],
  inputs?: Record<FactorKey, number>
) => {
  if (!inputs) return { nodes: [], links: [] };

  // Create properly formatted nodes for Sankey diagram
  const nodes: SankeyNode[] = [
    // Input nodes
    ...Object.keys(inputs).map((factor) => ({
      name: factor
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      color: "#64748b", // Slate color for input nodes
    })),
    // MBTI nodes
    ...archetypes.map((arch) => ({
      name: arch.name,
      color: mbtiDescriptions[arch.name]?.color || "#4455a6", // Use MBTI description's color
    })),
    // Decision nodes
    { name: "Proceed Strategically", color: "#4ade80" },
    { name: "Request Clarification", color: "#facc15" },
    { name: "Delay or Disengage", color: "#f87171" },
  ];

  // Create properly formatted links for Sankey diagram
  const links: SankeyLink[] = [];

  // Connect inputs to MBTI types
  Object.keys(inputs).forEach((factor, factorIndex) => {
    archetypes.forEach((arch, archIndex) => {
      const weight = arch.weights[factor as FactorKey];
      const input = inputs[factor as FactorKey];
      // Only show connections for significant influences (positive or negative)
      if (Math.abs(weight) > 0.05) {
        // Determine color based on positive/negative influence
        const color =
          weight > 0 ? "rgba(59, 130, 246, 0.7)" : "rgba(239, 68, 68, 0.7)"; // Blue for positive, red for negative

        links.push({
          source: factorIndex,
          target: Object.keys(inputs).length + archIndex,
          value: Math.abs(weight * input) * 10, // Increased scaling for better visibility
          // Store additional metadata for tooltips
          factorName: factor
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          personalityName: arch.name,
          weight: weight,
          inputValue: input,
          isPositive: weight > 0,
          color: color,
        });
      }
    });
  });

  // Connect MBTI types to decisions
  results.forEach((result, index) => {
    const archIndex = Object.keys(inputs).length + index;
    const decisionIndex = (() => {
      switch (result.decision) {
        case "Proceed Strategically":
          return nodes.length - 3;
        case "Request Clarification":
          return nodes.length - 2;
        case "Delay or Disengage":
          return nodes.length - 1;
        default:
          return nodes.length - 1;
      }
    })();

    // Use MBTI color for personality → decision links
    const mbtiColor =
      mbtiDescriptions[result.name]?.color || "rgba(68, 85, 166, 0.7)";

    links.push({
      source: archIndex,
      target: decisionIndex,
      value: result.score * 15, // Increased scaling for visibility
      // Store additional metadata for tooltips
      personalityName: result.name,
      decisionName: result.decision,
      confidence: result.score,
      color: mbtiColor,
    });
  });

  return { nodes, links };
};

// Creates quadrant data for decision landscape
const generateQuadrantData = (results: Props["results"]) => {
  // Generate artificial coordinates based on decisiveness and confidence
  return results.map((result) => {
    // Map decision to x value (decisiveness)
    const decisiveness = (() => {
      switch (result.decision) {
        case "Proceed Strategically":
          return 80 + Math.random() * 15;
        case "Request Clarification":
          return 40 + Math.random() * 20;
        case "Delay or Disengage":
          return 10 + Math.random() * 20;
        default:
          return 50;
      }
    })();

    // Use score as confidence (y value)
    const confidence = result.score * 100;

    return {
      name: result.name,
      decisiveness,
      confidence,
      decision: result.decision,
      color: result.color,
      size: 800, // Size of the dot
    };
  });
};

// Generate heat map data showing how each factor contributes to decisions
const generateHeatMapData = (
  archetypes: Props["archetypes"],
  inputs?: Record<FactorKey, number>
): HeatMapDataRow[] => {
  if (!inputs) return [];

  // Get all factor names
  const factorNames = Object.keys(inputs).map((key) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );

  // Calculate contribution of each factor to each personality's decision
  return archetypes.map((arch) => {
    const contributions: Record<string, number> = {};
    let totalContribution = 0;

    Object.keys(inputs).forEach((factor) => {
      const weight = arch.weights[factor as FactorKey];
      const input = inputs[factor as FactorKey];
      const contribution = weight * input;
      const formattedName = factor
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      contributions[formattedName] = contribution;
      totalContribution += contribution;
    });

    return {
      name: arch.name,
      ...contributions,
      totalScore: totalContribution,
    };
  });
};

// Define type for the factor info that comes from TeamDecisionDashboard
type FactorInfo = {
  label: string;
  description: string;
  lowDesc: string;
  highDesc: string;
};

type FactorInfoMap = {
  [K in FactorKey]: FactorInfo;
};

// Add public opinion data to radar chart
const addPublicDataToRadar = (
  radarData: Record<string, any>[],
  publicWeights?: Record<FactorKey, number>
) => {
  if (!publicWeights) return radarData;

  return radarData.map((point) => {
    // Extract the factor key from the factor label
    const factorKey = Object.keys(DecisionService.factorInfo).find(
      (key) =>
        DecisionService.factorInfo[key as FactorKey].label === point.factor
    ) as FactorKey | undefined;

    if (factorKey && publicWeights[factorKey] !== undefined) {
      return {
        ...point,
        // Add public opinion weight
        "Public Opinion": publicWeights[factorKey],
      };
    }

    return point;
  });
};

// Add this helper function to calculate similarity between public opinion and MBTI types
const findMostSimilarMBTIType = (
  publicWeights: Record<FactorKey, number>,
  archetypes: DecisionService.ArchetypeProfile[],
  mbtiDescriptions: Record<string, DecisionService.MBTIDescription>
): { type: string; similarity: number; description: string; color: string } => {
  if (!publicWeights) {
    return { type: "", similarity: 0, description: "", color: "" };
  }

  // Calculate similarity scores using cosine similarity
  const similarities = archetypes.map((arch) => {
    // Get weights as vectors
    const archWeights = Object.keys(publicWeights).map(
      (key) => arch.weights[key as FactorKey]
    );
    const pubWeights = Object.keys(publicWeights).map(
      (key) => publicWeights[key as FactorKey]
    );

    // Calculate dot product
    let dotProduct = 0;
    let archMagnitude = 0;
    let pubMagnitude = 0;

    for (let i = 0; i < archWeights.length; i++) {
      dotProduct += archWeights[i] * pubWeights[i];
      archMagnitude += archWeights[i] * archWeights[i];
      pubMagnitude += pubWeights[i] * pubWeights[i];
    }

    archMagnitude = Math.sqrt(archMagnitude);
    pubMagnitude = Math.sqrt(pubMagnitude);

    // Cosine similarity
    const similarity = dotProduct / (archMagnitude * pubMagnitude);

    return {
      type: arch.name,
      similarity: similarity,
      description: mbtiDescriptions[arch.name].name,
      color: mbtiDescriptions[arch.name].color,
    };
  });

  // Find the most similar MBTI type
  return similarities.reduce((prev, current) =>
    current.similarity > prev.similarity ? current : prev
  );
};

// Add new helper function for calculating circular positions
const calculateCircularPosition = (
  index: number,
  total: number,
  radius: number,
  centerX: number,
  centerY: number
) => {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
};

// Add new helper function for creating curved paths
const createCurvedPath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  curvature: number = 0.5
) => {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const controlX = midX;
  const controlY = midY - (endY - startY) * curvature;
  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
};

const UserDecisionCharts: React.FC<Props> = ({
  results,
  radarData,
  archetypes,
  mbtiDescriptions,
  inputs,
  publicResult,
  publicWeights,
}) => {
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("radar");

  const handleMouseEnter = (type: string) => {
    setHoveredType(type);
  };

  const handleMouseLeave = () => {
    setHoveredType(null);
  };

  // Generate data for visualizations
  const quadrantData = generateQuadrantData(results);
  const decisionFlowData = generateDecisionFlowData(
    archetypes,
    results,
    mbtiDescriptions,
    inputs
  );
  const heatMapData = generateHeatMapData(archetypes, inputs);
  const enhancedRadarData = publicWeights
    ? addPublicDataToRadar(radarData, publicWeights)
    : radarData;

  // Find most similar MBTI type to public opinion
  const similarMBTIType = publicWeights
    ? findMostSimilarMBTIType(publicWeights, archetypes, mbtiDescriptions)
    : { type: "", similarity: 0, description: "", color: "" };

  // Add public opinion to quadrant data if available
  const enhancedQuadrantData = [...quadrantData];
  if (publicResult) {
    // Calculate decisiveness based on probabilities
    const proceedProb = publicResult.probabilities["Proceed Strategically"];
    const decisiveness = 30 + proceedProb * 70; // Scale from 30-100

    enhancedQuadrantData.push({
      name: "Public",
      decisiveness,
      confidence: publicResult.score * 100,
      decision: publicResult.mostLikely,
      color: publicResult.color,
      size: 1000, // Make public opinion marker larger
    });
  }

  // Extract factor names for heat map
  const factorNames = inputs
    ? Object.keys(inputs).map((key) =>
        key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
    : [];

  // Helper function to determine if a link should be highlighted
  const shouldHighlightLink = (link: SankeyLink) => {
    if (!hoveredType) return true;

    // Get the source and target node indices
    const sourceNode = decisionFlowData.nodes[link.source];
    const targetNode = decisionFlowData.nodes[link.target];

    // Check if the link is connected to the hovered MBTI type
    return sourceNode.name === hoveredType || targetNode.name === hoveredType;
  };

  return (
    <Tabs
      defaultValue="radar"
      className="w-full"
      onValueChange={(value) => setActiveTab(value)}
    >
      <TabsList className="w-full mb-4 bg-[#4455a6]/10 p-1 rounded-xl">
        <TabsTrigger
          value="bar"
          className={cn(
            "flex-1 rounded-lg font-semibold",
            "data-[state=active]:bg-[#4455a6]",
            "data-[state=active]:text-white",
            "data-[state=active]:shadow-lg",
            "data-[state=inactive]:py-1",
            "transition-all duration-200"
          )}
        >
          Confidence Scores
        </TabsTrigger>
        <TabsTrigger
          value="radar"
          className={cn(
            "flex-1 rounded-lg font-semibold",
            "data-[state=active]:bg-[#4455a6]",
            "data-[state=active]:text-white",
            "data-[state=active]:shadow-lg",
            "data-[state=inactive]:py-1",
            "transition-all duration-200"
          )}
        >
          Personality Weights
        </TabsTrigger>
        <TabsTrigger
          value="quadrant"
          className={cn(
            "flex-1 rounded-lg font-semibold",
            "data-[state=active]:bg-[#4455a6]",
            "data-[state=active]:text-white",
            "data-[state=active]:shadow-lg",
            "data-[state=inactive]:py-1",
            "transition-all duration-200"
          )}
        >
          Decision Landscape
        </TabsTrigger>
        <TabsTrigger
          value="flow"
          className={cn(
            "flex-1 rounded-lg font-semibold",
            "data-[state=active]:bg-[#4455a6]",
            "data-[state=active]:text-white",
            "data-[state=active]:shadow-lg",
            "data-[state=inactive]:py-1",
            "transition-all duration-200"
          )}
        >
          Decision Flow
        </TabsTrigger>
        <TabsTrigger
          value="heatmap"
          className={cn(
            "flex-1 rounded-lg font-semibold",
            "data-[state=active]:bg-[#4455a6]",
            "data-[state=active]:text-white",
            "data-[state=active]:shadow-lg",
            "data-[state=inactive]:py-1",
            "transition-all duration-200"
          )}
        >
          Factor Influence
        </TabsTrigger>
        {publicResult && (
          <TabsTrigger
            value="public"
            className={cn(
              "flex-1 rounded-lg font-semibold",
              "data-[state=active]:bg-[#4455a6]",
              "data-[state=active]:text-white",
              "data-[state=active]:shadow-lg",
              "data-[state=inactive]:py-1",
              "transition-all duration-200"
            )}
          >
            Public Opinion
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="bar" className="mt-2">
        <div className="mb-4 text-sm text-[#4455a6] font-medium bg-[#4455a6]/5 p-3 rounded-lg">
          Each personality type's confidence score determines their decision
          recommendation. Higher scores lead to more proactive decisions.
        </div>
        <div className="relative">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={results}
              margin={{ top: 20, right: 180, left: 20, bottom: 70 }}
              barCategoryGap={30}
            >
              <defs>
                <linearGradient
                  id="confidenceGradient"
                  x1="0"
                  y1="1"
                  x2="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.1} />
                  <stop offset="35%" stopColor="#facc15" stopOpacity={0.1} />
                  <stop offset="55%" stopColor="#a3e635" stopOpacity={0.1} />
                  <stop offset="65%" stopColor="#4ade80" stopOpacity={0.1} />
                  <stop offset="85%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              {/* Background */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#confidenceGradient)"
              />

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94a3b8"
                strokeOpacity={0.2}
              />

              {/* Threshold lines */}
              <ReferenceLine
                y={0.85}
                stroke="#22c55e"
                strokeWidth={2}
                label={{
                  value: "Full Speed Ahead (85%)",
                  position: "right",
                  fill: "#15803d",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <ReferenceLine
                y={0.65}
                stroke="#4ade80"
                strokeWidth={2}
                label={{
                  value: "Proceed Strategically (65%)",
                  position: "right",
                  fill: "#15803d",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <ReferenceLine
                y={0.55}
                stroke="#a3e635"
                strokeWidth={2}
                label={{
                  value: "Implement with Oversight (55%)",
                  position: "right",
                  fill: "#65a30d",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <ReferenceLine
                y={0.35}
                stroke="#facc15"
                strokeWidth={2}
                label={{
                  value: "Request Clarification (35%)",
                  position: "right",
                  fill: "#a16207",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />

              <XAxis
                dataKey="name"
                tick={{ fill: "#4455a6", fontWeight: 500 }}
                onMouseEnter={(e) => handleMouseEnter(e.value)}
                onMouseLeave={handleMouseLeave}
                height={70}
                tickLine={false}
                axisLine={{ stroke: "#94a3b8", strokeOpacity: 0.3 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                fontSize={12}
              />
              <YAxis
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                tick={{ fill: "#4455a6", fontWeight: 500 }}
                axisLine={{ stroke: "#94a3b8", strokeOpacity: 0.3 }}
                tickLine={false}
                fontSize={12}
              />

              <Bar
                dataKey="score"
                name="Decision Score"
                animationDuration={800}
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              >
                {results.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={entry.color}
                    fillOpacity={
                      hoveredType && hoveredType !== entry.name ? 0.3 : 0.8
                    }
                    stroke={
                      hoveredType === entry.name
                        ? mbtiDescriptions[entry.name].color
                        : entry.color
                    }
                    strokeWidth={hoveredType === entry.name ? 2 : 0}
                  />
                ))}
              </Bar>

              {/* Bar labels */}
              {results.map((entry) => (
                <text
                  key={`label-${entry.name}`}
                  x={0}
                  y={0}
                  dx={16}
                  dy={-10}
                  textAnchor="middle"
                  fill={entry.color}
                  fontSize={12}
                  fontWeight="bold"
                  className="recharts-bar-label"
                >
                  {`${(entry.score * 100).toFixed(0)}%`}
                </text>
              ))}

              <RechartsTooltip
                cursor={{ fill: "rgba(68, 85, 166, 0.05)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const mbtiInfo = mbtiDescriptions[data.name];
                    const decision = data.decision;
                    const famousPerson = getRandomFamousPerson(data.name);

                    return (
                      <div className="p-3 bg-white border border-[#4455a6]/20 rounded-lg shadow-lg max-w-[300px]">
                        <div className="flex items-center gap-2 border-b border-[#4455a6]/10 pb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: mbtiInfo.color }}
                          ></div>
                          <p
                            className="font-semibold"
                            style={{ color: mbtiInfo.color }}
                          >
                            {mbtiInfo.name}
                          </p>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            Confidence:{" "}
                            <span className="font-medium">
                              {(data.score * 100).toFixed(1)}%
                            </span>
                          </p>
                          <p className="text-sm">
                            Decision:{" "}
                            <span
                              className="font-medium"
                              style={{ color: data.color }}
                            >
                              {decision}
                            </span>
                          </p>
                        </div>
                        <p className="text-xs mt-2 text-gray-600">
                          {mbtiInfo.description}
                        </p>
                        {famousPerson && (
                          <p className="text-xs mt-2 italic text-gray-500">
                            Like{" "}
                            <span className="font-medium">{famousPerson}</span>
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Add decision threshold legend */}
          <div className="w-full mt-2 flex justify-center">
            <div className="grid grid-cols-5 gap-2 text-xs max-w-5xl">
              <div className="p-2 rounded bg-green-100 border border-green-200 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
                <div>
                  <span className="font-bold block text-green-800">
                    Above 85%
                  </span>
                  <span className="text-green-700">Full Speed Ahead</span>
                </div>
              </div>
              <div className="p-2 rounded bg-green-100 border border-green-200 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#4ade80]"></div>
                <div>
                  <span className="font-bold block text-green-800">
                    65% - 85%
                  </span>
                  <span className="text-green-700">Proceed Strategically</span>
                </div>
              </div>
              <div className="p-2 rounded bg-lime-100 border border-lime-200 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#a3e635]"></div>
                <div>
                  <span className="font-bold block text-lime-800">
                    55% - 65%
                  </span>
                  <span className="text-lime-700">
                    Implement with Oversight
                  </span>
                </div>
              </div>
              <div className="p-2 rounded bg-yellow-100 border border-yellow-200 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#facc15]"></div>
                <div>
                  <span className="font-bold block text-yellow-800">
                    35% - 55%
                  </span>
                  <span className="text-yellow-700">Request Clarification</span>
                </div>
              </div>
              <div className="p-2 rounded bg-red-100 border border-red-200 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#f87171]"></div>
                <div>
                  <span className="font-bold block text-red-800">
                    Below 35%
                  </span>
                  <span className="text-red-700">Delay or Disengage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="radar" className="mt-2">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={enhancedRadarData}>
            <PolarGrid stroke="#4455a6" strokeOpacity={0.2} />
            <PolarAngleAxis
              dataKey="factor"
              tick={{ fill: "#4455a6", fontWeight: 500 }}
            />
            <PolarRadiusAxis
              domain={[-0.3, 0.4]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              tick={{ fill: "#4455a6", fontWeight: 500 }}
            />
            {publicWeights && (
              <Radar
                name="Public Opinion"
                dataKey="Public Opinion"
                stroke="#6b7280"
                fill="#6b7280"
                fillOpacity={
                  hoveredType && hoveredType !== "Public Opinion" ? 0.1 : 0.3
                }
                strokeOpacity={
                  hoveredType && hoveredType !== "Public Opinion" ? 0.3 : 1
                }
                strokeWidth={hoveredType === "Public Opinion" ? 3 : 2}
                strokeDasharray="5 5"
              />
            )}
            {archetypes.map((arch) => (
              <Radar
                key={arch.name}
                name={arch.name}
                dataKey={arch.name}
                stroke={mbtiDescriptions[arch.name].color}
                fill={mbtiDescriptions[arch.name].color}
                fillOpacity={
                  hoveredType && hoveredType !== arch.name ? 0.1 : 0.3
                }
                strokeOpacity={
                  hoveredType && hoveredType !== arch.name ? 0.3 : 1
                }
                strokeWidth={hoveredType === arch.name ? 3 : 2}
              />
            ))}
            <Legend
              onMouseEnter={(e) => handleMouseEnter(e.value)}
              onMouseLeave={handleMouseLeave}
              wrapperStyle={{
                fontWeight: 500,
                color: "#4455a6",
              }}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "white",
                border: "2px solid #4455a6",
                borderRadius: "8px",
                padding: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="quadrant" className="mt-2">
        <div className="mb-4 text-sm text-[#4455a6] font-medium bg-[#4455a6]/5 p-3 rounded-lg">
          This quadrant chart maps each personality type's position on
          decisiveness (willingness to act) vs. confidence (certainty in
          outcome).
          {publicResult && (
            <span className="font-semibold">
              {" "}
              Public opinion is shown with a larger marker.
            </span>
          )}
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              type="number"
              dataKey="decisiveness"
              name="Decisiveness"
              domain={[0, 100]}
              label={{
                value: "Decisiveness",
                position: "bottom",
                offset: 0,
                style: {
                  fill: "#4455a6",
                  fontWeight: 600,
                  textAnchor: "middle",
                },
              }}
              tick={{ fill: "#4455a6" }}
            />
            <YAxis
              type="number"
              dataKey="confidence"
              name="Confidence"
              domain={[0, 100]}
              label={{
                value: "Confidence",
                angle: -90,
                position: "insideLeft",
                style: {
                  fill: "#4455a6",
                  fontWeight: 600,
                  textAnchor: "middle",
                },
              }}
              tick={{ fill: "#4455a6" }}
            />
            <ZAxis type="number" dataKey="size" range={[100, 500]} />
            <RechartsTooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value: any, name: string, props: any) => {
                if (name === "Decisiveness" || name === "Confidence") {
                  return [`${Math.round(value)}%`, name];
                }
                return [value, name];
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const isPublic = data.name === "Public";

                  return (
                    <div className="p-3 bg-white border-2 border-[#4455a6] rounded-lg shadow-md">
                      <p className="font-bold text-[#4455a6]">
                        {isPublic
                          ? "Public Opinion"
                          : mbtiDescriptions[data.name].name}
                      </p>
                      <p className="text-sm">
                        Decisiveness:{" "}
                        <span className="font-medium">
                          {Math.round(data.decisiveness)}%
                        </span>
                      </p>
                      <p className="text-sm">
                        Confidence:{" "}
                        <span className="font-medium">
                          {Math.round(data.confidence)}%
                        </span>
                      </p>
                      <p
                        className="text-sm mt-1 font-medium"
                        style={{ color: data.color }}
                      >
                        Decision: {data.decision}
                      </p>
                      {isPublic && publicResult && (
                        <div className="mt-2 text-xs text-gray-600">
                          <p className="font-medium">
                            Probability distribution:
                          </p>
                          {Object.entries(publicResult.probabilities).map(
                            ([decision, prob]) => (
                              <p key={decision}>
                                {decision}:{" "}
                                <span className="font-mono">
                                  {(prob * 100).toFixed(0)}%
                                </span>
                              </p>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Decision Positions"
              data={enhancedQuadrantData}
              fill="#8884d8"
            >
              {enhancedQuadrantData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  fillOpacity={
                    hoveredType && hoveredType !== entry.name ? 0.3 : 0.8
                  }
                  stroke={
                    entry.name === "Public"
                      ? "#000"
                      : mbtiDescriptions[entry.name]?.color || entry.color
                  }
                  strokeWidth={
                    entry.name === "Public"
                      ? 2
                      : hoveredType === entry.name
                      ? 2
                      : 1
                  }
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        {/* Quadrant explanation */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded bg-green-100 border border-green-200">
            <span className="font-bold block text-green-800">
              High Confidence, High Decisiveness
            </span>
            Strong commitment to proceed with clear path forward
          </div>
          <div className="p-2 rounded bg-yellow-100 border border-yellow-200">
            <span className="font-bold block text-yellow-800">
              High Confidence, Low Decisiveness
            </span>
            Methodical approach requiring additional planning
          </div>
          <div className="p-2 rounded bg-blue-100 border border-blue-200">
            <span className="font-bold block text-blue-800">
              Low Confidence, High Decisiveness
            </span>
            Willingness to take calculated risks despite uncertainty
          </div>
          <div className="p-2 rounded bg-red-100 border border-red-200">
            <span className="font-bold block text-red-800">
              Low Confidence, Low Decisiveness
            </span>
            Significant concerns requiring reevaluation or disengagement
          </div>
        </div>
      </TabsContent>

      <TabsContent value="flow" className="mt-2">
        <div className="mb-4 text-sm text-[#4455a6] font-medium bg-[#4455a6]/5 p-3 rounded-lg">
          This circular flow diagram shows how personality types process
          different factors to reach decisions. The outer ring shows personality
          types, the inner connections show their decision paths, and the center
          shows final decisions.
          <div className="mt-2 flex items-center gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-2 bg-blue-500 opacity-70 mr-1"></div>
              <span>Strong influence</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-2 bg-red-500 opacity-70 mr-1"></div>
              <span>Weak influence</span>
            </div>
          </div>
        </div>
        {inputs ? (
          <div className="relative">
            <ResponsiveContainer width="100%" height={600}>
              <svg width="100%" height="100%" viewBox="0 0 800 800">
                {/* Define gradients for paths */}
                <defs>
                  {Object.entries(mbtiDescriptions).map(
                    ([type, info], index) => (
                      <linearGradient
                        key={`gradient-${type}`}
                        id={`flow-gradient-${type}`}
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop
                          offset="0%"
                          stopColor={info.color}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor={info.color}
                          stopOpacity={0.8}
                        />
                      </linearGradient>
                    )
                  )}
                </defs>

                {/* Draw personality type nodes in a circle */}
                <g transform="translate(400, 400)">
                  {Object.entries(mbtiDescriptions).map(
                    ([type, info], index) => {
                      const angle = (index / 16) * 2 * Math.PI - Math.PI / 2;
                      const x = 300 * Math.cos(angle);
                      const y = 300 * Math.sin(angle);
                      const isHovered = hoveredType === type;

                      return (
                        <g
                          key={type}
                          onMouseEnter={() => handleMouseEnter(type)}
                          onMouseLeave={handleMouseLeave}
                          style={{ cursor: "pointer" }}
                        >
                          {/* Personality node */}
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? 25 : 20}
                            fill={info.color}
                            fillOpacity={isHovered ? 1 : 0.7}
                            stroke={isHovered ? "#000" : "none"}
                            strokeWidth={isHovered ? 2 : 0}
                          />

                          {/* Personality label */}
                          <text
                            x={x + (x > 0 ? 30 : -30)}
                            y={y}
                            textAnchor={x > 0 ? "start" : "end"}
                            alignmentBaseline="middle"
                            fill={info.color}
                            fontSize={isHovered ? 14 : 12}
                            fontWeight={isHovered ? "bold" : "normal"}
                          >
                            {type}
                          </text>

                          {/* Draw decision paths */}
                          {results.map((result) => {
                            if (result.name === type) {
                              // Calculate target position based on decision
                              const targetAngle = (() => {
                                switch (result.decision) {
                                  case "Full Speed Ahead":
                                    return -Math.PI / 2;
                                  case "Proceed Strategically":
                                    return -Math.PI / 6;
                                  case "Implement with Oversight":
                                    return Math.PI / 6;
                                  case "Request Clarification":
                                    return Math.PI / 2;
                                  case "Delay or Disengage":
                                    return Math.PI;
                                  default:
                                    return 0;
                                }
                              })();
                              const targetX = 100 * Math.cos(targetAngle);
                              const targetY = 100 * Math.sin(targetAngle);

                              return (
                                <path
                                  key={`path-${type}-${result.decision}`}
                                  d={createCurvedPath(x, y, targetX, targetY)}
                                  stroke={`url(#flow-gradient-${type})`}
                                  strokeWidth={result.score * 10}
                                  fill="none"
                                  opacity={
                                    isHovered ? 1 : hoveredType ? 0.2 : 0.5
                                  }
                                />
                              );
                            }
                            return null;
                          })}
                        </g>
                      );
                    }
                  )}

                  {/* Draw decision nodes in the center */}
                  {[
                    { name: "Full Speed Ahead", color: "#22c55e" },
                    { name: "Proceed Strategically", color: "#4ade80" },
                    { name: "Implement with Oversight", color: "#a3e635" },
                    { name: "Request Clarification", color: "#facc15" },
                    { name: "Delay or Disengage", color: "#f87171" },
                  ].map((decision, index) => {
                    // Calculate position for each decision node
                    const angle = (() => {
                      switch (decision.name) {
                        case "Full Speed Ahead":
                          return -Math.PI / 2;
                        case "Proceed Strategically":
                          return -Math.PI / 6;
                        case "Implement with Oversight":
                          return Math.PI / 6;
                        case "Request Clarification":
                          return Math.PI / 2;
                        case "Delay or Disengage":
                          return Math.PI;
                        default:
                          return 0;
                      }
                    })();

                    const x = 100 * Math.cos(angle);
                    const y = 100 * Math.sin(angle);

                    return (
                      <g key={decision.name}>
                        <circle
                          cx={x}
                          cy={y}
                          r={25}
                          fill={decision.color}
                          fillOpacity={0.7}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          fill="white"
                          fontSize={9}
                          fontWeight="bold"
                        >
                          {decision.name.split(" ").map((word, i) => (
                            <tspan key={i} x={x} dy={i ? "1.2em" : 0}>
                              {word}
                            </tspan>
                          ))}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </ResponsiveContainer>

            {/* Legend for personality types */}
            <div className="mt-6 p-4 bg-white rounded-lg shadow-inner">
              <h4 className="font-bold text-[#4455a6] mb-2">
                Personality Types in Flow Diagram
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {Object.entries(mbtiDescriptions).map(([type, info]) => {
                  const famousPerson = getRandomFamousPerson(type);
                  return (
                    <div
                      key={type}
                      className="flex flex-col p-2 rounded-md"
                      style={{ backgroundColor: `${info.color}15` }}
                      onMouseEnter={() => handleMouseEnter(type)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: info.color }}
                        ></div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: info.color }}
                        >
                          {info.name}
                        </span>
                      </div>
                      {famousPerson && (
                        <span className="text-xs text-gray-600 mt-1 pl-5">
                          Like {famousPerson}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                The thickness of each path represents the confidence level of
                the personality type in their decision. Hover over a personality
                type to highlight their decision path.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center text-[#4455a6]">
            Run a simulation to see the decision flow
          </div>
        )}
      </TabsContent>

      <TabsContent value="heatmap" className="mt-2">
        <div className="mb-4 text-sm text-[#4455a6] font-medium bg-[#4455a6]/5 p-3 rounded-lg">
          This heat map shows how each factor contributes to each personality
          type's decision - positive values (blue) increase confidence while
          negative values (red) decrease it.
        </div>
        {inputs ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-[#4455a6] font-bold">
                    Personality
                  </th>
                  {factorNames.map((factor) => (
                    <th
                      key={factor}
                      className="p-2 text-left text-[#4455a6] font-bold"
                    >
                      {factor}
                    </th>
                  ))}
                  <th className="p-2 text-left text-[#4455a6] font-bold">
                    Total Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {heatMapData.map((row) => {
                  const personality = row.name;
                  return (
                    <tr
                      key={personality}
                      className="hover:bg-[#4455a6]/5 transition-colors"
                      onMouseEnter={() => handleMouseEnter(personality)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <td
                        className="p-2 font-semibold"
                        style={{ color: mbtiDescriptions[personality].color }}
                      >
                        {personality}
                      </td>
                      {factorNames.map((factor) => {
                        const value = row[factor] as number;
                        const scaledValue = Math.max(
                          -1,
                          Math.min(1, value * 2.5)
                        ); // Scale for better visualization
                        let bgColor = "transparent";

                        if (value > 0) {
                          const intensity = Math.floor(scaledValue * 100);
                          bgColor = `rgba(59, 130, 246, ${intensity / 100})`;
                        } else if (value < 0) {
                          const intensity = Math.floor(
                            Math.abs(scaledValue) * 100
                          );
                          bgColor = `rgba(239, 68, 68, ${intensity / 100})`;
                        }

                        return (
                          <td
                            key={`${personality}-${factor}`}
                            className="p-2 text-center relative"
                            style={{ backgroundColor: bgColor }}
                          >
                            <span
                              className={`font-mono ${
                                value > 0
                                  ? "text-blue-900"
                                  : value < 0
                                  ? "text-red-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {value > 0 ? "+" : ""}
                              {(value * 100).toFixed(1)}%
                            </span>
                          </td>
                        );
                      })}
                      <td
                        className="p-2 font-semibold text-center"
                        style={{
                          backgroundColor:
                            row.totalScore > 0.65
                              ? "rgba(74, 222, 128, 0.2)"
                              : row.totalScore > 0.45
                              ? "rgba(250, 204, 21, 0.2)"
                              : "rgba(248, 113, 113, 0.2)",
                          color:
                            row.totalScore > 0.65
                              ? "rgb(22, 101, 52)"
                              : row.totalScore > 0.45
                              ? "rgb(161, 98, 7)"
                              : "rgb(153, 27, 27)",
                        }}
                      >
                        {(row.totalScore * 100).toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center text-[#4455a6]">
            Run a simulation to see the factor influence heat map
          </div>
        )}
      </TabsContent>

      {/* Add Public Opinion Tab */}
      {publicResult && (
        <TabsContent value="public" className="mt-2">
          <div className="mb-4 text-sm text-[#4455a6] font-medium bg-[#4455a6]/5 p-3 rounded-lg">
            This visualization shows how the general public would likely
            approach this decision, with probabilities for each outcome.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-inner">
              <h4 className="text-lg font-bold mb-4 text-[#4455a6]">
                Public Decision Probability
              </h4>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.entries(publicResult.probabilities).map(
                    ([key, value]) => ({
                      decision: key,
                      probability: value,
                      color:
                        key === "Proceed Strategically"
                          ? "#4ade80"
                          : key === "Request Clarification"
                          ? "#facc15"
                          : "#f87171",
                    })
                  )}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="decision"
                    tick={{ fill: "#4455a6", fontWeight: 500 }}
                    width={150}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [
                      `${(value * 100).toFixed(1)}%`,
                      "Probability",
                    ]}
                  />
                  <Bar dataKey="probability" minPointSize={2} barSize={30}>
                    {Object.entries(publicResult.probabilities).map(
                      ([key, value], index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            key === "Proceed Strategically"
                              ? "#4ade80"
                              : key === "Request Clarification"
                              ? "#facc15"
                              : "#f87171"
                          }
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="font-bold text-[#4455a6]">
                  Public Opinion Summary
                </p>
                <p className="text-sm mt-2">
                  Score:{" "}
                  <span className="font-medium">
                    {(publicResult.score * 100).toFixed(1)}%
                  </span>{" "}
                  confidence
                </p>
                <p className="text-sm mt-1">
                  Most Likely Decision:{" "}
                  <span
                    className="font-medium"
                    style={{ color: publicResult.color }}
                  >
                    {publicResult.mostLikely}
                  </span>
                  <span className="ml-1 text-gray-600">
                    (
                    {(
                      publicResult.probabilities[publicResult.mostLikely] * 100
                    ).toFixed(0)}
                    % probability)
                  </span>
                </p>

                {/* Add the most similar MBTI type */}
                {similarMBTIType.type && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="font-medium text-[#4455a6]">
                      Most Similar Personality Type:
                    </p>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: similarMBTIType.color }}
                      ></div>
                      <span
                        className="font-medium"
                        style={{ color: similarMBTIType.color }}
                      >
                        {similarMBTIType.description}
                      </span>
                      <span className="ml-2 text-gray-600 text-sm">
                        ({(similarMBTIType.similarity * 100).toFixed(0)}%
                        similarity)
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      This personality type has the most similar decision-making
                      pattern to the general public.
                    </p>
                    {similarMBTIType.type && (
                      <p className="text-xs mt-1 text-gray-500 italic">
                        Famous examples:{" "}
                        {famousPeopleByMBTI[similarMBTIType.type]
                          ?.slice(0, 2)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-inner">
              <h4 className="text-lg font-bold mb-4 text-[#4455a6]">
                Public vs. Personality Weights
              </h4>

              <div className="space-y-3">
                {publicWeights &&
                  Object.keys(publicWeights).map((factorKey) => {
                    const publicWeight = publicWeights[factorKey as FactorKey];
                    const formattedKey = factorKey
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");

                    // Calculate average personality weight for this factor
                    const personalityWeights = archetypes.map(
                      (arch) => arch.weights[factorKey as FactorKey]
                    );
                    const avgPersonalityWeight =
                      personalityWeights.reduce((a, b) => a + b, 0) /
                      personalityWeights.length;

                    // Determine if public weights this factor more or less than personalities
                    const publicHigher = publicWeight > avgPersonalityWeight;
                    const difference = Math.abs(
                      publicWeight - avgPersonalityWeight
                    );

                    // Get the similar MBTI type's weight for this factor
                    const similarTypeWeight = similarMBTIType.type
                      ? archetypes.find((a) => a.name === similarMBTIType.type)
                          ?.weights[factorKey as FactorKey] || 0
                      : 0;

                    return (
                      <div key={factorKey} className="relative">
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-medium">{formattedKey}</span>
                          <div className="flex items-center">
                            <span
                              className={`font-mono ${
                                publicWeight > 0
                                  ? "text-blue-600"
                                  : "text-red-600"
                              }`}
                            >
                              {publicWeight > 0 ? "+" : ""}
                              {(publicWeight * 100).toFixed(0)}%
                            </span>

                            {/* Add similar type comparison */}
                            {similarMBTIType.type && (
                              <span
                                className="ml-2 text-xs"
                                style={{ color: similarMBTIType.color }}
                              >
                                (
                                {(similarTypeWeight > 0 ? "+" : "") +
                                  (similarTypeWeight * 100).toFixed(0)}
                                %)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden relative">
                          {/* Bar representing public weight */}
                          <div
                            className={`h-full ${
                              publicWeight > 0 ? "bg-blue-500" : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.abs(publicWeight) * 200}%`,
                              maxWidth: "100%",
                              opacity: 0.7,
                            }}
                          ></div>

                          {/* Add marker for similar MBTI type weight */}
                          {similarMBTIType.type && (
                            <div
                              className="absolute top-0 h-full w-1 z-10"
                              style={{
                                backgroundColor: similarMBTIType.color,
                                left: `${50 + similarTypeWeight * 100}%`,
                                opacity: 0.9,
                              }}
                            ></div>
                          )}
                        </div>

                        {/* Comparison indicator */}
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>
                            Public weights this {publicHigher ? "more" : "less"}{" "}
                            than personalities
                          </span>
                          <span
                            className={
                              publicHigher ? "text-blue-700" : "text-red-700"
                            }
                          >
                            {difference > 0.1
                              ? "Significant difference"
                              : "Slight difference"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-6 p-3 bg-[#4455a6]/5 rounded-lg text-sm">
                <p className="font-medium text-[#4455a6]">Key Differences:</p>
                <ul className="mt-2 space-y-1 list-disc pl-5 text-gray-700">
                  <li>
                    Public opinion gives more weight to{" "}
                    <span className="font-medium">ROI Visibility</span> and{" "}
                    <span className="font-medium">Time Pressure</span>
                  </li>
                  <li>
                    Public opinion is more negatively affected by{" "}
                    <span className="font-medium">Social Complexity</span>
                  </li>
                  <li>
                    Personality types typically value{" "}
                    <span className="font-medium">Data Quality</span> more than
                    the general public
                  </li>
                  {similarMBTIType.type && (
                    <li>
                      Most similar personality type:{" "}
                      <span
                        className="font-medium"
                        style={{ color: similarMBTIType.color }}
                      >
                        {similarMBTIType.description}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default UserDecisionCharts;
