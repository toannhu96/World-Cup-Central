import React from "react";
import { Box, Text, Icon, Switch, Spinner, Button } from "zmp-ui";
import { useNotificationSettings, NotificationSettings } from "../hooks/useNotificationSettings";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../state";
import { useTranslation } from "react-i18next";
import { getUserInfo } from "zmp-sdk";
import { requestMatchNotifications } from "../api/zaloApi";

export function SettingsPage() {
  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);
  const { settings, loading, updateSetting } = useNotificationSettings();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSyncProfile = async () => {
    try {
      const { userInfo } = await getUserInfo({ autoRequestPermission: true });
      setUser(userInfo);
    } catch (error) {
      console.error("Error syncing profile:", error);
    }
  };

  const handleEnableNotifications = async () => {
    await requestMatchNotifications();
  };

  const settingItems: { key: keyof NotificationSettings; label: string; icon: string; description: string }[] = [
    { 
      key: "alert_match_today", 
      label: t('common.alert_match_today_label'), 
      icon: "zi-calendar", 
      description: t('common.alert_match_today_desc') 
    },
    { 
      key: "alert_match_1h_before", 
      label: t('common.alert_match_1h_before_label'), 
      icon: "zi-clock-1", 
      description: t('common.alert_match_1h_before_desc') 
    },
    { 
      key: "alert_match_result", 
      label: t('common.alert_match_result_label'), 
      icon: "zi-note", 
      description: t('common.alert_match_result_desc') 
    },
    { 
      key: "alert_your_prediction_result", 
      label: t('common.alert_your_prediction_result_label'), 
      icon: "zi-star", 
      description: t('common.alert_your_prediction_result_desc') 
    },
    { 
      key: "alert_goals", 
      label: t('common.alert_goals_label'), 
      icon: "zi-check-circle", 
      description: t('common.alert_goals_desc') 
    },
    { 
      key: "alert_group_stage_complete", 
      label: t('common.alert_group_stage_complete_label'), 
      icon: "zi-flag", 
      description: t('common.alert_group_stage_complete_desc') 
    },
  ];

  return (
    <Box className="m-4 flex flex-col gap-4">
      {user?.id === "guest" ? (
        <Box className="p-6 text-center bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
          <Icon icon="zi-user" size={48} className="text-gray-200 mb-4" />
          <Text className="text-gray-600 font-bold mb-1">{t('common.guest_mode')}</Text>
          <Text size="small" className="text-gray-400 mb-6">{t('common.guest_mode_hint')}</Text>
          <Button
            onClick={handleSyncProfile}
            className="bg-blue-600 rounded-xl h-12 px-8 font-bold"
          >
            {t('common.sync_zalo_profile')}
          </Button>
        </Box>
      ) : (
        <Box flex alignItems="center" className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm gap-4">
          <img
            src={user.avatar || "https://stc-zaloprofile.zdn.vn/static/iphone/default_avatar.png"}
            className="w-16 h-16 rounded-full border-2 border-blue-100"
            alt="Avatar"
          />
          <Box>
            <Text className="font-bold text-gray-800 text-lg">{user.name}</Text>
            <Text size="xxxSmall" className="text-gray-400">ID: {user.id}</Text>
          </Box>
        </Box>
      )}

      {/* Language Switcher */}
      <Box className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Box flex alignItems="center" className="gap-3 mb-6">
          <Icon icon="zi-Chat" className="text-blue-600" size={24} />
          <Box>
            <Text className="font-bold text-gray-800">{t('common.language')}</Text>
            <Text size="xxxSmall" className="text-gray-400">🇻🇳 {t('common.vietnamese')} / 🇺🇸 {t('common.english')}</Text>
          </Box>
        </Box>
        <Box flex className="gap-2">
          <Button 
            size="small" 
            variant={i18n.language === 'vi' ? 'primary' : 'secondary'}
            onClick={() => changeLanguage('vi')}
            className="flex-1"
          >
            <Box flex alignItems="center" justifyContent="center" className="gap-2">
              <Text>🇻🇳</Text>
              <Text className="font-bold">{t('common.vietnamese')}</Text>
            </Box>
          </Button>
          <Button 
            size="small" 
            variant={i18n.language === 'en' ? 'primary' : 'secondary'}
            onClick={() => changeLanguage('en')}
            className="flex-1"
          >
            <Box flex alignItems="center" justifyContent="center" className="gap-2">
              <Text>🇺🇸</Text>
              <Text className="font-bold">{t('common.english')}</Text>
            </Box>
          </Button>
        </Box>
      </Box>

      {/* Notification Preferences */}
      <Box className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Box flex alignItems="center" className="gap-3 mb-6">
          <Icon icon="zi-notif-ring" className="text-blue-600" size={24} />
          <Box>
            <Text className="font-bold text-gray-800">{t('common.notification_preferences')}</Text>
            <Text size="xxxSmall" className="text-gray-400">{t('common.notification_hint')}</Text>
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
        <Text className="font-bold mb-1">{t('common.zalo_notif_api')}</Text>
        <Text size="xxxSmall" className="text-white/60 mb-4">{t('common.zalo_notif_hint')}</Text>
        <Box className="p-3 bg-white/10 rounded-xl border border-white/10">
          <Text size="xxxSmall" className="italic">
            "{t('common.notif_value_statement')}"
          </Text>
        </Box>
        <Button
          fullWidth
          onClick={handleEnableNotifications}
          className="mt-4 bg-blue-600 border-none h-12 rounded-xl font-bold"
        >
          {t('common.enable_match_alerts')}
        </Button>
      </Box>
    </Box>
  );
}
