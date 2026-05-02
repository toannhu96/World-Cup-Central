import { MATCHES, TEAMS, type Match } from "@/data/worldcup2026";

const BASE_URL =
  typeof process !== "undefined" && process.env.EXPO_PUBLIC_DOMAIN
    ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
    : "";

export interface LiveMatch {
  espnId: string;
  date: string;
  name: string;
  shortName: string;
  status: "upcoming" | "live" | "finished";
  clock: string | null;
  period: number | null;
  statusDetail: string | null;
  homeTeam: { name: string; shortName: string; logo: string | null };
  awayTeam: { name: string; shortName: string; logo: string | null };
  homeScore: number | null;
  awayScore: number | null;
  venue: string | null;
  city: string | null;
  country: string | null;
  round: string | null;
}

export interface ScoreboardResponse {
  source: string;
  events: LiveMatch[];
  hasLive: boolean;
  fetchedAt: string;
}

export interface ScheduleResponse {
  source: string;
  events: LiveMatch[];
  total: number;
  fetchedAt: string;
}

export async function fetchScoreboard(): Promise<ScoreboardResponse> {
  const res = await fetch(`${BASE_URL}/api/football/scoreboard`);
  if (!res.ok) throw new Error(`Scoreboard fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchSchedule(
  startDate = "20260611",
  endDate = "20260719"
): Promise<ScheduleResponse> {
  const res = await fetch(
    `${BASE_URL}/api/football/schedule?startDate=${startDate}&endDate=${endDate}`
  );
  if (!res.ok) throw new Error(`Schedule fetch failed: ${res.status}`);
  return res.json();
}

// Normalize ESPN abbreviation → our team ID
function findTeamId(abbreviation: string): string | null {
  const abbr = abbreviation.toUpperCase();
  const found = Object.values(TEAMS).find(
    (t) => t.shortName.toUpperCase() === abbr || t.id === abbr
  );
  return found?.id ?? null;
}

// Merge ESPN live data onto our static match list
export function mergeWithLive(liveEvents: LiveMatch[]): Match[] {
  if (!liveEvents.length) return MATCHES;

  const liveMap = new Map<string, LiveMatch>();
  for (const ev of liveEvents) {
    // Index by homeShortName+awayShortName for fast lookup
    const key = `${ev.homeTeam.shortName.toUpperCase()}-${ev.awayTeam.shortName.toUpperCase()}`;
    liveMap.set(key, ev);
  }

  return MATCHES.map((m) => {
    const home = TEAMS[m.homeTeam];
    const away = TEAMS[m.awayTeam];
    if (!home || !away) return m;

    const key = `${home.shortName.toUpperCase()}-${away.shortName.toUpperCase()}`;
    const live = liveMap.get(key);
    if (!live) return m;

    return {
      ...m,
      status: live.status,
      homeScore: live.homeScore ?? undefined,
      awayScore: live.awayScore ?? undefined,
    };
  });
}

// Build merged match list from full ESPN schedule
export function mergeSchedule(espnEvents: LiveMatch[]): Match[] {
  return mergeWithLive(espnEvents);
}
