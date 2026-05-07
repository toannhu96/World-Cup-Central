import React from "react";
import { Box, Text, Icon } from "zmp-ui";
import { Player } from "@/types";

interface LineupsProps {
  lineups: {
    home: Player[];
    away: Player[];
  };
}

export const Lineups: React.FC<LineupsProps> = ({ lineups }) => {
  if (!lineups || (!lineups.home.length && !lineups.away.length)) {
    return (
      <Box className="py-20 px-10 text-center">
        <Icon icon="zi-info" size={48} className="text-gray-200 mb-4" />
        <Text className="text-gray-400">Lineups are not announced yet.</Text>
      </Box>
    );
  }

  const PlayerRow: React.FC<{ player: Player }> = ({ player }) => (
    <Box flex alignItems="center" className="mb-4 gap-3">
      <Box className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <Text size="xxxSmall" className="font-bold text-gray-600">{player.number}</Text>
      </Box>
      <Box>
        <Text size="small" className="font-bold block">{player.name}</Text>
        <Text size="xxxSmall" className="text-gray-400 uppercase">{player.position}</Text>
      </Box>
    </Box>
  );

  return (
    <Box className="py-8 px-6 flex gap-8">
      <Box className="flex-1">
        <Text size="small" className="font-black text-blue-600 mb-6 uppercase tracking-wider">Home Team</Text>
        {lineups.home.map((p) => <PlayerRow key={p.id} player={p} />)}
      </Box>
      <Box className="w-px bg-gray-100" />
      <Box className="flex-1">
        <Text size="small" className="font-black text-red-600 mb-6 uppercase tracking-wider text-right">Away Team</Text>
        {lineups.away.map((p) => (
          <Box key={p.id} flex flexDirection="row-reverse" alignItems="center" className="mb-4 gap-3">
            <Box className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Text size="xxxSmall" className="font-bold text-gray-600">{p.number}</Text>
            </Box>
            <Box className="text-right">
              <Text size="small" className="font-bold block">{p.name}</Text>
              <Text size="xxxSmall" className="text-gray-400 uppercase">{p.position}</Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
