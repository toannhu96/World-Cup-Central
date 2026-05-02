import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import { getTodayDateStr, getTodayQuestionIndex, TRIVIA_QUESTIONS } from "@/data/trivia";

const STORAGE_KEY = "wc2026_trivia_v1";

interface TriviaState {
  streak: number;
  totalCorrect: number;
  lastAnsweredDate: string | null;
  answers: Record<string, { selectedIndex: number; correct: boolean }>;
}

const DEFAULT_STATE: TriviaState = {
  streak: 0,
  totalCorrect: 0,
  lastAnsweredDate: null,
  answers: {},
};

export function useTrivia() {
  const [state, setState] = useState<TriviaState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setState(JSON.parse(raw));
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const persist = (next: TriviaState) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const todayStr = getTodayDateStr();
  const questionIndex = getTodayQuestionIndex();
  const todayQuestion = TRIVIA_QUESTIONS[questionIndex];
  const hasAnsweredToday = state.lastAnsweredDate === todayStr;
  const todayAnswer = state.answers[todayStr] ?? null;

  const answerToday = useCallback(
    (selectedIndex: number) => {
      if (hasAnsweredToday) return;
      const correct = selectedIndex === todayQuestion.correctIndex;

      setState((prev) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        const streakContinued = prev.lastAnsweredDate === yesterdayStr;

        const next: TriviaState = {
          ...prev,
          streak: correct ? (streakContinued ? prev.streak + 1 : 1) : 0,
          totalCorrect: correct ? prev.totalCorrect + 1 : prev.totalCorrect,
          lastAnsweredDate: todayStr,
          answers: {
            ...prev.answers,
            [todayStr]: { selectedIndex, correct },
          },
        };
        persist(next);
        return next;
      });
    },
    [hasAnsweredToday, todayQuestion, todayStr]
  );

  const totalAnswered = Object.keys(state.answers).length;

  return {
    loaded,
    todayQuestion,
    questionIndex,
    hasAnsweredToday,
    todayAnswer,
    streak: state.streak,
    totalCorrect: state.totalCorrect,
    totalAnswered,
    answerToday,
  };
}
