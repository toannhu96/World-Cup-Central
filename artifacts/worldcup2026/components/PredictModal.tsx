import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import { TEAMS, type Match } from "@/data/worldcup2026";

interface PredictModalProps {
  match: Match;
  visible: boolean;
  onClose: () => void;
  onSubmit: (homeScore: number, awayScore: number) => void;
  initialHome?: number;
  initialAway?: number;
}

function ScoreStepper({
  value,
  onChange,
  colors,
}: {
  value: number;
  onChange: (v: number) => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onChange(Math.max(0, value - 1));
        }}
        style={[styles.stepBtn, { backgroundColor: colors.muted, borderRadius: 20 }]}
      >
        <Ionicons name="remove" size={20} color={colors.foreground} />
      </TouchableOpacity>

      <Text style={[styles.stepValue, { color: colors.gold }]}>{value}</Text>

      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onChange(Math.min(20, value + 1));
        }}
        style={[styles.stepBtn, { backgroundColor: colors.muted, borderRadius: 20 }]}
      >
        <Ionicons name="add" size={20} color={colors.foreground} />
      </TouchableOpacity>
    </View>
  );
}

export function PredictModal({
  match,
  visible,
  onClose,
  onSubmit,
  initialHome = 1,
  initialAway = 1,
}: PredictModalProps) {
  const colors = useColors();
  const [homeScore, setHomeScore] = useState(initialHome);
  const [awayScore, setAwayScore] = useState(initialAway);

  const homeTeam = TEAMS[match.homeTeam];
  const awayTeam = TEAMS[match.awayTeam];

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSubmit(homeScore, awayScore);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.sheet, { backgroundColor: colors.navy, borderColor: colors.border }]}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <Text style={[styles.title, { color: colors.gold }]}>Predict the Score</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {match.date} · {match.city}
          </Text>

          {/* Scoring legend */}
          <View style={[styles.legend, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            <LegendItem pts="3" label="Exact scoreline" colors={colors} />
            <LegendItem pts="1" label="Correct winner / draw" colors={colors} />
            <LegendItem pts="0" label="Wrong result" colors={colors} />
          </View>

          {/* Teams and steppers */}
          <View style={styles.teamsRow}>
            <View style={styles.teamCol}>
              <Text style={{ fontSize: 40 }}>{homeTeam?.flag ?? "🏳️"}</Text>
              <Text style={[styles.teamLabel, { color: colors.foreground }]}>
                {homeTeam?.shortName ?? match.homeTeam}
              </Text>
              <ScoreStepper value={homeScore} onChange={setHomeScore} colors={colors} />
            </View>

            <Text style={[styles.vs, { color: colors.mutedForeground }]}>–</Text>

            <View style={styles.teamCol}>
              <Text style={{ fontSize: 40 }}>{awayTeam?.flag ?? "🏳️"}</Text>
              <Text style={[styles.teamLabel, { color: colors.foreground }]}>
                {awayTeam?.shortName ?? match.awayTeam}
              </Text>
              <ScoreStepper value={awayScore} onChange={setAwayScore} colors={colors} />
            </View>
          </View>

          {/* Preview */}
          <Text style={[styles.preview, { color: colors.gold }]}>
            Your prediction: {homeTeam?.shortName ?? match.homeTeam} {homeScore} –{" "}
            {awayScore} {awayTeam?.shortName ?? match.awayTeam}
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
            >
              <Ionicons name="checkmark-circle" size={18} color={colors.primaryForeground} />
              <Text style={[styles.submitText, { color: colors.primaryForeground }]}>
                Lock It In
              </Text>
            </TouchableOpacity>
          </View>

          {Platform.OS === "ios" && <View style={{ height: 24 }} />}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function LegendItem({
  pts,
  label,
  colors,
}: {
  pts: string;
  label: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.ptsBadge, { backgroundColor: `${colors.primary}25` }]}>
        <Text style={[styles.ptsText, { color: colors.primary }]}>+{pts}</Text>
      </View>
      <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000070",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800" as const,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  legend: {
    padding: 12,
    marginBottom: 20,
    gap: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ptsBadge: {
    width: 32,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  ptsText: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
  legendLabel: {
    fontSize: 12,
  },
  teamsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  teamCol: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  teamLabel: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  vs: {
    fontSize: 28,
    fontWeight: "300" as const,
    paddingBottom: 20,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stepBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  stepValue: {
    fontSize: 32,
    fontWeight: "900" as const,
    minWidth: 36,
    textAlign: "center",
  },
  preview: {
    fontSize: 14,
    fontWeight: "600" as const,
    textAlign: "center",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  submitBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "700" as const,
  },
});
