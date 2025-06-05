"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as DecisionService from "@/lib/decisionMatrixService";

export interface SliderInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: string) => void;
  info: DecisionService.FactorInfo;
}

const SliderInput: React.FC<SliderInputProps> = ({ id, label, value, onChange, info }) => (
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
              <span className="font-bold text-[#1d1d1f]">Low:</span> {info.lowDesc}
            </div>
            <div className="bg-[#f9f9fb] p-2 rounded-lg border border-[#e6e6e6]">
              <span className="font-bold text-[#1d1d1f]">High:</span> {info.highDesc}
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
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        className="flex-grow appearance-none h-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007aff]/20"
        style={{
          WebkitAppearance: "none",
          background: `linear-gradient(to right, #007aff ${value * 100}%, #e5e5ea ${value * 100}%)`,
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

export default SliderInput;
