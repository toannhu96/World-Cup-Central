import { useCallback, useEffect, useState } from "react";
import { getTodayDateStr, getTodayQuestion, getTodayQuestionIndex, SHUFFLED_QUESTIONS } from "../constants/trivia";
import { getStorage, setStorage } from "zmp-sdk/apis";
import { supabase } from "../lib/supabase";
import { useRecoilValue } from "recoil";
import { userState } from "../state";

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
  const user = useRecoilValue(userState);
  const [state, setState] = useState<TriviaState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const { [STORAGE_KEY]: raw } = await getStorage({ keys: [STORAGE_KEY] });
        if (raw) {
          setState(JSON.parse(raw));
        }
      } catch (error) {
        console.error("Error loading trivia state:", error);
      }
      setLoaded(true);
    };
    loadState();
  }, []);

  const persist = async (next: TriviaState) => {
    try {
      await setStorage({
        data: { [STORAGE_KEY]: JSON.stringify(next) },
      });
    } catch (error) {
      console.error("Error saving trivia state:", error);
    }
  };

  const todayStr = getTodayDateStr();
  const questionIndex = getTodayQuestionIndex();
  const todayQuestion = getTodayQuestion();
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
        
        // Sync to Supabase if correct
        if (correct && user?.id && user.id !== "guest") {
          supabase.from("point_logs").insert({
            user_id: user.id,
            action: "trivia_correct",
            points: 10,
            metadata: { questionDate: todayStr }
          }).then(({ error }) => {
            if (!error) {
              supabase.rpc("increment_points", { row_id: user.id, amount: 10 });
            }
          });
        }

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
    totalQuestions: SHUFFLED_QUESTIONS.length,
    hasAnsweredToday,
    todayAnswer,
    streak: state.streak,
    totalCorrect: state.totalCorrect,
    totalAnswered,
    answerToday,
  };
}
