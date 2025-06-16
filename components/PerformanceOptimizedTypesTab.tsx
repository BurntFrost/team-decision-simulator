"use client";

import React, { useMemo, useCallback, useEffect, useState } from "react";
import { OptimizedPersonalityCard } from "./OptimizedPersonalityCard";
import { LazyMBTILoader } from "@/models/decision/mbti/lazy-loader";
import * as DecisionService from "@/lib/decisionMatrixService";

interface PerformanceOptimizedTypesTabProps {
  userMBTI: string;
  characterIndices: Record<string, Record<string, number>>;
  characterPoolsByMBTI: any;
  cycleCharacter: (type: string, franchise: string) => void;
  shuffleAllCharacters: (type: string) => void;
  getFranchiseColors: (franchise: string) => { backgroundColor: string; color: string };
  getCurrentCharactersForMBTI: (type: string, indices: Record<string, Record<string, number>>) => Array<{ name: string; franchise: string }>;
  getMBTIImage: (type: string) => string;
}

// Virtualized grid component for better performance with many cards
const VirtualizedPersonalityGrid: React.FC<{
  personalities: Array<[string, any]>;
  userMBTI: string;
  characterIndices: Record<string, Record<string, number>>;
  characterPoolsByMBTI: any;
  cycleCharacter: (type: string, franchise: string) => void;
  shuffleAllCharacters: (type: string) => void;
  getFranchiseColors: (franchise: string) => { backgroundColor: string; color: string };
  getCurrentCharactersForMBTI: (type: string, indices: Record<string, Record<string, number>>) => Array<{ name: string; franchise: string }>;
  getMBTIImage: (type: string) => string;
}> = React.memo(({
  personalities,
  userMBTI,
  characterIndices,
  characterPoolsByMBTI,
  cycleCharacter,
  shuffleAllCharacters,
  getFranchiseColors,
  getCurrentCharactersForMBTI,
  getMBTIImage,
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 8 });
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Intersection Observer for lazy loading cards
  useEffect(() => {
    if (!containerRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleRange(prev => ({
              start: Math.min(prev.start, Math.max(0, index - 2)),
              end: Math.max(prev.end, Math.min(personalities.length, index + 6))
            }));
          }
        });
      },
      { rootMargin: '100px' }
    );

    const cards = containerRef.querySelectorAll('[data-index]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [containerRef, personalities.length]);

  const visiblePersonalities = useMemo(() => 
    personalities.slice(visibleRange.start, visibleRange.end),
    [personalities, visibleRange]
  );

  return (
    <div 
      ref={setContainerRef}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {personalities.map(([type, info], index) => {
        const isVisible = index >= visibleRange.start && index < visibleRange.end;
        
        if (!isVisible) {
          return (
            <div
              key={type}
              data-index={index}
              className="h-64 bg-gray-100 rounded-3xl animate-pulse"
            />
          );
        }

        const characterExamples = getCurrentCharactersForMBTI(type, characterIndices);
        const img = getMBTIImage(type);
        const isUserType = type === userMBTI;

        return (
          <div key={type} data-index={index}>
            <OptimizedPersonalityCard
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
          </div>
        );
      })}
    </div>
  );
});

VirtualizedPersonalityGrid.displayName = 'VirtualizedPersonalityGrid';

export const PerformanceOptimizedTypesTab: React.FC<PerformanceOptimizedTypesTabProps> = React.memo(({
  userMBTI,
  characterIndices,
  characterPoolsByMBTI,
  cycleCharacter,
  shuffleAllCharacters,
  getFranchiseColors,
  getCurrentCharactersForMBTI,
  getMBTIImage,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Preload MBTI types when component mounts
  useEffect(() => {
    let isMounted = true;

    const preloadTypes = async () => {
      try {
        setIsLoading(true);
        setLoadingProgress(0);

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => Math.min(prev + 10, 90));
        }, 50);

        await LazyMBTILoader.preloadAllTypes();
        
        clearInterval(progressInterval);
        if (isMounted) {
          setLoadingProgress(100);
          setTimeout(() => {
            if (isMounted) setIsLoading(false);
          }, 200);
        }
      } catch (error) {
        console.error('Failed to preload MBTI types:', error);
        if (isMounted) setIsLoading(false);
      }
    };

    preloadTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoized personality entries
  const personalityEntries = useMemo(() => 
    Object.entries(DecisionService.mbtiDescriptions),
    []
  );

  // Memoized handlers
  const memoizedCycleCharacter = useCallback((type: string, franchise: string) => {
    cycleCharacter(type, franchise);
  }, [cycleCharacter]);

  const memoizedShuffleAllCharacters = useCallback((type: string) => {
    shuffleAllCharacters(type);
  }, [shuffleAllCharacters]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700 mb-2">
            Loading Personality Types...
          </div>
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {loadingProgress}% Complete
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          MBTI Personality Types
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore the 16 personality types and their decision-making patterns. 
          Click on cards to shuffle characters, or click individual characters to cycle through options.
        </p>
      </div>

      <VirtualizedPersonalityGrid
        personalities={personalityEntries}
        userMBTI={userMBTI}
        characterIndices={characterIndices}
        characterPoolsByMBTI={characterPoolsByMBTI}
        cycleCharacter={memoizedCycleCharacter}
        shuffleAllCharacters={memoizedShuffleAllCharacters}
        getFranchiseColors={getFranchiseColors}
        getCurrentCharactersForMBTI={getCurrentCharactersForMBTI}
        getMBTIImage={getMBTIImage}
      />

      {/* Performance stats (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
          <div className="font-semibold mb-2">Performance Stats:</div>
          <div>Loaded MBTI Types: {LazyMBTILoader.getCacheSize()}/16</div>
          <div>Rendered Cards: {personalityEntries.length}</div>
        </div>
      )}
    </div>
  );
});

PerformanceOptimizedTypesTab.displayName = 'PerformanceOptimizedTypesTab';
