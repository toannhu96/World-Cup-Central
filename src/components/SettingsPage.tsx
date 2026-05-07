import React from "react";
import { Box, Text, Icon, Switch, List, Spinner } from "zmp-ui";
import { useNotificationSettings, NotificationSettings } from "../hooks/useNotificationSettings";
import { useRecoilValue } from "recoil";
import { userState } from "../state";

export function SettingsPage() {
  const user = useRecoilValue(userState);
  const { settings, loading, updateSetting } = useNotificationSettings();

  const settingItems: { key: keyof NotificationSettings; label: string; icon: string; description: string }[] = [
    { 
      key: "alert_match_today", 
      label: "Match Today", 
      icon: "zi-calendar", 
      description: "Get a daily digest of matches happening today" 
    },
    { 
      key: "alert_match_1h_before", 
      label: "1 Hour Reminder", 
      icon: "zi-clock-1", 
      description: "Alert before a match starts" 
    },
    { 
      key: "alert_match_result", 
      label: "Match Results", 
      icon: "zi-note", 
      description: "Notification when a match ends" 
    },
    { 
      key: "alert_your_prediction_result", 
      label: "Prediction Performance", 
      icon: "zi-star", 
      description: "Alert when your prediction is scored" 
    },
    { 
      key: "alert_goals", 
      label: "Goal Alerts", 
      icon: "zi-check-circle", 
      description: "Real-time notifications for goals" 
    },
    { 
      key: "alert_group_stage_complete", 
      label: "Tournament Milestones", 
      icon: "zi-flag", 
      description: "Alert when group stages or rounds complete" 
    },
  ];

  if (user?.id === "guest") {
    return (
      <Box className="m-4 p-10 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Icon icon="zi-user" size={48} className="text-gray-200 mb-4" />
        <Text className="text-gray-600 font-bold mb-1">Guest Mode</Text>
        <Text size="small" className="text-gray-400">Please log in to manage your notification settings.</Text>
      </Box>
    );
  }

  return (
    <Box className="m-4 flex flex-col gap-4">
      <Box className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Box flex alignItems="center" className="gap-3 mb-6">
          <Icon icon="zi-notif-ring" className="text-blue-600" size={24} />
          <Box>
            <Text className="font-bold text-gray-800">Notification Preferences</Text>
            <Text size="xxxSmall" className="text-gray-400">Choose which events you want to be alerted about</Text>
          </Box>
        </Box>

        {loading ? (
          <Box flex justifyContent="center" className="py-10">
            <Spinner />
          </Box>
        ) : (
          <Box className="flex flex-col gap-4">
            {settingItems.map((item) => (
              <Box key={item.key} flex alignItems="center" justifyContent="space-between" className="py-2">
                <Box flex className="gap-3 flex-1">
                  <Box className="p-2 bg-gray-50 rounded-lg h-fit">
                    <Icon icon={item.icon as any} size={20} className="text-gray-500" />
                  </Box>
                  <Box className="flex-1">
                    <Text className="font-semibold text-gray-700 text-sm">{item.label}</Text>
                    <Text size="xxxSmall" className="text-gray-400 leading-tight">{item.description}</Text>
                  </Box>
                </Box>
                <Switch 
                  checked={settings[item.key]} 
                  onChange={(e) => updateSetting(item.key, e.target.checked)}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box className="p-4 bg-navy-900 rounded-2xl text-white shadow-lg" style={{ backgroundColor: '#001f3f' }}>
        <Text className="font-bold mb-1">Zalo Notification API</Text>
        <Text size="xxxSmall" className="text-white/60 mb-4">Actual delivery depends on your Zalo permission settings.</Text>
        <Box className="p-3 bg-white/10 rounded-xl border border-white/10">
          <Text size="xxxSmall" className="italic">
            "We only send high-value alerts about matches and your predictions."
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
