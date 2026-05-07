import React, { useState } from "react";
import { Box, Text, Icon, Button } from "zmp-ui";
import { useColors } from "@/hooks/useColors";
import { useTrivia } from "@/hooks/useTrivia";
import { trackEvent } from "../utils/analytics";

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

  const handleAnswer = (idx: number) => {
    if (hasAnsweredToday) return;
    setSelectedIndex(idx);
    answerToday(idx);
    trackEvent("trivia_answer", "engagement", idx === todayQuestion.correctIndex ? "correct" : "incorrect");
    setTimeout(() => setShowFact(true), 600);
  };

  const effectiveSelected = hasAnsweredToday ? todayAnswer?.selectedIndex ?? selectedIndex : selectedIndex;
  const answered = hasAnsweredToday || selectedIndex !== null;
  const isCorrect = effectiveSelected === todayQuestion.correctIndex;

  const getOptionClass = (idx: number) => {
    if (!answered) return "bg-white border-gray-100";
    if (idx === todayQuestion.correctIndex)
      return "bg-green-50 border-green-500 text-green-700";
    if (idx === effectiveSelected && idx !== todayQuestion.correctIndex)
      return "bg-red-50 border-red-500 text-red-700";
    return "bg-white border-gray-100 opacity-50";
  };

  const streakEmoji = streak >= 14 ? "🔥🔥" : streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "📅";

  return (
    <Box className="m-4 overflow-hidden border border-gray-100 rounded-2xl bg-white shadow-sm">
      {/* Header */}
      <Box className="flex flex-row items-center justify-between p-4 bg-navy-900" style={{ backgroundColor: '#001f3f' }}>
        <Box className="flex flex-row items-center gap-3">
          <Text className="text-2xl">🧠</Text>
          <Box>
            <Text className="font-bold text-yellow-500">Daily Trivia</Text>
            <Text size="xxxSmall" className="text-white/60">New question every day</Text>
          </Box>
        </Box>
        <Box className="text-right">
          <Text className="font-bold text-yellow-500">{streakEmoji} {streak}</Text>
          <Text size="xxxSmall" className="text-white/60">day streak</Text>
        </Box>
      </Box>

      {/* Stats row */}
      {totalAnswered > 0 && (
        <Box flex className="border-b border-gray-50 py-2">
          <StatMini label="Answered" value={String(totalAnswered)} />
          <StatMini label="Correct" value={String(totalCorrect)} />
          <StatMini
            label="Accuracy"
            value={`${totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%`}
          />
        </Box>
      )}

      {/* Question */}
      <Text className="font-bold p-4 text-gray-800 leading-tight">
        {todayQuestion.question}
      </Text>

      {/* Options */}
      <Box className="px-4 pb-4 flex flex-col gap-2">
        {todayQuestion.options.map((opt, idx) => (
          <Box
            key={idx}
            onClick={() => handleAnswer(idx)}
            className={`flex flex-row items-center gap-3 p-3 border rounded-xl transition-all ${getOptionClass(idx)} ${!answered ? "active:scale-95 cursor-pointer" : ""}`}
          >
            <Text className="font-bold w-5">
              {["A", "B", "C", "D"][idx]}
            </Text>
            <Text className="flex-1 text-sm font-medium">
              {opt}
            </Text>
            {answered && idx === todayQuestion.correctIndex && (
              <Icon icon="zi-check-circle-solid" className="text-green-500" size={18} />
            )}
            {answered && idx === effectiveSelected && idx !== todayQuestion.correctIndex && (
              <Icon icon="zi-close-circle-solid" className="text-red-500" size={18} />
            )}
          </Box>
        ))}
      </Box>

      {/* Result + Fun Fact */}
      {showFact && (
        <Box className={`mx-4 mb-4 p-3 border rounded-xl flex flex-col gap-1 ${isCorrect ? "bg-green-50/50 border-green-100" : "bg-red-50/50 border-red-100"}`}>
          <Text className={`font-bold text-sm ${isCorrect ? "text-green-600" : "text-red-600"}`}>
            {isCorrect ? "🎉 Correct! +1 streak" : "😅 Not quite!"}
          </Text>
          <Text size="xxxSmall" className="text-gray-500 leading-normal italic">
            {todayQuestion.funFact}
          </Text>
        </Box>
      )}

      {hasAnsweredToday && !showFact && (
        <Box onClick={() => setShowFact(true)} className="py-2 text-center">
          <Text size="small" className="text-blue-600 font-semibold cursor-pointer">Show fun fact ›</Text>
        </Box>
      )}

      {answered && (
        <Text size="xxxSmall" className="text-center pb-3 text-gray-400">
          Next question tomorrow
        </Text>
      )}
    </Box>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <Box flex flexDirection="column" alignItems="center" className="flex-1">
      <Text className="font-bold text-gray-700">{value}</Text>
      <Text size="xxxSmall" className="text-gray-400 uppercase tracking-tighter">{label}</Text>
    </Box>
  );
}
