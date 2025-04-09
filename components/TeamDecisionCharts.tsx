import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { StyledTabs } from './TeamDecisionDashboard';

export type Props = {
  results: Array<{
    name: string;
    score: number;
    decision: string;
    color: string;
  }>;
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

const TeamDecisionCharts: React.FC<Props> = ({ 
  results, 
  radarData, 
  archetypes, 
  mbtiDescriptions 
}) => {
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('bar');

  const handleMouseEnter = (type: string) => {
    setHoveredType(type);
  };

  const handleMouseLeave = () => {
    setHoveredType(null);
  };

  return (
    <Tabs 
      defaultValue="bar" 
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
            "transition-all duration-200"
          )}
        >
          Personality Weights
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="bar" className="mt-2">
        <div className="mb-4 text-sm text-[#4455a6] font-medium bg-[#4455a6]/5 p-3 rounded-lg">
          Higher percentages indicate stronger confidence in the personality type's decision recommendation based on the given factors.
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={results}>
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#4455a6', fontWeight: 500 }}
              onMouseEnter={e => handleMouseEnter(e.value)}
              onMouseLeave={handleMouseLeave}
            />
            <YAxis 
              domain={[0, 1]} 
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              tick={{ fill: '#4455a6', fontWeight: 500 }}
              label={{ 
                value: 'Decision Confidence', 
                angle: -90, 
                position: 'insideLeft',
                style: { 
                  fill: '#4455a6',
                  fontWeight: 600,
                  textAnchor: 'middle' 
                }
              }}
            />
            <RechartsTooltip 
              formatter={(value: number, name: string) => [
                `${(value * 100).toFixed(0)}% Confidence`,
                mbtiDescriptions[results.find(r => r.score === value)?.name || ''].name
              ]}
              labelStyle={{ color: '#4455a6', fontWeight: 600 }}
              contentStyle={{ 
                backgroundColor: 'white',
                border: '2px solid #4455a6',
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              formatter={(value) => 'Personality Type Confidence'}
              wrapperStyle={{
                fontWeight: 500,
                color: '#4455a6'
              }}
              onMouseEnter={(e) => handleMouseEnter(e.value)}
              onMouseLeave={handleMouseLeave}
            />
            <Bar 
              dataKey="score" 
              name="Decision Score"
              animationDuration={500}
              radius={[4, 4, 0, 0]}
            >
              {results.map((entry) => (
                <Cell 
                  key={`cell-${entry.name}`} 
                  fill={mbtiDescriptions[entry.name].color}
                  fillOpacity={hoveredType && hoveredType !== entry.name ? 0.2 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
      
      <TabsContent value="radar" className="mt-2">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#4455a6" strokeOpacity={0.2} />
            <PolarAngleAxis 
              dataKey="factor"
              tick={{ fill: '#4455a6', fontWeight: 500 }}
            />
            <PolarRadiusAxis 
              domain={[-0.2, 0.4]} 
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              tick={{ fill: '#4455a6', fontWeight: 500 }}
            />
            {archetypes.map(arch => (
              <Radar
                key={arch.name}
                name={arch.name}
                dataKey={arch.name}
                stroke={mbtiDescriptions[arch.name].color}
                fill={mbtiDescriptions[arch.name].color}
                fillOpacity={hoveredType && hoveredType !== arch.name ? 0.1 : 0.3}
                strokeOpacity={hoveredType && hoveredType !== arch.name ? 0.3 : 1}
                strokeWidth={hoveredType === arch.name ? 3 : 2}
              />
            ))}
            <Legend 
              onMouseEnter={(e) => handleMouseEnter(e.value)}
              onMouseLeave={handleMouseLeave}
              wrapperStyle={{
                fontWeight: 500,
                color: '#4455a6'
              }}
            />
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '2px solid #4455a6',
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
};

export default TeamDecisionCharts; 