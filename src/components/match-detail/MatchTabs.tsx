import React from "react";
import { Box, Text } from "zmp-ui";

interface MatchTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MatchTabs: React.FC<MatchTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "events", label: "Events" },
    { id: "stats", label: "Stats" },
    { id: "lineups", label: "Lineups" },
  ];

  return (
    <Box className="flex bg-white px-4 py-2 border-b border-gray-100 sticky top-0 z-10">
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex-1 text-center py-3 relative"
        >
          <Text
            size="small"
            className={`font-bold transition-colors ${
              activeTab === tab.id ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {tab.label}
          </Text>
          {activeTab === tab.id && (
            <Box className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
          )}
        </Box>
      ))}
    </Box>
  );
};
