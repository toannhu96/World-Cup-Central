import React from "react";
import { Box, Text, Icon } from "zmp-ui";
import { MatchStats as IMatchStats } from "@/types";
import { useTranslation } from "react-i18next";

interface MatchStatsProps {
  stats: IMatchStats;
}

export const MatchStats: React.FC<MatchStatsProps> = ({ stats }) => {
  const { t } = useTranslation();

  const STAT_KEYS: Record<string, string> = {
    "Possession": "stat_possession",
    "Shots": "stat_shots",
    "Shots on Goal": "stat_shotsOnGoal",
    "Fouls": "stat_fouls",
    "Corners": "stat_corners",
    "Offsides": "stat_offsides",
    "Saves": "stat_saves"
  };

  if (!stats || !stats.home) {
    return (
      <Box className="py-20 px-10 text-center">
        <Icon icon="zi-info" size={48} className="text-gray-200 mb-4" />
        <Text className="text-gray-400">{t('common.no_stats')}</Text>
      </Box>
    );
  }

  const statKeys = Object.keys(stats.home);

  const parseStat = (val: string) => {
    return parseFloat(val.replace("%", "")) || 0;
  };

  return (
    <Box className="py-8 px-6">
      {statKeys.map((key) => {
        const homeVal = stats.home[key];
        const awayVal = stats.away[key];
        const h = parseStat(homeVal);
        const a = parseStat(awayVal);
        const total = h + a || 1;
        const homePercent = (h / total) * 100;

        return (
          <Box key={key} className="mb-6 last:mb-0">
            <Box flex justifyContent="space-between" className="mb-2">
              <Text size="small" className="font-bold">{homeVal}</Text>
              <Text size="xxxSmall" className="uppercase tracking-widest text-gray-400 font-bold">
                {t(`common.${STAT_KEYS[key] || key}`)}
              </Text>
              <Text size="small" className="font-bold">{awayVal}</Text>
            </Box>
            <Box className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
              <Box 
                className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                style={{ width: `${homePercent}%` }} 
              />
              <Box 
                className="h-full bg-red-600 transition-all duration-1000 ease-out" 
                style={{ width: `${100 - homePercent}%` }} 
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
