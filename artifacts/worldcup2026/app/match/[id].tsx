import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useMatches } from "@/hooks/useMatchData";
import { TEAMS, getTimeUntilMatch, type Match } from "@/data/worldcup2026";

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isFavoriteMatch, toggleFavoriteMatch } = useApp();
  const { matches, isLoading } = useMatches();

  const match: Match | undefined = matches.find((m) => m.id === id);

  const [countdown, setCountdown] = useState(match ? getTimeUntilMatch(match) : null);

  useEffect(() => {
    if (!match || match.status !== "upcoming") return;
    const timer = setInterval(() => setCountdown(getTimeUntilMatch(match)), 1000);
    return () => clearInterval(timer);
  }, [match]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (isLoading && !match) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.mutedForeground, marginTop: 12, fontSize: 14 }}>
          Loading match…
        </Text>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="football-outline" size={48} color={colors.mutedForeground} />
        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "700", marginTop: 12 }}>
          Match not found
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontSize: 14 }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const homeTeam = TEAMS[match.homeTeam];
  const awayTeam = TEAMS[match.awayTeam];
  const isFav = isFavoriteMatch(match.id);
  const isFinished = match.status === "finished";
  const isLive = match.status === "live";

  const homeWon = isFinished && match.homeScore !== undefined && match.awayScore !== undefined && match.homeScore > match.awayScore;
  const awayWon = isFinished && match.homeScore !== undefined && match.awayScore !== undefined && match.awayScore > match.homeScore;
  const isDraw = isFinished && match.homeScore === match.awayScore;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.navy, paddingTop: topPad + 12 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerRound}>{match.round}</Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFavoriteMatch(match.id);
            }}
          >
            <Ionicons name={isFav ? "bookmark" : "bookmark-outline"} size={22} color={isFav ? colors.gold : "#fff"} />
          </TouchableOpacity>
        </View>

        {isLive && (
          <View style={[styles.livePill, { backgroundColor: colors.live }]}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}

        {/* Score / Teams */}
        <View style={styles.scoreBlock}>
          <View style={styles.teamBlock}>
            <Text style={styles.bigFlag}>{homeTeam?.flag ?? "🏳️"}</Text>
            <Text style={[styles.teamLong, { color: "#fff" }]}>{homeTeam?.name ?? match.homeTeam}</Text>
            <Text style={[styles.teamShort, { color: colors.goldLight }]}>{homeTeam?.shortName ?? match.homeTeam}</Text>
          </View>

          <View style={styles.centerScore}>
            {isFinished || isLive ? (
              <>
                <Text style={[styles.bigScore, { color: homeWon ? colors.win : awayWon ? colors.foreground : "#fff" }]}>
                  {match.homeScore ?? 0}
                </Text>
                <Text style={[styles.scoreSep, { color: "#ffffff60" }]}>–</Text>
                <Text style={[styles.bigScore, { color: awayWon ? colors.win : homeWon ? colors.foreground : "#fff" }]}>
                  {match.awayScore ?? 0}
                </Text>
                {isDraw && <Text style={[styles.resultLabel, { color: colors.draw }]}>Draw</Text>}
              </>
            ) : (
              <>
                <Text style={[styles.matchTime, { color: colors.gold }]}>{match.time}</Text>
                <Text style={[styles.matchDate, { color: "#ffffff80" }]}>{match.date}</Text>
              </>
            )}
          </View>

          <View style={[styles.teamBlock, { alignItems: "flex-end" }]}>
            <Text style={styles.bigFlag}>{awayTeam?.flag ?? "🏳️"}</Text>
            <Text style={[styles.teamLong, { color: "#fff", textAlign: "right" }]}>{awayTeam?.name ?? match.awayTeam}</Text>
            <Text style={[styles.teamShort, { color: colors.goldLight }]}>{awayTeam?.shortName ?? match.awayTeam}</Text>
          </View>
        </View>

        {/* Countdown */}
        {countdown && match.status === "upcoming" && (
          <View style={styles.countdownRow}>
            {[{ v: countdown.days, l: "Days" }, { v: countdown.hours, l: "Hours" }, { v: countdown.minutes, l: "Min" }, { v: countdown.seconds, l: "Sec" }].map(({ v, l }) => (
              <View key={l} style={[styles.countdownUnit, { backgroundColor: "#ffffff15", borderRadius: 8 }]}>
                <Text style={[styles.countdownValue, { color: colors.gold }]}>{String(v).padStart(2, "0")}</Text>
                <Text style={styles.countdownLabel}>{l}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Match Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          {[
            { icon: "location-outline", label: "Venue", value: match.venue },
            { icon: "map-outline", label: "City", value: `${match.city}, ${match.country}` },
            { icon: "calendar-outline", label: "Date", value: match.date },
            { icon: "time-outline", label: "Kick-off", value: match.time },
            ...(match.group ? [{ icon: "grid-outline", label: "Group", value: `Group ${match.group}` }] : []),
          ].map(({ icon, label, value }) => (
            <View key={label} style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Ionicons name={icon as any} size={18} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{label}</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Result banner */}
        {isFinished && (
          <View style={[styles.resultBanner, {
            backgroundColor: homeWon ? `${colors.win}20` : awayWon ? `${colors.win}20` : `${colors.draw}20`,
            borderColor: homeWon || awayWon ? colors.win : colors.draw,
            borderRadius: colors.radius,
          }]}>
            <Ionicons name="trophy" size={22} color={homeWon || awayWon ? colors.win : colors.draw} />
            <Text style={[styles.resultText, { color: homeWon || awayWon ? colors.win : colors.draw }]}>
              {isDraw ? "Match ended in a draw" : `${homeWon ? homeTeam?.name : awayTeam?.name} won`}
            </Text>
          </View>
        )}

        {/* Teams Info */}
        {(homeTeam || awayTeam) && (
          <View style={styles.teamsCompare}>
            {[homeTeam, awayTeam].filter(Boolean).map((team) => (
              <View key={team!.id} style={[styles.teamInfoCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                <Text style={{ fontSize: 36 }}>{team!.flag}</Text>
                <Text style={[styles.teamCardName, { color: colors.foreground }]}>{team!.name}</Text>
                {team!.confederation ? (
                  <Text style={[styles.teamCardConf, { color: colors.primary }]}>{team!.confederation}</Text>
                ) : null}
                {team!.fifaRanking && team!.fifaRanking < 99 ? (
                  <View style={[styles.rankRow, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.rankLabel, { color: colors.mutedForeground }]}>FIFA Rank</Text>
                    <Text style={[styles.rankValue, { color: colors.foreground }]}>#{team!.fifaRanking}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: "center", justifyContent: "center" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerRound: {
    color: "#ffffff90",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    marginBottom: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  liveText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800" as const,
    letterSpacing: 1,
  },
  scoreBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  teamBlock: {
    flex: 1,
    alignItems: "flex-start",
    gap: 4,
  },
  bigFlag: {
    fontSize: 40,
  },
  teamLong: {
    fontSize: 13,
    fontWeight: "700" as const,
    lineHeight: 18,
  },
  teamShort: {
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  centerScore: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  bigScore: {
    fontSize: 36,
    fontWeight: "900" as const,
  },
  scoreSep: {
    fontSize: 28,
    fontWeight: "300" as const,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    width: "100%",
    textAlign: "center",
    marginTop: 2,
  },
  matchTime: {
    fontSize: 24,
    fontWeight: "800" as const,
  },
  matchDate: {
    fontSize: 12,
  },
  countdownRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  countdownUnit: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 60,
  },
  countdownValue: {
    fontSize: 22,
    fontWeight: "800" as const,
  },
  countdownLabel: {
    color: "#ffffff60",
    fontSize: 10,
    marginTop: 2,
  },
  infoCard: {
    margin: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: {
    fontSize: 13,
    width: 70,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600" as const,
    flex: 1,
  },
  resultBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderWidth: 1,
  },
  resultText: {
    fontSize: 15,
    fontWeight: "700" as const,
  },
  teamsCompare: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  teamInfoCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    gap: 4,
    borderWidth: 1,
  },
  teamCardName: {
    fontSize: 14,
    fontWeight: "700" as const,
    textAlign: "center",
  },
  teamCardConf: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  rankLabel: {
    fontSize: 10,
  },
  rankValue: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
});
