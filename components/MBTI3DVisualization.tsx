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
  // Optimized lookup using direct character checking for better performance
  const n = mbtiType[0] === 'E' ? mbtiType[1] : mbtiType[0];
  const t = mbtiType[2];
  const p = mbtiType[3];

  if (n === 'N' && t === 'T') return "NT";
  if (n === 'N' && t === 'F') return "NF";
  if (n === 'S' && p === 'P') return "SP";
  return "SJ"; // Default for SJ types
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

// Convert MBTI weights to 3D coordinates (simplified mapping)
const weightsTo3D = (weights: Weights, isUserInput: boolean = false): [number, number, number] => {
  // Normalize user inputs to MBTI scale if needed
  const normalizedWeights = isUserInput ? normalizeUserInputs(weights) : weights;

  // Simplified 3D mapping with reduced range for better visibility
  // X-axis: Analytical factors (data_quality + roi_visibility)
  const x = (normalizedWeights.data_quality + normalizedWeights.roi_visibility) * 3 - 1.5;

  // Y-axis: Decision style factors (autonomy_scope - time_pressure)
  const y = (normalizedWeights.autonomy_scope - normalizedWeights.time_pressure) * 3;

  // Z-axis: Social complexity (reduced range)
  const z = normalizedWeights.social_complexity * 4 - 1;

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
  fontSize = 0.18,
  color = "#ffffff",
  backgroundColor = "#1e293b",
  backgroundOpacity = 0.85,
  onHover,
}) => {
  const textRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [isHovered, setIsHovered] = useState(false);

  // Optimized billboard behavior with reduced frequency for better performance
  useFrame((state) => {
    if (textRef.current && camera && state.clock.elapsedTime % 0.1 < 0.016) {
      textRef.current.lookAt(camera.position);
    }
  });

  // Simplified background dimensions
  const backgroundWidth = Math.max(text.length * fontSize * 0.5, 1.2);
  const backgroundHeight = fontSize * 1.6;

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
      {/* Simplified background with liquid glass styling */}
      <mesh
        position={[0, 0, -0.01]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[backgroundWidth, backgroundHeight]} />
        <meshBasicMaterial
          color={backgroundColor}
          opacity={isHovered ? Math.min(backgroundOpacity + 0.15, 1) : backgroundOpacity}
          transparent={true}
        />
      </mesh>

      {/* Simplified text styling */}
      <Text
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
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
  prefersReducedMotion?: boolean;
}

const MBTIPoint: React.FC<MBTIPointProps> = React.memo(({
  position,
  color,
  mbtiType,
  description,
  onHover,
  isHovered,
  showFullNames,
  prefersReducedMotion = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Simplified animation with better performance and accessibility
  useFrame((state) => {
    if (meshRef.current && isHovered && !prefersReducedMotion) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.y = time * 0.8; // Reduced rotation speed
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
        scale={isHovered ? 1.3 : 1.0} // Simplified scaling
      >
        <sphereGeometry args={[0.15, 16, 16]} /> {/* Reduced geometry complexity */}
        <meshStandardMaterial
          color={color}
          emissive={isHovered ? color : "#000000"}
          emissiveIntensity={isHovered ? 0.15 : 0}
          roughness={0.4}
          metalness={0.2}
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
  prefersReducedMotion?: boolean;
}

const UserPosition: React.FC<UserPositionProps> = ({ position, userMBTI, prefersReducedMotion = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && !prefersReducedMotion) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.6; // Slower rotation
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <ringGeometry args={[0.18, 0.25, 12]} /> {/* Slightly smaller, more segments */}
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* User label with billboard behavior */}
      <BillboardText
        position={[0, -0.4, 0]}
        text={userMBTI ? `YOU (${userMBTI})` : "YOU"}
        fontSize={0.14}
        color="#ffffff"
        backgroundColor="#ef4444"
        backgroundOpacity={0.9}
      />
    </group>
  );
};

// Factor Labels component with billboard behavior
const FactorLabels: React.FC = () => {
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);

  // Simplified factor positions for better visibility and reduced clutter
  const factorPositions: Record<string, [number, number, number]> = {
    data_quality: [2.5, 1.0, 0.3],        // Analytical factors - right side
    roi_visibility: [2.5, -1.0, -0.3],    // Analytical factors - right side
    autonomy_scope: [-1.0, 2.5, 0.3],     // Autonomy - top
    time_pressure: [1.0, -2.5, -0.3],     // Speed - bottom
    social_complexity: [0.3, 0.5, 2.5],   // Social - front
    psychological_safety: [-0.3, 1.5, -2.0], // Safety - back
  };

  // Simplified color scheme aligned with liquid glass aesthetic
  const factorColors: Record<string, { bg: string; text: string }> = {
    data_quality: { bg: "#3b82f6", text: "#ffffff" },      // Blue - Analytical
    roi_visibility: { bg: "#1e40af", text: "#ffffff" },    // Dark Blue - Analytical
    autonomy_scope: { bg: "#06b6d4", text: "#ffffff" },    // Cyan - Control
    time_pressure: { bg: "#8b5cf6", text: "#ffffff" },     // Purple - Urgency
    social_complexity: { bg: "#6366f1", text: "#ffffff" }, // Indigo - Complexity
    psychological_safety: { bg: "#a855f7", text: "#ffffff" }, // Purple - Safety
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
            text={info.label.replace(" Quality", "").replace(" Visibility", "")} // Simplified labels
            fontSize={isHovered ? 0.16 : 0.14}
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

// Simplified axis labels component (removed axis lines for cleaner look)
const AxisLabels: React.FC = () => {
  return (
    <>
      {/* Simplified axis labels with better positioning */}
      <BillboardText
        position={[2.8, -2.2, 0]}
        text="Analytical →"
        fontSize={0.16}
        color="#ffffff"
        backgroundColor="#3b82f6"
        backgroundOpacity={0.8}
      />

      <BillboardText
        position={[-2.5, 2.8, 0]}
        text="Autonomy →"
        fontSize={0.16}
        color="#ffffff"
        backgroundColor="#06b6d4"
        backgroundOpacity={0.8}
      />

      <BillboardText
        position={[0, -2.8, 2.2]}
        text="Social →"
        fontSize={0.16}
        color="#ffffff"
        backgroundColor="#6366f1"
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
  prefersReducedMotion?: boolean;
}

const Scene3D: React.FC<Scene3DProps> = React.memo(({
  archetypes,
  mbtiDescriptions,
  userInputs,
  userMBTI,
  hoveredType,
  setHoveredType,
  showFullNames,
  prefersReducedMotion = false,
}) => {
  const userPosition = useMemo(() => weightsTo3D(userInputs, true), [userInputs]);

  // Memoized hover handler to prevent unnecessary re-renders
  const handleHover = useCallback((type: string | null) => {
    setHoveredType(type);
  }, [setHoveredType]);

  // Memoized MBTI points to prevent unnecessary re-renders
  const mbtiPoints = useMemo(() => {
    return archetypes.map((archetype) => {
      const mbtiType = archetype.name.split(" - ")[0];
      const position = weightsTo3D(archetype.weights, false);
      const temperament = getTemperamentGroup(mbtiType);
      const color = temperamentColors[temperament];

      return {
        key: mbtiType,
        position,
        color,
        mbtiType,
        description: mbtiDescriptions[mbtiType],
      };
    });
  }, [archetypes, mbtiDescriptions]);

  return (
    <>
      {/* Simplified lighting setup */}
      <ambientLight intensity={0.7} />
      <pointLight position={[8, 8, 8]} intensity={0.6} />
      <pointLight position={[-4, -4, -4]} intensity={0.3} />

      {/* Simplified grid helper */}
      <gridHelper args={[6, 6]} position={[0, -2.5, 0]} />

      {/* Axis labels */}
      <AxisLabels />

      {/* Factor labels with billboard behavior */}
      <FactorLabels />

      {/* Optimized MBTI points */}
      {mbtiPoints.map((point) => (
        <MBTIPoint
          key={point.key}
          position={point.position}
          color={point.color}
          mbtiType={point.mbtiType}
          description={point.description}
          onHover={handleHover}
          isHovered={hoveredType === point.mbtiType}
          showFullNames={showFullNames}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}

      {/* User position */}
      <UserPosition
        position={userPosition}
        userMBTI={userMBTI}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Optimized orbit controls with accessibility */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={15}
        enableDamping={true}
        dampingFactor={0.08}
        rotateSpeed={prefersReducedMotion ? 0.2 : 0.5}
        zoomSpeed={0.8}
        panSpeed={0.8}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN
        }}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }}
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

// Main component with accessibility improvements
const MBTI3DVisualization: React.FC<MBTI3DVisualizationProps> = React.memo(({
  archetypes,
  mbtiDescriptions,
  userInputs,
  userMBTI,
  className = "",
}) => {
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [showFullNames, setShowFullNames] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Enhanced accessibility checks
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle display mode
  const toggleDisplayMode = useCallback(() => {
    setShowFullNames(prev => !prev);
  }, []);

  // Add keyboard navigation support
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
        // Allow keyboard navigation through the 3D scene
        e.preventDefault();
        if (e.key === 'Enter' || e.key === ' ') {
          toggleDisplayMode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDisplayMode]);

  // Debounced hover handler to improve performance
  const debouncedSetHoveredType = useCallback((type: string | null) => {
    setHoveredType(type);
  }, []);

  return (
    <div
      className={`w-full h-[400px] sm:h-[500px] bg-gradient-to-br from-white/18 via-white/12 to-white/8 backdrop-blur-2xl border border-white/40 rounded-3xl overflow-hidden relative shadow-liquid ${className}`}
      role="img"
      aria-label="Interactive 3D visualization of MBTI personality types and decision factors"
      tabIndex={0}
    >
      {/* Liquid Glass Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/8 via-purple-400/6 to-cyan-300/8"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-white/10 via-transparent to-white/15"></div>

      {/* Enhanced Glass Morphism Texture */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <Canvas
        camera={{ position: [6, 6, 6], fov: 65 }}
        style={{
          background: "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(226, 232, 240, 0.8) 50%, rgba(219, 234, 254, 0.9) 100%)",
          borderRadius: "inherit"
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial color="#3b82f6" opacity={0.6} transparent />
          </mesh>
        }>
          <Scene3D
            archetypes={archetypes}
            mbtiDescriptions={mbtiDescriptions}
            userInputs={userInputs}
            userMBTI={userMBTI}
            hoveredType={hoveredType}
            setHoveredType={debouncedSetHoveredType}
            showFullNames={showFullNames}
            prefersReducedMotion={prefersReducedMotion}
          />
        </Suspense>
      </Canvas>
      
      {/* Simplified Legend with Liquid Glass Styling */}
      <div className="absolute bottom-4 left-4 bg-white/15 backdrop-blur-2xl border border-white/25 p-4 rounded-2xl shadow-xl max-w-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-glass-effect">
            MBTI Types
          </h4>
          <button
            onClick={toggleDisplayMode}
            className="sm:hidden px-2 py-1 text-xs bg-blue-500/80 hover:bg-blue-600/80 text-white rounded-lg transition-all duration-200"
          >
            {showFullNames ? "Codes" : "Names"}
          </button>
        </div>
        <div className="space-y-2">
          {Object.entries(temperamentColors).map(([group, color]) => (
            <div key={group} className="flex items-center gap-3 text-xs p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-medium text-enhanced-contrast">
                {group === "NT" && "Analysts"}
                {group === "NF" && "Diplomats"}
                {group === "SJ" && "Sentinels"}
                {group === "SP" && "Explorers"}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-3 text-xs pt-2 border-t border-white/20 p-2 rounded-lg bg-white/15">
            <div className="w-3 h-3 rounded-full border-2 border-red-500" />
            <span className="font-medium text-enhanced-contrast">Your Position</span>
          </div>
        </div>
      </div>

      {/* Simplified Controls Info */}
      <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-2xl border border-white/25 p-4 rounded-2xl shadow-xl hidden sm:block">
        <h4 className="text-sm font-semibold mb-3 text-glass-effect">
          Controls
        </h4>
        <div className="space-y-2 text-xs text-subtle-glass mb-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10">
            <span>🖱️</span>
            <span>Drag to rotate</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10">
            <span>🔍</span>
            <span>Scroll to zoom</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10">
            <span>👆</span>
            <span>Hover for details</span>
          </div>
        </div>
        <button
          onClick={toggleDisplayMode}
          className="w-full px-3 py-2 text-xs bg-blue-500/80 hover:bg-blue-600/80 text-white rounded-lg transition-all duration-200 font-medium"
        >
          {showFullNames ? "Show Codes" : "Show Names"}
        </button>
      </div>

      {/* Simplified Decision Factors Info */}
      <div className="absolute bottom-4 right-4 bg-white/15 backdrop-blur-2xl border border-white/25 p-4 rounded-2xl shadow-xl max-w-xs">
        <h4 className="text-sm font-semibold mb-3 text-glass-effect">
          Decision Factors
        </h4>
        <div className="space-y-2 text-xs text-subtle-glass">
          <div className="p-2 rounded-lg bg-white/10">
            <strong className="text-blue-600">Analytical:</strong> Data + ROI
          </div>
          <div className="p-2 rounded-lg bg-white/10">
            <strong className="text-cyan-600">Autonomy:</strong> Control vs Speed
          </div>
          <div className="p-2 rounded-lg bg-white/10">
            <strong className="text-indigo-600">Social:</strong> Complexity
          </div>
          <div className="text-xs text-blue-600/80 mt-3 pt-2 border-t border-white/20 p-2 rounded-lg bg-white/15">
            💡 Labels always face the camera
          </div>
        </div>
      </div>

      {/* Screen Reader Accessible Description */}
      <div className="sr-only">
        <h3>MBTI Decision Factors 3D Visualization</h3>
        <p>
          This interactive 3D visualization shows how different MBTI personality types
          approach decision-making across six key factors: data quality, ROI visibility,
          autonomy scope, time pressure, social complexity, and psychological safety.
        </p>
        <p>
          Each colored sphere represents one of the 16 MBTI types, positioned based on
          their decision-making preferences. Your current position is shown as a red ring.
        </p>
        <p>
          Use mouse or touch to rotate the view, scroll to zoom, and hover over elements
          for more details. Press Enter or Space to toggle between showing MBTI codes
          and full type names.
        </p>
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
