# MBTI Brain

A sophisticated decision-making simulation tool that helps teams understand how different personality types approach decisions. This application models the decision-making processes of all 16 MBTI personality types using a scientifically-informed 6-factor decision matrix and provides comprehensive insights into team dynamics and consensus building.

## Features

- **Personality-Based Decision Modeling**: Simulates how each of the 16 MBTI personality types would approach decisions based on their cognitive preferences and scientific research
- **6-Factor Decision Matrix**: Evaluates decisions across research-backed factors including:
  - **Data Quality**: Reliability and completeness of available information
  - **ROI Visibility**: Clarity and measurability of expected returns
  - **Autonomy Scope**: Level of control over decision execution
  - **Time Pressure**: Urgency and deadline constraints
  - **Social Complexity**: Number and alignment of stakeholders involved
  - **Psychological Safety**: Trust environment for expressing concerns and ideas
- **Advanced Visual Analytics**: Multiple sophisticated visualization tools:
  - **3D MBTI Visualization**: Interactive Three.js-powered 3D personality mapping
  - **Radar Charts**: Multi-dimensional factor comparison across personality types
  - **Scatter Plots**: Decisiveness vs confidence quadrant analysis
  - **Heat Maps**: Personality response patterns and correlations
  - **Bar Charts**: Decision distribution and majority analysis
  - **Sankey Diagrams**: Decision flow visualization
- **Preset Scenario Library**: Pre-configured decision scenarios across categories:
  - Career Choices (job moves, professional development)
  - Financial Decisions (major purchases, investments)
  - Personal Growth (health, wellness, relationships)
- **Character Mapping Examples**: Relatable personality examples including:
  - Famous historical and contemporary figures
  - Fictional characters from popular franchises (Harry Potter, The Office)
  - Hogwarts House classifications for MBTI types
- **Public Opinion Simulation**: Models how diverse groups reach consensus using behavioral economics research
- **Mobile-First Design**: iOS-style interface optimized for mobile and desktop experiences

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

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 with Radix UI component library
- **3D Graphics**: Three.js with React Three Fiber and Drei for interactive visualizations
- **Charts**: Recharts for comprehensive data visualization
- **UI Components**: Radix UI primitives (Select, Tabs, Tooltip, Popover, Slider)
- **Icons**: Lucide React and React Icons for comprehensive icon coverage
- **Testing**: Vitest with coverage reporting and Testing Library for React
- **Development**: ESLint, TypeScript strict mode, bundle analysis
- **Deployment**: Static export optimized for GitHub Pages with sitemap generation

### Architecture Patterns

- **Clean Layered Architecture**: Strict separation between presentation, business logic, and data layers
- **Factory Pattern**: MBTI personality types implemented via `MBTIFactory` with `BaseMBTIType` abstract class
- **Service Facade Pattern**: `decisionMatrixService.ts` provides clean API boundary between UI and core logic
- **Type-Safe Design**: Comprehensive TypeScript interfaces and strict typing throughout

### Core Components

- **Decision Engine**: Research-backed algorithms modeling MBTI cognitive functions and decision-making patterns
- **6-Factor Decision Matrix**: Enhanced framework including psychological safety based on Google's Project Aristotle
- **MBTI Implementation**: 16 personality types with individual classes containing:
  - Specific decision weights for each factor
  - Scientific descriptions and research insights
  - Historical context and real-world applications
- **Visualization Engine**: Multiple chart types with interactive features:
  - 3D personality space mapping
  - Multi-dimensional radar charts
  - Decision flow diagrams
  - Correlation heat maps
  - Quadrant analysis plots

### Key Features

- **Type-Safe**: Comprehensive TypeScript 5 implementation with strict configuration
- **Modular Design**: Clean separation between UI components, business logic, and data models
- **Mobile-First**: iOS-style responsive interface with touch-optimized interactions
- **Performance Optimized**: Static export, bundle analysis, code splitting, and optimized builds
- **Extensible**: Factory pattern allows easy addition of new personality types or decision factors
- **Research-Based**: Incorporates latest findings from behavioral psychology and team dynamics research

## Project Structure

```text
├── app/                           # Next.js 15 App Router
│   ├── globals.css               # Global styles and Tailwind imports
│   ├── layout.tsx                # Root layout with fonts, metadata, and viewport config
│   ├── not-found.tsx             # Custom 404 page
│   └── page.tsx                  # Main application entry point
├── components/                    # React components
│   ├── ui/                       # Radix UI primitives and custom components
│   │   ├── button.tsx            # Button component with variants
│   │   ├── card.tsx              # Card layout components
│   │   ├── popover.tsx           # Popover/dropdown components
│   │   ├── select.tsx            # Select input components
│   │   ├── slider.tsx            # Range slider components
│   │   ├── tabs.tsx              # Tab navigation components
│   │   └── tooltip.tsx           # Tooltip components
│   ├── IOSStatusBar.tsx          # iOS-style status bar component
│   ├── MBTI3DVisualization.tsx   # Three.js 3D personality visualization
│   ├── MBTI3DWrapper.tsx         # Wrapper for 3D component with dynamic loading
│   ├── SliderInput.tsx           # Custom slider input with labels
│   ├── Stepper.tsx               # Step-by-step progress component
│   ├── StyledTabs.tsx            # Custom styled tab components
│   ├── UserDecisionCharts.tsx    # Comprehensive visualization layer
│   └── UserDecisionDashboard.tsx # Main application container and state management
├── models/decision/               # Business logic and data models
│   ├── types.ts                  # TypeScript type definitions and interfaces
│   ├── constants.ts              # Factor definitions, presets, and configuration
│   ├── logic.ts                  # Core calculation algorithms and decision logic
│   └── mbti/                     # MBTI personality type implementations
│       ├── base.ts               # Abstract BaseMBTIType class
│       ├── index.ts              # MBTIFactory and type management
│       ├── constants.ts          # MBTI archetypes and famous people mappings
│       ├── intj.ts               # INTJ personality implementation
│       ├── entj.ts               # ENTJ personality implementation
│       ├── intp.ts               # INTP personality implementation
│       ├── entp.ts               # ENTP personality implementation
│       ├── infj.ts               # INFJ personality implementation
│       ├── enfj.ts               # ENFJ personality implementation
│       ├── infp.ts               # INFP personality implementation
│       ├── enfp.ts               # ENFP personality implementation
│       ├── istj.ts               # ISTJ personality implementation
│       ├── estj.ts               # ESTJ personality implementation
│       ├── isfj.ts               # ISFJ personality implementation
│       ├── esfj.ts               # ESFJ personality implementation
│       ├── istp.ts               # ISTP personality implementation
│       ├── estp.ts               # ESTP personality implementation
│       ├── isfp.ts               # ISFP personality implementation
│       └── esfp.ts               # ESFP personality implementation
├── lib/                          # Service layer and utilities
│   ├── decisionMatrixService.ts  # Service facade re-exporting business logic
│   └── utils.ts                  # Utility functions and helpers
├── tests/                        # Comprehensive test suite
│   ├── logic.test.ts             # Core business logic tests
│   ├── additional.test.ts        # Extended functionality tests
│   ├── edge-cases.test.ts        # Edge case and error handling tests
│   ├── integration.test.ts       # Integration tests
│   └── ui-components.test.ts     # UI component tests
├── scripts/                      # Development and build scripts
│   ├── dev.js                    # CLI task management tool
│   ├── modules/                  # Modular script architecture
│   └── README.md                 # Script documentation
├── public/                       # Static assets
│   ├── favicon.ico               # Application favicon
│   ├── robots.txt                # SEO robots configuration
│   └── sitemap.xml               # Generated sitemap
└── coverage/                     # Test coverage reports
    └── [generated files]         # Vitest coverage output
```

## Data Flow

1. **User Input**: Interactive sliders adjust 6-factor decision parameters in real-time
2. **State Management**: React hooks manage application state with TypeScript interfaces
3. **Service Facade**: `decisionMatrixService.ts` provides clean API to business logic modules
4. **MBTI Factory**: `MBTIFactory` creates personality type instances with specific decision weights
5. **Decision Engine**: Core algorithms calculate weighted scores for each personality type
6. **Result Processing**: Decision categories assigned based on score thresholds
7. **Visualization Pipeline**: Multiple chart components render interactive simulation results
8. **3D Rendering**: Three.js engine creates immersive personality space visualizations

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
- **Mobile**: iOS Safari, Chrome Mobile optimized
- **Accessibility**: WCAG 2.1 AA compliant components

## Contributing

Contributions are welcome! Please ensure:

- TypeScript strict mode compliance
- Test coverage for new features
- Consistent code formatting (ESLint)
- Documentation updates for architectural changes

## License

This project is licensed under the MIT License - see the LICENSE file for details.
