import { useCallback, useEffect, useState } from "react";
import { type Match } from "../constants/worldcup2026";
import { getStorage, setStorage } from "zmp-sdk/apis";
import { supabase } from "../lib/supabase";
import { useRecoilValue } from "recoil";
import { userState } from "../state";

const STORAGE_KEY = "wc2026_predictions_v1";

export interface Prediction {
  matchId: string;
  homeScore: number;
  awayScore: number;
  submittedAt: string;
}

export type PredictionOutcome = "exact" | "correct" | "wrong" | "pending";

export interface PredictionResult {
  points: 0 | 1 | 3;
  outcome: PredictionOutcome;
  label: string;
}

export function scorePrediction(pred: Prediction, match: Match): PredictionResult {
  if (
    match.status !== "finished" ||
    match.homeScore === undefined ||
    match.awayScore === undefined
  ) {
    return { points: 0, outcome: "pending", label: "Pending" };
  }

  if (pred.homeScore === match.homeScore && pred.awayScore === match.awayScore) {
    return { points: 3, outcome: "exact", label: "Exact! 🎯" };
  }

  const predWinner =
    pred.homeScore > pred.awayScore ? "home" : pred.homeScore < pred.awayScore ? "away" : "draw";
  const actualWinner =
    match.homeScore > match.awayScore
      ? "home"
      : match.homeScore < match.awayScore
      ? "away"
      : "draw";

  if (predWinner === actualWinner) {
    return { points: 1, outcome: "correct", label: "Correct ✅" };
  }

  return { points: 0, outcome: "wrong", label: "Wrong ❌" };
}

export function usePredictions() {
  const user = useRecoilValue(userState);
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const { [STORAGE_KEY]: raw } = await getStorage({ keys: [STORAGE_KEY] });
        if (raw) {
          setPredictions(JSON.parse(raw));
        }
      } catch (error) {
        console.error("Error loading predictions state:", error);
      }
      setLoaded(true);
    };
    loadState();
  }, []);

  const savePrediction = useCallback(async (matchId: string, homeScore: number, awayScore: number) => {
    const newPreds = {
      ...predictions,
      [matchId]: { matchId, homeScore, awayScore, submittedAt: new Date().toISOString() },
    };
    setPredictions(newPreds);
    try {
      await setStorage({
        data: { [STORAGE_KEY]: JSON.stringify(newPreds) },
      });
    } catch (error) {
      console.error("Error saving predictions state:", error);
    }
  }, [predictions]);

  const deletePrediction = useCallback(async (matchId: string) => {
    const newPreds = { ...predictions };
    delete newPreds[matchId];
    setPredictions(newPreds);
    try {
      await setStorage({
        data: { [STORAGE_KEY]: JSON.stringify(newPreds) },
      });
    } catch (error) {
      console.error("Error deleting prediction:", error);
    }
  }, [predictions]);

  const getPrediction = useCallback(
    (matchId: string): Prediction | undefined => predictions[matchId],
    [predictions]
  );

  const getStats = useCallback(
    (allMatches: Match[]) => {
      const preds = Object.values(predictions);
      let totalPoints = 0;
      let finished = 0;
      let correct = 0;

      for (const pred of preds) {
        const match = allMatches.find((m) => m.id === pred.matchId);
        if (!match || match.status !== "finished") continue;
        const result = scorePrediction(pred, match);
        finished++;
        totalPoints += result.points;
        if (result.outcome !== "wrong") {
          correct++;
          // Sync +20 pts to Supabase for correct predictions
          if (user?.id && user.id !== "guest") {
            supabase.from("point_logs").insert({
              user_id: user.id,
              action: "prediction_correct",
              points: 20,
              metadata: { matchId: match.id }
            }).then(({ error }) => {
              if (!error) {
                supabase.rpc("increment_points", { row_id: user.id, amount: 20 });
              }
            });
          }
        }
      }

      return {
        total: preds.length,
        totalPoints,
        finished,
        correct,
        accuracy: finished > 0 ? Math.round((correct / finished) * 100) : 0,
      };
    },
    [predictions]
  );

  return { predictions, savePrediction, deletePrediction, getPrediction, getStats, loaded };
}
