import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
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
import { MATCHES, ROUNDS_ORDER, Match } from "@/data/worldcup2026";

const FILTERS = ["All", "Group Stage", "Knockout", "Favorites"] as const;
type Filter = typeof FILTERS[number];

const ROUNDS_GROUPED = ROUNDS_ORDER.filter((r) => r !== "Group Stage");

export default function ScheduleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>("All");
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const { favoriteMatches } = useApp();

  const filteredMatches = useMemo<Match[]>(() => {
    if (filter === "Group Stage") return MATCHES.filter((m) => m.group);
    if (filter === "Knockout") return MATCHES.filter((m) => !m.group);
    if (filter === "Favorites") return MATCHES.filter((m) => favoriteMatches.includes(m.id));
    return MATCHES;
  }, [filter, favoriteMatches]);

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const headerHeight = Platform.OS === "web" ? 67 : 0;
  const topPad = Platform.OS === "web" ? headerHeight + 16 : 16;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : 100 }}
      >
        {/* Hero */}
        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.navy,
              paddingTop: insets.top + topPad,
            },
          ]}
        >
          <Text style={styles.heroLabel}>FIFA World Cup</Text>
          <Text style={styles.heroTitle}>2026</Text>
          <Text style={styles.heroSubtitle}>🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 Mexico</Text>
          <View style={styles.heroStats}>
            <StatPill label="Teams" value="48" colors={colors} />
            <StatPill label="Matches" value="104" colors={colors} />
            <StatPill label="Venues" value="16" colors={colors} />
            <StatPill label="Days" value="39" colors={colors} />
          </View>
        </View>

        {/* Filter Pills */}
        <View style={[styles.filterRow, { borderBottomColor: colors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
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
                    { color: filter === f ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {filter === "Favorites" && filteredMatches.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No saved matches</Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
              Tap the bookmark on any match to save it here
            </Text>
          </View>
        ) : (
          sections.map(({ round, matches }) => (
            <View key={round}>
              <SectionHeader title={round} subtitle={`${matches.length} match${matches.length > 1 ? "es" : ""}`} />
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </View>
          ))
        )}
      </Animated.ScrollView>
    </View>
  );
}

function StatPill({ label, value, colors }: { label: string; value: string; colors: any }) {
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
    paddingBottom: 24,
  },
  heroLabel: {
    color: "#C9A84C80",
    fontSize: 13,
    fontWeight: "600" as const,
    letterSpacing: 2,
    textTransform: "uppercase",
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
    gap: 12,
  },
  statPill: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800" as const,
  },
  statLabel: {
    color: "#ffffff80",
    fontSize: 10,
    marginTop: 2,
  },
  filterRow: {
    borderBottomWidth: 1,
    backgroundColor: "transparent",
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
