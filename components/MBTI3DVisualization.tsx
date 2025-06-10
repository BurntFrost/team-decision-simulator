"use client";

import React, { Suspense, useMemo, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { ArchetypeProfile, MBTIDescription, FactorKey, Weights } from "@/lib/decisionMatrixService";

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

// Convert MBTI weights to 3D coordinates
const weightsTo3D = (weights: Weights): [number, number, number] => {
  // X-axis: Analytical factors (data_quality + roi_visibility)
  const x = (weights.data_quality + weights.roi_visibility) * 5 - 2.5;
  
  // Y-axis: Decision style factors (autonomy_scope - time_pressure)
  const y = (weights.autonomy_scope - weights.time_pressure) * 5;
  
  // Z-axis: Social complexity
  const z = weights.social_complexity * 10 - 2.5;
  
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
}

const MBTIPoint: React.FC<MBTIPointProps> = ({
  position,
  color,
  mbtiType,
  description,
  onHover,
  isHovered,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isHovered) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover(mbtiType)}
        onPointerLeave={() => onHover(null)}
        scale={isHovered ? 1.5 : 1}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {isHovered && (
        <Html distanceFactor={10}>
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs pointer-events-none">
            <h4 className="font-bold text-sm mb-1" style={{ color }}>
              {description.name}
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              {description.description}
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <div><strong>Key Traits:</strong> {description.scientificFactors.keyTraits.slice(0, 3).join(", ")}</div>
              <div><strong>Decision Style:</strong> {description.scientificFactors.decisionProcess.slice(0, 80)}...</div>
              <div><strong>Strengths:</strong> {description.scientificFactors.strengths.slice(0, 2).join(", ")}</div>
            </div>
          </div>
        </Html>
      )}
      
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {mbtiType}
      </Text>
    </group>
  );
};

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
}

const Scene3D: React.FC<Scene3DProps> = ({
  archetypes,
  mbtiDescriptions,
  userInputs,
  userMBTI,
  hoveredType,
  setHoveredType,
}) => {
  const userPosition = useMemo(() => weightsTo3D(userInputs), [userInputs]);

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
        const position = weightsTo3D(archetype.weights);
        const temperament = getTemperamentGroup(mbtiType);
        const color = temperamentColors[temperament];
        
        return (
          <MBTIPoint
            key={mbtiType}
            position={position}
            color={color}
            mbtiType={mbtiType}
            description={mbtiDescriptions[mbtiType]}
            onHover={setHoveredType}
            isHovered={hoveredType === mbtiType}
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
      />
    </>
  );
};

// Main component
const MBTI3DVisualization: React.FC<MBTI3DVisualizationProps> = ({
  archetypes,
  mbtiDescriptions,
  userInputs,
  userMBTI,
  className = "",
}) => {
  const [hoveredType, setHoveredType] = useState<string | null>(null);

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
            setHoveredType={setHoveredType}
          />
        </Suspense>
      </Canvas>
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-lg shadow-lg max-w-xs">
        <h4 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">MBTI Temperaments</h4>
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
        <div className="space-y-1 text-xs text-gray-600">
          <div>🖱️ Drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
          <div>👆 Hover for details</div>
        </div>
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
};

export default MBTI3DVisualization;
