# PLAN: World Cup Match Experience Enhancements

## Goal
Upgrade the World Cup Central app with rich match details, team-based favourites, contextual group filtering, a hybrid calendar view, and time-based filtering.

## Tech Stack
- **Framework**: Zalo Mini App (React + Vite)
- **UI**: ZMP-UI + Tailwind CSS
- **State**: Recoil + Context API
- **Data**: React Query + ESPN Football API (Proxy)

---

## Tasks Status

### Task 1: ESPN Match Summary API Layer ✅
- [x] Add `fetchMatchSummary(espnId: string)` to `footballApi.ts`
- [x] Add `MatchSummary` TypeScript interface to `types/index.ts`
- [x] Add `useMatchDetail(matchId: string)` hook using React Query

### Task 2: Match Detail Page ✅
- [x] Create `pages/match-detail.tsx`
- [x] Create `match-detail/MatchHeader.tsx` (Hero gradient)
- [x] Create `match-detail/MatchTabs.tsx` (Events/Stats/Lineups)
- [x] Create `match-detail/KeyEvents.tsx` (Timeline)
- [x] Create `match-detail/MatchStats.tsx` (Comparison bars)
- [x] Create `match-detail/Lineups.tsx` (Rosters)
- [x] Add route `/match/:id` to `layout.tsx`

### Task 3: Team-Based Favourites ✅
- [x] Create `TeamPicker.tsx` (48-team selection grid)
- [x] Modify `AppContext.tsx` (team-based logic)
- [x] Modify `pages/index.tsx` (favourites filtering)
- [x] Remove per-match favourites from `MatchCard.tsx`

### Task 4: Group Filter (Contextual) ✅
- [x] Create `GroupFilterBar.tsx` (A–L chips)
- [x] Integrate chips into "Group Stage" tab in `pages/index.tsx`

### Task 5: Calendar View ✅
- [x] Create `CalendarView.tsx` (Week strip + Month grid)
- [x] Add "Calendar" tab to `pages/index.tsx`
- [x] Support date-based filtering

### Task 6: Time Filter Toggle ✅
- [x] Create `TimeFilter.tsx` (All | Upcoming | Past)
- [x] Implement 3-segment segment control in `pages/index.tsx`

---

## ✅ PHASE X COMPLETE
- **All 6 features implemented**
- **Mobile-optimized UI/UX**
- **Premium design language applied**
- **Type safety verified**
- **Completion Date**: 2026-05-07

---
