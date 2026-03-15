# MBTI Brain

Ever wonder how different personality types would handle the same decision? MBTI Brain simulates the decision-making process of all 16 MBTI types so you can see where people agree, disagree, and why.

You describe a situation using 6 factors (data quality, ROI visibility, autonomy, time pressure, social complexity, psychological safety), and the app shows you how each personality type would respond — from cautious INFPs to decisive ENTJs.

**Try it live:** [https://burntfrost.github.io/team-decision-simulator](https://burntfrost.github.io/team-decision-simulator)

## Using the App

The interface has four tabs. You can work through them in order or jump to any tab.

### 1. Scenarios
Start here. Pick a preset scenario like "Job Offer from Competitor" or "Launch MVP Early" — each one pre-fills the factor sliders with realistic values for that situation. Categories include career choices, financial decisions, and personal growth.

### 2. Factors
This is where you describe the decision. Six sliders let you set conditions like how reliable the data is, how much time pressure exists, or how politically complex the situation is. Each slider shows a plain-English description of what the current value means (e.g. "Data is incomplete or unverified" at the low end vs. "Strong, validated data available" at the high end).

A live prediction at the bottom updates as you drag, showing the most likely outcome across all 16 types before you even run the full simulation.

Hit **"See all 16 results →"** when you're ready.

### 3. Results
The results page shows two things:

**Decision Summary** — A quick overview: what your type would do, what the majority would do, and what public opinion says. Below that, cards break down how many types chose each of the three outcomes (Proceed Strategically, Request Clarification, or Delay/Disengage).

**Charts** — Four interactive views you can switch between:
- **Confidence** — Bar chart of each type's confidence score, with threshold lines showing which decision each score maps to
- **Personality** — Radar chart showing how each type weighs the 6 factors differently. Filter by temperament group (NT Analysts, NF Diplomats, SJ Sentinels, SP Explorers)
- **Landscape** — Scatter plot placing each type on a decisiveness vs. confidence grid
- **Flow** — Three-column diagram showing how factors feed into personality types, which feed into final decisions. Hover to highlight individual paths.

### 4. Types
Browse all 16 personality type cards with descriptions, key traits, and character examples from The Office, Harry Potter, Marvel, and DC. Click a card to shuffle characters.

Two additional sub-views are available here:
- **Office** — Groups the 16 types by Dunder Mifflin department (Management, Sales, Accounting, etc.) and shows how each department would decide
- **Houses** — Groups the 16 types by Hogwarts house and compares house-level decision patterns

The Office and Houses views require simulation results — run a simulation first, then come back to explore these.

## How It Works

Each MBTI type has a unique set of weights for the 6 decision factors. An INTJ, for example, puts heavy positive weight on data quality and autonomy but negative weight on social complexity — they trust data over group consensus. An ESFJ is the opposite: they weight psychological safety and social dynamics highly.

When you run a simulation, the app multiplies your factor values by each type's weights to produce a confidence score. That score determines the decision:
- **Above 65%** → Proceed Strategically
- **35–65%** → Request Clarification
- **Below 35%** → Delay or Disengage

Public opinion uses a separate set of weights modeled on general population decision-making patterns (higher weight on visible ROI and time pressure, lower weight on data quality).

The factor weights are informed by MBTI cognitive function research, behavioral economics, and Google's Project Aristotle findings on psychological safety.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

Next.js 15, React 19, TypeScript 5, Tailwind CSS 4, Radix UI, Recharts. Static export deploys to GitHub Pages.

<details>
<summary><strong>Developer Details</strong></summary>

### Architecture

- **Factory Pattern** — Each MBTI type is a class extending `BaseMBTIType`, created by `MBTIFactory`
- **Service Facade** — `decisionMatrixService.ts` is the API boundary between UI and business logic
- **Lazy Loading** — MBTI type classes are loaded on demand via `lazy-loader.ts`
- **Virtualized Grid** — The Types tab uses intersection observer to lazy-render personality cards

### Project Structure

```text
app/                          # Next.js App Router (layout, page, 404)
components/                   # React components
├── UserDecisionDashboard.tsx # Main container: tabs, state, layout
├── UserDecisionCharts.tsx    # 4 chart views
├── OptimizedPersonalityCard  # Individual type card
└── ui/                       # Radix UI primitives
models/decision/              # Business logic
├── logic.ts                  # Core algorithms
├── constants.ts              # Factors, presets, scenarios
└── mbti/                     # 16 type implementations + factory
lib/                          # Service layer, hooks, utilities
tests/                        # Vitest test suite
```

### Commands

```bash
npm run dev            # Dev server (Turbopack)
npm run build          # Production build
npm run test           # Run tests
npm run lint           # ESLint
npm run typecheck      # TypeScript checking
npm run build:analyze  # Bundle analysis
```

### Requirements

- Node.js 20+
- Modern browser (ES2017+)

</details>

## License

MIT
