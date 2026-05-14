import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRecoilValue } from "recoil";
import { userState } from "../state";

export interface NotificationSettings {
  alert_match_today: boolean;
  alert_match_1h_before: boolean;
  alert_match_result: boolean;
  alert_goals: boolean;
  alert_group_stage_complete: boolean;
  alert_your_prediction_result: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  alert_match_today: true,
  alert_match_1h_before: true,
  alert_match_result: true,
  alert_goals: false,
  alert_group_stage_complete: false,
  alert_your_prediction_result: true,
};

export function useNotificationSettings() {
  const user = useRecoilValue(userState);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || user.id === "guest") {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("notification_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") throw error;
        if (data) {
          const { user_id, updated_at, ...cleanSettings } = data;
          setSettings(cleanSettings as NotificationSettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    if (!user?.id || user.id === "guest") return;

    const nextSettings = { ...settings, [key]: value };
    setSettings(nextSettings);

    try {
      await supabase
        .from("notification_settings")
        .upsert({
          user_id: user.id,
          ...nextSettings,
          updated_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return { settings, loading, updateSetting };
}
