import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import { type Match } from "@/data/worldcup2026";

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
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setPredictions(JSON.parse(raw));
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const savePrediction = useCallback((matchId: string, homeScore: number, awayScore: number) => {
    setPredictions((prev) => {
      const next: Record<string, Prediction> = {
        ...prev,
        [matchId]: { matchId, homeScore, awayScore, submittedAt: new Date().toISOString() },
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const deletePrediction = useCallback((matchId: string) => {
    setPredictions((prev) => {
      const next = { ...prev };
      delete next[matchId];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

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
        if (result.outcome !== "wrong") correct++;
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
