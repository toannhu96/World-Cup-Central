import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { MatchCard } from "@/components/MatchCard";
import { TriviaCard } from "@/components/TriviaCard";
import { useColors } from "@/hooks/useColors";
import { useMatches } from "@/hooks/useMatchData";
import { usePredictions, scorePrediction } from "@/hooks/usePredictions";
import { TEAMS } from "@/data/worldcup2026";

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { favoriteTeams, favoriteMatches, toggleFavoriteTeam, notificationsEnabled, toggleNotifications } = useApp();
  const { matches } = useMatches();
  const { predictions, getPrediction, getStats } = usePredictions();
  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;

  const favMatches = matches.filter((m) => favoriteMatches.includes(m.id));
  const favTeamMatches = matches.filter(
    (m) => favoriteTeams.includes(m.homeTeam) || favoriteTeams.includes(m.awayTeam)
  );
  const favTeams = favoriteTeams.map((id) => TEAMS[id]).filter(Boolean);

  const stats = useMemo(() => getStats(matches), [getStats, matches, predictions]);

  // All predicted matches, most recent first
  const predictedMatches = useMemo(() => {
    return matches
      .filter((m) => !!getPrediction(m.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [matches, getPrediction, predictions]);

  const finishedPredictions = predictedMatches.filter((m) => m.status === "finished");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.navy, paddingTop: topPad }]}>
        <Text style={styles.headerTitle}>My Cup</Text>
        <Text style={styles.headerSubtitle}>Predictions · Trivia · Favorites</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Daily Trivia ─────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Daily Trivia</Text>
        <TriviaCard />

        {/* ── Score Predictor ───────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Score Predictor</Text>

        {/* Stats Banner */}
        <View style={[styles.statsCard, { backgroundColor: colors.navy, borderRadius: colors.radius }]}>
          <StatBox label="Points" value={String(stats.totalPoints)} accent={colors.gold} colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatBox label="Predictions" value={String(stats.total)} accent={colors.foreground} colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatBox label="Correct" value={String(stats.correct)} accent={colors.win} colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatBox
            label="Accuracy"
            value={stats.finished > 0 ? `${stats.accuracy}%` : "–"}
            accent={colors.primary}
            colors={colors}
          />
        </View>

        {/* Scoring guide */}
        <View style={[styles.guideRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <GuideItem emoji="🎯" label="Exact score" pts="+3" colors={colors} />
          <GuideItem emoji="✅" label="Correct result" pts="+1" colors={colors} />
          <GuideItem emoji="❌" label="Wrong result" pts="+0" colors={colors} />
        </View>

        {/* Hint to predict */}
        {stats.total === 0 && (
          <View style={[styles.hintBox, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <Ionicons name="stats-chart-outline" size={28} color={colors.primary} />
            <Text style={[styles.hintTitle, { color: colors.foreground }]}>No predictions yet</Text>
            <Text style={[styles.hintSub, { color: colors.mutedForeground }]}>
              Tap "Predict the score" on any upcoming match in the Schedule tab
            </Text>
          </View>
        )}

        {/* Recent prediction results */}
        {finishedPredictions.length > 0 && (
          <>
            <Text style={[styles.subTitle, { color: colors.mutedForeground }]}>Recent Results</Text>
            {finishedPredictions.slice(0, 5).map((m) => {
              const pred = getPrediction(m.id)!;
              const result = scorePrediction(pred, m);
              const homeT = TEAMS[m.homeTeam];
              const awayT = TEAMS[m.awayTeam];
              const outcomeColor =
                result.outcome === "exact"
                  ? colors.win
                  : result.outcome === "correct"
                  ? colors.gold
                  : colors.loss;
              return (
                <View
                  key={m.id}
                  style={[
                    styles.resultRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderRadius: colors.radius,
                    },
                  ]}
                >
                  <View style={styles.resultTeams}>
                    <Text style={{ fontSize: 18 }}>{homeT?.flag ?? "🏳️"}</Text>
                    <Text style={[styles.resultScore, { color: colors.foreground }]}>
                      {m.homeScore}–{m.awayScore}
                    </Text>
                    <Text style={{ fontSize: 18 }}>{awayT?.flag ?? "🏳️"}</Text>
                  </View>
                  <View style={styles.resultMeta}>
                    <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>
                      You predicted {pred.homeScore}–{pred.awayScore}
                    </Text>
                  </View>
                  <View style={[styles.resultBadge, { backgroundColor: `${outcomeColor}20` }]}>
                    <Text style={[styles.resultBadgeText, { color: outcomeColor }]}>
                      {result.label}
                    </Text>
                    <Text style={[styles.resultPts, { color: outcomeColor }]}>
                      +{result.points}
                    </Text>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* Upcoming predicted matches */}
        {predictedMatches.filter((m) => m.status === "upcoming").length > 0 && (
          <>
            <Text style={[styles.subTitle, { color: colors.mutedForeground }]}>Upcoming Predictions</Text>
            {predictedMatches
              .filter((m) => m.status === "upcoming")
              .slice(0, 3)
              .map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
          </>
        )}

        {/* ── Favorite Teams ────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Favorite Teams</Text>

        {/* Notifications Toggle */}
        <View style={[styles.notifCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <View style={styles.notifLeft}>
            <View style={[styles.notifIcon, { backgroundColor: `${colors.primary}20` }]}>
              <Ionicons name="notifications" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.notifTitle, { color: colors.foreground }]}>Match Alerts</Text>
              <Text style={[styles.notifSubtitle, { color: colors.mutedForeground }]}>
                {notificationsEnabled ? "Alerts before match & after final whistle" : "Alerts disabled"}
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleNotifications();
            }}
            trackColor={{ false: colors.muted, true: colors.primary }}
            thumbColor={"#ffffff"}
          />
        </View>

        {favTeams.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="star-outline" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No favorite teams yet</Text>
            <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>Star a team on the Teams tab</Text>
          </View>
        ) : (
          <View style={styles.teamsGrid}>
            {favTeams.map((team) => (
              <View key={team.id} style={[styles.teamChip, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                <Text style={{ fontSize: 28 }}>{team.flag}</Text>
                <Text style={[styles.chipName, { color: colors.foreground }]}>{team.shortName}</Text>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    toggleFavoriteTeam(team.id);
                  }}
                >
                  <Ionicons name="close-circle" size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {favTeams.length > 0 && favTeamMatches.length > 0 && (
          <>
            <Text style={[styles.subTitle, { color: colors.mutedForeground }]}>Next Matches</Text>
            {favTeamMatches.slice(0, 5).map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </>
        )}

        {/* Saved Matches */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Saved Matches</Text>
        {favMatches.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="bookmark-outline" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No saved matches</Text>
            <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>Bookmark matches from the Schedule tab</Text>
          </View>
        ) : (
          favMatches.map((m) => <MatchCard key={m.id} match={m} />)
        )}

        {/* WC Info */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About WC 2026</Text>
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          {[
            { icon: "calendar-outline", label: "Dates", value: "June 11 – July 19, 2026" },
            { icon: "location-outline", label: "Host Countries", value: "USA, Canada, Mexico" },
            { icon: "trophy-outline", label: "Venues", value: "16 stadiums across 3 countries" },
            { icon: "people-outline", label: "Teams", value: "48 teams (expanded format)" },
            { icon: "football-outline", label: "Matches", value: "104 total matches" },
            { icon: "star-outline", label: "Final", value: "MetLife Stadium, New York" },
          ].map(({ icon, label, value }) => (
            <View key={label} style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Ionicons name={icon as any} size={18} color={colors.primary} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{label}</Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({
  label,
  value,
  accent,
  colors,
}: {
  label: string;
  value: string;
  accent: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function GuideItem({
  emoji,
  label,
  pts,
  colors,
}: {
  emoji: string;
  label: string;
  pts: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.guideItem}>
      <Text style={{ fontSize: 16 }}>{emoji}</Text>
      <Text style={[styles.guideLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.guidePts, { color: colors.gold }]}>{pts}</Text>
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
    fontSize: 26,
    fontWeight: "800" as const,
  },
  headerSubtitle: {
    color: "#ffffff60",
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: "600" as const,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  statsCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    padding: 16,
    alignItems: "center",
  },
  statBox: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "900" as const },
  statLabel: { fontSize: 10, marginTop: 2 },
  statDivider: { width: 1, height: 32 },
  guideRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  guideItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 2,
  },
  guideLabel: { fontSize: 10, textAlign: "center" },
  guidePts: { fontSize: 13, fontWeight: "700" as const },
  hintBox: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  hintTitle: { fontSize: 15, fontWeight: "700" as const },
  hintSub: { fontSize: 12, textAlign: "center", lineHeight: 18 },
  resultRow: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resultTeams: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resultScore: {
    fontSize: 16,
    fontWeight: "800" as const,
  },
  resultMeta: { flex: 1 },
  resultLabel: { fontSize: 11 },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  resultBadgeText: { fontSize: 11, fontWeight: "700" as const },
  resultPts: { fontSize: 13, fontWeight: "900" as const },
  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
  },
  notifLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  notifIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  notifTitle: { fontSize: 15, fontWeight: "700" as const },
  notifSubtitle: { fontSize: 12, marginTop: 2 },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
  },
  emptyText: { fontSize: 15, fontWeight: "600" as const },
  emptyHint: { fontSize: 12 },
  teamsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },
  teamChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderWidth: 1,
  },
  chipName: { fontSize: 13, fontWeight: "700" as const },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 11 },
  infoValue: { fontSize: 14, fontWeight: "600" as const, marginTop: 1 },
});
