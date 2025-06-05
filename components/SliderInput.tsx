"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
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
      <Slider
        id={id}
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(_, v) =>
          onChange((Array.isArray(v) ? v[0] : v).toString())
        }
        aria-label={info.label}
        aria-describedby={`${id}-info`}
        className="flex-grow"
      />
      <span className="w-12 text-right font-mono text-[#007aff] font-semibold">
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  </div>
);

export default SliderInput;
