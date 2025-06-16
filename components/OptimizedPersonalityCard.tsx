"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Optimized Personality Card Component with better memoization
interface OptimizedPersonalityCardProps {
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

// Memoized character button component
const CharacterButton = React.memo<{
  character: { name: string; franchise: string };
  type: string;
  hasMultiple: boolean;
  colors: { backgroundColor: string; color: string };
  onCycle: () => void;
}>(({ character, type, hasMultiple, colors, onCycle }) => (
  <button
    onClick={onCycle}
    disabled={!hasMultiple}
    className={cn(
      "group relative flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ease-out transform-gpu",
      "bg-white/40 backdrop-blur-sm border border-white/30 shadow-lg",
      hasMultiple
        ? "hover:bg-white/60 hover:scale-[1.02] hover:shadow-xl cursor-pointer active:scale-[0.98]"
        : "cursor-default opacity-75"
    )}
    type="button"
    aria-label={hasMultiple ? `Cycle ${character.franchise} character` : `${character.franchise} character`}
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div
        className="w-4 h-4 rounded-full shadow-md flex-shrink-0"
        style={colors}
      />
      <div className="text-left min-w-0 flex-1">
        <div className="font-semibold text-gray-800 truncate text-sm">
          {character.name}
        </div>
        <div className="text-xs text-gray-600 truncate">
          {character.franchise}
        </div>
      </div>
    </div>
    {hasMultiple && (
      <div className="text-gray-500 group-hover:text-gray-700 transition-colors ml-2 flex-shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
    )}
  </button>
));

CharacterButton.displayName = 'CharacterButton';

// Main optimized personality card component
export const OptimizedPersonalityCard: React.FC<OptimizedPersonalityCardProps> = React.memo(({
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

  // Memoized handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    shuffleAllCharacters(type);
  }, [shuffleAllCharacters, type]);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Memoized character buttons
  const characterButtons = useMemo(() => 
    characterExamples.map((character, index) => {
      const pool = characterPoolsByMBTI[type]?.[character.franchise] || [];
      const hasMultiple = pool.length > 1;
      const colors = getFranchiseColors(character.franchise);
      
      return (
        <CharacterButton
          key={`${character.franchise}-${index}`}
          character={character}
          type={type}
          hasMultiple={hasMultiple}
          colors={colors}
          onCycle={() => cycleCharacter(type, character.franchise)}
        />
      );
    }), [characterExamples, characterPoolsByMBTI, type, getFranchiseColors, cycleCharacter]
  );

  // Memoized styles
  const cardStyles = useMemo(() => ({
    background: `linear-gradient(135deg, 
      ${info.color}15 0%, 
      ${info.color}08 50%, 
      transparent 100%
    )`,
  }), [info.color]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl transition-all duration-300 ease-out cursor-pointer transform-gpu",
        isHovered ? "scale-[1.02] -translate-y-1 shadow-4xl" : "shadow-2xl",
        isUserType
          ? "ring-2 ring-[#007aff] ring-offset-4 ring-offset-white/50"
          : ""
      )}
      style={cardStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-xl border border-white/30" />
      
      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/30">
              <Image
                src={img}
                alt={`${type} personality`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {isUserType && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#007aff] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">★</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-xl font-bold text-gray-800 mb-1 truncate">
              {info.name}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {info.description}
            </p>
          </div>
        </div>

        {/* Character Examples */}
        {characterExamples.length > 0 && (
          <div className="pt-4 border-t border-white/30 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 shadow-sm animate-pulse"></span>
                Character Examples
              </h5>
              <button
                onClick={handleToggleExpanded}
                className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
                type="button"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
            </div>
            
            <div className={cn(
              "grid gap-2 transition-all duration-300",
              isExpanded ? "grid-cols-1" : "grid-cols-2"
            )}>
              {isExpanded ? characterButtons : characterButtons.slice(0, 2)}
            </div>
            
            {!isExpanded && characterButtons.length > 2 && (
              <div className="text-center">
                <span className="text-xs text-gray-500">
                  +{characterButtons.length - 2} more
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

OptimizedPersonalityCard.displayName = 'OptimizedPersonalityCard';
