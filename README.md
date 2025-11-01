# TalentFlow
TalentFlow is a modern, feature-rich hiring platform designed for streamlined recruitment management. Built with React.js, Vite, and Tailwind CSS, it offers a responsive UI, light/dark mode, and robust analytics—all powered by mock APIs for rapid prototyping and testing.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [Technical Decisions](#technical-decisions)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Dashboard**: Overview of jobs and key hiring metrics.
- **Job Management**: Create, view, and manage job listings.
- **Candidate Tracking**: Visualize candidate progress through all hiring stages.
- **Assessments**: Build and take assessments for job applicants.
- **Analytics**: Interactive charts (pipeline, velocity, scores, top jobs) with CSV export.
- **Theme Toggle**: Seamless light/dark mode, persisted in `localStorage`.
- **Global Search**: Search jobs, candidates, and assessments.
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS.
- **Mocked API**: MSW simulates backend endpoints for development.

## Tech Stack

- **Frontend**: React.js (18+), TypeScript
- **Build Tool**: Vite
- **Routing**: React Router (6+)
- **Styling**: Tailwind CSS (OKLCH colors, dark mode)
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **API Mocking**: MSW (Mock Service Worker)
- **Theme Management**: Custom React Context
- **Utilities**: `clsx`, `tailwind-merge`
- **Linting/Formatting**: ESLint, Prettier

## Project Structure

```
/ENTNT/
├── public/
│   ├── index.html
│   └── mockServiceWorker.js
├── src/
│   ├── components/
│   │   ├── assessments/
│   │   ├── candidates/
│   │   ├── jobs/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── ThemeProvider.tsx
│   ├── hooks/
│   ├── lib/
│   ├── mocks/
│   ├── styles/
│   ├── App.tsx
│   ├── main.tsx
│   ├── AnalyticsPage.tsx
│   ├── AssessmentsPage.tsx
│   ├── TakeAssessmentPage.tsx
│   ├── AssessmentBuilder.tsx
│   ├── NotFoundPage.tsx
│   ├── HomePage.tsx
│   └── index.tsx
├── tailwind.config.js
├── vite.config.ts
├── package.json
├── .env
└── README.md
```

## Setup Instructions

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Installation

1. **Clone the Repository**
  ```bash
  git clone <repository-url>
  cd ENTNT
  ```

2. **Install Dependencies**
  ```bash
  npm install
  ```

3. **Set Up Environment**
  - Create a `.env` file in the root:
    ```
    VITE_API_URL=http://localhost:5173
    ```

4. **Initialize MSW**
  ```bash
  npx msw init public/ --save
  ```

5. **Run the Development Server**
  ```bash
  npm run dev
  ```
  Open [http://localhost:5173](http://localhost:5173) in your browser.

6. **Build for Production**
  ```bash
  npm run build
  npm run preview
  ```

### Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint
- `npm run format`: Run Prettier

## Architecture

### Frontend

- **React.js**: Component-based architecture with TypeScript.
- **React Router**: Client-side routing (`/`, `/jobs`, `/candidates`, `/assessments`, `/analytics`).
- **ThemeProvider**: Custom React Context for theme, toggling Tailwind’s `dark` class and persisting in `localStorage`.
- **Shadcn/UI**: Reusable, accessible UI components.
- **Tailwind CSS**: Utility-first styling with OKLCH color support and dark mode.
- **Recharts**: Analytics charts (Bar, Pie, Line).

### Data Layer

- **DatabaseService**: Mock data layer (`src/lib/db.ts`) for jobs, candidates, assessments.
- **MSW**: Simulates API endpoints with realistic delays and error rates.
- **Analytics**: Local processing for pipeline, velocity, scores, and top jobs.

### Key Components

- **Navigation**: Responsive navbar with routing and theme toggle.
- **AnalyticsPage**: Visualizes metrics and exports CSV.
- **ThemeProvider**: Manages and persists theme state.

## Technical Decisions

- **Vite**: Chosen over CRA for faster builds and simpler config.
- **Tailwind CSS (OKLCH)**: Utility-first, accessible, and consistent styling.
- **Custom ThemeProvider**: React Context for theme, no Next.js dependency.
- **MSW**: Mock APIs for rapid frontend development.
- **Recharts**: Lightweight, theme-aware analytics.
- **Client-Side CSV Export**: Uses Blob API for analytics data export.
- **Shadcn/UI**: Accessible, customizable UI components.

## Known Issues

- **Tailwind CSS Resolution**:  
  If you see `Can't resolve 'tailwindcss'`, clear cache:
  ```bash
  - **Kanban Board Drag-and-Drop Integration**:  
    Integrating drag-and-drop functionality for the Kanban board is in progress. While the UI supports moving cards between columns, updating the underlying data state is not yet fully implemented. Ensure that state changes are properly handled and persisted when cards are moved. Further enhancements are planned to synchronize UI interactions with the mock data layer.
  npm install
  ```
  Ensure `vite.config.ts` includes `@tailwindcss/vite`.

- **Mock Data Limitations**:  
  Analytics use static mock data. For dynamic metrics, extend `DatabaseService`.

## Future Improvements

- Integrate with a real backend (e.g., Node.js/Express).
- Link candidates to jobs/assessments for dynamic analytics.
- Add toast notifications (e.g., `react-toastify`) for user feedback.
- Improve accessibility (ARIA, Lighthouse audits).
- Implement server-side pagination for large datasets.

## Contributing

1. Fork the repository.
2. Create a feature branch:
  ```bash
  git checkout -b feature/xyz
  ```
3. Commit your changes:
  ```bash
  git commit -m "Add feature xyz"
  ```
4. Push to your branch:
  ```bash
  git push origin feature/xyz
  ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.# ENTNT
