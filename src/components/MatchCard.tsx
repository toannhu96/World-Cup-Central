import React, { useEffect, useState } from "react";
import { Box, Text, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { usePredictions, scorePrediction } from "@/hooks/usePredictions";
import { PredictModal } from "@/components/PredictModal";
import { Match, TEAMS, getTimeUntilMatch } from "@/constants/worldcup2026";

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

function CountdownTimer({ match }: { match: Match }) {
  const [countdown, setCountdown] = useState(getTimeUntilMatch(match));
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMatch(match));
    }, 1000);
    return () => clearInterval(timer);
  }, [match]);

  if (!countdown) return null;

  if (countdown.days > 7) {
    return (
      <Text size="xxxSmall" className="text-gray-400">
        {t('common.days_away', { count: countdown.days })}
      </Text>
    );
  }

  return (
    <Text size="xxxSmall" style={{ color: "#FFD700" }}>
      {countdown.days > 0 ? `${t('common.days_away', { count: countdown.days })} ` : ""}
      {String(countdown.hours).padStart(2, "0")}:{String(countdown.minutes).padStart(2, "0")}:{String(countdown.seconds).padStart(2, "0")}
    </Text>
  );
}

export function MatchCard({ match, compact = false }: MatchCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getPrediction, savePrediction } = usePredictions();
  const [showPredict, setShowPredict] = useState(false);

  const homeTeam = TEAMS[match.homeTeam];
  const awayTeam = TEAMS[match.awayTeam];
  const isFinished = match.status === "finished";
  const isLive = match.status === "live";
  const isUpcoming = match.status === "upcoming";

  const prediction = getPrediction(match.id);
  const predResult = prediction && isFinished ? scorePrediction(prediction, match) : null;

  const handlePress = () => {
    navigate(`/match/${match.id}`);
  };

  const handlePredict = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPredict(true);
  };

  const getScoreColor = (home?: number, away?: number, isHome?: boolean) => {
    if (home === undefined || away === undefined) return "inherit";
    if (isHome) return home > away ? "#4CAF50" : home < away ? "#F44336" : "#757575";
    return away > home ? "#4CAF50" : away < home ? "#F44336" : "#757575";
  };

  const outcomeColor = predResult
    ? predResult.outcome === "exact"
      ? "#4CAF50"
      : predResult.outcome === "correct"
      ? "#FFD700"
      : "#F44336"
    : "#007AFF";

  const ROUND_KEYS: Record<string, string> = {
    "Group Stage": "round_group_stage",
    "Round of 32": "round_of_32",
    "Round of 16": "round_of_16",
    "Quarterfinal": "round_quarterfinal",
    "Semifinal": "round_semifinal",
    "Third Place": "round_third_place",
    "Final": "round_final"
  };

  return (
    <>
      <Box
        onClick={handlePress}
        className={`mx-4 my-2 p-4 rounded-[24px] glass-morphism shadow-xl overflow-hidden relative active:scale-[0.98] transition-all duration-200 ${isLive ? "border-red-500/50 border-2" : ""}`}
      >
        {isLive && (
          <Box className="absolute top-2.5 left-3.5 px-1.5 py-0.5 bg-red-500 rounded text-white uppercase text-[9px] font-extrabold tracking-wider">
            {t('common.live')}
          </Box>
        )}

        <Box flex justifyContent="space-between" alignItems="flex-start" className="mb-3">
          <Box>
            <Text className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600/70">
              {t(`common.${ROUND_KEYS[match.round]}`)}
            </Text>
            <Text className="text-[11px] text-gray-500 font-medium">{match.city} · {match.date}</Text>
          </Box>
        </Box>

        <Box flex alignItems="center" justifyContent="space-between" className="mb-3 px-1">
          <Box flex flexDirection="column" alignItems="center" className="flex-1 gap-1">
            <Text className="text-3xl">{homeTeam?.flag ?? "🏳️"}</Text>
            <Text size="small" className="font-bold text-center truncate w-full text-gray-800">
              {homeTeam?.shortName ?? match.homeTeam}
            </Text>
          </Box>

          <Box flex flexDirection="column" alignItems="center" className="flex-1">
            {isFinished || isLive ? (
              <Box flex alignItems="center" className="gap-1.5">
                <Text className="text-3xl font-extrabold" style={{ color: isFinished ? getScoreColor(match.homeScore, match.awayScore, true) : "inherit" }}>
                  {match.homeScore ?? 0}
                </Text>
                <Text className="text-xl font-light text-gray-400">–</Text>
                <Text className="text-3xl font-extrabold" style={{ color: isFinished ? getScoreColor(match.homeScore, match.awayScore, false) : "inherit" }}>
                  {match.awayScore ?? 0}
                </Text>
              </Box>
            ) : (
              <Box flex flexDirection="column" alignItems="center" className="gap-0.5">
                <Text className="text-lg font-bold">{match.time}</Text>
                <CountdownTimer match={match} />
              </Box>
            )}
          </Box>

          <Box flex flexDirection="column" alignItems="center" className="flex-1 gap-1">
            <Text className="text-3xl">{awayTeam?.flag ?? "🏳️"}</Text>
            <Text size="small" className="font-bold text-center truncate w-full text-gray-800">
              {awayTeam?.shortName ?? match.awayTeam}
            </Text>
          </Box>
        </Box>

        {match.group && (
          <Box className="mx-auto mb-2 px-2.5 py-0.5 bg-gray-100 rounded-full">
            <Text className="text-[11px] font-semibold text-gray-500">{t('common.group', { group: match.group })}</Text>
          </Box>
        )}

        {isUpcoming && (
          <Box
            onClick={handlePredict}
            flex
            alignItems="center"
            className="gap-1.5 px-3.5 py-2.5 border-t border-gray-50 bg-opacity-5"
            style={{ backgroundColor: prediction ? "rgba(0, 122, 255, 0.05)" : "transparent" }}
          >
            <Icon icon="zi-edit" size={14} className={prediction ? "text-blue-500" : "text-gray-400"} />
            <Text size="xSmall" className={`flex-1 font-medium ${prediction ? "text-blue-500" : "text-gray-400"}`}>
              {prediction
                ? t('common.your_pick', { homeScore: prediction.homeScore, awayScore: prediction.awayScore })
                : t('common.predict_score')}
            </Text>
            <Icon icon="zi-chevron-right" size={12} className={prediction ? "text-blue-500" : "text-gray-400"} />
          </Box>
        )}

        {isFinished && prediction && predResult && (
          <Box
            flex
            alignItems="center"
            className="gap-1.5 px-3.5 py-2 border-t border-gray-50"
            style={{ backgroundColor: `${outcomeColor}12` }}
          >
            <Text size="xSmall" className="font-bold mr-1" style={{ color: outcomeColor }}>
              {t(predResult.label)}
            </Text>
            <Text className="text-[11px] flex-1 text-gray-500">
              {t('common.you_predicted', { homeScore: prediction.homeScore, awayScore: prediction.awayScore, points: predResult.points })}
            </Text>
          </Box>
        )}
      </Box>

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
