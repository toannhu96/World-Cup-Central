# Zalo Mini App Conversion Plan

## Overview
Converting the existing `artifacts/worldcup2026` Expo (React Native) application into a Zalo Mini App (React Web). We will overwrite the existing Expo implementation, adopting `zmp-ui`, `zmp-sdk`, `react-router-dom`, and `recoil` to match the exact architecture of the `zaui-coffee` template.

## Project Type
**WEB** (Zalo Mini App uses React Web technology, so we will assign the `frontend-specialist`)

## Success Criteria
1. The `artifacts/worldcup2026` directory contains no Expo/React Native code or configuration.
2. The project successfully builds using Vite (`npm run build:css` and Vite build).
3. The UI strictly uses `zmp-ui` components and Tailwind CSS for styling.
4. Routing and state are managed by `react-router-dom` and `recoil`.
5. Feature parity with the previous Expo application is achieved within the Zalo Mini App framework.

## Tech Stack
- **Framework**: React 18 + Vite
- **Zalo Integration**: `zmp-sdk`, `zmp-ui`, `zmp-cli`
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: Recoil
- **Routing**: React Router DOM v6
- **Language**: TypeScript

## File Structure
```
artifacts/worldcup2026/
├── src/
│   ├── components/      # ZMP-UI based React components
│   ├── pages/           # Screen components (Home, Standings, etc.)
│   ├── css/             # Tailwind CSS entry (tailwind.css, styles.css)
│   ├── state.ts         # Recoil atoms
│   └── app.tsx          # Main App entry (react-router, zmp-ui App)
├── index.html           # Vite HTML entry
├── app-config.json      # Zalo App config
├── zmp-cli.json         # Zalo CLI config
├── tailwind.config.js
├── postcss.config.js
├── vite.config.mts
└── package.json         # Updated dependencies
```

## Task Breakdown

### Task 1: Purge Expo & Initialize Vite/ZMP Configs
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`, `bash-linux`
- **Priority**: P0
- **Dependencies**: None
- **INPUT**: Current `artifacts/worldcup2026` directory and `zaui-coffee` configs.
- **OUTPUT**: Cleaned directory, new `package.json`, Vite, Tailwind, and Zalo config files (`app-config.json`, `zmp-cli.json`, `vite.config.mts`, `tailwind.config.js`).
- **VERIFY**: No `app.json`, `metro.config.js`, or Expo packages remain. `npm install` runs successfully.

### Task 2: Scaffold App Entry & Routing
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `clean-code`
- **Priority**: P0
- **Dependencies**: Task 1
- **INPUT**: `zaui-coffee/src/app.tsx`, `index.html`.
- **OUTPUT**: `src/app.tsx`, `index.html`, and `src/css/tailwind.css` created.
- **VERIFY**: The app skeleton mounts a basic ZMP-UI `<App>` with `<SnackbarProvider>` and a placeholder routing structure.

### Task 3: Migrate State Management
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P1
- **Dependencies**: Task 2
- **INPUT**: Existing state logic in Expo app.
- **OUTPUT**: `src/state.ts` (or similar) containing Recoil atoms and selectors.
- **VERIFY**: State can be imported and consumed via `useRecoilState` without TypeScript errors.

### Task 4: Convert UI Components to ZMP-UI
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `tailwind-patterns`
- **Priority**: P1
- **Dependencies**: Task 2
- **INPUT**: Existing Expo components (`View`, `Text`, custom styling).
- **OUTPUT**: Converted React Web components in `src/components/` using `zmp-ui` (`Box`, `Text`, `Header`, etc.) and Tailwind CSS.
- **VERIFY**: Components compile with Vite and accurately reflect the `zaui-coffee` template's native aesthetic.

### Task 5: Migrate Pages & Navigation
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P1
- **Dependencies**: Task 3, Task 4
- **INPUT**: Existing Expo Router files (`app/(tabs)/index.tsx`, etc.).
- **OUTPUT**: Page components in `src/pages/` mapped to `react-router-dom` `<Route>` definitions in `src/app.tsx`.
- **VERIFY**: All pages render correctly and navigation flows seamlessly via `useNavigate()`.

### Task 6: Final Cleanup & Typecheck
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`
- **Priority**: P2
- **Dependencies**: Task 5
- **INPUT**: All newly created files.
- **OUTPUT**: Resolved TS errors, removed unused files/assets.
- **VERIFY**: `npm run build` succeeds with zero errors.

## Phase X: Verification
- [ ] No `View` or `Text` from `react-native` left in the codebase.
- [ ] No purple/violet hex codes (`frontend-specialist` purple ban check).
- [ ] Socratic Gate was respected.
- [ ] Typescript check (`npx tsc --noEmit`) passes.
- [ ] Vite build runs successfully.
