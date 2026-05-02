import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { usePredictions, scorePrediction } from "@/hooks/usePredictions";
import { PredictModal } from "@/components/PredictModal";
import { Match, TEAMS, getTimeUntilMatch } from "@/data/worldcup2026";

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

function CountdownTimer({ match }: { match: Match }) {
  const colors = useColors();
  const [countdown, setCountdown] = useState(getTimeUntilMatch(match));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMatch(match));
    }, 1000);
    return () => clearInterval(timer);
  }, [match]);

  if (!countdown) return null;

  if (countdown.days > 7) {
    return (
      <Text style={[styles.countdownText, { color: colors.mutedForeground }]}>
        {countdown.days}d away
      </Text>
    );
  }

  return (
    <Text style={[styles.countdownText, { color: colors.gold }]}>
      {countdown.days > 0 ? `${countdown.days}d ` : ""}
      {String(countdown.hours).padStart(2, "0")}:{String(countdown.minutes).padStart(2, "0")}:{String(countdown.seconds).padStart(2, "0")}
    </Text>
  );
}

export function MatchCard({ match, compact = false }: MatchCardProps) {
  const colors = useColors();
  const { isFavoriteMatch, toggleFavoriteMatch } = useApp();
  const { getPrediction, savePrediction } = usePredictions();
  const isFav = isFavoriteMatch(match.id);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [showPredict, setShowPredict] = useState(false);

  const homeTeam = TEAMS[match.homeTeam];
  const awayTeam = TEAMS[match.awayTeam];
  const isFinished = match.status === "finished";
  const isLive = match.status === "live";
  const isUpcoming = match.status === "upcoming";

  const prediction = getPrediction(match.id);
  const predResult = prediction && isFinished ? scorePrediction(prediction, match) : null;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    router.push({ pathname: "/match/[id]", params: { id: match.id } } as never);
  };

  const handleFav = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavoriteMatch(match.id);
  };

  const handlePredict = (e: any) => {
    e.stopPropagation?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowPredict(true);
  };

  const getScoreColor = (home?: number, away?: number, isHome?: boolean) => {
    if (home === undefined || away === undefined) return colors.foreground;
    if (isHome) return home > away ? colors.win : home < away ? colors.loss : colors.draw;
    return away > home ? colors.win : away < home ? colors.loss : colors.draw;
  };

  const outcomeColor = predResult
    ? predResult.outcome === "exact"
      ? colors.win
      : predResult.outcome === "correct"
      ? colors.gold
      : colors.loss
    : colors.primary;

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.85}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: isLive ? colors.live : colors.border,
              borderWidth: isLive ? 1.5 : 1,
              borderRadius: colors.radius,
            },
          ]}
        >
          {isLive && (
            <View style={[styles.liveBadge, { backgroundColor: colors.live }]}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          )}

          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.roundText, { color: colors.mutedForeground }]}>{match.round}</Text>
              <Text style={[styles.venueText, { color: colors.mutedForeground }]}>{match.city} · {match.date}</Text>
            </View>
            <TouchableOpacity onPress={handleFav} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons
                name={isFav ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isFav ? colors.gold : colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.teamsRow}>
            <View style={styles.teamSide}>
              <Text style={styles.teamFlag}>{homeTeam?.flag ?? "🏳️"}</Text>
              <Text style={[styles.teamName, { color: colors.foreground }]} numberOfLines={1}>
                {homeTeam?.shortName ?? match.homeTeam}
              </Text>
            </View>

            <View style={styles.scoreCenter}>
              {isFinished || isLive ? (
                <View style={styles.scoreRow}>
                  <Text style={[styles.score, { color: isFinished ? getScoreColor(match.homeScore, match.awayScore, true) : colors.foreground }]}>
                    {match.homeScore ?? 0}
                  </Text>
                  <Text style={[styles.scoreSeparator, { color: colors.mutedForeground }]}>–</Text>
                  <Text style={[styles.score, { color: isFinished ? getScoreColor(match.homeScore, match.awayScore, false) : colors.foreground }]}>
                    {match.awayScore ?? 0}
                  </Text>
                </View>
              ) : (
                <View style={styles.vsContainer}>
                  <Text style={[styles.vsText, { color: colors.mutedForeground }]}>{match.time}</Text>
                  <CountdownTimer match={match} />
                </View>
              )}
            </View>

            <View style={[styles.teamSide, styles.teamRight]}>
              <Text style={styles.teamFlag}>{awayTeam?.flag ?? "🏳️"}</Text>
              <Text style={[styles.teamName, { color: colors.foreground }]} numberOfLines={1}>
                {awayTeam?.shortName ?? match.awayTeam}
              </Text>
            </View>
          </View>

          {match.group && (
            <View style={[styles.groupBadge, { backgroundColor: colors.muted }]}>
              <Text style={[styles.groupBadgeText, { color: colors.mutedForeground }]}>Group {match.group}</Text>
            </View>
          )}

          {/* Prediction row */}
          {isUpcoming && (
            <TouchableOpacity
              onPress={handlePredict}
              style={[
                styles.predictRow,
                {
                  borderTopColor: colors.border,
                  backgroundColor: prediction ? `${colors.primary}10` : "transparent",
                },
              ]}
            >
              <Ionicons
                name={prediction ? "stats-chart" : "stats-chart-outline"}
                size={13}
                color={prediction ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.predictText,
                  { color: prediction ? colors.primary : colors.mutedForeground },
                ]}
              >
                {prediction
                  ? `Your pick: ${prediction.homeScore}–${prediction.awayScore} · Tap to change`
                  : "Predict the score"}
              </Text>
              <Ionicons name="chevron-forward" size={12} color={prediction ? colors.primary : colors.mutedForeground} />
            </TouchableOpacity>
          )}

          {/* Prediction result for finished matches */}
          {isFinished && prediction && predResult && (
            <View
              style={[
                styles.predictRow,
                {
                  borderTopColor: colors.border,
                  backgroundColor: `${outcomeColor}12`,
                },
              ]}
            >
              <Text style={[styles.predResultLabel, { color: outcomeColor }]}>
                {predResult.label}
              </Text>
              <Text style={[styles.predResultDetail, { color: colors.mutedForeground }]}>
                You predicted {prediction.homeScore}–{prediction.awayScore} · +{predResult.points} pts
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      <PredictModal
        match={match}
        visible={showPredict}
        onClose={() => setShowPredict(false)}
        onSubmit={(h, a) => savePrediction(match.id, h, a)}
        initialHome={prediction?.homeScore ?? 1}
        initialAway={prediction?.awayScore ?? 1}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  liveBadge: {
    position: "absolute",
    top: 10,
    left: 14,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800" as const,
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 14,
    paddingBottom: 12,
  },
  roundText: {
    fontSize: 11,
    fontWeight: "600" as const,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  venueText: {
    fontSize: 11,
    marginTop: 2,
  },
  teamsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  teamSide: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  teamRight: {
    alignItems: "center",
  },
  teamFlag: {
    fontSize: 32,
  },
  teamName: {
    fontSize: 13,
    fontWeight: "600" as const,
    textAlign: "center",
  },
  scoreCenter: {
    flex: 1,
    alignItems: "center",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  score: {
    fontSize: 28,
    fontWeight: "800" as const,
  },
  scoreSeparator: {
    fontSize: 20,
    fontWeight: "300" as const,
  },
  vsContainer: {
    alignItems: "center",
    gap: 2,
  },
  vsText: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  countdownText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  groupBadge: {
    alignSelf: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  groupBadgeText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  predictRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  predictText: {
    fontSize: 12,
    fontWeight: "500" as const,
    flex: 1,
  },
  predResultLabel: {
    fontSize: 12,
    fontWeight: "700" as const,
    marginRight: 6,
  },
  predResultDetail: {
    fontSize: 11,
    flex: 1,
  },
});
