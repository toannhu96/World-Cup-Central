import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { GROUPS, TEAMS, Team } from "@/data/worldcup2026";

const CONFEDERATIONS = ["All", "UEFA", "CONMEBOL", "CONCACAF", "AFC", "CAF", "OFC"];

export default function TeamsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isFavoriteTeam, toggleFavoriteTeam } = useApp();
  const [search, setSearch] = useState("");
  const [confederation, setConfederation] = useState("All");

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;

  const allTeams = useMemo(() => {
    const seen = new Set<string>();
    const result: Team[] = [];
    for (const group of GROUPS) {
      for (const tid of group.teams) {
        if (!seen.has(tid)) {
          seen.add(tid);
          if (TEAMS[tid]) result.push(TEAMS[tid]);
        }
      }
    }
    return result;
  }, []);

  const filtered = useMemo(() => {
    return allTeams.filter((t) => {
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.shortName.toLowerCase().includes(search.toLowerCase());
      const matchConf = confederation === "All" || t.confederation === confederation;
      return matchSearch && matchConf;
    });
  }, [allTeams, search, confederation]);

  const renderTeam = ({ item: team }: { item: Team }) => {
    const fav = isFavoriteTeam(team.id);
    return (
      <View style={[styles.teamRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
        <View style={[styles.rankBadge, { backgroundColor: colors.muted }]}>
          <Text style={[styles.rankText, { color: colors.mutedForeground }]}>{team.fifaRanking}</Text>
        </View>
        <Text style={styles.flagBig}>{team.flag}</Text>
        <View style={styles.teamInfo}>
          <Text style={[styles.teamFullName, { color: colors.foreground }]}>{team.name}</Text>
          <View style={styles.teamMeta}>
            <Text style={[styles.confBadge, { color: colors.primary, backgroundColor: `${colors.primary}15` }]}>
              {team.confederation}
            </Text>
            <Text style={[styles.groupBadge, { color: colors.mutedForeground }]}>Group {team.group}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggleFavoriteTeam(team.id);
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name={fav ? "star" : "star-outline"} size={20} color={fav ? colors.gold : colors.mutedForeground} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerSection, { backgroundColor: colors.navy, paddingTop: topPad }]}>
        <Text style={styles.title}>48 Teams</Text>
        <Text style={styles.subtitle}>All qualified nations</Text>

        <View style={[styles.searchBar, { backgroundColor: "#ffffff15", borderRadius: colors.radius }]}>
          <Ionicons name="search" size={16} color="#ffffff60" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search team..."
            placeholderTextColor="#ffffff50"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="#ffffff60" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Confederation Filter */}
      <FlatList
        data={CONFEDERATIONS}
        keyExtractor={(c) => c}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.confList}
        renderItem={({ item: c }) => (
          <TouchableOpacity
            onPress={() => setConfederation(c)}
            style={[
              styles.confPill,
              { backgroundColor: confederation === c ? colors.primary : colors.muted, borderRadius: 20 },
            ]}
          >
            <Text style={[styles.confPillText, { color: confederation === c ? colors.primaryForeground : colors.mutedForeground }]}>
              {c}
            </Text>
          </TouchableOpacity>
        )}
        style={[styles.confRow, { borderBottomColor: colors.border }]}
      />

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={renderTeam}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === "web" ? 34 + 84 : 100, gap: 8 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No teams found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 4,
  },
  title: {
    color: "#C9A84C",
    fontSize: 26,
    fontWeight: "800" as const,
  },
  subtitle: {
    color: "#ffffff60",
    fontSize: 13,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#ffffff",
  },
  confRow: {
    borderBottomWidth: 1,
  },
  confList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  confPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  confPillText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
    borderWidth: 1,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 11,
    fontWeight: "700" as const,
  },
  flagBig: {
    fontSize: 32,
  },
  teamInfo: {
    flex: 1,
    gap: 4,
  },
  teamFullName: {
    fontSize: 15,
    fontWeight: "700" as const,
  },
  teamMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  confBadge: {
    fontSize: 10,
    fontWeight: "700" as const,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  groupBadge: {
    fontSize: 11,
  },
  emptyState: {
    paddingTop: 60,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
  },
});
