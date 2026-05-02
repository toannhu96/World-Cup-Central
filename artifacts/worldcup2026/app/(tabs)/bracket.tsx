import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useMatches } from "@/hooks/useMatchData";
import { TEAMS, type Match } from "@/data/worldcup2026";

const ROUNDS = ["Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Final"];

function BracketMatch({ match, colors }: { match: Match; colors: ReturnType<typeof useColors> }) {
  const home = TEAMS[match.homeTeam];
  const away = TEAMS[match.awayTeam];
  const finished = match.status === "finished";
  const isLive = match.status === "live";

  const isTbd = match.homeTeam === "TBD" || !home;
  const isTbdAway = match.awayTeam === "TBD" || !away;

  const homeWon = finished && match.homeScore !== undefined && match.awayScore !== undefined && match.homeScore > match.awayScore;
  const awayWon = finished && match.homeScore !== undefined && match.awayScore !== undefined && match.awayScore > match.homeScore;

  return (
    <View style={[styles.bracketMatch, {
      backgroundColor: colors.card,
      borderColor: isLive ? colors.live : colors.border,
      borderRadius: colors.radius / 2,
    }]}>
      {isLive && (
        <View style={[styles.liveStrip, { backgroundColor: colors.live }]}>
          <Text style={styles.liveStripText}>● LIVE</Text>
        </View>
      )}
      <View style={[styles.bracketTeam, { borderBottomColor: colors.border }]}>
        <Text style={{ fontSize: 14 }}>{isTbd ? "🏳️" : (home?.flag ?? "🏳️")}</Text>
        <Text
          style={[styles.bracketTeamName, {
            color: homeWon ? colors.win : isTbd ? colors.mutedForeground : colors.foreground,
          }]}
          numberOfLines={1}
        >
          {isTbd ? "TBD" : (home?.shortName ?? match.homeTeam)}
        </Text>
        {(finished || isLive) && !isTbd && (
          <Text style={[styles.bracketScore, { color: homeWon ? colors.win : colors.foreground }]}>
            {match.homeScore ?? 0}
          </Text>
        )}
      </View>
      <View style={styles.bracketTeam}>
        <Text style={{ fontSize: 14 }}>{isTbdAway ? "🏳️" : (away?.flag ?? "🏳️")}</Text>
        <Text
          style={[styles.bracketTeamName, {
            color: awayWon ? colors.win : isTbdAway ? colors.mutedForeground : colors.foreground,
          }]}
          numberOfLines={1}
        >
          {isTbdAway ? "TBD" : (away?.shortName ?? match.awayTeam)}
        </Text>
        {(finished || isLive) && !isTbdAway && (
          <Text style={[styles.bracketScore, { color: awayWon ? colors.win : colors.foreground }]}>
            {match.awayScore ?? 0}
          </Text>
        )}
      </View>
      {!finished && !isLive && (
        <View style={[styles.bracketDate, { borderTopColor: colors.border }]}>
          <Text style={[styles.bracketDateText, { color: colors.mutedForeground }]}>{match.date}</Text>
        </View>
      )}
    </View>
  );
}

function RoundColumn({ round, matches, colors }: { round: string; matches: Match[]; colors: ReturnType<typeof useColors> }) {
  const roundMatches = matches.filter((m) => m.round === round);
  return (
    <View style={styles.roundColumn}>
      <View style={[styles.roundHeader, { backgroundColor: colors.navy }]}>
        <Text style={[styles.roundTitle, { color: colors.gold }]} numberOfLines={1}>{round}</Text>
        <Text style={[styles.roundCount, { color: colors.goldLight }]}>{roundMatches.length}</Text>
      </View>
      <ScrollView nestedScrollEnabled contentContainerStyle={{ gap: 8, paddingVertical: 8 }}>
        {roundMatches.map((m) => (
          <BracketMatch key={m.id} match={m} colors={colors} />
        ))}
        {roundMatches.length === 0 && (
          <View style={styles.tbdBox}>
            <Text style={[styles.tbdText, { color: colors.mutedForeground }]}>TBD</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default function BracketScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { matches } = useMatches();
  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.navy, paddingTop: topPad }]}>
        <Text style={styles.headerTitle}>Knockout Stage</Text>
        <Text style={styles.headerSubtitle}>Round of 32 → Final · MetLife Stadium</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={[styles.bracketScroll, { paddingBottom: Platform.OS === "web" ? 34 + 84 : 100 }]}
      >
        {ROUNDS.map((round) => (
          <RoundColumn key={round} round={round} matches={matches} colors={colors} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    color: "#C9A84C",
    fontSize: 22,
    fontWeight: "800" as const,
  },
  headerSubtitle: {
    color: "#ffffff60",
    fontSize: 12,
    marginTop: 2,
  },
  bracketScroll: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    alignItems: "flex-start",
  },
  roundColumn: {
    width: 160,
  },
  roundHeader: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  roundTitle: {
    fontSize: 11,
    fontWeight: "700" as const,
    flex: 1,
  },
  roundCount: {
    fontSize: 11,
    fontWeight: "600" as const,
    marginLeft: 4,
  },
  liveStrip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: "center",
  },
  liveStripText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800" as const,
    letterSpacing: 0.5,
  },
  bracketMatch: {
    borderWidth: 1,
    overflow: "hidden",
  },
  bracketTeam: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bracketTeamName: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600" as const,
  },
  bracketScore: {
    fontSize: 13,
    fontWeight: "800" as const,
    minWidth: 16,
    textAlign: "right",
  },
  bracketDate: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bracketDateText: {
    fontSize: 10,
    textAlign: "center",
  },
  tbdBox: {
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffffff20",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  tbdText: {
    fontSize: 12,
    fontWeight: "600" as const,
    letterSpacing: 1,
  },
});
