"use client";

import React, { memo, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useThrottle } from "@/lib/hooks/useDebounce";
import * as DecisionService from "@/lib/decisionMatrixService";

export interface SliderInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: string) => void;
  info: DecisionService.FactorInfo;
}

const SliderInput: React.FC<SliderInputProps> = memo(({ id, label, value, onChange, info }) => {
  // Throttled onChange to prevent excessive updates while maintaining responsiveness
  const throttledOnChange = useThrottle(onChange, 50);

  // Optimized slider change handler
  const handleSliderChange = useCallback((_event: Event, v: number | number[]) => {
    const newValue = (Array.isArray(v) ? v[0] : v).toString();
    throttledOnChange(newValue);
  }, [throttledOnChange]);

  return (
  <div className="flex flex-col space-y-3">
    <div className="flex justify-between items-center">
      <label htmlFor={id} className="font-semibold text-sm sm:text-base text-glass-effect leading-tight tracking-tight">
        {info.label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            aria-label={`More information about ${info.label}`}
            className="text-sm text-gray-600 cursor-help bg-gradient-to-br from-white/15 via-white/10 to-white/15 backdrop-blur-lg border border-white/30 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gradient-to-br hover:from-white/25 hover:via-white/15 hover:to-white/25 hover:scale-110 transition-all duration-300 shadow-lg gpu-accelerated"
          >
            ⓘ
          </button>
        </PopoverTrigger>
        <PopoverContent
          id={`${id}-info`}
          className="max-w-sm bg-gradient-to-br from-white/20 via-white/15 to-white/20 backdrop-blur-2xl border-white/40 shadow-liquid rounded-3xl p-5 gpu-accelerated"
        >
          <p className="font-semibold text-glass-effect mb-4 leading-relaxed">{info.description}</p>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-white/25 via-white/15 to-white/25 backdrop-blur-lg p-4 rounded-2xl border border-white/30 shadow-lg">
              <span className="font-bold text-enhanced-contrast">Low:</span>
              <span className="text-subtle-glass block mt-1">{info.lowDesc}</span>
            </div>
            <div className="bg-gradient-to-br from-white/25 via-white/15 to-white/25 backdrop-blur-lg p-4 rounded-2xl border border-white/30 shadow-lg">
              <span className="font-bold text-enhanced-contrast">High:</span>
              <span className="text-subtle-glass block mt-1">{info.highDesc}</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <div className="flex items-center space-x-5">
      <div className="flex-grow relative">
        <Slider
          id={id}
          min={0}
          max={1}
          step={0.05}
          value={value}
          onChange={handleSliderChange}
          aria-label={info.label}
          aria-describedby={`${id}-info`}
          className="w-full"
        />
        {/* Enhanced visual feedback */}
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200/30 via-purple-200/30 to-cyan-200/30 rounded-full opacity-50" />
      </div>
      <div className="bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-lg border border-white/30 px-4 py-2 rounded-2xl shadow-lg min-w-[4rem] text-center">
        <span className="font-bold text-liquid-gradient text-sm tracking-tight">
          {(value * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  </div>
  );
});

SliderInput.displayName = 'SliderInput';

export default SliderInput;
