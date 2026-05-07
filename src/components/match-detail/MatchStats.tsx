import React from "react";
import { Box, Text, Icon } from "zmp-ui";
import { MatchStats as IMatchStats } from "@/types";

interface MatchStatsProps {
  stats: IMatchStats;
}

export const MatchStats: React.FC<MatchStatsProps> = ({ stats }) => {
  if (!stats || !stats.home) {
    return (
      <Box className="py-20 px-10 text-center">
        <Icon icon="zi-info" size={48} className="text-gray-200 mb-4" />
        <Text className="text-gray-400">Statistics are not available for this match.</Text>
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
              <Text size="xxxSmall" className="uppercase tracking-widest text-gray-400 font-bold">{key}</Text>
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
