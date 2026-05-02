import { Router } from "express";
import { cache } from "../lib/cache";

const router = Router();

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";
const ESPN_CORE = "https://sports.core.api.espn.com/v2/sports/soccer/leagues/fifa.world";

const TTL_LIVE = 30_000;        // 30 seconds — live match
const TTL_SCOREBOARD = 120_000; // 2 minutes — no live match
const TTL_SCHEDULE = 600_000;   // 10 minutes — full schedule

interface EspnCompetitor {
  homeAway: "home" | "away";
  score?: string;
  team: {
    displayName: string;
    abbreviation: string;
    logo?: string;
  };
}

interface EspnStatusType {
  state: "pre" | "in" | "post";
  completed: boolean;
  description?: string;
  detail?: string;
}

interface EspnEvent {
  id: string;
  date: string;
  name: string;
  shortName: string;
  competitions: Array<{
    status: {
      clock?: number;
      displayClock?: string;
      period?: number;
      type: EspnStatusType;
    };
    competitors: EspnCompetitor[];
    venue?: {
      fullName?: string;
      address?: { city?: string; country?: string };
    };
    notes?: Array<{ type: string; headline?: string }>;
  }>;
}

function normalizeEvent(event: EspnEvent) {
  const comp = event.competitions[0];
  if (!comp) return null;

  const home = comp.competitors.find((c) => c.homeAway === "home");
  const away = comp.competitors.find((c) => c.homeAway === "away");
  const status = comp.status.type;

  const matchStatus: "upcoming" | "live" | "finished" =
    status.state === "in" ? "live" : status.state === "post" ? "finished" : "upcoming";

  const note = comp.notes?.find((n) => n.type === "event");

  return {
    espnId: event.id,
    date: event.date,
    name: event.name,
    shortName: event.shortName,
    status: matchStatus,
    clock: comp.status.displayClock,
    period: comp.status.period,
    statusDetail: status.detail ?? status.description,
    homeTeam: {
      name: home?.team.displayName ?? "",
      shortName: home?.team.abbreviation ?? "",
      logo: home?.team.logo ?? null,
    },
    awayTeam: {
      name: away?.team.displayName ?? "",
      shortName: away?.team.abbreviation ?? "",
      logo: away?.team.logo ?? null,
    },
    homeScore: home?.score != null ? parseInt(home.score, 10) : null,
    awayScore: away?.score != null ? parseInt(away.score, 10) : null,
    venue: comp.venue?.fullName ?? null,
    city: comp.venue?.address?.city ?? null,
    country: comp.venue?.address?.country ?? null,
    round: note?.headline ?? null,
  };
}

async function fetchEspn<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`ESPN API error: ${res.status}`);
  return res.json() as Promise<T>;
}

// GET /api/football/scoreboard
// Returns today's live/recent matches — cached 30s if live, 2min otherwise
router.get("/scoreboard", async (req, res) => {
  const CACHE_KEY = "scoreboard";
  const cached = cache.get<object>(CACHE_KEY);
  if (cached) {
    res.json({ source: "cache", ...cached });
    return;
  }

  try {
    const data = await fetchEspn<{ events?: EspnEvent[] }>(`${ESPN_BASE}/scoreboard`);
    const events = (data.events ?? []).map(normalizeEvent).filter(Boolean);
    const hasLive = events.some((e) => e!.status === "live");

    const payload = { events, hasLive, fetchedAt: new Date().toISOString() };
    cache.set(CACHE_KEY, payload, hasLive ? TTL_LIVE : TTL_SCOREBOARD);
    res.json({ source: "live", ...payload });
  } catch (err) {
    req.log.error({ err }, "ESPN scoreboard fetch failed");
    res.status(502).json({ error: "Failed to fetch scoreboard", events: [], hasLive: false });
  }
});

// GET /api/football/schedule?startDate=20260611&endDate=20260719
// Returns matches for a date range — cached 10 min
router.get("/schedule", async (req, res) => {
  const { startDate = "20260611", endDate = "20260719" } = req.query as {
    startDate?: string;
    endDate?: string;
  };

  const CACHE_KEY = `schedule:${startDate}:${endDate}`;
  const cached = cache.get<object>(CACHE_KEY);
  if (cached) {
    res.json({ source: "cache", ...cached });
    return;
  }

  try {
    const url = `${ESPN_BASE}/scoreboard?dates=${startDate}-${endDate}&limit=200`;
    const data = await fetchEspn<{ events?: EspnEvent[] }>(url);
    const events = (data.events ?? []).map(normalizeEvent).filter(Boolean);

    const payload = { events, total: events.length, fetchedAt: new Date().toISOString() };
    cache.set(CACHE_KEY, payload, TTL_SCHEDULE);
    res.json({ source: "live", ...payload });
  } catch (err) {
    req.log.error({ err }, "ESPN schedule fetch failed");
    res.status(502).json({ error: "Failed to fetch schedule", events: [], total: 0 });
  }
});

// GET /api/football/match/:espnId
// Returns details for a single match — cached 30s
router.get("/match/:espnId", async (req, res) => {
  const { espnId } = req.params;
  const CACHE_KEY = `match:${espnId}`;
  const cached = cache.get<object>(CACHE_KEY);
  if (cached) {
    res.json({ source: "cache", ...cached });
    return;
  }

  try {
    const url = `${ESPN_BASE}/summary?event=${espnId}`;
    const data = await fetchEspn<object>(url);
    cache.set(CACHE_KEY, data, TTL_LIVE);
    res.json({ source: "live", ...data as object });
  } catch (err) {
    req.log.error({ err }, "ESPN match fetch failed");
    res.status(502).json({ error: "Failed to fetch match" });
  }
});

export default router;
