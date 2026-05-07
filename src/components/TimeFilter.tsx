import React from "react";
import { Box, Text } from "zmp-ui";

export type TimeFilterType = "all" | "upcoming" | "past";

interface TimeFilterProps {
  activeFilter: TimeFilterType;
  onChange: (filter: TimeFilterType) => void;
  counts?: { all: number; upcoming: number; past: number };
}

export const TimeFilter: React.FC<TimeFilterProps> = ({ activeFilter, onChange, counts }) => {
  const filters: { id: TimeFilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
  ];

  return (
    <Box className="px-4 mb-4">
      <Box className="glass-morphism p-1 rounded-2xl flex relative h-12 border-white/30 shadow-lg">
        {/* Sliding Indicator */}
        <Box 
          className="absolute top-1 bottom-1 bg-blue-600 rounded-xl shadow-lg transition-all duration-300 ease-out z-0"
          style={{ 
            width: "calc(33.33% - 4px)", 
            left: activeFilter === "all" ? "4px" : activeFilter === "upcoming" ? "33.33%" : "66.66%" 
          }}
        />
        
        {filters.map((f) => (
          <Box
            key={f.id}
            onClick={() => onChange(f.id)}
            className="flex-1 flex items-center justify-center z-10 relative"
          >
            <Text 
              size="xSmall" 
              className={`font-bold transition-colors ${activeFilter === f.id ? "text-white" : "text-gray-500"}`}
            >
              {f.label}
              {counts && (
                <span className={`ml-1 font-medium ${activeFilter === f.id ? "opacity-70" : "opacity-50"}`}>
                  ({counts[f.id]})
                </span>
              )}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
