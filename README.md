# MBTI Brain

A sophisticated decision-making simulation tool that helps teams understand how different personality types approach decisions. This application models the decision-making processes of all 16 MBTI personality types and provides insights into team dynamics and consensus building.

## Features

- **Personality-Based Decision Modeling**: Simulates how each of the 16 MBTI personality types would approach decisions based on their cognitive preferences
- **Factor Analysis**: Evaluates decisions across multiple factors including:
  - Data Quality
  - ROI Visibility
  - Autonomy Scope
  - Time Pressure
  - Social Complexity
- **Visual Analytics**: Provides multiple visualization tools to understand decision patterns:
  - Radar charts for factor comparison
  - Decision flow diagrams
  - Heat maps of personality responses
  - Quadrant analysis of decisiveness vs confidence
- **Public Opinion Simulation**: Models how a diverse group might reach consensus
- **Scenario Testing**: Test different decision scenarios and see how various personality types would respond

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

1. **Input Decision Factors**: Adjust sliders to set the importance of different factors in your decision scenario
2. **Run Simulation**: The application will calculate how each MBTI type would likely respond
3. **Analyze Results**: View detailed visualizations of the decision patterns and potential team dynamics
4. **Build Consensus**: Use the insights to understand how to build consensus across different personality types

## Architecture Overview

### Technology Stack

- **Frontend**: Next.js 15 with App Router, React 18+, TypeScript
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **Charts**: Recharts for data visualization
- **Testing**: Vitest for unit testing
- **Deployment**: Static export optimized for GitHub Pages

### Core Components

- **Decision Engine**: Sophisticated algorithms modeling MBTI cognitive functions
- **Factor Analysis**: 5-factor decision matrix (Data Quality, ROI Visibility, Autonomy Scope, Time Pressure, Social Complexity)
- **MBTI Models**: Factory pattern implementation for all 16 personality types
- **Visualization Layer**: Multiple chart types including radar, bar, scatter, and heat maps

### Key Features

- **Type-Safe**: Comprehensive TypeScript implementation with strict typing
- **Modular Design**: Clean separation between UI, business logic, and data models
- **Mobile-First**: Responsive design with iOS-style interface
- **Performance Optimized**: Static export with bundle analysis and optimized builds

## Project Structure

```text
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts and metadata
│   └── page.tsx           # Main application entry point
├── components/            # React components
│   ├── ui/               # Reusable UI primitives (Shadcn/ui)
│   ├── UserDecisionDashboard.tsx  # Main application container
│   └── UserDecisionCharts.tsx     # Visualization layer
├── models/decision/       # Business logic and data models
│   ├── types.ts          # TypeScript type definitions
│   ├── constants.ts      # Factor definitions and presets
│   ├── logic.ts          # Core calculation algorithms
│   └── mbti/             # MBTI personality type implementations
│       ├── base.ts       # Abstract base class
│       ├── index.ts      # Factory pattern implementation
│       └── [type].ts     # Individual MBTI type classes
├── lib/                  # Utility functions and services
│   ├── decisionMatrixService.ts  # Business logic facade
│   └── utils.ts          # Helper utilities
└── tests/                # Unit tests
    ├── logic.test.ts     # Core business logic tests
    └── additional.test.ts # Extended functionality tests
```

## Data Flow

1. **User Input**: Factor sliders adjust decision parameters
2. **State Management**: React hooks manage application state
3. **Service Layer**: DecisionMatrixService processes business logic
4. **MBTI Models**: Individual personality types calculate decision scores
5. **Visualization**: Multiple chart types render simulation results

## Development Commands

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Production build
npm run start           # Start production server

# Testing & Quality
npm run test            # Run unit tests
npm run lint            # ESLint code analysis
npm run typecheck       # TypeScript type checking

# Analysis & Deployment
npm run build:analyze   # Bundle analysis
npm run build:prod      # Production build with optimizations
npm run clean           # Clean build artifacts
```

## Learn More

To learn more about the MBTI framework and decision-making styles:

- [Myers-Briggs Type Indicator](https://www.myersbriggs.org/)
- [Cognitive Functions in MBTI](https://www.16personalities.com/articles/our-theory)
- [Team Decision Making](https://www.psychologytoday.com/us/basics/decision-making)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
