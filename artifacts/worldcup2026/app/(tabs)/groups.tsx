import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useMatches, useGroups } from "@/hooks/useMatchData";
import { TEAMS, type Match } from "@/data/worldcup2026";

interface TeamStats {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

function computeStandings(teamIds: string[], allMatches: Match[]): TeamStats[] {
  const stats: Record<string, TeamStats> = {};
  for (const teamId of teamIds) {
    stats[teamId] = { teamId, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 };
  }

  const teamSet = new Set(teamIds);
  const groupMatches = allMatches.filter(
    (m) =>
      m.status === "finished" &&
      teamSet.has(m.homeTeam) &&
      teamSet.has(m.awayTeam)
  );

  for (const m of groupMatches) {
    const home = stats[m.homeTeam];
    const away = stats[m.awayTeam];
    if (!home || !away || m.homeScore === undefined || m.awayScore === undefined) continue;
    home.played++;
    away.played++;
    home.gf += m.homeScore;
    home.ga += m.awayScore;
    away.gf += m.awayScore;
    away.ga += m.homeScore;
    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;
    if (m.homeScore > m.awayScore) {
      home.won++; home.points += 3; away.lost++;
    } else if (m.homeScore < m.awayScore) {
      away.won++; away.points += 3; home.lost++;
    } else {
      home.drawn++; home.points += 1; away.drawn++; away.points += 1;
    }
  }

  return Object.values(stats).sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
}

export default function GroupsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isFavoriteTeam, toggleFavoriteTeam } = useApp();
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
  const { matches } = useMatches();
  const { groups, isLoading: groupsLoading } = useGroups();

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;

  const selectedGroup = groups[selectedGroupIdx];
  const teamIds = selectedGroup?.teams ?? [];

  const standings = useMemo(
    () => computeStandings(teamIds, matches),
    [teamIds, matches]
  );

  const groupMatches = useMemo(() => {
    if (!selectedGroup) return [];
    const teamSet = new Set(teamIds);
    return matches.filter(
      (m) => m.round === "Group Stage" && teamSet.has(m.homeTeam) && teamSet.has(m.awayTeam)
    );
  }, [matches, teamIds, selectedGroup]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Group Selector */}
      <View style={[styles.groupSelector, { backgroundColor: colors.navy, paddingTop: topPad }]}>
        <Text style={styles.selectorTitle}>Group Stage</Text>

        {groupsLoading ? (
          <ActivityIndicator color={colors.gold} style={{ marginVertical: 8 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupTabs}>
            {groups.map((g, idx) => (
              <TouchableOpacity
                key={g.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedGroupIdx(idx);
                }}
                style={[
                  styles.groupTab,
                  {
                    backgroundColor: selectedGroupIdx === idx ? colors.gold : "transparent",
                    borderRadius: 8,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.groupTabText,
                    { color: selectedGroupIdx === idx ? colors.navy : colors.goldLight },
                  ]}
                >
                  {g.id}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 + 84 : 100,
        }}
      >
        {/* Standings Table */}
        {!selectedGroup ? (
          <View style={styles.emptyBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Loading groups…</Text>
          </View>
        ) : (
          <View style={[styles.tableCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.tableHeaderCell, styles.teamCol, { color: colors.mutedForeground }]}>Team</Text>
              {["P", "W", "D", "L", "GD", "Pts"].map((h) => (
                <Text key={h} style={[styles.tableHeaderCell, styles.statCol, { color: colors.mutedForeground }]}>{h}</Text>
              ))}
              <View style={styles.favCol} />
            </View>

            {standings.map((s, idx) => {
              const team = TEAMS[s.teamId];
              const isQualified = idx < 2;
              const fav = isFavoriteTeam(s.teamId);
              return (
                <View
                  key={s.teamId}
                  style={[
                    styles.tableRow,
                    {
                      borderBottomColor: colors.border,
                      backgroundColor: isQualified ? `${colors.primary}08` : "transparent",
                    },
                  ]}
                >
                  <View style={[styles.posIndicator, { backgroundColor: isQualified ? colors.gold : "transparent" }]} />
                  <View style={[styles.teamCol, styles.teamRowCell]}>
                    <Text style={styles.flagSmall}>{team?.flag ?? "🏳️"}</Text>
                    <Text style={[styles.teamNameSmall, { color: colors.foreground }]} numberOfLines={1}>
                      {team?.shortName ?? s.teamId}
                    </Text>
                  </View>
                  {[s.played, s.won, s.drawn, s.lost, s.gd > 0 ? `+${s.gd}` : s.gd, s.points].map((val, i) => (
                    <Text
                      key={i}
                      style={[
                        styles.tableCell,
                        styles.statCol,
                        {
                          color: i === 5 ? colors.foreground : colors.mutedForeground,
                          fontWeight: i === 5 ? ("800" as const) : ("400" as const),
                        },
                      ]}
                    >
                      {val}
                    </Text>
                  ))}
                  <TouchableOpacity
                    style={styles.favCol}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      toggleFavoriteTeam(s.teamId);
                    }}
                  >
                    <Ionicons name={fav ? "star" : "star-outline"} size={16} color={fav ? colors.gold : colors.mutedForeground} />
                  </TouchableOpacity>
                </View>
              );
            })}

            <View style={styles.qualifiedNote}>
              <View style={[styles.qualifiedDot, { backgroundColor: colors.gold }]} />
              <Text style={[styles.qualifiedText, { color: colors.mutedForeground }]}>Qualifies to Round of 32</Text>
            </View>
          </View>
        )}

        {/* Group Matches */}
        {selectedGroup && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
              Matches · Group {selectedGroup.id}
            </Text>

            {groupMatches.length === 0 ? (
              <View style={styles.emptyMatches}>
                <Text style={[styles.emptyMatchText, { color: colors.mutedForeground }]}>
                  No matches scheduled yet
                </Text>
              </View>
            ) : (
              groupMatches.map((m) => {
                const home = TEAMS[m.homeTeam];
                const away = TEAMS[m.awayTeam];
                const finished = m.status === "finished";
                const isLive = m.status === "live";
                return (
                  <View
                    key={m.id}
                    style={[
                      styles.matchRow,
                      {
                        backgroundColor: colors.card,
                        borderColor: isLive ? colors.live : colors.border,
                        borderRadius: colors.radius,
                      },
                    ]}
                  >
                    <View style={styles.matchTeam}>
                      <Text style={{ fontSize: 22 }}>{home?.flag ?? "🏳️"}</Text>
                      <Text style={[styles.matchTeamName, { color: colors.foreground }]}>
                        {home?.shortName ?? m.homeTeam}
                      </Text>
                    </View>
                    <View style={styles.matchCenter}>
                      {finished || isLive ? (
                        <>
                          {isLive && (
                            <View style={[styles.liveTag, { backgroundColor: colors.live }]}>
                              <Text style={styles.liveTagText}>LIVE</Text>
                            </View>
                          )}
                          <Text style={[styles.matchScore, { color: colors.foreground }]}>
                            {m.homeScore ?? 0} – {m.awayScore ?? 0}
                          </Text>
                        </>
                      ) : (
                        <Text style={[styles.matchTime, { color: colors.mutedForeground }]}>{m.time}</Text>
                      )}
                      <Text style={[styles.matchDate, { color: colors.mutedForeground }]}>{m.date}</Text>
                    </View>
                    <View style={[styles.matchTeam, { alignItems: "flex-end" }]}>
                      <Text style={{ fontSize: 22 }}>{away?.flag ?? "🏳️"}</Text>
                      <Text style={[styles.matchTeamName, { color: colors.foreground }]}>
                        {away?.shortName ?? m.awayTeam}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  groupSelector: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  selectorTitle: {
    color: "#ffffff80",
    fontSize: 12,
    fontWeight: "600" as const,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  groupTabs: {
    gap: 6,
    paddingBottom: 4,
  },
  groupTab: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  groupTabText: {
    fontSize: 15,
    fontWeight: "700" as const,
  },
  tableCard: {
    margin: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: "600" as const,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tableCell: {
    fontSize: 13,
    textAlign: "center",
  },
  teamCol: { flex: 1 },
  statCol: { width: 32, textAlign: "center" },
  favCol: { width: 28, alignItems: "center" },
  teamRowCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  flagSmall: { fontSize: 18 },
  teamNameSmall: {
    fontSize: 13,
    fontWeight: "600" as const,
    flex: 1,
  },
  posIndicator: {
    width: 3,
    height: 28,
    borderRadius: 2,
    marginRight: 8,
  },
  qualifiedNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  qualifiedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  qualifiedText: { fontSize: 11 },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700" as const,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: { fontSize: 14 },
  emptyMatches: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyMatchText: { fontSize: 14 },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
  },
  matchTeam: {
    alignItems: "center",
    gap: 4,
    width: 60,
  },
  matchTeamName: {
    fontSize: 12,
    fontWeight: "600" as const,
    textAlign: "center",
  },
  matchCenter: {
    alignItems: "center",
    flex: 1,
    gap: 2,
  },
  liveTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveTagText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800" as const,
    letterSpacing: 0.5,
  },
  matchScore: {
    fontSize: 20,
    fontWeight: "800" as const,
  },
  matchTime: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  matchDate: {
    fontSize: 11,
    marginTop: 2,
  },
});
