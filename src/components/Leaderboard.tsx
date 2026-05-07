import React from "react";
import { Box, Text, Icon, Avatar, Spinner } from "zmp-ui";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { TriviaCard } from "./TriviaCard";
import { useTranslation } from "react-i18next";

export function Leaderboard() {
  const { topUsers, currentUser, loading } = useLeaderboard();
  const { t } = useTranslation();

  return (
    <Box className="pb-8">
      {/* Embedded Trivia Section */}
      <Box className="mb-2">
        <TriviaCard />
      </Box>

      {/* Leaderboard Table */}
      <Box className="mx-4 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <Box className="p-4 bg-navy-900 flex flex-row items-center justify-between" style={{ backgroundColor: '#001f3f' }}>
          <Box flex alignItems="center" className="gap-2">
            <Icon icon="zi-star-solid" className="text-yellow-500" size={24} />
            <Text className="font-bold text-white">{t('common.leaderboard')}</Text>
          </Box>
          <Text size="xxxSmall" className="text-white/40 uppercase font-bold tracking-widest">{t('common.top_10')}</Text>
        </Box>
        
        <Box className="flex flex-col">
          {loading ? (
            <Box flex justifyContent="center" className="py-10">
              <Spinner />
            </Box>
          ) : topUsers.length === 0 ? (
            <Box className="py-10 text-center">
              <Text className="text-gray-400">{t('common.no_data_yet')}</Text>
            </Box>
          ) : (
            topUsers.map((entry, index) => (
              <Box 
                key={entry.id} 
                flex 
                alignItems="center" 
                justifyContent="space-between" 
                className={`p-4 ${index !== topUsers.length - 1 ? "border-b border-gray-50" : ""} ${entry.id === currentUser?.id ? "bg-blue-50/50" : ""}`}
              >
                <Box flex alignItems="center" className="gap-4">
                  <Box className="w-6 text-center">
                    {index < 3 ? (
                      <Text className="text-lg">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </Text>
                    ) : (
                      <Text size="small" className="text-gray-400 font-bold">{index + 1}</Text>
                    )}
                  </Box>
                  <Avatar src={entry.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + entry.id} size={32} />
                  <Text className={`font-semibold ${entry.id === currentUser?.id ? "text-blue-700" : "text-gray-700"}`}>
                    {entry.name} {entry.id === currentUser?.id && `(${t('common.you')})`}
                  </Text>
                </Box>
                <Box className="text-right">
                  <Text className="font-bold text-blue-600">{entry.total_points.toLocaleString()}</Text>
                  <Text size="xxxSmall" className="text-gray-400 uppercase font-bold">{t('common.pts')}</Text>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* Your Rank Footer (if not in top 10) */}
        {!loading && currentUser && !topUsers.find(u => u.id === currentUser.id) && (
          <Box className="p-4 bg-blue-50/30 border-t border-gray-100" flex alignItems="center" justifyContent="space-between">
            <Box flex alignItems="center" className="gap-4">
              <Box className="w-6 text-center">
                <Text size="small" className="text-gray-400 font-bold">?</Text>
              </Box>
              <Avatar src={currentUser.avatar} size={32} />
              <Text className="font-bold text-blue-700">{currentUser.name} ({t('common.you')})</Text>
            </Box>
            <Box className="text-right">
              <Text className="font-bold text-blue-600">{currentUser.total_points.toLocaleString()}</Text>
              <Text size="xxxSmall" className="text-gray-400 uppercase font-bold">{t('common.pts')}</Text>
            </Box>
          </Box>
        )}
        
        <Box className="p-3 bg-gray-50/50 text-center">
          <Text size="xxxSmall" className="text-gray-400 italic">{t('common.leaderboard_hint')}</Text>
        </Box>
      </Box>
    </Box>
  );
}
