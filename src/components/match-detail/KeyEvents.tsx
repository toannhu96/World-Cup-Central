import React from "react";
import { Box, Text, Icon } from "zmp-ui";
import { MatchEvent } from "@/types";

interface KeyEventsProps {
  events: MatchEvent[];
  homeTeam: string;
  awayTeam: string;
}

export const KeyEvents: React.FC<KeyEventsProps> = ({ events, homeTeam, awayTeam }) => {
  if (!events || events.length === 0) {
    return (
      <Box className="py-20 px-10 text-center">
        <Icon icon="zi-info" size={48} className="text-gray-200 mb-4" />
        <Text className="text-gray-400">No match events recorded yet.</Text>
      </Box>
    );
  }

  const getIcon = (type: MatchEvent["type"]) => {
    switch (type) {
      case "goal": return "⚽";
      case "yellowCard": return "🟨";
      case "redCard": return "🟥";
      case "substitution": return "🔄";
      default: return "•";
    }
  };

  return (
    <Box className="py-8 px-6">
      <Box className="relative">
        {/* Timeline Line */}
        <Box className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 -translate-x-1/2" />

        {events.map((event, idx) => {
          const isHome = event.team === homeTeam;
          return (
            <Box key={idx} className="relative flex items-center mb-8 last:mb-0">
              {/* Home Side */}
              <Box className={`flex-1 flex justify-end pr-8 ${isHome ? "opacity-100" : "opacity-0"}`}>
                {isHome && (
                  <Box className="text-right">
                    <Text size="small" className="font-bold block">{event.player}</Text>
                    {event.assistedBy && <Text size="xxxSmall" className="text-gray-400">assist: {event.assistedBy}</Text>}
                    {event.detail && <Text size="xxxSmall" className="text-gray-400">{event.detail}</Text>}
                  </Box>
                )}
              </Box>

              {/* Center Icon & Minute */}
              <Box className="relative z-10 w-12 h-12 bg-white border-2 border-gray-100 rounded-full flex flex-col items-center justify-center shadow-sm">
                <Text className="text-lg leading-none">{getIcon(event.type)}</Text>
                <Text size="xxxSmall" className="font-bold text-gray-500 mt-0.5">{event.minute}'</Text>
              </Box>

              {/* Away Side */}
              <Box className={`flex-1 flex justify-start pl-8 ${!isHome ? "opacity-100" : "opacity-0"}`}>
                {!isHome && (
                  <Box className="text-left">
                    <Text size="small" className="font-bold block">{event.player}</Text>
                    {event.assistedBy && <Text size="xxxSmall" className="text-gray-400">assist: {event.assistedBy}</Text>}
                    {event.detail && <Text size="xxxSmall" className="text-gray-400">{event.detail}</Text>}
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
