// @ts-nocheck
import React, { useMemo, useState } from "react";
import { Page, Box, Text, Icon, Button } from "zmp-ui";
import { useMatches } from "../hooks/useMatchData";
import { MatchCard } from "../components/MatchCard";
import { SectionHeader } from "../components/SectionHeader";
import { ROUNDS_ORDER, Match } from "../constants/worldcup2026";
import { useApp } from "../context/AppContext";
import { NotificationPopup } from "../components/NotificationPopup";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { SettingsPage } from "../components/SettingsPage";
import { trackPageView } from "../utils/analytics";
import { GroupFilterBar } from "../components/GroupFilterBar";
import { TimeFilter, TimeFilterType } from "../components/TimeFilter";
import { CalendarView } from "../components/CalendarView";
import { TeamPicker } from "../components/TeamPicker";
import { Leaderboard } from "../components/Leaderboard";
import heroBanner from "../static/images/hero_banner.png";
import appIcon from "../static/images/icon.png";

const FILTERS = ["All", "Group Stage", "Knockout", "Favorites", "Calendar", "Leaderboard", "Settings"] as const;
type Filter = typeof FILTERS[number];

const HomePage: React.FC = () => {
  const { matches, isLoading, isError, refetch } = useMatches();
  const { favoriteTeams, toggleFavoriteTeam } = useApp();
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [showTeamPicker, setShowTeamPicker] = useState(false);

  React.useEffect(() => {
    trackPageView(filter);
  }, [filter]);
  
  const { currentUser } = useLeaderboard();
  const totalPoints = currentUser?.total_points ?? 0;

  // 1. Initial filter by Main Tab
  const tabFilteredMatches = useMemo<Match[]>(() => {
    let filtered = [];
    if (filter === "Group Stage") {
      const gs = matches.filter((m) => m.group);
      filtered = selectedGroup === "All" ? gs : gs.filter(m => m.group === selectedGroup);
    } else if (filter === "Knockout") {
      filtered = matches.filter((m) => !m.group);
    } else if (filter === "Favorites") {
      filtered = matches.filter((m) => favoriteTeams.includes(m.homeTeam) || favoriteTeams.includes(m.awayTeam));
    } else if (filter === "Calendar") {
        if (!selectedDate && matches.length > 0) {
            const todayStr = new Date().toISOString().split('T')[0];
            const dates = Array.from(new Set(matches.map(m => m.date))).sort();
            if (dates.includes(todayStr)) {
                setSelectedDate(todayStr);
            } else if (dates.length) {
                setSelectedDate(dates[0]);
            }
        }
        filtered = matches.filter(m => m.date === selectedDate);
    } else {
      filtered = matches;
    }

    // Sort by date and time ascending
    return [...filtered].sort((a, b) => {
      const dateA = `${a.date} ${a.time}`;
      const dateB = `${b.date} ${b.time}`;
      return dateA.localeCompare(dateB);
    });
  }, [filter, favoriteTeams, matches, selectedGroup, selectedDate]);

  // 2. Apply Time Filter
  const finalMatches = useMemo(() => {
    if (timeFilter === "all" || filter === "Calendar") return tabFilteredMatches;
    if (timeFilter === "upcoming") return tabFilteredMatches.filter(m => m.status === "upcoming");
    if (timeFilter === "past") return tabFilteredMatches.filter(m => m.status === "finished");
    return tabFilteredMatches;
  }, [tabFilteredMatches, timeFilter, filter]);

  const groupedByRound = useMemo(() => {
    const grouped: Record<string, Match[]> = {};
    for (const m of finalMatches) {
      if (!grouped[m.round]) grouped[m.round] = [];
      grouped[m.round].push(m);
    }
    return grouped;
  }, [finalMatches]);

  const sections = useMemo(() => {
    return ROUNDS_ORDER.filter((r) => groupedByRound[r]?.length).map((r) => ({
      round: r,
      matches: groupedByRound[r],
    }));
  }, [groupedByRound]);

  // Counts for time filter
  const timeCounts = useMemo(() => ({
    all: tabFilteredMatches.length,
    upcoming: tabFilteredMatches.filter(m => m.status === "upcoming").length,
    past: tabFilteredMatches.filter(m => m.status === "finished").length,
  }), [tabFilteredMatches]);

  const handleTabChange = (f: Filter) => {
    setFilter(f);
    setSelectedGroup("All");
    setTimeFilter("all");
  };


  if (showTeamPicker) {
      return (
          <Page className="bg-gray-50">
              <TeamPicker 
                selectedTeams={favoriteTeams} 
                onToggleTeam={toggleFavoriteTeam} 
                onDone={() => setShowTeamPicker(false)} 
              />
          </Page>
      );
  }

  return (
    <Page className="relative">
      {/* Hero Section */}
      <Box 
        className="relative overflow-hidden pt-10 pb-6 px-6 rounded-b-[40px] shadow-2xl mb-6"
        style={{ 
          backgroundImage: `url(${heroBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '260px'
        }}
      >
        {/* Overlay to ensure text readability */}
        <Box className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        <Box className="relative z-10">
          <Box flex alignItems="center" className="mb-4">
            <img 
              src={appIcon} 
              alt="World Cup Icon" 
              className="w-12 h-12 mr-3 drop-shadow-lg"
            />
            <Box>
              <Text size="xSmall" className="uppercase tracking-[0.3em] text-yellow-400 font-black leading-none mb-1">FIFA World Cup</Text>
              <Text size="xxxLarge" className="text-white leading-none font-black italic transform -skew-x-12">2026</Text>
            </Box>
          </Box>
          
          <Text size="small" className="text-white/80 mb-6 font-medium tracking-wide">🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 Mexico</Text>
          
          <Box flex justifyContent="space-between" className="glass-morphism-dark p-4 rounded-3xl border border-white/20">
            <Stat label="Teams" value="48" />
            <Stat label="Matches" value="104" />
            <Stat label="Venues" value="16" />
            <Stat label="Your Pts" value={totalPoints.toLocaleString()} highlight />
          </Box>
        </Box>
      </Box>

      {/* Filter Tabs */}
      <Box className="px-4 mb-4">
        <Box flex className="gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map((f) => (
            <Box
              key={f}
              onClick={() => handleTabChange(f)}
              className={`px-5 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 ${
                filter === f 
                  ? "bg-blue-600 text-white shadow-xl scale-105" 
                  : "glass-morphism text-gray-500 border-white/20"
              }`}
            >
              <Text size="small" className="font-bold tracking-wide">{f}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Contextual Sub-filters */}
      {filter === "Group Stage" && (
          <GroupFilterBar selectedGroup={selectedGroup} onSelectGroup={setSelectedGroup} />
      )}

      {filter === "Calendar" && (
          <CalendarView matches={matches} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      )}

      {["All", "Group Stage", "Knockout", "Favorites"].includes(filter) && (
          <TimeFilter activeFilter={timeFilter} onChange={setTimeFilter} counts={timeCounts} />
      )}

      {filter === "Favorites" && favoriteTeams.length > 0 && (
          <Box className="px-6 mb-4 flex justify-between items-center">
              <Text size="small" className="font-black text-gray-400 uppercase tracking-widest">Your Teams</Text>
              <Button size="small" variant="tertiary" onClick={() => setShowTeamPicker(true)} className="text-blue-600 font-bold">Edit</Button>
          </Box>
      )}

      {/* Match Sections */}
      <Box className="pb-10">
        {filter === "Leaderboard" ? (
          <Leaderboard />
        ) : filter === "Settings" ? (
          <SettingsPage />
        ) : isLoading ? (
          <Box flex justifyContent="center" className="py-10">
            <Text className="text-gray-400">Loading matches...</Text>
          </Box>
        ) : isError ? (
          <Box flex flexDirection="column" alignItems="center" className="py-20 px-10 text-center">
            <Icon icon="zi-warning" size={48} className="text-red-500 mb-4" />
            <Text className="text-gray-600 mb-1 font-bold">Failed to load matches</Text>
            <Text size="small" className="text-gray-400 mb-4">Please check your connection and try again</Text>
            <Button onClick={refetch} size="small" variant="secondary">Retry</Button>
          </Box>
        ) : finalMatches.length === 0 ? (
          filter === "Favorites" && favoriteTeams.length === 0 ? (
            <Box flex flexDirection="column" alignItems="center" justifyContent="center" className="py-20 px-10 text-center">
                <Box className="w-24 h-24 glass-morphism rounded-full flex items-center justify-center mb-8 shadow-xl">
                  <Icon icon="zi-star" size={48} className="text-yellow-400" />
                </Box>
                <Text size="large" className="font-black mb-2 text-gray-800">No Favorite Teams</Text>
                <Text size="small" className="text-gray-500 mb-10 font-medium">Select the teams you follow to see their match schedule here.</Text>
                <Button onClick={() => setShowTeamPicker(true)} className="bg-blue-600 rounded-2xl h-14 px-10 font-black uppercase tracking-widest shadow-2xl">Pick My Teams</Button>
            </Box>
          ) : (
            <Box flex flexDirection="column" alignItems="center" className="py-20 px-10 text-center">
              <Icon icon="zi-star" size={48} className="text-gray-200 mb-4" />
              <Text className="text-gray-600 mb-1 font-bold">No matches found</Text>
              <Text size="small" className="text-gray-400">Try changing your filter or add some favorites</Text>
            </Box>
          )
        ) : (
          sections.map(({ round, matches }) => (
            <Box key={round} className="mb-4">
              <SectionHeader
                title={round}
                subtitle={`${matches.length} match${matches.length > 1 ? "es" : ""}`}
              />
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </Box>
          ))
        )}
      </Box>

      <NotificationPopup />
    </Page>
  );
};

const Stat: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <Box flex flexDirection="column" alignItems="center" className="flex-1">
    <Text size="large" className={`${highlight ? "text-blue-400" : "text-yellow-400"} font-black tracking-tight`}>{value}</Text>
    <Text size="xxxSmall" className="text-white/50 uppercase font-bold tracking-widest text-[8px]">{label}</Text>
  </Box>
);

export default HomePage;
