# Plan: Notification Features & Restoration

## Overview
This plan outlines the implementation of a first-time user popup requesting permission to send notification alerts about incoming matches and results using the Zalo Mini App API. It also addresses the restoration and integration of missing features that were accidentally omitted during the migration: trivia, prediction and points, top leaderboard, and dynamic data loading from the API.

## Project Type
**WEB** (Zalo Mini App) -> Primary Agent: `frontend-specialist`

## Success Criteria
1. First-time users see a popup requesting notification permissions for matches.
2. Zalo Mini App Notification API is successfully integrated.
3. Trivia feature is fully accessible from the main flow.
4. Prediction and points system is functioning and visible.
5. Top leaderboard is implemented and displays user rankings.
6. Match data and results are dynamically loaded from the API rather than hardcoded.

## Tech Stack
- **Framework**: React 18 + Vite (Zalo Mini App)
- **UI/Components**: `zmp-ui`, Tailwind CSS
- **APIs**: Zalo Mini App API (for Notifications and User info)
- **State**: Recoil

## File Structure Additions/Modifications
```
src/
├── api/
│   ├── zaloApi.ts         # Zalo API wrappers (notifications, permissions)
│   └── matchApi.ts        # API integration for match data
├── components/
│   ├── NotificationPopup.tsx  # First-time popup component
│   └── Leaderboard.tsx    # Leaderboard component
├── pages/
│   ├── index.tsx          # Integration of popup and restored features
│   └── LeaderboardPage.tsx # Dedicated leaderboard page (if needed)
└── state.ts               # State for permissions, predictions, points
```

## Task Breakdown

### Task 1: Integrate Notification Permission Popup
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `api-patterns`
- **Priority**: P0
- **Dependencies**: None
- **INPUT**: Zalo Mini App API documentation for permissions.
- **OUTPUT**: `NotificationPopup.tsx` and state logic to check if it's the user's first time.
- **VERIFY**: Popup renders only once for new users. Clicking "Allow" successfully triggers the Zalo permission request API.

### Task 2: Implement Match/Result Notification Logic
- **Agent**: `frontend-specialist`
- **Skills**: `api-patterns`
- **Priority**: P1
- **Dependencies**: Task 1
- **INPUT**: Zalo Open API docs for sending notifications.
- **OUTPUT**: Utility functions in `api/zaloApi.ts` to subscribe users to match notifications.
- **VERIFY**: Successful subscription flow logs without errors.

### Task 3: Restore Data Loading from API
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`
- **Priority**: P1
- **Dependencies**: None
- **INPUT**: Existing hardcoded match data.
- **OUTPUT**: `matchApi.ts` integration to fetch live matches, results, and trivia.
- **VERIFY**: `pages/index.tsx` displays match data fetched from an external API endpoint instead of local constants.

### Task 4: Restore Prediction, Points, and Trivia Integration
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P2
- **Dependencies**: Task 3
- **INPUT**: Existing `PredictModal.tsx` and `TriviaCard.tsx`.
- **OUTPUT**: Properly integrated prediction flow saving points to user state (or API) and active trivia module on the home screen.
- **VERIFY**: Users can submit predictions, earn points, and view trivia without UI breaks.

### Task 5: Implement Leaderboard Feature
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P2
- **Dependencies**: Task 4
- **INPUT**: User points state/API.
- **OUTPUT**: `Leaderboard.tsx` component and potentially a routing link to view top users.
- **VERIFY**: Leaderboard correctly sorts and displays mock or real API data for top scores.

## Phase X: Verification
- [ ] Zalo notification API calls are valid and non-blocking.
- [ ] No purple/violet hex codes used.
- [ ] Socratic Gate was respected before coding.
- [ ] `npm run lint` and `npx tsc --noEmit` pass.
- [ ] Application builds successfully via Vite.
