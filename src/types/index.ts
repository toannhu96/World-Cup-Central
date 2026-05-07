export interface Team {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  group: string;
  confederation: string;
  fifaRanking: number;
  color: string;
}

export interface Match {
  id: string;
  group?: string;
  round: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  country: "USA" | "CAN" | "MEX";
  homeScore?: number;
  awayScore?: number;
  status: "upcoming" | "live" | "finished";
  matchDay?: number;
}

export interface Group {
  id: string;
  name: string;
  teams: string[];
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  teamId: string;
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellowCard" | "redCard" | "substitution";
  team: string;
  player: string;
  assistedBy?: string;
  detail?: string;
}

export interface MatchStats {
  home: Record<string, string>;
  away: Record<string, string>;
}

export interface MatchSummary {
  id: string;
  status: string;
  venue: string;
  attendance?: number;
  keyEvents: MatchEvent[];
  stats: MatchStats;
  lineups: {
    home: Player[];
    away: Player[];
  };
}
