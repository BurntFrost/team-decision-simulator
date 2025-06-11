"use client";

import React, { Suspense, useMemo, useState, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { ArchetypeProfile, MBTIDescription, Weights } from "@/lib/decisionMatrixService";

interface MBTI3DVisualizationProps {
  archetypes: ArchetypeProfile[];
  mbtiDescriptions: Record<string, MBTIDescription>;
  userInputs: Weights;
  userMBTI?: string;
  className?: string;
}

// MBTI temperament groups for color coding
const temperamentGroups = {
  NT: ["INTJ", "INTP", "ENTJ", "ENTP"], // Analysts - Purple
  NF: ["INFJ", "INFP", "ENFJ", "ENFP"], // Diplomats - Green
  SJ: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"], // Sentinels - Blue
  SP: ["ISTP", "ISFP", "ESTP", "ESFP"], // Explorers - Orange
};

const temperamentColors = {
  NT: "#8b5cf6", // violet-500
  NF: "#10b981", // emerald-500
  SJ: "#3b82f6", // blue-500
  SP: "#f59e0b", // amber-500
};

// Helper function to get temperament group
const getTemperamentGroup = (mbtiType: string): keyof typeof temperamentGroups => {
  for (const [group, types] of Object.entries(temperamentGroups)) {
    if (types.includes(mbtiType)) {
      return group as keyof typeof temperamentGroups;
    }
  }
  return "NT"; // fallback
};

// Normalize user inputs to MBTI weight scale
const normalizeUserInputs = (inputs: Weights): Weights => {
  // MBTI weights typically range from -0.22 to 0.36
  // User inputs range from 0 to 1
  // We need to scale user inputs to match MBTI weight distribution

  // Calculate scaling factors based on typical MBTI weight ranges
  const scalingFactors = {
    data_quality: 0.36,      // Max observed in MBTI weights
    roi_visibility: 0.34,    // Max observed in MBTI weights
    autonomy_scope: 0.28,    // Max observed in MBTI weights
    time_pressure: 0.18,     // Max observed in MBTI weights
    social_complexity: 0.26, // Max observed in MBTI weights (positive range)
    psychological_safety: 0.32, // Max observed in MBTI weights
  };

  // Apply scaling to normalize user inputs to MBTI weight scale
  return {
    data_quality: inputs.data_quality * scalingFactors.data_quality,
    roi_visibility: inputs.roi_visibility * scalingFactors.roi_visibility,
    autonomy_scope: inputs.autonomy_scope * scalingFactors.autonomy_scope,
    time_pressure: inputs.time_pressure * scalingFactors.time_pressure,
    // For social_complexity, allow negative values by centering around 0
    social_complexity: (inputs.social_complexity - 0.5) * 0.48, // Range: -0.24 to 0.24
    psychological_safety: inputs.psychological_safety * scalingFactors.psychological_safety,
  };
};

// Convert MBTI weights to 3D coordinates
const weightsTo3D = (weights: Weights, isUserInput: boolean = false): [number, number, number] => {
  // Normalize user inputs to MBTI scale if needed
  const normalizedWeights = isUserInput ? normalizeUserInputs(weights) : weights;

  // X-axis: Analytical factors (data_quality + roi_visibility)
  const x = (normalizedWeights.data_quality + normalizedWeights.roi_visibility) * 5 - 2.5;

  // Y-axis: Decision style factors (autonomy_scope - time_pressure)
  const y = (normalizedWeights.autonomy_scope - normalizedWeights.time_pressure) * 5;

  // Z-axis: Social complexity
  const z = normalizedWeights.social_complexity * 10 - 2.5;

  return [x, y, z];
};

// Individual MBTI point component
interface MBTIPointProps {
  position: [number, number, number];
  color: string;
  mbtiType: string;
  description: MBTIDescription;
  onHover: (mbtiType: string | null) => void;
  isHovered: boolean;
  showFullNames: boolean;
}

const MBTIPoint: React.FC<MBTIPointProps> = React.memo(({
  position,
  color,
  mbtiType,
  description,
  onHover,
  isHovered,
  showFullNames,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Throttled animation for better performance
  useFrame((state) => {
    if (meshRef.current && isHovered) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.x = time * 1.5; // Reduced rotation speed
      meshRef.current.rotation.y = time * 1.5;
    }
  });

  // Memoized hover handlers
  const handlePointerEnter = useCallback(() => onHover(mbtiType), [onHover, mbtiType]);
  const handlePointerLeave = useCallback(() => onHover(null), [onHover]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        scale={isHovered ? 1.4 : 1.1} // Slightly larger base size and more prominent hover
      >
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={isHovered ? color : "#000000"}
          emissiveIntensity={isHovered ? 0.2 : 0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {isHovered && (
        <Html
          distanceFactor={6}
          zIndexRange={[100, 0]}
          transform
          occlude
          position={[0, 0.8, 0]}
        >
          <div className="bg-white/98 backdrop-blur-md p-4 rounded-xl shadow-2xl border-2 border-gray-300 max-w-sm pointer-events-none z-50 transform -translate-x-1/2">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <h4 className="font-bold text-base text-gray-900">
                {description.name}
              </h4>
            </div>
            <p className="text-sm text-gray-700 mb-3 font-medium leading-relaxed">
              {description.description}
            </p>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex flex-wrap gap-1">
                <strong className="text-gray-800">Key Traits:</strong>
                <span className="text-gray-600">{description.scientificFactors.keyTraits.slice(0, 3).join(", ")}</span>
              </div>
              <div>
                <strong className="text-gray-800">Decision Style:</strong>
                <span className="text-gray-600">{description.scientificFactors.decisionProcess.slice(0, 80)}...</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <strong className="text-gray-800">Strengths:</strong>
                <span className="text-gray-600">{description.scientificFactors.strengths.slice(0, 2).join(", ")}</span>
              </div>
            </div>
          </div>
        </Html>
      )}
      
      {/* MBTI Type Label with improved readability */}
      <Text
        position={[0, 0.45, 0]}
        fontSize={showFullNames ? 0.15 : 0.28}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
        maxWidth={showFullNames ? 2.5 : 1.5}
        textAlign="center"
      >
        {showFullNames ? description.name.replace(" - ", "\n") : mbtiType}
      </Text>

      {/* Background for better text contrast */}
      <mesh position={[0, 0.45, 0]}>
        <planeGeometry args={[showFullNames ? 2.8 : 1.2, showFullNames ? 0.8 : 0.5]} />
        <meshBasicMaterial
          color={color}
          opacity={0.85}
          transparent={true}
        />
      </mesh>
    </group>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo
  return (
    prevProps.mbtiType === nextProps.mbtiType &&
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.color === nextProps.color &&
    prevProps.showFullNames === nextProps.showFullNames &&
    prevProps.position[0] === nextProps.position[0] &&
    prevProps.position[1] === nextProps.position[1] &&
    prevProps.position[2] === nextProps.position[2]
  );
});

MBTIPoint.displayName = 'MBTIPoint';

// User position indicator
interface UserPositionProps {
  position: [number, number, number];
  userMBTI?: string;
}

const UserPosition: React.FC<UserPositionProps> = ({ position, userMBTI }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <ringGeometry args={[0.2, 0.3, 8]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.15}
        color="#ff6b6b"
        anchorX="center"
        anchorY="middle"
      >
        {userMBTI ? `YOU (${userMBTI})` : "YOU"}
      </Text>
    </group>
  );
};

// Axis lines and labels component
const AxisLabels: React.FC = () => {
  return (
    <>
      {/* X-axis line */}
      <mesh position={[0, -3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 8]} />
        <meshStandardMaterial color="#999" />
      </mesh>

      {/* Y-axis line */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 8]} />
        <meshStandardMaterial color="#999" />
      </mesh>

      {/* Z-axis line */}
      <mesh position={[0, -3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 8]} />
        <meshStandardMaterial color="#999" />
      </mesh>

      {/* X-axis label */}
      <Text
        position={[4, -3, 0]}
        fontSize={0.25}
        color="#555"
        anchorX="center"
        anchorY="middle"
      >
        Data + ROI Focus →
      </Text>

      {/* Y-axis label */}
      <Text
        position={[-3.5, 3, 0]}
        fontSize={0.25}
        color="#555"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, Math.PI / 2]}
      >
        Autonomy vs Speed →
      </Text>

      {/* Z-axis label */}
      <Text
        position={[0, -3.5, 3]}
        fontSize={0.25}
        color="#555"
        anchorX="center"
        anchorY="middle"
      >
        Social Complexity →
      </Text>
    </>
  );
};

// Main 3D Scene component
interface Scene3DProps {
  archetypes: ArchetypeProfile[];
  mbtiDescriptions: Record<string, MBTIDescription>;
  userInputs: Weights;
  userMBTI?: string;
  hoveredType: string | null;
  setHoveredType: (type: string | null) => void;
  showFullNames: boolean;
}

const Scene3D: React.FC<Scene3DProps> = React.memo(({
  archetypes,
  mbtiDescriptions,
  userInputs,
  userMBTI,
  hoveredType,
  setHoveredType,
  showFullNames,
}) => {
  const userPosition = useMemo(() => weightsTo3D(userInputs, true), [userInputs]);

  // Memoized hover handler to prevent unnecessary re-renders
  const handleHover = useCallback((type: string | null) => {
    setHoveredType(type);
  }, [setHoveredType]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />
      
      {/* Grid helper */}
      <gridHelper args={[10, 10]} position={[0, -3, 0]} />
      
      {/* Axis labels */}
      <AxisLabels />
      
      {/* MBTI points */}
      {archetypes.map((archetype) => {
        const mbtiType = archetype.name.split(" - ")[0]; // Extract MBTI code
        const position = weightsTo3D(archetype.weights, false);
        const temperament = getTemperamentGroup(mbtiType);
        const color = temperamentColors[temperament];

        return (
          <MBTIPoint
            key={mbtiType}
            position={position}
            color={color}
            mbtiType={mbtiType}
            description={mbtiDescriptions[mbtiType]}
            onHover={handleHover}
            isHovered={hoveredType === mbtiType}
            showFullNames={showFullNames}
          />
        );
      })}
      
      {/* User position */}
      <UserPosition position={userPosition} userMBTI={userMBTI} />
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo
  return (
    prevProps.hoveredType === nextProps.hoveredType &&
    prevProps.userMBTI === nextProps.userMBTI &&
    prevProps.showFullNames === nextProps.showFullNames &&
    JSON.stringify(prevProps.userInputs) === JSON.stringify(nextProps.userInputs)
  );
});

Scene3D.displayName = 'Scene3D';

// Main component
const MBTI3DVisualization: React.FC<MBTI3DVisualizationProps> = React.memo(({
  archetypes,
  mbtiDescriptions,
  userInputs,
  userMBTI,
  className = "",
}) => {
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [showFullNames, setShowFullNames] = useState<boolean>(false);

  // Debounced hover handler to improve performance
  const debouncedSetHoveredType = useCallback((type: string | null) => {
    setHoveredType(type);
  }, []);

  // Toggle display mode
  const toggleDisplayMode = useCallback(() => {
    setShowFullNames(prev => !prev);
  }, []);

  return (
    <div className={`w-full h-[400px] sm:h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden relative ${className}`}>
      <Canvas
        camera={{ position: [8, 8, 8], fov: 60 }}
        style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
      >
        <Suspense fallback={null}>
          <Scene3D
            archetypes={archetypes}
            mbtiDescriptions={mbtiDescriptions}
            userInputs={userInputs}
            userMBTI={userMBTI}
            hoveredType={hoveredType}
            setHoveredType={debouncedSetHoveredType}
            showFullNames={showFullNames}
          />
        </Suspense>
      </Canvas>
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-lg shadow-lg max-w-xs">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <h4 className="text-xs sm:text-sm font-semibold">MBTI Temperaments</h4>
          <button
            onClick={toggleDisplayMode}
            className="sm:hidden px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          >
            {showFullNames ? "Codes" : "Names"}
          </button>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          {Object.entries(temperamentColors).map(([group, color]) => (
            <div key={group} className="flex items-center gap-1 sm:gap-2 text-xs">
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs">
                {group === "NT" && "Analysts (NT)"}
                {group === "NF" && "Diplomats (NF)"}
                {group === "SJ" && "Sentinels (SJ)"}
                {group === "SP" && "Explorers (SP)"}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1 sm:gap-2 text-xs pt-1 border-t">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-red-500" />
            <span>Your Position</span>
          </div>
        </div>
      </div>

      {/* Controls Info - Hidden on mobile */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-lg shadow-lg hidden sm:block">
        <h4 className="text-sm font-semibold mb-2">3D Controls</h4>
        <div className="space-y-1 text-xs text-gray-600 mb-3">
          <div>🖱️ Drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
          <div>👆 Hover for details</div>
        </div>
        <button
          onClick={toggleDisplayMode}
          className="w-full px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        >
          {showFullNames ? "Show Codes" : "Show Names"}
        </button>
      </div>

      {/* Axis Info */}
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-lg shadow-lg max-w-xs">
        <h4 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Decision Factors</h4>
        <div className="space-y-0.5 sm:space-y-1 text-xs text-gray-600">
          <div><strong>X:</strong> Data + ROI</div>
          <div><strong>Y:</strong> Autonomy - Speed</div>
          <div><strong>Z:</strong> Social Complexity</div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo
  return (
    prevProps.userMBTI === nextProps.userMBTI &&
    prevProps.className === nextProps.className &&
    JSON.stringify(prevProps.userInputs) === JSON.stringify(nextProps.userInputs)
  );
});

MBTI3DVisualization.displayName = 'MBTI3DVisualization';

export default MBTI3DVisualization;
