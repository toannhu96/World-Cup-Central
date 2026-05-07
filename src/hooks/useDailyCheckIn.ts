import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../state";
import { supabase } from "../lib/supabase";

export function useDailyCheckIn() {
  const user = useRecoilValue(userState);

  useEffect(() => {
    if (!user || !user.id || user.id === "guest") return;

    const checkIn = async () => {
      const today = new Date().toISOString().split("T")[0];

      try {
        // 1. Sync user to 'users' table
        const { error: userError } = await supabase
          .from("users")
          .upsert({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            last_login_date: today,
            updated_at: new Date().toISOString(),
          }, { onConflict: "id" });

        if (userError) throw userError;

        // 2. Try to log daily check-in (deduped by index)
        const { error: logError } = await supabase
          .from("point_logs")
          .insert({
            user_id: user.id,
            action: "daily_login",
            points: 10,
          });

        // 3. If insert succeeded, increment total points
        if (!logError) {
          await supabase.rpc("increment_points", { 
            row_id: user.id, 
            amount: 10 
          });
          console.log("Daily check-in successful: +10 pts");
        }
      } catch (error) {
        // Silent catch for unique constraint violations (already checked in)
        if ((error as any).code !== "23505") {
          console.error("Check-in error:", error);
        }
      }
    };

    checkIn();
  }, [user]);
}
