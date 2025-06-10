"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ArchetypeProfile, MBTIDescription, Weights } from "@/lib/decisionMatrixService";

interface MBTI3DWrapperProps {
  archetypes: ArchetypeProfile[];
  mbtiDescriptions: Record<string, MBTIDescription>;
  userInputs: Weights;
  userMBTI?: string;
  className?: string;
}

// Dynamically import the 3D visualization to avoid SSR issues
const MBTI3DVisualization = dynamic(() => import("./MBTI3DVisualization"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4455a6] mx-auto mb-4"></div>
        <p className="text-[#4455a6] font-medium">Loading 3D Visualization...</p>
        <p className="text-sm text-gray-500 mt-1">Mapping MBTI types to decision factors</p>
      </div>
    </div>
  ),
});

const MBTI3DWrapper: React.FC<MBTI3DWrapperProps> = (props) => {
  return <MBTI3DVisualization {...props} />;
};

export default MBTI3DWrapper;
