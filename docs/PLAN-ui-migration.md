# UI Migration Plan: World Cup Central

## Overview
The Zalo Mini App is currently displaying the default "Hello world!" UI boilerplate provided by ZaUI. The actual World Cup Central UI components and pages have been created and are located in the `artifacts/worldcup2026/` directory. This plan outlines the tasks to migrate the World Cup Central UI into the active `src/` directory so the app correctly displays the intended interface.

## Project Type
**WEB** (Zalo Mini App using React, Vite, and ZMP-UI)

## Success Criteria
1. The app displays the World Cup Central home page when loaded.
2. The Hello World boilerplate is completely removed.
3. All required components, hooks, state, and data files from `artifacts/worldcup2026/` are properly integrated into the `src/` folder.
4. The app successfully compiles and runs without missing import errors.

## Tech Stack
- **Framework:** React + ZMP-UI (Zalo Mini App)
- **State Management:** Recoil
- **Data Fetching:** React Query
- **Styling:** Tailwind CSS + ZMP-UI

## File Structure
We will copy and integrate files from `artifacts/worldcup2026/` into `src/`:
```text
src/
├── app.ts / app.tsx       # Main entry point and layout
├── components/            # Reusable React components
│   ├── MatchCard.tsx
│   ├── SectionHeader.tsx
│   └── TeamFlag.tsx
├── constants/             # Constants and static data (formerly data/)
│   └── worldcup2026.ts
├── context/               # Global contexts
├── hooks/                 # Custom React hooks
├── pages/                 # Page components corresponding to routes
│   └── index.tsx
├── state/                 # State management (Recoil atoms/selectors)
└── types/                 # TypeScript interfaces and types
```

## Task Breakdown

### Task 1: Migrate State and Data Files
- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`
- **Priority:** P1
- **Dependencies:** None
- **INPUT:** `artifacts/worldcup2026/data/`, `artifacts/worldcup2026/state/`, `artifacts/worldcup2026/hooks/`
- **OUTPUT:**
  - `src/constants/` (populated with data from `data/`)
  - `src/state/`
  - `src/hooks/`
  - `src/types/` (extract types if necessary from data files)
- **VERIFY:** Check that the files exist in their new directories in `src/` and update any internal import paths to reflect `constants/` instead of `data/`.

### Task 2: Migrate Components
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P1
- **Dependencies:** Task 1
- **INPUT:** `artifacts/worldcup2026/src/components/` and `artifacts/worldcup2026/components/`
- **OUTPUT:** `src/components/` updated with `MatchCard`, `SectionHeader`, `TeamFlag`, `PredictModal`, `ErrorFallback`, etc.
- **VERIFY:** Ensure all component files are properly placed in `src/components/` and imports (like `../data/worldcup2026`) are resolving correctly.

### Task 3: Replace Home Page
- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`
- **Priority:** P1
- **Dependencies:** Task 1, Task 2
- **INPUT:** `artifacts/worldcup2026/src/pages/index.tsx`
- **OUTPUT:** Replace `src/pages/index.tsx` with the World Cup version.
- **VERIFY:** The `HomePage` component should now render the World Cup Hero Section and Filter Tabs.

### Task 4: Setup Providers in App/Layout
- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`
- **Priority:** P1
- **Dependencies:** Task 3
- **INPUT:** `src/app.ts` and `src/components/layout.tsx`
- **OUTPUT:** Wrap the application in `RecoilRoot` and `QueryClientProvider` to support the new hooks and state.
- **VERIFY:** The app compiles successfully, and React Query/Recoil don't throw context missing errors.

## ✅ PHASE X COMPLETE
- [ ] Lint: Pass
- [ ] Security: No critical issues
- [ ] Build: Success
- [ ] Date: Pending
