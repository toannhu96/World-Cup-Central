import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { useTrivia } from "@/hooks/useTrivia";

export function TriviaCard() {
  const colors = useColors();
  const {
    todayQuestion,
    hasAnsweredToday,
    todayAnswer,
    streak,
    totalCorrect,
    totalAnswered,
    answerToday,
  } = useTrivia();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    todayAnswer?.selectedIndex ?? null
  );
  const [showFact, setShowFact] = useState(hasAnsweredToday);
  const [scaleAnims] = useState(() => [0, 1, 2, 3].map(() => new Animated.Value(1)));

  const handleAnswer = (idx: number) => {
    if (hasAnsweredToday) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.sequence([
      Animated.timing(scaleAnims[idx], { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnims[idx], { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    setSelectedIndex(idx);
    answerToday(idx);
    setTimeout(() => setShowFact(true), 600);
    if (idx === todayQuestion.correctIndex) {
      setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 200);
    } else {
      setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error), 200);
    }
  };

  const effectiveSelected = hasAnsweredToday ? todayAnswer?.selectedIndex ?? selectedIndex : selectedIndex;
  const answered = hasAnsweredToday || selectedIndex !== null;
  const isCorrect = effectiveSelected === todayQuestion.correctIndex;

  const getOptionStyle = (idx: number) => {
    if (!answered) return { backgroundColor: colors.card, borderColor: colors.border };
    if (idx === todayQuestion.correctIndex)
      return { backgroundColor: `${colors.win}22`, borderColor: colors.win };
    if (idx === effectiveSelected && idx !== todayQuestion.correctIndex)
      return { backgroundColor: `${colors.loss}22`, borderColor: colors.loss };
    return { backgroundColor: colors.card, borderColor: colors.border };
  };

  const getOptionTextColor = (idx: number) => {
    if (!answered) return colors.foreground;
    if (idx === todayQuestion.correctIndex) return colors.win;
    if (idx === effectiveSelected && idx !== todayQuestion.correctIndex) return colors.loss;
    return colors.mutedForeground;
  };

  const streakEmoji = streak >= 14 ? "🔥🔥" : streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "📅";

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.navy, borderRadius: colors.radius }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerEmoji}>🧠</Text>
          <View>
            <Text style={[styles.headerTitle, { color: colors.gold }]}>Daily Trivia</Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              New question every day
            </Text>
          </View>
        </View>
        <View style={styles.streakBox}>
          <Text style={[styles.streakNumber, { color: colors.gold }]}>{streakEmoji} {streak}</Text>
          <Text style={[styles.streakLabel, { color: colors.mutedForeground }]}>day streak</Text>
        </View>
      </View>

      {/* Stats row */}
      {totalAnswered > 0 && (
        <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
          <StatMini label="Answered" value={String(totalAnswered)} colors={colors} />
          <StatMini label="Correct" value={String(totalCorrect)} colors={colors} />
          <StatMini
            label="Accuracy"
            value={`${totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%`}
            colors={colors}
          />
        </View>
      )}

      {/* Question */}
      <Text style={[styles.question, { color: colors.foreground }]}>{todayQuestion.question}</Text>

      {/* Options */}
      <View style={styles.options}>
        {todayQuestion.options.map((opt, idx) => (
          <Animated.View key={idx} style={{ transform: [{ scale: scaleAnims[idx] }] }}>
            <TouchableOpacity
              onPress={() => handleAnswer(idx)}
              disabled={answered}
              style={[styles.option, getOptionStyle(idx), { borderRadius: colors.radius / 2 }]}
            >
              <Text style={[styles.optionLetter, { color: getOptionTextColor(idx) }]}>
                {["A", "B", "C", "D"][idx]}
              </Text>
              <Text style={[styles.optionText, { color: getOptionTextColor(idx) }]} numberOfLines={2}>
                {opt}
              </Text>
              {answered && idx === todayQuestion.correctIndex && (
                <Ionicons name="checkmark-circle" size={18} color={colors.win} />
              )}
              {answered && idx === effectiveSelected && idx !== todayQuestion.correctIndex && (
                <Ionicons name="close-circle" size={18} color={colors.loss} />
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Result + Fun Fact */}
      {showFact && (
        <View
          style={[
            styles.factBox,
            {
              backgroundColor: isCorrect ? `${colors.win}15` : `${colors.loss}15`,
              borderColor: isCorrect ? `${colors.win}40` : `${colors.loss}40`,
              borderRadius: colors.radius / 2,
            },
          ]}
        >
          <Text style={[styles.factResult, { color: isCorrect ? colors.win : colors.loss }]}>
            {isCorrect ? "🎉 Correct! +1 streak" : "😅 Not quite!"}
          </Text>
          <Text style={[styles.factText, { color: colors.mutedForeground }]}>
            {todayQuestion.funFact}
          </Text>
        </View>
      )}

      {hasAnsweredToday && !showFact && (
        <TouchableOpacity onPress={() => setShowFact(true)}>
          <Text style={[styles.showFact, { color: colors.primary }]}>Show fun fact ›</Text>
        </TouchableOpacity>
      )}

      {answered && (
        <Text style={[styles.nextLabel, { color: colors.mutedForeground }]}>
          Next question tomorrow ·{" "}
          {new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </Text>
      )}
    </View>
  );
}

function StatMini({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.statMini}>
      <Text style={[styles.statMiniValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statMiniLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 4,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    margin: 0,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerEmoji: { fontSize: 26 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800" as const,
  },
  headerSub: { fontSize: 11, marginTop: 1 },
  streakBox: { alignItems: "flex-end" },
  streakNumber: {
    fontSize: 16,
    fontWeight: "800" as const,
  },
  streakLabel: { fontSize: 10 },
  statsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  statMini: { flex: 1, alignItems: "center" },
  statMiniValue: { fontSize: 16, fontWeight: "700" as const },
  statMiniLabel: { fontSize: 10, marginTop: 1 },
  question: {
    fontSize: 15,
    fontWeight: "700" as const,
    lineHeight: 22,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },
  options: {
    paddingHorizontal: 14,
    gap: 8,
    paddingBottom: 14,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderWidth: 1,
  },
  optionLetter: {
    fontSize: 13,
    fontWeight: "700" as const,
    width: 20,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "500" as const,
    flex: 1,
    lineHeight: 18,
  },
  factBox: {
    marginHorizontal: 14,
    marginBottom: 14,
    padding: 12,
    borderWidth: 1,
    gap: 4,
  },
  factResult: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  factText: {
    fontSize: 12,
    lineHeight: 18,
  },
  showFact: {
    fontSize: 13,
    fontWeight: "600" as const,
    textAlign: "center",
    paddingVertical: 8,
  },
  nextLabel: {
    fontSize: 11,
    textAlign: "center",
    paddingBottom: 12,
  },
});
