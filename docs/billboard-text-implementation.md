# Billboard Text Implementation for 3D Visualization

## Overview

This document describes the comprehensive implementation of billboard text behavior for ALL text elements in the MBTI 3D visualization. Billboard text always faces the camera/user regardless of how they rotate, pan, or zoom the 3D scene.

## Text Elements with Billboard Behavior

1. **MBTI Profile Names** - The 16 personality type labels (e.g., "INTJ", "ENFP", etc.)
2. **Decision Factor Labels** - The 6 decision factor names positioned in 3D space
3. **User Position Label** - The "YOU" indicator showing user's position
4. **Axis Labels** - The X, Y, Z axis descriptions

## Implementation Details

### BillboardText Component

The `BillboardText` component is a React Three Fiber component that:

1. **Always faces the camera**: Uses `useFrame` hook to continuously update the text orientation using `lookAt(camera.position)`
2. **Provides readable backgrounds**: Includes a colored background plane for better text visibility
3. **Supports hover interactions**: Changes opacity and size when hovered
4. **Optimized for performance**: Uses React.memo and throttled updates

### Factor Label Positioning

The 6 decision factors are positioned strategically in 3D space:

- **Data Quality**: High X-axis (analytical focus)
- **ROI Visibility**: High X-axis (analytical focus)
- **Autonomy & Scope**: High Y-axis (control/autonomy)
- **Time Pressure**: Low Y-axis (speed/urgency)
- **Social Complexity**: High Z-axis (social dimension)
- **Psychological Safety**: Negative Z-axis (safety dimension)

### Color Coding

Each factor has a distinct color to help users identify them:

- **Data Quality**: Blue (#3b82f6) - Analytical
- **ROI Visibility**: Dark Blue (#1d4ed8) - Analytical
- **Autonomy & Scope**: Green (#10b981) - Control
- **Time Pressure**: Amber (#f59e0b) - Urgency
- **Social Complexity**: Red (#ef4444) - Complexity
- **Psychological Safety**: Purple (#8b5cf6) - Safety

## Features

### Billboard Behavior
- Text always faces the camera during all 3D interactions
- Maintains readability from any viewing angle
- Smooth rotation updates using Three.js lookAt method

### Interactive Elements
- Hover effects with size and opacity changes
- Subtle pulsing animation when hovered
- Color-coded backgrounds for easy identification

### Performance Optimizations
- React.memo for component memoization
- Throttled useFrame updates
- Efficient background size calculations

## Usage

The billboard text is automatically included in the 3D visualization and requires no additional configuration. Users can:

1. Rotate the 3D scene and see factor labels always facing them
2. Hover over labels for enhanced visibility
3. Use the labels as reference points while exploring MBTI personality positions

## Technical Implementation

```typescript
// Key implementation details:
useFrame(() => {
  if (textRef.current && camera) {
    // Make the text always face the camera
    textRef.current.lookAt(camera.position);
  }
});
```

The implementation uses React Three Fiber's `useFrame` hook to update the text orientation on every frame, ensuring smooth billboard behavior during all 3D navigation interactions.
