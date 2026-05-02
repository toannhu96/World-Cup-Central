import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { MatchCard } from "@/components/MatchCard";
import { useColors } from "@/hooks/useColors";
import { useMatches } from "@/hooks/useMatchData";
import { TEAMS } from "@/data/worldcup2026";

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { favoriteTeams, favoriteMatches, toggleFavoriteTeam, notificationsEnabled, toggleNotifications } = useApp();
  const { matches } = useMatches();
  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;

  const favMatches = matches.filter((m) => favoriteMatches.includes(m.id));
  const favTeamMatches = matches.filter(
    (m) => favoriteTeams.includes(m.homeTeam) || favoriteTeams.includes(m.awayTeam)
  );
  const favTeams = favoriteTeams.map((id) => TEAMS[id]).filter(Boolean);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.navy, paddingTop: topPad }]}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>Your teams & matches</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : 100 }}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Favorite Teams */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Favorite Teams</Text>
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

        {/* Upcoming matches for fav teams */}
        {favTeams.length > 0 && favTeamMatches.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Next Matches</Text>
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

        {/* World Cup Info */}
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
  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 16,
    marginBottom: 0,
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
  notifTitle: {
    fontSize: 15,
    fontWeight: "700" as const,
  },
  notifSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  emptyHint: {
    fontSize: 12,
  },
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
  chipName: {
    fontSize: 13,
    fontWeight: "700" as const,
  },
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
