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

// Detect round name from ESPN status/round info
function detectRound(ev: LiveMatch, index: number): string {
  const r = (ev.round ?? "").toLowerCase();
  if (r.includes("group") || r.includes("matchday")) return "Group Stage";
  if (r.includes("round of 32") || r.includes("round of 32")) return "Round of 32";
  if (r.includes("round of 16")) return "Round of 16";
  if (r.includes("quarter")) return "Quarterfinal";
  if (r.includes("semi")) return "Semifinal";
  if (r.includes("third") || r.includes("3rd")) return "Third Place";
  if (r.includes("final")) return "Final";
  // Heuristic: first ~48 matches are group stage for 48-team WC
  if (index < 48) return "Group Stage";
  if (index < 64) return "Round of 32";
  if (index < 72) return "Round of 16";
  if (index < 76) return "Quarterfinal";
  if (index < 78) return "Semifinal";
  if (index === 78) return "Third Place";
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
export function espnEventsToMatches(events: LiveMatch[]): Match[] {
  return events.map((ev, idx): Match => {
    const homeAbbr = ev.homeTeam.shortName.toUpperCase();
    const awayAbbr = ev.awayTeam.shortName.toUpperCase();
    const { date, time } = parseDate(ev.date);

    // Try to find existing static match for extra metadata (group, venue detail)
    const staticMatch = MATCHES.find((m) => {
      const ht = TEAMS[m.homeTeam];
      const at = TEAMS[m.awayTeam];
      return (
        ht?.shortName.toUpperCase() === homeAbbr &&
        at?.shortName.toUpperCase() === awayAbbr
      );
    });

    const round = detectRound(ev, idx);
    const isGroup = round === "Group Stage";

    // Determine group letter from static match if available
    const group = staticMatch?.group ?? (isGroup ? undefined : undefined);

    // Country from city/country field
    const country: "USA" | "CAN" | "MEX" = ev.country?.toLowerCase().includes("canada")
      ? "CAN"
      : ev.country?.toLowerCase().includes("mexico")
      ? "MEX"
      : "USA";

    return {
      id: staticMatch?.id ?? `espn-${ev.espnId}`,
      group,
      round,
      homeTeam: homeAbbr,
      awayTeam: awayAbbr,
      date,
      time,
      venue: ev.venue ?? staticMatch?.venue ?? "TBD",
      city: ev.city ?? staticMatch?.city ?? "",
      country,
      homeScore: ev.homeScore ?? undefined,
      awayScore: ev.awayScore ?? undefined,
      status: ev.status,
      matchDay: staticMatch?.matchDay,
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
