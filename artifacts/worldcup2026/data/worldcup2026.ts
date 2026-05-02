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

export const TEAMS: Record<string, Team> = {
  BRA: { id: "BRA", name: "Brazil", shortName: "BRA", flag: "🇧🇷", group: "A", confederation: "CONMEBOL", fifaRanking: 1, color: "#009C3B" },
  GER: { id: "GER", name: "Germany", shortName: "GER", flag: "🇩🇪", group: "A", confederation: "UEFA", fifaRanking: 12, color: "#000000" },
  MEX: { id: "MEX", name: "Mexico", shortName: "MEX", flag: "🇲🇽", group: "A", confederation: "CONCACAF", fifaRanking: 16, color: "#006847" },
  MOR: { id: "MOR", name: "Morocco", shortName: "MAR", flag: "🇲🇦", group: "A", confederation: "CAF", fifaRanking: 14, color: "#C1272D" },

  FRA: { id: "FRA", name: "France", shortName: "FRA", flag: "🇫🇷", group: "B", confederation: "UEFA", fifaRanking: 2, color: "#003189" },
  ARG: { id: "ARG", name: "Argentina", shortName: "ARG", flag: "🇦🇷", group: "B", confederation: "CONMEBOL", fifaRanking: 3, color: "#74ACDF" },
  CAN: { id: "CAN", name: "Canada", shortName: "CAN", flag: "🇨🇦", group: "B", confederation: "CONCACAF", fifaRanking: 40, color: "#FF0000" },
  EGY: { id: "EGY", name: "Egypt", shortName: "EGY", flag: "🇪🇬", group: "B", confederation: "CAF", fifaRanking: 38, color: "#CE1126" },

  ESP: { id: "ESP", name: "Spain", shortName: "ESP", flag: "🇪🇸", group: "C", confederation: "UEFA", fifaRanking: 6, color: "#AA151B" },
  ENG: { id: "ENG", name: "England", shortName: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "C", confederation: "UEFA", fifaRanking: 4, color: "#003090" },
  USA: { id: "USA", name: "USA", shortName: "USA", flag: "🇺🇸", group: "C", confederation: "CONCACAF", fifaRanking: 13, color: "#B22234" },
  SEN: { id: "SEN", name: "Senegal", shortName: "SEN", flag: "🇸🇳", group: "C", confederation: "CAF", fifaRanking: 20, color: "#00853F" },

  POR: { id: "POR", name: "Portugal", shortName: "POR", flag: "🇵🇹", group: "D", confederation: "UEFA", fifaRanking: 5, color: "#006600" },
  NED: { id: "NED", name: "Netherlands", shortName: "NED", flag: "🇳🇱", group: "D", confederation: "UEFA", fifaRanking: 7, color: "#FF6600" },
  AUS: { id: "AUS", name: "Australia", shortName: "AUS", flag: "🇦🇺", group: "D", confederation: "AFC", fifaRanking: 24, color: "#00843D" },
  ECU: { id: "ECU", name: "Ecuador", shortName: "ECU", flag: "🇪🇨", group: "D", confederation: "CONMEBOL", fifaRanking: 35, color: "#FFD100" },

  BEL: { id: "BEL", name: "Belgium", shortName: "BEL", flag: "🇧🇪", group: "E", confederation: "UEFA", fifaRanking: 8, color: "#EF2B2D" },
  COL: { id: "COL", name: "Colombia", shortName: "COL", flag: "🇨🇴", group: "E", confederation: "CONMEBOL", fifaRanking: 9, color: "#003087" },
  JPN: { id: "JPN", name: "Japan", shortName: "JPN", flag: "🇯🇵", group: "E", confederation: "AFC", fifaRanking: 15, color: "#003087" },
  NGR: { id: "NGR", name: "Nigeria", shortName: "NGA", flag: "🇳🇬", group: "E", confederation: "CAF", fifaRanking: 37, color: "#008751" },

  CRO: { id: "CRO", name: "Croatia", shortName: "CRO", flag: "🇭🇷", group: "F", confederation: "UEFA", fifaRanking: 10, color: "#FF0000" },
  URU: { id: "URU", name: "Uruguay", shortName: "URU", flag: "🇺🇾", group: "F", confederation: "CONMEBOL", fifaRanking: 11, color: "#75AADB" },
  KOR: { id: "KOR", name: "South Korea", shortName: "KOR", flag: "🇰🇷", group: "F", confederation: "AFC", fifaRanking: 22, color: "#CD2E3A" },
  CMR: { id: "CMR", name: "Cameroon", shortName: "CMR", flag: "🇨🇲", group: "F", confederation: "CAF", fifaRanking: 43, color: "#007A3D" },

  DEN: { id: "DEN", name: "Denmark", shortName: "DEN", flag: "🇩🇰", group: "G", confederation: "UEFA", fifaRanking: 17, color: "#C60C30" },
  SUI: { id: "SUI", name: "Switzerland", shortName: "SUI", flag: "🇨🇭", group: "G", confederation: "UEFA", fifaRanking: 18, color: "#FF0000" },
  MEX2: { id: "MEX2", name: "Mexico", shortName: "MEX", flag: "🇲🇽", group: "G", confederation: "CONCACAF", fifaRanking: 16, color: "#006847" },
  GHA: { id: "GHA", name: "Ghana", shortName: "GHA", flag: "🇬🇭", group: "G", confederation: "CAF", fifaRanking: 56, color: "#006B3F" },

  ITA: { id: "ITA", name: "Italy", shortName: "ITA", flag: "🇮🇹", group: "H", confederation: "UEFA", fifaRanking: 19, color: "#003399" },
  QAT: { id: "QAT", name: "Qatar", shortName: "QAT", flag: "🇶🇦", group: "H", confederation: "AFC", fifaRanking: 58, color: "#8D1B3D" },
  CHI: { id: "CHI", name: "Chile", shortName: "CHI", flag: "🇨🇱", group: "H", confederation: "CONMEBOL", fifaRanking: 29, color: "#D52B1E" },
  ALG: { id: "ALG", name: "Algeria", shortName: "ALG", flag: "🇩🇿", group: "H", confederation: "CAF", fifaRanking: 42, color: "#006233" },

  ENG2: { id: "ENG2", name: "England", shortName: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "I", confederation: "UEFA", fifaRanking: 4, color: "#003090" },
  SRB: { id: "SRB", name: "Serbia", shortName: "SRB", flag: "🇷🇸", group: "I", confederation: "UEFA", fifaRanking: 33, color: "#C6363C" },
  IRN: { id: "IRN", name: "Iran", shortName: "IRN", flag: "🇮🇷", group: "I", confederation: "AFC", fifaRanking: 21, color: "#239F40" },
  PAN: { id: "PAN", name: "Panama", shortName: "PAN", flag: "🇵🇦", group: "I", confederation: "CONCACAF", fifaRanking: 49, color: "#DA121A" },

  POL: { id: "POL", name: "Poland", shortName: "POL", flag: "🇵🇱", group: "J", confederation: "UEFA", fifaRanking: 23, color: "#DC143C" },
  AUT: { id: "AUT", name: "Austria", shortName: "AUT", flag: "🇦🇹", group: "J", confederation: "UEFA", fifaRanking: 25, color: "#ED2939" },
  SAU: { id: "SAU", name: "Saudi Arabia", shortName: "KSA", flag: "🇸🇦", group: "J", confederation: "AFC", fifaRanking: 56, color: "#006C35" },
  MAL: { id: "MAL", name: "Mali", shortName: "MLI", flag: "🇲🇱", group: "J", confederation: "CAF", fifaRanking: 50, color: "#14B53A" },

  TUR: { id: "TUR", name: "Turkey", shortName: "TUR", flag: "🇹🇷", group: "K", confederation: "UEFA", fifaRanking: 26, color: "#E30A17" },
  UKR: { id: "UKR", name: "Ukraine", shortName: "UKR", flag: "🇺🇦", group: "K", confederation: "UEFA", fifaRanking: 27, color: "#005BBB" },
  MAR: { id: "MAR", name: "Morocco", shortName: "MAR", flag: "🇲🇦", group: "K", confederation: "CAF", fifaRanking: 14, color: "#C1272D" },
  CRI: { id: "CRI", name: "Costa Rica", shortName: "CRC", flag: "🇨🇷", group: "K", confederation: "CONCACAF", fifaRanking: 51, color: "#002B7F" },

  HUN: { id: "HUN", name: "Hungary", shortName: "HUN", flag: "🇭🇺", group: "L", confederation: "UEFA", fifaRanking: 28, color: "#477050" },
  ROM: { id: "ROM", name: "Romania", shortName: "ROU", flag: "🇷🇴", group: "L", confederation: "UEFA", fifaRanking: 30, color: "#002B7F" },
  NZL: { id: "NZL", name: "New Zealand", shortName: "NZL", flag: "🇳🇿", group: "L", confederation: "OFC", fifaRanking: 95, color: "#000000" },
  HON: { id: "HON", name: "Honduras", shortName: "HON", flag: "🇭🇳", group: "L", confederation: "CONCACAF", fifaRanking: 74, color: "#0073CF" },
};

export const GROUPS: Group[] = [
  { id: "A", name: "Group A", teams: ["BRA", "GER", "MEX", "MOR"] },
  { id: "B", name: "Group B", teams: ["FRA", "ARG", "CAN", "EGY"] },
  { id: "C", name: "Group C", teams: ["ESP", "ENG", "USA", "SEN"] },
  { id: "D", name: "Group D", teams: ["POR", "NED", "AUS", "ECU"] },
  { id: "E", name: "Group E", teams: ["BEL", "COL", "JPN", "NGR"] },
  { id: "F", name: "Group F", teams: ["CRO", "URU", "KOR", "CMR"] },
  { id: "G", name: "Group G", teams: ["DEN", "SUI", "MEX2", "GHA"] },
  { id: "H", name: "Group H", teams: ["ITA", "QAT", "CHI", "ALG"] },
  { id: "I", name: "Group I", teams: ["ENG2", "SRB", "IRN", "PAN"] },
  { id: "J", name: "Group J", teams: ["POL", "AUT", "SAU", "MAL"] },
  { id: "K", name: "Group K", teams: ["TUR", "UKR", "MAR", "CRI"] },
  { id: "L", name: "Group L", teams: ["HUN", "ROM", "NZL", "HON"] },
];

export const MATCHES: Match[] = [
  // Group A
  { id: "m001", group: "A", round: "Group Stage", homeTeam: "BRA", awayTeam: "GER", date: "2026-06-11", time: "21:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA", status: "upcoming", matchDay: 1 },
  { id: "m002", group: "A", round: "Group Stage", homeTeam: "MEX", awayTeam: "MOR", date: "2026-06-11", time: "18:00", venue: "Estadio Azteca", city: "Mexico City", country: "MEX", status: "upcoming", matchDay: 1 },
  { id: "m003", group: "A", round: "Group Stage", homeTeam: "BRA", awayTeam: "MEX", date: "2026-06-15", time: "21:00", venue: "MetLife Stadium", city: "New York", country: "USA", status: "upcoming", matchDay: 2 },
  { id: "m004", group: "A", round: "Group Stage", homeTeam: "GER", awayTeam: "MOR", date: "2026-06-15", time: "18:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA", status: "upcoming", matchDay: 2 },
  { id: "m005", group: "A", round: "Group Stage", homeTeam: "MOR", awayTeam: "BRA", date: "2026-06-19", time: "21:00", venue: "AT&T Stadium", city: "Dallas", country: "USA", status: "upcoming", matchDay: 3 },
  { id: "m006", group: "A", round: "Group Stage", homeTeam: "GER", awayTeam: "MEX", date: "2026-06-19", time: "21:00", venue: "BMO Field", city: "Toronto", country: "CAN", status: "upcoming", matchDay: 3 },

  // Group B
  { id: "m007", group: "B", round: "Group Stage", homeTeam: "FRA", awayTeam: "ARG", date: "2026-06-12", time: "21:00", venue: "AT&T Stadium", city: "Dallas", country: "USA", status: "upcoming", matchDay: 1 },
  { id: "m008", group: "B", round: "Group Stage", homeTeam: "CAN", awayTeam: "EGY", date: "2026-06-12", time: "18:00", venue: "BC Place", city: "Vancouver", country: "CAN", status: "upcoming", matchDay: 1 },
  { id: "m009", group: "B", round: "Group Stage", homeTeam: "FRA", awayTeam: "CAN", date: "2026-06-16", time: "21:00", venue: "MetLife Stadium", city: "New York", country: "USA", status: "upcoming", matchDay: 2 },
  { id: "m010", group: "B", round: "Group Stage", homeTeam: "ARG", awayTeam: "EGY", date: "2026-06-16", time: "18:00", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA", status: "upcoming", matchDay: 2 },
  { id: "m011", group: "B", round: "Group Stage", homeTeam: "EGY", awayTeam: "FRA", date: "2026-06-20", time: "21:00", venue: "Allegiant Stadium", city: "Las Vegas", country: "USA", status: "upcoming", matchDay: 3 },
  { id: "m012", group: "B", round: "Group Stage", homeTeam: "ARG", awayTeam: "CAN", date: "2026-06-20", time: "21:00", venue: "Estadio Akron", city: "Guadalajara", country: "MEX", status: "upcoming", matchDay: 3 },

  // Group C
  { id: "m013", group: "C", round: "Group Stage", homeTeam: "ESP", awayTeam: "ENG", date: "2026-06-13", time: "21:00", venue: "MetLife Stadium", city: "New York", country: "USA", status: "upcoming", matchDay: 1 },
  { id: "m014", group: "C", round: "Group Stage", homeTeam: "USA", awayTeam: "SEN", date: "2026-06-13", time: "18:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA", status: "upcoming", matchDay: 1 },
  { id: "m015", group: "C", round: "Group Stage", homeTeam: "ESP", awayTeam: "USA", date: "2026-06-17", time: "21:00", venue: "AT&T Stadium", city: "Dallas", country: "USA", status: "upcoming", matchDay: 2 },
  { id: "m016", group: "C", round: "Group Stage", homeTeam: "ENG", awayTeam: "SEN", date: "2026-06-17", time: "18:00", venue: "Gillette Stadium", city: "Boston", country: "USA", status: "upcoming", matchDay: 2 },
  { id: "m017", group: "C", round: "Group Stage", homeTeam: "SEN", awayTeam: "ESP", date: "2026-06-21", time: "21:00", venue: "Levi's Stadium", city: "San Francisco", country: "USA", status: "upcoming", matchDay: 3 },
  { id: "m018", group: "C", round: "Group Stage", homeTeam: "ENG", awayTeam: "USA", date: "2026-06-21", time: "21:00", venue: "MetLife Stadium", city: "New York", country: "USA", status: "upcoming", matchDay: 3 },

  // Group D
  { id: "m019", group: "D", round: "Group Stage", homeTeam: "POR", awayTeam: "NED", date: "2026-06-14", time: "21:00", venue: "Allegiant Stadium", city: "Las Vegas", country: "USA", status: "upcoming", matchDay: 1 },
  { id: "m020", group: "D", round: "Group Stage", homeTeam: "AUS", awayTeam: "ECU", date: "2026-06-14", time: "18:00", venue: "Lumen Field", city: "Seattle", country: "USA", status: "upcoming", matchDay: 1 },
  { id: "m021", group: "D", round: "Group Stage", homeTeam: "POR", awayTeam: "AUS", date: "2026-06-18", time: "21:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA", status: "upcoming", matchDay: 2 },
  { id: "m022", group: "D", round: "Group Stage", homeTeam: "NED", awayTeam: "ECU", date: "2026-06-18", time: "18:00", venue: "Estadio BBVA", city: "Monterrey", country: "MEX", status: "upcoming", matchDay: 2 },
  { id: "m023", group: "D", round: "Group Stage", homeTeam: "ECU", awayTeam: "POR", date: "2026-06-22", time: "21:00", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA", status: "upcoming", matchDay: 3 },
  { id: "m024", group: "D", round: "Group Stage", homeTeam: "NED", awayTeam: "AUS", date: "2026-06-22", time: "21:00", venue: "BMO Field", city: "Toronto", country: "CAN", status: "upcoming", matchDay: 3 },

  // Group E
  { id: "m025", group: "E", round: "Group Stage", homeTeam: "BEL", awayTeam: "COL", date: "2026-06-12", time: "15:00", venue: "Levi's Stadium", city: "San Francisco", country: "USA", status: "upcoming", matchDay: 1 },
  { id: "m026", group: "E", round: "Group Stage", homeTeam: "JPN", awayTeam: "NGR", date: "2026-06-12", time: "12:00", venue: "Gillette Stadium", city: "Boston", country: "USA", status: "upcoming", matchDay: 1 },

  // Group F
  { id: "m027", group: "F", round: "Group Stage", homeTeam: "CRO", awayTeam: "URU", date: "2026-06-13", time: "15:00", venue: "Estadio Akron", city: "Guadalajara", country: "MEX", status: "upcoming", matchDay: 1 },
  { id: "m028", group: "F", round: "Group Stage", homeTeam: "KOR", awayTeam: "CMR", date: "2026-06-13", time: "12:00", venue: "BC Place", city: "Vancouver", country: "CAN", status: "upcoming", matchDay: 1 },

  // Round of 32 (placeholders)
  { id: "r32_01", round: "Round of 32", homeTeam: "TBD", awayTeam: "TBD", date: "2026-06-29", time: "21:00", venue: "MetLife Stadium", city: "New York", country: "USA", status: "upcoming" },
  { id: "r32_02", round: "Round of 32", homeTeam: "TBD", awayTeam: "TBD", date: "2026-06-30", time: "21:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA", status: "upcoming" },
  { id: "r32_03", round: "Round of 32", homeTeam: "TBD", awayTeam: "TBD", date: "2026-07-01", time: "21:00", venue: "AT&T Stadium", city: "Dallas", country: "USA", status: "upcoming" },
  { id: "r32_04", round: "Round of 32", homeTeam: "TBD", awayTeam: "TBD", date: "2026-07-02", time: "21:00", venue: "Allegiant Stadium", city: "Las Vegas", country: "USA", status: "upcoming" },

  // Round of 16 (placeholders)
  { id: "r16_01", round: "Round of 16", homeTeam: "TBD", awayTeam: "TBD", date: "2026-07-06", time: "21:00", venue: "MetLife Stadium", city: "New York", country: "USA", status: "upcoming" },
  { id: "r16_02", round: "Round of 16", homeTeam: "TBD", awayTeam: "TBD", date: "2026-07-07", time: "21:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA", status: "upcoming" },

  // Quarterfinals
  { id: "qf_01", round: "Quarterfinal", homeTeam: "TBD", awayTeam: "TBD", date: "2026-07-10", time: "21:00", venue: "MetLife Stadium", city: "New York", country: "USA", status: "upcoming" },
  { id: "qf_02", round: "Quarterfinal", homeTeam: "TBD", awayTeam: "TBD", date: "2026-07-11", time: "21:00", venue: "SoFi Stadium", city: "Los Angeles", country: "USA", status: "upcoming" },

  // Semifinals
  { id: "sf_01", round: "Semifinal", homeTeam: "TBD", awayTeam: "TBD", date: "2026-07-14", time: "21:00", venue: "MetLife Stadium", city: "New York", country: "USA", status: "upcoming" },
  { id: "sf_02", round: "Semifinal", homeTeam: "TBD", awayTeam: "TBD", date: "2026-07-15", time: "21:00", venue: "AT&T Stadium", city: "Dallas", country: "USA", status: "upcoming" },

  // Third Place
  { id: "tp_01", round: "Third Place", homeTeam: "TBD", awayTeam: "TBD", date: "2026-07-18", time: "21:00", venue: "Allegiant Stadium", city: "Las Vegas", country: "USA", status: "upcoming" },

  // Final
  { id: "final", round: "Final", homeTeam: "TBD", awayTeam: "TBD", date: "2026-07-19", time: "21:00", venue: "MetLife Stadium", city: "New York", country: "USA", status: "upcoming" },
];

export const VENUES = [
  { name: "MetLife Stadium", city: "New York", country: "USA", capacity: 82500 },
  { name: "SoFi Stadium", city: "Los Angeles", country: "USA", capacity: 70000 },
  { name: "AT&T Stadium", city: "Dallas", country: "USA", capacity: 80000 },
  { name: "Allegiant Stadium", city: "Las Vegas", country: "USA", capacity: 65000 },
  { name: "Estadio Azteca", city: "Mexico City", country: "MEX", capacity: 87523 },
  { name: "Estadio Akron", city: "Guadalajara", country: "MEX", capacity: 49850 },
  { name: "Estadio BBVA", city: "Monterrey", country: "MEX", capacity: 53500 },
  { name: "BC Place", city: "Vancouver", country: "CAN", capacity: 54500 },
  { name: "BMO Field", city: "Toronto", country: "CAN", capacity: 30000 },
  { name: "Levi's Stadium", city: "San Francisco", country: "USA", capacity: 68500 },
  { name: "Arrowhead Stadium", city: "Kansas City", country: "USA", capacity: 76416 },
  { name: "Gillette Stadium", city: "Boston", country: "USA", capacity: 65878 },
  { name: "Lumen Field", city: "Seattle", country: "USA", capacity: 69000 },
];

export function getMatchDate(match: Match): Date {
  return new Date(`${match.date}T${match.time}:00`);
}

export function getTimeUntilMatch(match: Match): { days: number; hours: number; minutes: number; seconds: number } | null {
  if (match.status !== "upcoming") return null;
  const now = new Date();
  const matchDate = getMatchDate(match);
  const diff = matchDate.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export function formatMatchDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export const ROUNDS_ORDER = [
  "Group Stage",
  "Round of 32",
  "Round of 16",
  "Quarterfinal",
  "Semifinal",
  "Third Place",
  "Final",
];
