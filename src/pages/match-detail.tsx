import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Page, Box, Text, Icon } from "zmp-ui";
import { useMatches } from "../hooks/useMatchData";
import { useMatchDetail } from "../hooks/useMatchDetail";
import { MatchHeader } from "../components/match-detail/MatchHeader";
import { MatchTabs } from "../components/match-detail/MatchTabs";
import { KeyEvents } from "../components/match-detail/KeyEvents";
import { MatchStats } from "../components/match-detail/MatchStats";
import { Lineups } from "../components/match-detail/Lineups";

const MatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { matches, isLoading: matchesLoading } = useMatches();
  const [activeTab, setActiveTab] = useState("events");

  // Find the match in our list
  const match = matches.find((m) => m.id === id);

  // Fetch detailed summary from ESPN
  const { data: summary, isLoading: summaryLoading } = useMatchDetail(id);

  if (matchesLoading) {
    return (
      <Page className="bg-white">
        <Box flex alignItems="center" justifyContent="center" className="h-full">
          <Text className="text-gray-400">Loading match info...</Text>
        </Box>
      </Page>
    );
  }

  if (!match) {
    return (
      <Page className="bg-white">
        <Box flex flexDirection="column" alignItems="center" justifyContent="center" className="h-full px-10 text-center">
          <Icon icon="zi-warning" size={48} className="text-red-500 mb-4" />
          <Text className="text-gray-600 font-bold mb-1">Match not found</Text>
          <Text size="small" className="text-gray-400">We couldn't find the match you're looking for.</Text>
        </Box>
      </Page>
    );
  }

  const renderTabContent = () => {
    if (summaryLoading) {
      return (
        <Box className="py-20 text-center">
          <Text className="text-gray-400">Loading match details...</Text>
        </Box>
      );
    }

    if (!summary) {
        return (
            <Box className="py-20 px-10 text-center">
                <Icon icon="zi-clock" size={48} className="text-gray-200 mb-4" />
                <Text className="text-gray-600 font-bold mb-1">Upcoming Match</Text>
                <Text size="small" className="text-gray-400">Detailed statistics and events will be available once the match starts.</Text>
            </Box>
        );
    }

    switch (activeTab) {
      case "events":
        return <KeyEvents events={summary.keyEvents} homeTeam={match.homeTeam} awayTeam={match.awayTeam} />;
      case "stats":
        return <MatchStats stats={summary.stats} />;
      case "lineups":
        return <Lineups lineups={summary.lineups} />;
      default:
        return null;
    }
  };

  return (
    <Page className="bg-gray-50">
      <MatchHeader match={match} />
      <Box className="bg-white min-h-screen">
        <MatchTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </Box>
    </Page>
  );
};

export default MatchDetailPage;
