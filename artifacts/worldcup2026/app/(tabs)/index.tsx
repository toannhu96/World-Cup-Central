import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MatchCard } from "@/components/MatchCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useMatches } from "@/hooks/useMatchData";
import { ROUNDS_ORDER, type Match } from "@/data/worldcup2026";

const FILTERS = ["All", "Group Stage", "Knockout", "Favorites"] as const;
type Filter = typeof FILTERS[number];

export default function ScheduleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>("All");
  const scrollY = useRef(new Animated.Value(0)).current;
  const { favoriteMatches } = useApp();
  const { matches, isLoading, isError, hasLive, lastUpdated, dataSource, refetch } = useMatches();
  const [refreshing, setRefreshing] = useState(false);

  const filteredMatches = useMemo<Match[]>(() => {
    if (filter === "Group Stage") return matches.filter((m) => m.group);
    if (filter === "Knockout") return matches.filter((m) => !m.group);
    if (filter === "Favorites") return matches.filter((m) => favoriteMatches.includes(m.id));
    return matches;
  }, [filter, favoriteMatches, matches]);

  const groupedByRound = useMemo(() => {
    const grouped: Record<string, Match[]> = {};
    for (const m of filteredMatches) {
      if (!grouped[m.round]) grouped[m.round] = [];
      grouped[m.round].push(m);
    }
    return grouped;
  }, [filteredMatches]);

  const sections = useMemo(() => {
    return ROUNDS_ORDER.filter((r) => groupedByRound[r]?.length).map((r) => ({
      round: r,
      matches: groupedByRound[r],
    }));
  }, [groupedByRound]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const topPad = Platform.OS === "web" ? 67 + 16 : 0;

  const formatLastUpdated = (iso: string | null) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 + 84 : 100,
        }}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: colors.navy, paddingTop: insets.top + topPad }]}>
          <Text style={styles.heroLabel}>FIFA World Cup</Text>
          <Text style={styles.heroTitle}>2026</Text>
          <Text style={styles.heroSubtitle}>🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 Mexico</Text>

          <View style={styles.heroStats}>
            <StatPill label="Teams" value="48" colors={colors} />
            <StatPill label="Matches" value="104" colors={colors} />
            <StatPill label="Venues" value="16" colors={colors} />
            <StatPill label="Days" value="39" colors={colors} />
          </View>

          {/* Live / data status bar */}
          <View style={styles.statusRow}>
            {hasLive && (
              <View style={[styles.livePill, { backgroundColor: colors.live }]}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE NOW</Text>
              </View>
            )}
            {dataSource !== "static" ? (
              <View style={styles.sourceRow}>
                <Ionicons name="wifi" size={11} color="#ffffff60" />
                <Text style={styles.sourceText}>
                  {dataSource === "cache" ? "cached" : "live"} · {formatLastUpdated(lastUpdated) ?? ""}
                </Text>
              </View>
            ) : isError ? (
              <View style={styles.sourceRow}>
                <Ionicons name="cloud-offline-outline" size={11} color="#ffffff60" />
                <Text style={styles.sourceText}>offline · static data</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Filter Pills */}
        <View style={[styles.filterRow, { borderBottomColor: colors.border }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: filter === f ? colors.primary : colors.muted,
                    borderRadius: 20,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        filter === f ? colors.primaryForeground : colors.mutedForeground,
                    },
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Loading state */}
        {isLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
              Fetching live data…
            </Text>
          </View>
        )}

        {/* Empty favorites */}
        {filter === "Favorites" && filteredMatches.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No saved matches
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
              Tap the bookmark on any match to save it here
            </Text>
          </View>
        ) : (
          sections.map(({ round, matches: sectionMatches }) => (
            <View key={round}>
              <SectionHeader
                title={round}
                subtitle={`${sectionMatches.length} match${sectionMatches.length > 1 ? "es" : ""}`}
              />
              {sectionMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </View>
          ))
        )}
      </Animated.ScrollView>
    </View>
  );
}

function StatPill({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.statPill}>
      <Text style={[styles.statValue, { color: colors.gold }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroLabel: {
    color: "#C9A84C80",
    fontSize: 13,
    fontWeight: "600" as const,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 8,
  },
  heroTitle: {
    color: "#C9A84C",
    fontSize: 56,
    fontWeight: "900" as const,
    letterSpacing: -2,
    lineHeight: 60,
  },
  heroSubtitle: {
    color: "#ffffff99",
    fontSize: 13,
    marginTop: 2,
    marginBottom: 16,
  },
  heroStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  statPill: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "800" as const },
  statLabel: { color: "#ffffff80", fontSize: 10, marginTop: 2 },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  liveText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800" as const,
    letterSpacing: 0.8,
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sourceText: {
    color: "#ffffff60",
    fontSize: 11,
  },
  filterRow: { borderBottomWidth: 1 },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterText: { fontSize: 13, fontWeight: "600" as const },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  loadingText: { fontSize: 13 },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700" as const, marginTop: 8 },
  emptySubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
});
