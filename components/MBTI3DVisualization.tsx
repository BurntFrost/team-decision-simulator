"use client";

import React, { Suspense, useMemo, useState, useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { ArchetypeProfile, MBTIDescription, Weights } from "@/lib/decisionMatrixService";
import { factorInfo } from "@/models/decision/constants";

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

// Billboard Text component that always faces the camera
interface BillboardTextProps {
  position: [number, number, number];
  text: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  onHover?: (hovered: boolean) => void;
}

const BillboardText: React.FC<BillboardTextProps> = React.memo(({
  position,
  text,
  fontSize = 0.2,
  color = "#ffffff",
  backgroundColor = "#000000",
  backgroundOpacity = 0.7,
  onHover,
}) => {
  const textRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [isHovered, setIsHovered] = useState(false);

  // Use useFrame with a throttled update for better performance
  useFrame(() => {
    if (textRef.current && camera) {
      // Make the text always face the camera
      textRef.current.lookAt(camera.position);
    }

    // Add subtle hover animation
    if (meshRef.current && isHovered) {
      const time = Date.now() * 0.001;
      meshRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.05);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  // Calculate background size based on text length and font size
  // Handle multi-line text by checking for line breaks
  const lines = text.split('\n');
  const maxLineLength = Math.max(...lines.map(line => line.length));
  const backgroundWidth = Math.max(maxLineLength * fontSize * 0.55, fontSize * 2);
  const backgroundHeight = fontSize * (1.4 + (lines.length - 1) * 0.8);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    onHover?.(true);
  }, [onHover]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    onHover?.(false);
  }, [onHover]);

  return (
    <group ref={textRef} position={position}>
      {/* Background plane for better readability */}
      <mesh
        ref={meshRef}
        position={[0, 0, -0.01]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[backgroundWidth, backgroundHeight]} />
        <meshBasicMaterial
          color={backgroundColor}
          opacity={isHovered ? Math.min(backgroundOpacity + 0.2, 1) : backgroundOpacity}
          transparent={true}
        />
      </mesh>

      {/* Text with improved styling */}
      <Text
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000000"
        maxWidth={backgroundWidth * 0.9}
        textAlign="center"
      >
        {text}
      </Text>
    </group>
  );
});

BillboardText.displayName = 'BillboardText';

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
      
      {/* MBTI Type Label with billboard behavior */}
      <BillboardText
        position={[0, 0.45, 0]}
        text={showFullNames ? description.name.replace(" - ", "\n") : mbtiType}
        fontSize={showFullNames ? 0.15 : 0.28}
        color="#ffffff"
        backgroundColor={color}
        backgroundOpacity={0.85}
      />
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
      {/* User label with billboard behavior */}
      <BillboardText
        position={[0, -0.5, 0]}
        text={userMBTI ? `YOU (${userMBTI})` : "YOU"}
        fontSize={0.15}
        color="#ffffff"
        backgroundColor="#ff6b6b"
        backgroundOpacity={0.9}
      />
    </group>
  );
};

// Factor Labels component with billboard behavior
const FactorLabels: React.FC = () => {
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);

  // Define positions for each factor label in 3D space
  // Positioned to represent their influence on the decision space
  const factorPositions: Record<string, [number, number, number]> = {
    data_quality: [4.2, 1.8, 0.5],        // High X (analytical), slightly positive Y and Z
    roi_visibility: [4.2, -1.8, -0.5],    // High X (analytical), slightly negative Y and Z
    autonomy_scope: [-1.8, 4.2, 0.5],     // High Y (autonomy), slightly negative X and positive Z
    time_pressure: [1.8, -4.2, -0.5],     // Low Y (speed), slightly positive X and negative Z
    social_complexity: [0.5, 0.8, 4.2],   // High Z (social), slightly positive X and Y
    psychological_safety: [-0.5, 2.8, -3.5], // Negative Z (safety), positive Y, slightly negative X
  };

  // Color coding for different factor categories
  const factorColors: Record<string, { bg: string; text: string }> = {
    data_quality: { bg: "#3b82f6", text: "#ffffff" },      // Blue - Analytical
    roi_visibility: { bg: "#1d4ed8", text: "#ffffff" },    // Dark Blue - Analytical
    autonomy_scope: { bg: "#10b981", text: "#ffffff" },    // Green - Control
    time_pressure: { bg: "#f59e0b", text: "#ffffff" },     // Amber - Urgency
    social_complexity: { bg: "#ef4444", text: "#ffffff" }, // Red - Complexity
    psychological_safety: { bg: "#8b5cf6", text: "#ffffff" }, // Purple - Safety
  };

  const handleFactorHover = useCallback((factor: string, hovered: boolean) => {
    setHoveredFactor(hovered ? factor : null);
  }, []);

  return (
    <>
      {Object.entries(factorInfo).map(([key, info]) => {
        const colors = factorColors[key] || { bg: "#4455a6", text: "#ffffff" };
        const isHovered = hoveredFactor === key;

        return (
          <BillboardText
            key={key}
            position={factorPositions[key]}
            text={info.label}
            fontSize={isHovered ? 0.18 : 0.15}
            color={colors.text}
            backgroundColor={colors.bg}
            backgroundOpacity={isHovered ? 0.95 : 0.85}
            onHover={(hovered) => handleFactorHover(key, hovered)}
          />
        );
      })}
    </>
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

      {/* X-axis label with billboard behavior */}
      <BillboardText
        position={[4, -3, 0]}
        text="Data + ROI Focus →"
        fontSize={0.22}
        color="#ffffff"
        backgroundColor="#555555"
        backgroundOpacity={0.8}
      />

      {/* Y-axis label with billboard behavior */}
      <BillboardText
        position={[-3.5, 3, 0]}
        text="Autonomy vs Speed →"
        fontSize={0.22}
        color="#ffffff"
        backgroundColor="#555555"
        backgroundOpacity={0.8}
      />

      {/* Z-axis label with billboard behavior */}
      <BillboardText
        position={[0, -3.5, 3]}
        text="Social Complexity →"
        fontSize={0.22}
        color="#ffffff"
        backgroundColor="#555555"
        backgroundOpacity={0.8}
      />
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

      {/* Factor labels with billboard behavior */}
      <FactorLabels />

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
    <div className={`w-full h-[400px] sm:h-[500px] bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl overflow-hidden relative shadow-2xl ${className}`}>
      {/* Enhanced background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-500/5 to-cyan-400/5"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-white/8 via-transparent to-white/12"></div>

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <Canvas
        camera={{ position: [8, 8, 8], fov: 60 }}
        style={{
          background: "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.6) 100%)",
          borderRadius: "inherit"
        }}
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
      
      {/* Enhanced Legend */}
      <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 bg-white/20 backdrop-blur-xl border border-white/30 p-3 sm:p-4 rounded-2xl shadow-2xl max-w-xs">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            MBTI Temperaments
          </h4>
          <button
            onClick={toggleDisplayMode}
            className="sm:hidden px-3 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:scale-105 transform-gpu"
          >
            {showFullNames ? "Codes" : "Names"}
          </button>
        </div>
        <div className="space-y-1 sm:space-y-2">
          {Object.entries(temperamentColors).map(([group, color]) => (
            <div key={group} className="flex items-center gap-2 sm:gap-3 text-xs p-1.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all duration-200">
              <div
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg animate-pulse"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-medium text-gray-700">
                {group === "NT" && "Analysts (NT)"}
                {group === "NF" && "Diplomats (NF)"}
                {group === "SJ" && "Sentinels (SJ)"}
                {group === "SP" && "Explorers (SP)"}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 sm:gap-3 text-xs pt-2 border-t border-white/30 p-1.5 rounded-xl bg-white/30 backdrop-blur-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-red-500 shadow-lg animate-pulse" />
            <span className="font-medium text-gray-700">Your Position</span>
          </div>
        </div>
      </div>

      {/* Enhanced Controls Info - Hidden on mobile */}
      <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-white/20 backdrop-blur-xl border border-white/30 p-3 sm:p-4 rounded-2xl shadow-2xl hidden sm:block">
        <h4 className="text-sm font-semibold mb-3 text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          3D Controls
        </h4>
        <div className="space-y-2 text-xs text-gray-700 mb-4">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20">
            <span>🖱️</span>
            <span>Drag to rotate</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20">
            <span>🔍</span>
            <span>Scroll to zoom</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20">
            <span>👆</span>
            <span>Hover for details</span>
          </div>
        </div>
        <button
          onClick={toggleDisplayMode}
          className="w-full px-3 py-2 text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:scale-105 transform-gpu font-medium"
        >
          {showFullNames ? "Show Codes" : "Show Names"}
        </button>
      </div>

      {/* Enhanced Axis Info */}
      <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 bg-white/20 backdrop-blur-xl border border-white/30 p-3 sm:p-4 rounded-2xl shadow-2xl max-w-xs">
        <h4 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Decision Factors
        </h4>
        <div className="space-y-2 sm:space-y-3 text-xs text-gray-700">
          <div className="p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20">
            <strong className="text-red-600">X:</strong> Data + ROI
          </div>
          <div className="p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20">
            <strong className="text-green-600">Y:</strong> Autonomy - Speed
          </div>
          <div className="p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20">
            <strong className="text-blue-600">Z:</strong> Social Complexity
          </div>
          <div className="text-xs text-blue-600 mt-3 pt-2 border-t border-white/30 p-2 rounded-xl bg-white/40 backdrop-blur-sm">
            💡 All text labels always face you as you rotate the view
          </div>
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
