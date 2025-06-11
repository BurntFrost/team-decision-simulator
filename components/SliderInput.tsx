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
  <div className="flex flex-col">
    <div className="flex justify-between items-center mb-2">
      <label htmlFor={id} className="font-medium text-sm sm:text-md text-[#1d1d1f] leading-tight">
        {info.label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            aria-label={`More information about ${info.label}`}
            className="text-sm text-gray-600 cursor-help bg-white/8 backdrop-blur-md border border-white/20 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-200"
          >
            ⓘ
          </button>
        </PopoverTrigger>
        <PopoverContent
          id={`${id}-info`}
          className="max-w-xs bg-white/12 backdrop-blur-xl border-white/30 shadow-2xl rounded-2xl p-4"
        >
          <p className="font-medium text-gray-800">{info.description}</p>
            <div className="mt-3 text-sm grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/20">
              <span className="font-bold text-gray-800">Low:</span> <span className="text-gray-700">{info.lowDesc}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/20">
              <span className="font-bold text-gray-800">High:</span> <span className="text-gray-700">{info.highDesc}</span>
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
      <span className="w-14 text-right font-mono text-blue-600 font-semibold bg-white/8 backdrop-blur-md border border-white/20 px-2 py-1 rounded-lg text-sm">
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  </div>
);

export default SliderInput;
