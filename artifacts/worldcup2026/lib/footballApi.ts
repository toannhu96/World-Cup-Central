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

export interface EspnGroup {
  id: string;
  name: string;
  teams: string[]; // ESPN abbreviations
}

export interface GroupsResponse {
  source: string;
  groups: EspnGroup[];
  teamGroup: Record<string, string>; // abbr → group letter
  total: number;
  fetchedAt: string;
}

export async function fetchGroups(): Promise<GroupsResponse> {
  const res = await fetch(`${BASE_URL}/api/football/groups`);
  if (!res.ok) throw new Error(`Groups fetch failed: ${res.status}`);
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

// Country/team flag lookup by ESPN shortName abbreviation
const FLAG_MAP: Record<string, string> = {
  MEX: "🇲🇽", RSA: "🇿🇦", KOR: "🇰🇷", CZE: "🇨🇿", BRA: "🇧🇷", GER: "🇩🇪",
  FRA: "🇫🇷", ARG: "🇦🇷", ESP: "🇪🇸", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", USA: "🇺🇸", POR: "🇵🇹",
  NED: "🇳🇱", BEL: "🇧🇪", CRO: "🇭🇷", URU: "🇺🇾", DEN: "🇩🇰", SUI: "🇨🇭",
  ITA: "🇮🇹", POL: "🇵🇱", TUR: "🇹🇷", UKR: "🇺🇦", HUN: "🇭🇺", ROM: "🇷🇴",
  MAR: "🇲🇦", SEN: "🇸🇳", EGY: "🇪🇬", NGR: "🇳🇬", CMR: "🇨🇲", GHA: "🇬🇭",
  MLI: "🇲🇱", ALG: "🇩🇿", JPN: "🇯🇵", AUS: "🇦🇺", IRN: "🇮🇷", KSA: "🇸🇦",
  QAT: "🇶🇦", CAN: "🇨🇦", PAN: "🇵🇦", CRC: "🇨🇷", HON: "🇭🇳", COL: "🇨🇴",
  ECU: "🇪🇨", CHI: "🇨🇱", PRY: "🇵🇾", PER: "🇵🇪", VEN: "🇻🇪", BOL: "🇧🇴",
  NZL: "🇳🇿", PHI: "🇵🇭", THA: "🇹🇭", VIE: "🇻🇳", IND: "🇮🇳", SRB: "🇷🇸",
  AUT: "🇦🇹", WAL: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", SWE: "🇸🇪", NOR: "🇳🇴",
  CIV: "🇨🇮", TUN: "🇹🇳", ANG: "🇦🇴", EQG: "🇬🇶", MOZ: "🇲🇿", ZIM: "🇿🇼",
  GRE: "🇬🇷", CYP: "🇨🇾", MKD: "🇲🇰", ALB: "🇦🇱", KAZ: "🇰🇿", AZE: "🇦🇿",
  GEO: "🇬🇪", ARM: "🇦🇲", ISR: "🇮🇱", UZB: "🇺🇿", IDN: "🇮🇩", OMN: "🇴🇲",
  BHR: "🇧🇭", IRQ: "🇮🇶", JOR: "🇯🇴", SYR: "🇸🇾", TJK: "🇹🇯", KGZ: "🇰🇬",
  MLT: "🇲🇹", AND: "🇦🇩", SMR: "🇸🇲", LIE: "🇱🇮", MON: "🇲🇨",
};

// Detect round name by index position in the ESPN event list.
// ESPN's `round` field is always null; event `name` is unreliable for 3RD-place team R32 matches
// (e.g. "Third Place Group A/B/C/D/F at Group E Winner" is an R32 match, NOT the 3rd-place playoff).
// 2026 WC structure: 72 GS | 16 R32 | 8 R16 | 4 QF | 2 SF | 1 3P | 1 F = 104 total
function detectRound(_ev: LiveMatch, index: number): string {
  if (index < 72) return "Group Stage";
  if (index < 88) return "Round of 32";
  if (index < 96) return "Round of 16";
  if (index < 100) return "Quarterfinal";
  if (index < 102) return "Semifinal";
  if (index === 102) return "Third Place";
  return "Final";
}

function parseDate(isoDate: string): { date: string; time: string } {
  const d = new Date(isoDate);
  const date = d.toISOString().slice(0, 10); // YYYY-MM-DD
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/New_York",
  });
  return { date, time };
}

// Convert ESPN LiveMatch events → our Match format
// Pass teamGroup map (abbr → group letter) for group assignment
export function espnEventsToMatches(
  events: LiveMatch[],
  teamGroup: Record<string, string> = {}
): Match[] {
  return events.map((ev, idx): Match => {
    const homeAbbr = ev.homeTeam.shortName.toUpperCase();
    const awayAbbr = ev.awayTeam.shortName.toUpperCase();
    const { date, time } = parseDate(ev.date);

    const round = detectRound(ev, idx);
    const isGroup = round === "Group Stage";

    // Group letter from ESPN-derived teamGroup map first, then static match fallback
    const group: string | undefined = isGroup
      ? (teamGroup[homeAbbr] ?? teamGroup[awayAbbr] ?? undefined)
      : undefined;

    // Country from city/country field
    const country: "USA" | "CAN" | "MEX" = ev.country?.toLowerCase().includes("canada")
      ? "CAN"
      : ev.country?.toLowerCase().includes("mexico")
      ? "MEX"
      : "USA";

    return {
      id: `espn-${ev.espnId}`,
      group,
      round,
      homeTeam: homeAbbr,
      awayTeam: awayAbbr,
      date,
      time,
      venue: ev.venue ?? "TBD",
      city: ev.city ?? "",
      country,
      homeScore: ev.homeScore ?? undefined,
      awayScore: ev.awayScore ?? undefined,
      status: ev.status,
    };
  });
}

// Inject team flags/names into our TEAMS map for ESPN-only teams
export function patchTeamsFromEspn(events: LiveMatch[]): void {
  for (const ev of events) {
    for (const side of [ev.homeTeam, ev.awayTeam]) {
      const abbr = side.shortName.toUpperCase();
      if (!TEAMS[abbr]) {
        // Dynamically add unknown team
        (TEAMS as Record<string, (typeof TEAMS)[string]>)[abbr] = {
          id: abbr,
          name: side.name,
          shortName: abbr,
          flag: FLAG_MAP[abbr] ?? "🏳️",
          group: "",
          confederation: "",
          fifaRanking: 99,
          color: "#666666",
        };
      }
    }
  }
}

// Merge ESPN scoreboard scores into existing match list
export function mergeWithLive(liveEvents: LiveMatch[], baseMatches: Match[]): Match[] {
  if (!liveEvents.length) return baseMatches;

  const liveMap = new Map<string, LiveMatch>();
  for (const ev of liveEvents) {
    const key = `${ev.homeTeam.shortName.toUpperCase()}-${ev.awayTeam.shortName.toUpperCase()}`;
    liveMap.set(key, ev);
  }

  return baseMatches.map((m) => {
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
