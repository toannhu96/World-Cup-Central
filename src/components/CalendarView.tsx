import React, { useState, useMemo } from "react";
import { Box, Text, Icon } from "zmp-ui";
import { Match } from "@/constants/worldcup2026";
import { useTranslation } from "react-i18next";

interface CalendarViewProps {
  matches: Match[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ matches, selectedDate, onSelectDate }) => {
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const { t, i18n } = useTranslation();

  // Get all unique dates from matches
  const matchDates = useMemo(() => {
    const dates = Array.from(new Set(matches.map(m => m.date))).sort();
    return dates;
  }, [matches]);

  const matchesByDate = useMemo(() => {
    const grouped: Record<string, Match[]> = {};
    matches.forEach(m => {
      if (!grouped[m.date]) grouped[m.date] = [];
      grouped[m.date].push(m);
    });
    return grouped;
  }, [matches]);

  // For month view: June/July 2026
  const juneDays = Array.from({ length: 30 }, (_, i) => `2026-06-${String(i + 1).padStart(2, "0")}`);
  const julyDays = Array.from({ length: 31 }, (_, i) => `2026-07-${String(i + 1).padStart(2, "0")}`);
  const allDays = [...juneDays, ...julyDays];

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return t('common.select_date');
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { 
      weekday: "short", 
      month: "short", 
      day: "numeric" 
    });
  };

  const renderWeekStrip = () => (
    <Box className="px-4 mb-6">
      <Box flex className="gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {matchDates.map((date) => {
          const isSelected = selectedDate === date;
          const isPast = date < todayStr;
          const d = new Date(date);
          const dayName = d.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { weekday: "short" });
          const dayNum = d.getDate();
          const matchCount = matchesByDate[date]?.length || 0;

          return (
            <Box
              key={date}
              onClick={() => onSelectDate(date)}
              className={`min-w-[64px] h-24 rounded-2xl flex flex-col items-center justify-center transition-all ${
                isSelected 
                  ? "bg-blue-600 text-white shadow-lg scale-110" 
                  : isPast 
                    ? "bg-gray-50 text-gray-300 border border-transparent"
                    : "bg-white text-gray-400 border border-gray-100"
              }`}
            >
              <Text size="xxxSmall" className={`uppercase font-bold mb-1 ${isSelected ? "opacity-100" : "opacity-70"}`}>{dayName}</Text>
              <Text size="large" className="font-black">{dayNum}</Text>
              {matchCount > 0 && (
                <Box className={`w-1.5 h-1.5 rounded-full mt-2 ${isSelected ? "bg-white" : isPast ? "bg-gray-200" : "bg-blue-400"}`} />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  const dayLabels = i18n.language === 'vi' 
    ? ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    : ["S", "M", "T", "W", "T", "F", "S"];

  const renderMonthView = () => (
    <Box className="px-4 mb-6 bg-white p-4 rounded-3xl border border-gray-100">
      <Box className="grid grid-cols-7 gap-2">
        {dayLabels.map(d => (
          <Box key={d} className="text-center py-2">
            <Text size="xxxSmall" className="font-bold text-gray-300">{d}</Text>
          </Box>
        ))}
        {/* Placeholder for alignment (June 1st 2026 is Monday) */}
        <Box className="h-10" /> 
        {allDays.map(date => {
          const isSelected = selectedDate === date;
          const isPast = date < todayStr;
          const dayNum = parseInt(date.split("-")[2]);
          const hasMatches = matchesByDate[date]?.length > 0;
          
          return (
            <Box
              key={date}
              onClick={() => onSelectDate(date)}
              className={`h-10 rounded-xl flex items-center justify-center relative transition-colors ${
                isSelected 
                  ? "bg-blue-600 text-white" 
                  : isPast 
                    ? "bg-gray-50" 
                    : hasMatches 
                      ? "bg-blue-50" 
                      : ""
              }`}
            >
              <Text size="xSmall" className={`font-bold ${
                isSelected 
                  ? "text-white" 
                  : isPast 
                    ? "text-gray-200" 
                    : hasMatches 
                      ? "text-blue-600" 
                      : "text-gray-300"
              }`}>
                {dayNum}
              </Text>
              {hasMatches && !isSelected && (
                <Box className={`absolute bottom-1 w-1 h-1 rounded-full ${isPast ? "bg-gray-200" : "bg-blue-600"}`} />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Box>
      <Box flex justifyContent="space-between" alignItems="center" className="px-6 mb-4">
        <Text size="small" className="font-black text-gray-400 uppercase tracking-widest">
          {formatDisplayDate(selectedDate)}
        </Text>
        <Box 
          onClick={() => setViewMode(prev => prev === "week" ? "month" : "week")}
          className="p-2 bg-gray-100 rounded-xl active:scale-90 transition-transform"
        >
          <Icon icon={viewMode === "week" ? "zi-calendar" : "zi-list-bullet"} size={20} className="text-gray-500" />
        </Box>
      </Box>
      
      {viewMode === "week" ? renderWeekStrip() : renderMonthView()}
    </Box>
  );
};
