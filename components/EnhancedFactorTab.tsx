'use client';

import React, { useState, useEffect } from 'react';
import { FactorKey } from '@/models/decision/types';
import { factorInfo } from '@/models/decision/constants';

interface HeatMapDataRow {
  name: string;
  totalScore: number;
  [key: string]: string | number;
}

interface Props {
  inputs: Record<FactorKey, number>;
  heatMapData: HeatMapDataRow[];
  mbtiDescriptions: Record<string, { color: string; name: string; description: string }>;
  handleMouseEnter: (type: string) => void;
  handleMouseLeave: () => void;
}

const EnhancedFactorTab: React.FC<Props> = ({
  inputs,
  heatMapData,
  mbtiDescriptions,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-[#4455a6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4455a6] mx-auto mb-2"></div>
          <p className="text-sm">Loading enhanced factor analysis...</p>
        </div>
      </div>
    );
  }
  // Factor categories for better organization
  const factorCategories = {
    cognitive: [
      { key: 'data_quality', displayName: 'Data Quality' },
      { key: 'roi_visibility', displayName: 'Roi Visibility' }
    ],
    control: [
      { key: 'autonomy_scope', displayName: 'Autonomy Scope' },
      { key: 'time_pressure', displayName: 'Time Pressure' }
    ],
    social: [
      { key: 'social_complexity', displayName: 'Social Complexity' },
      { key: 'psychological_safety', displayName: 'Psychological Safety' }
    ]
  };

  const renderFactorCard = (factorKey: string, displayName: string, categoryColor: string, categoryIcon: string) => {
    const factorData = factorInfo[factorKey as FactorKey];
    const currentValue = inputs[factorKey as FactorKey];
    
    // Get top 3 personalities most influenced by this factor
    const sortedData = [...heatMapData].sort((a, b) => Math.abs((b[displayName] as number)) - Math.abs((a[displayName] as number)));
    const topPersonalities = sortedData.slice(0, 3);

    return (
      <div key={factorKey} className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">{factorData.label}</h4>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
            {(currentValue * 100).toFixed(0)}% Current
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          {factorData.description}
        </p>
        
        {/* Factor range indicator */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Low Impact</span>
            <span>High Impact</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${categoryColor} transition-all duration-300`}
              style={{ width: `${currentValue * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{factorData.lowDesc}</span>
            <span className="text-right max-w-[50%]">{factorData.highDesc}</span>
          </div>
        </div>
        
        {/* Top personalities for this factor */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700 mb-1">Most Influenced By This Factor:</div>
          {topPersonalities.map((row, index) => {
            const value = row[displayName] as number;
            const personality = row.name;
            return (
              <button
                key={personality}
                className="flex items-center justify-between text-sm hover:bg-white/50 p-1 rounded transition-colors cursor-pointer w-full text-left"
                onMouseEnter={() => handleMouseEnter(personality)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleMouseEnter(personality)}
                type="button"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: mbtiDescriptions[personality].color }}
                  ></div>
                  <span className="font-medium" style={{ color: mbtiDescriptions[personality].color }}>
                    {personality}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${value > 0 ? 'bg-blue-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(value) * 200}%`, maxWidth: '100%' }}
                    ></div>
                  </div>
                  <span className={`text-xs font-mono ${value > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {value > 0 ? '+' : ''}{(value * 100).toFixed(0)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced header */}
      <div className="mb-6 text-sm text-[#4455a6] font-medium bg-gradient-to-r from-[#4455a6]/5 to-[#4455a6]/10 p-4 rounded-xl border border-[#4455a6]/20">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[#4455a6]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-[#4455a6]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-[#4455a6] mb-1">Factor Analysis Overview</h4>
            <p className="text-[#4455a6]/80 leading-relaxed">
              Explore how the 6 decision factors influence each MBTI personality type. 
              <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Positive
              </span>
              values increase decision confidence, while
              <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Negative
              </span>
              values decrease it.
            </p>
          </div>
        </div>
      </div>

      {/* Factor Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Cognitive Factors */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cognitive Factors</h3>
              <p className="text-sm text-gray-600">Information processing and analysis</p>
            </div>
          </div>

          <div className="space-y-4">
            {factorCategories.cognitive.map(factor =>
              renderFactorCard(factor.key, factor.displayName, 'bg-purple-500', 'cognitive')
            )}
          </div>
        </div>

        {/* Control & Timing Factors */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Control & Timing</h3>
              <p className="text-sm text-gray-600">Autonomy and temporal considerations</p>
            </div>
          </div>

          <div className="space-y-4">
            {factorCategories.control.map(factor =>
              renderFactorCard(factor.key, factor.displayName, 'bg-green-500', 'control')
            )}
          </div>
        </div>

        {/* Social & Environmental Factors */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Social & Environment</h3>
              <p className="text-sm text-gray-600">Interpersonal and team dynamics</p>
            </div>
          </div>

          <div className="space-y-4">
            {factorCategories.social.map(factor =>
              renderFactorCard(factor.key, factor.displayName, 'bg-blue-500', 'social')
            )}
          </div>
        </div>
      </div>

      {/* Personality Comparison Matrix */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Personality Factor Matrix</h3>
            <p className="text-sm text-gray-600">Complete factor influence breakdown by personality type</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 text-left text-[#4455a6] font-bold bg-gray-50">
                  Personality Type
                </th>
                {Object.values(factorInfo).map((factor) => (
                  <th
                    key={factor.label}
                    className="p-3 text-center text-[#4455a6] font-bold bg-gray-50 min-w-[100px]"
                  >
                    {factor.label}
                  </th>
                ))}
                <th className="p-3 text-center text-[#4455a6] font-bold bg-gray-50">
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
                    className="hover:bg-[#4455a6]/5 transition-colors border-b border-gray-100"
                    onMouseEnter={() => handleMouseEnter(personality)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <td className="p-3 font-semibold bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: mbtiDescriptions[personality].color }}
                        ></div>
                        <span style={{ color: mbtiDescriptions[personality].color }}>
                          {personality}
                        </span>
                      </div>
                    </td>
                    {Object.values(factorInfo).map((factor) => {
                      const value = row[factor.label.replace(' ', ' ')] as number || 0;

                      // Determine bar color based on value
                      let barColor = 'bg-gray-300';
                      if (value > 0) {
                        barColor = 'bg-blue-500';
                      } else if (value < 0) {
                        barColor = 'bg-red-500';
                      }

                      // Determine text color based on value
                      let textColor = 'text-gray-500';
                      if (value > 0) {
                        textColor = 'text-blue-700';
                      } else if (value < 0) {
                        textColor = 'text-red-700';
                      }

                      return (
                        <td
                          key={`${personality}-${factor.label}`}
                          className="p-3 text-center relative"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${barColor}`}
                                style={{ width: `${Math.abs(value) * 200}%`, maxWidth: '100%' }}
                              ></div>
                            </div>
                            <span className={`text-xs font-mono ${textColor}`}>
                              {value > 0 ? "+" : ""}{(value * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-3 text-center font-semibold">
                      {(() => {
                        // Determine background and text colors based on total score
                        let backgroundColor = "rgba(248, 113, 113, 0.2)";
                        let textColor = "rgb(153, 27, 27)";

                        if (row.totalScore > 0.65) {
                          backgroundColor = "rgba(74, 222, 128, 0.2)";
                          textColor = "rgb(22, 101, 52)";
                        } else if (row.totalScore > 0.45) {
                          backgroundColor = "rgba(250, 204, 21, 0.2)";
                          textColor = "rgb(161, 98, 7)";
                        }

                        return (
                          <div
                            className="inline-flex items-center px-2 py-1 rounded-full text-sm"
                            style={{ backgroundColor, color: textColor }}
                          >
                            {(row.totalScore * 100).toFixed(0)}%
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFactorTab;
