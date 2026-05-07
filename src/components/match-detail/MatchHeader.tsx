import React from "react";
import { Box, Text, Icon, Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { Match, TEAMS } from "@/constants/worldcup2026";

interface MatchHeaderProps {
  match: Match;
}

export const MatchHeader: React.FC<MatchHeaderProps> = ({ match }) => {
  const navigate = useNavigate();
  const homeTeam = TEAMS[match.homeTeam];
  const awayTeam = TEAMS[match.awayTeam];

  const headerStyle = {
    background: `linear-gradient(135deg, ${homeTeam?.color || "#001f3f"} 0%, ${awayTeam?.color || "#001f3f"} 100%)`,
  };

  return (
    <Box className="relative pb-8 rounded-b-[40px] shadow-2xl overflow-hidden" style={headerStyle}>
      {/* Back Button */}
      <Box className="pt-10 px-4">
        <Button
          variant="secondary"
          size="small"
          type="neutral"
          icon={<Icon icon="zi-chevron-left" />}
          onClick={() => navigate(-1)}
          className="bg-white/20 border-none text-white backdrop-blur-md rounded-full"
        >
          Back
        </Button>
      </Box>

      {/* Match Info */}
      <Box className="mt-6 px-6 text-center text-white">
        <Text size="xxxSmall" className="uppercase tracking-[0.3em] text-white/70 font-bold mb-2">
          {match.round} · {match.city}
        </Text>
        
        <Box flex alignItems="center" justifyContent="center" className="gap-8 my-6">
          <Box flex flexDirection="column" alignItems="center" className="flex-1">
            <Box className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
              <Text className="text-5xl">{homeTeam?.flag || "🏳️"}</Text>
            </Box>
            <Text size="large" className="font-extrabold uppercase tracking-tight text-white">{homeTeam?.shortName || match.homeTeam}</Text>
          </Box>

          <Box flex flexDirection="column" alignItems="center">
            {match.status === "upcoming" ? (
              <Box className="px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                <Text size="xxxLarge" className="font-black text-white">{match.time}</Text>
              </Box>
            ) : (
              <Box flex alignItems="center" className="gap-4">
                <Text size="xxxLarge" className="font-black text-white">{match.homeScore ?? 0}</Text>
                <Text size="xLarge" className="text-white/40 font-light">:</Text>
                <Text size="xxxLarge" className="font-black text-white">{match.awayScore ?? 0}</Text>
              </Box>
            )}
          </Box>

          <Box flex flexDirection="column" alignItems="center" className="flex-1">
            <Box className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
              <Text className="text-5xl">{awayTeam?.flag || "🏳️"}</Text>
            </Box>
            <Text size="large" className="font-extrabold uppercase tracking-tight text-white">{awayTeam?.shortName || match.awayTeam}</Text>
          </Box>
        </Box>

        <Box className="inline-block px-4 py-1.5 bg-yellow-500/20 rounded-full border border-yellow-500/30 backdrop-blur-sm">
          <Text size="xxxSmall" className="text-yellow-500 font-black uppercase tracking-widest">
            {match.status === "live" ? "Live Now" : match.status === "finished" ? "Match Finished" : match.date}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
