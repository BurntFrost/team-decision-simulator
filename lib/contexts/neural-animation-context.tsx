"use client";

import * as React from "react";

export type AnimationIntensity = "idle" | "active" | "intense" | "burst";

interface NeuralAnimationState {
  intensity: AnimationIntensity;
  isInteracting: boolean;
  interactionCount: number;
  lastInteraction: number;
}

interface NeuralAnimationContextValue {
  state: NeuralAnimationState;
  triggerInteraction: (type?: "click" | "hover" | "form" | "navigation") => void;
  setIntensity: (intensity: AnimationIntensity) => void;
  resetToIdle: () => void;
}

const NeuralAnimationContext = React.createContext<NeuralAnimationContextValue | null>(null);

interface NeuralAnimationProviderProps {
  children: React.ReactNode;
  idleTimeout?: number; // Time in ms before returning to idle state
  burstDuration?: number; // Duration of burst animation in ms
}

export const NeuralAnimationProvider: React.FC<NeuralAnimationProviderProps> = ({
  children,
  idleTimeout = 3000,
  burstDuration = 2000,
}) => {
  const [state, setState] = React.useState<NeuralAnimationState>({
    intensity: "idle",
    isInteracting: false,
    interactionCount: 0,
    lastInteraction: 0,
  });

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const burstTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const triggerInteraction = React.useCallback((type: "click" | "hover" | "form" | "navigation" = "click") => {
    const now = Date.now();
    
    setState(prev => {
      const newCount = prev.interactionCount + 1;
      let newIntensity: AnimationIntensity = "active";
      
      // Determine intensity based on interaction type and frequency
      switch (type) {
        case "click":
          newIntensity = newCount > 3 ? "burst" : "intense";
          break;
        case "form":
          newIntensity = "burst";
          break;
        case "navigation":
          newIntensity = "intense";
          break;
        case "hover":
          newIntensity = "active";
          break;
      }
      
      return {
        ...prev,
        intensity: newIntensity,
        isInteracting: true,
        interactionCount: newCount,
        lastInteraction: now,
      };
    });

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (burstTimeoutRef.current) {
      clearTimeout(burstTimeoutRef.current);
    }

    // Handle burst animation duration
    if (state.intensity === "burst") {
      burstTimeoutRef.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          intensity: "active",
        }));
      }, burstDuration);
    }

    // Set timeout to return to idle
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        intensity: "idle",
        isInteracting: false,
        interactionCount: Math.max(0, prev.interactionCount - 1),
      }));
    }, idleTimeout);
  }, [idleTimeout, burstDuration, state.intensity]);

  const setIntensity = React.useCallback((intensity: AnimationIntensity) => {
    setState(prev => ({
      ...prev,
      intensity,
      isInteracting: intensity !== "idle",
    }));
  }, []);

  const resetToIdle = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (burstTimeoutRef.current) {
      clearTimeout(burstTimeoutRef.current);
    }
    
    setState({
      intensity: "idle",
      isInteracting: false,
      interactionCount: 0,
      lastInteraction: 0,
    });
  }, []);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (burstTimeoutRef.current) {
        clearTimeout(burstTimeoutRef.current);
      }
    };
  }, []);

  const contextValue: NeuralAnimationContextValue = React.useMemo(() => ({
    state,
    triggerInteraction,
    setIntensity,
    resetToIdle,
  }), [state, triggerInteraction, setIntensity, resetToIdle]);

  return (
    <NeuralAnimationContext.Provider value={contextValue}>
      {children}
    </NeuralAnimationContext.Provider>
  );
};

export const useNeuralAnimation = (): NeuralAnimationContextValue => {
  const context = React.useContext(NeuralAnimationContext);
  if (!context) {
    throw new Error("useNeuralAnimation must be used within a NeuralAnimationProvider");
  }
  return context;
};

// Hook for components that want to trigger interactions
export const useNeuralInteraction = () => {
  const { triggerInteraction } = useNeuralAnimation();
  
  return {
    onInteraction: triggerInteraction,
    onClick: () => triggerInteraction("click"),
    onHover: () => triggerInteraction("hover"),
    onFormSubmit: () => triggerInteraction("form"),
    onNavigation: () => triggerInteraction("navigation"),
  };
};

// Hook for getting animation classes based on current state
export const useNeuralAnimationClasses = () => {
  const { state } = useNeuralAnimation();
  
  const getIntensityClass = React.useCallback(() => {
    switch (state.intensity) {
      case "idle":
        return "opacity-30";
      case "active":
        return "opacity-50 animate-neural-network-active";
      case "intense":
        return "opacity-70 animate-neural-network-active";
      case "burst":
        return "opacity-90 animate-neural-network-intense";
      default:
        return "opacity-30";
    }
  }, [state.intensity]);

  const getNodeAnimationClass = React.useCallback((index: number) => {
    const baseClass = "animate-neural-node";
    let delayClass = "";
    if (index % 3 === 0) {
      delayClass = "animate-neural-node-delayed";
    } else if (index % 3 === 1) {
      delayClass = "animate-neural-node-slow";
    }

    const intensityClass = state.intensity === "burst" ? "animate-synaptic-burst" : "";

    return `${baseClass} ${delayClass} ${intensityClass}`.trim();
  }, [state.intensity]);

  return {
    intensityClass: getIntensityClass(),
    getNodeAnimationClass,
    isInteracting: state.isInteracting,
    intensity: state.intensity,
  };
};
