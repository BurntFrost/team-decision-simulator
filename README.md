# MBTI Brain

A decision-making simulation tool that models how the 16 MBTI personality types approach decisions. It uses a 6-factor decision matrix informed by personality psychology research and provides visual analytics to explore team dynamics and consensus patterns.

## Features

- **Personality-Based Decision Modeling**: Simulates how each of the 16 MBTI types would respond to a decision scenario based on their cognitive preferences
- **6-Factor Decision Matrix**: Evaluates decisions across research-backed factors:
  - **Data Quality** — Reliability and completeness of available information
  - **ROI Visibility** — Clarity and measurability of expected returns
  - **Autonomy Scope** — Level of control over decision execution
  - **Time Pressure** — Urgency and deadline constraints
  - **Social Complexity** — Number and alignment of stakeholders involved
  - **Psychological Safety** — Trust environment for expressing concerns
- **Visual Analytics** (4 chart views):
  - **Confidence** — Bar chart showing each type's decision confidence score
  - **Personality** — Radar chart comparing how types weigh each factor
  - **Landscape** — Scatter plot mapping decisiveness vs. confidence
  - **Flow** — Column-based diagram showing factor → type → decision pathways
- **Preset Scenario Library**: Pre-configured scenarios across categories:
  - Career Choices (job moves, professional development)
  - Financial Decisions (major purchases, investments)
  - Personal Growth (health, wellness, relationships)
- **Themed Personality Groupings**: View types through pop-culture lenses:
  - **Office** — Dunder Mifflin department groupings
  - **Houses** — Hogwarts house classifications
  - Character examples from The Office, Harry Potter, Marvel, and DC
- **Public Opinion Simulation**: Models how the general public would approach the same decision, shown alongside individual type results
- **Clean Design**: Indigo/white/gray design system, responsive across mobile and desktop

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

The app is organized into four tabs:

1. **Scenarios** — Pick a preset decision scenario (or go straight to Factors to build your own)
2. **Factors** — Adjust sliders describing the situation; a live prediction updates as you drag. Hit "See all 16 results" to run the simulation.
3. **Results** — View the decision summary and explore 4 chart views (Confidence, Personality, Landscape, Flow)
4. **Types** — Browse all 16 personality type cards, or switch to Office / Houses sub-views to see results grouped by themed categories

## Architecture Overview

### Technology Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 with Radix UI component library
- **Charts**: Recharts for data visualization
- **UI Components**: Radix UI primitives (Select, Tabs, Slider, Tooltip)
- **Icons**: Lucide React and React Icons
- **Testing**: Vitest with coverage reporting and Testing Library for React
- **Development**: ESLint, TypeScript strict mode, bundle analysis
- **Deployment**: Static export optimized for GitHub Pages with sitemap generation

### Architecture Patterns

- **Clean Layered Architecture**: Strict separation between presentation, business logic, and data layers
- **Factory Pattern**: MBTI personality types implemented via `MBTIFactory` with `BaseMBTIType` abstract class
- **Service Facade Pattern**: `decisionMatrixService.ts` provides clean API boundary between UI and core logic
- **Type-Safe Design**: Comprehensive TypeScript interfaces and strict typing throughout

### Core Components

- **Decision Engine**: Algorithms modeling MBTI cognitive functions and decision-making patterns
- **6-Factor Decision Matrix**: Framework including psychological safety based on Google's Project Aristotle
- **MBTI Implementation**: 16 personality types with individual classes containing specific decision weights, scientific descriptions, and research context
- **Visualization Engine**: 4 chart views — bar, radar, scatter, and flow diagrams

### Key Features

- **Type-Safe**: TypeScript 5 with strict configuration
- **Modular Design**: Clean separation between UI components, business logic, and data models
- **Responsive**: Indigo/white/gray design system, works across mobile and desktop
- **Performance Optimized**: Static export, bundle analysis, lazy-loaded MBTI types, virtualized card grid
- **Extensible**: Factory pattern allows easy addition of new personality types or decision factors

## Project Structure

```text
app/                                # Next.js 15 App Router
├── globals.css                     # Global styles and Tailwind imports
├── layout.tsx                      # Root layout with metadata
├── not-found.tsx                   # Custom 404 page
└── page.tsx                        # Main entry point

components/                         # React components
├── ui/                             # Radix UI primitives and wrappers
│   ├── button.tsx, card.tsx        # Core UI elements
│   ├── select.tsx, slider.tsx      # Form controls
│   ├── tabs.tsx, tooltip.tsx       # Navigation and overlays
│   └── popover.tsx, ...            # Additional UI primitives
├── UserDecisionDashboard.tsx       # Main container: tabs, state, layout
├── UserDecisionCharts.tsx          # Chart views (Confidence, Personality, Landscape, Flow)
├── OptimizedPersonalityCard.tsx    # Individual MBTI type card
├── PerformanceOptimizedTypesTab.tsx # Virtualized grid of type cards
├── EnhancedFactorTab.tsx           # Factor analysis visualization
└── EnhancedPerformanceMonitor.tsx  # Dev-only performance overlay

models/decision/                    # Business logic and data models
├── types.ts                        # TypeScript interfaces
├── constants.ts                    # Factor definitions, presets, scenario config
├── logic.ts                        # Core calculation algorithms
└── mbti/                           # MBTI personality type implementations
    ├── base.ts                     # Abstract BaseMBTIType class
    ├── index.ts                    # MBTIFactory and type registry
    ├── constants.ts                # Archetypes and famous people mappings
    ├── lazy-loader.ts              # Lazy loading for MBTI type classes
    └── [intj|entj|...].ts          # 16 individual type implementations

lib/                                # Service layer and utilities
├── decisionMatrixService.ts        # Facade re-exporting business logic to UI
├── mbtiData.ts                     # Character data, house/department mappings
├── utils.ts                        # Utility functions (cn, etc.)
└── hooks/                          # Custom React hooks
    ├── useDebounce.ts              # Debounced value hook
    └── usePerformance.ts           # Adaptive performance detection

tests/                              # Test suite (Vitest)
├── logic.test.ts                   # Core business logic
├── additional.test.ts              # Extended functionality
├── edge-cases.test.ts              # Edge cases and error handling
├── integration.test.ts             # Integration tests
└── ui-components.test.ts           # UI component tests

scripts/                            # Dev tools
├── dev.js                          # CLI task runner
└── modules/commands.js             # Task definitions
```

## Data Flow

1. **User Input** — Sliders adjust 6-factor parameters; a live preview updates in real-time
2. **Service Facade** — `decisionMatrixService.ts` provides the API boundary between UI and business logic
3. **MBTI Factory** — `MBTIFactory` creates personality type instances with specific decision weights
4. **Decision Engine** — Core algorithms calculate weighted scores for each of the 16 types
5. **Result Processing** — Decision categories assigned based on score thresholds (Proceed / Clarify / Disengage)
6. **Visualization** — Chart components render interactive results across 4 views

## Development Commands

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build            # Production build with static export
npm run start            # Start production server
npm run clean            # Clean build artifacts and cache

# Code Quality & Testing
npm run test             # Run Vitest unit tests
npm run lint             # ESLint code analysis
npm run typecheck        # TypeScript type checking

# Analysis & Optimization
npm run build:analyze    # Bundle analysis with @next/bundle-analyzer
npm run build:prod       # Production build with NODE_ENV=production
npm run postbuild        # Generate sitemap after build

# Development Tools
npm run list             # List available development tasks
npm run generate         # Generate code scaffolding
npm run parse-prd        # Parse product requirements documents
```

## Configuration & Deployment

### Static Export Configuration

- **GitHub Pages**: Optimized static export with proper `basePath` handling
- **Asset Optimization**: Unoptimized images for better static hosting compatibility
- **Bundle Analysis**: Built-in bundle size analysis and optimization recommendations
- **Sitemap Generation**: Automatic sitemap creation with `next-sitemap`

### Testing Setup

- **Vitest**: Modern testing framework with native TypeScript support
- **Coverage Reporting**: Comprehensive test coverage with v8 provider
- **Testing Library**: React component testing utilities
- **Multiple Test Types**: Unit, integration, edge case, and UI component tests

## Research Foundation

This application is built on extensive research in personality psychology and decision-making:

- **MBTI Framework**: Based on Carl Jung's psychological types and Myers-Briggs research
- **Cognitive Functions**: Incorporates latest neuroscience research by Dario Nardi (2024)
- **Decision Science**: Integrates behavioral economics and team dynamics research
- **Psychological Safety**: Based on Google's Project Aristotle findings
- **Self-Determination Theory**: Incorporates autonomy research for motivation and decision quality

### Learn More

- [Myers-Briggs Type Indicator](https://www.myersbriggs.org/)
- [Cognitive Functions in MBTI](https://www.16personalities.com/articles/our-theory)
- [Team Decision Making Research](https://www.psychologytoday.com/us/basics/decision-making)
- [Google's Project Aristotle](https://rework.withgoogle.com/blog/five-keys-to-a-successful-google-team/)
- [Dario Nardi's Neuroscience Research](https://www.radford.edu/~nardi/)

## Technical Specifications

- **Node.js**: 20+ required
- **Package Manager**: npm, yarn, or pnpm supported
- **Browser Support**: Modern browsers with ES2017+ support
- **Mobile**: Responsive design, tested on iOS Safari and Chrome Mobile
- **Accessibility**: WCAG 2.1 AA compliant components (Radix UI)

## Contributing

Contributions are welcome! Please ensure:

- TypeScript strict mode compliance
- Test coverage for new features
- Consistent code formatting (ESLint)
- Documentation updates for architectural changes

## License

This project is licensed under the MIT License - see the LICENSE file for details.
