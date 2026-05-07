import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRecoilValue } from "recoil";
import { userState } from "../state";

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  total_points: number;
  rank?: number;
}

export function useLeaderboard() {
  const user = useRecoilValue(userState);
  const [topUsers, setTopUsers] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // 1. Fetch top 10
      const { data: topData, error: topError } = await supabase
        .from("users")
        .select("id, name, avatar, total_points")
        .order("total_points", { ascending: false })
        .limit(10);

      if (topError) throw topError;
      setTopUsers(topData || []);

      // 2. Fetch current user data
      if (user?.id && user.id !== "guest") {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, name, avatar, total_points")
          .eq("id", user.id)
          .single();

        if (userError && userError.code !== "PGRST116") throw userError;
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  return { topUsers, currentUser, loading, refresh: fetchLeaderboard };
}
