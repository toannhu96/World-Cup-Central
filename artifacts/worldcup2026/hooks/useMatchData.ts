import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  fetchScoreboard,
  fetchSchedule,
  mergeWithLive,
  mergeSchedule,
  type LiveMatch,
} from "@/lib/footballApi";
import { MATCHES, type Match } from "@/data/worldcup2026";

const REFETCH_LIVE = 30_000;     // 30s when a match is live
const REFETCH_NORMAL = 120_000;  // 2min otherwise
const REFETCH_SCHEDULE = 600_000; // 10min

// Returns merged match list (static + live overlay)
export function useMatches() {
  const [refetchInterval, setRefetchInterval] = useState(REFETCH_NORMAL);

  const scoreboard = useQuery({
    queryKey: ["scoreboard"],
    queryFn: fetchScoreboard,
    refetchInterval,
    retry: 2,
    staleTime: 0,
  });

  const schedule = useQuery({
    queryKey: ["schedule"],
    queryFn: () => fetchSchedule("20260611", "20260719"),
    refetchInterval: REFETCH_SCHEDULE,
    retry: 2,
    staleTime: REFETCH_SCHEDULE,
  });

  // Adjust poll interval based on live games
  useEffect(() => {
    const hasLive = scoreboard.data?.hasLive ?? false;
    setRefetchInterval(hasLive ? REFETCH_LIVE : REFETCH_NORMAL);
  }, [scoreboard.data?.hasLive]);

  const isLoading = scoreboard.isLoading && schedule.isLoading;
  const isError = scoreboard.isError && schedule.isError;

  // Priority: full schedule from ESPN, then fallback to static + scoreboard overlay
  let matches: Match[] = MATCHES;
  if (schedule.data?.events?.length) {
    matches = mergeSchedule(schedule.data.events);
  } else if (scoreboard.data?.events?.length) {
    matches = mergeWithLive(scoreboard.data.events);
  }

  const hasLive = scoreboard.data?.hasLive ?? false;
  const lastUpdated = scoreboard.data?.fetchedAt ?? null;
  const dataSource = schedule.data?.source ?? scoreboard.data?.source ?? "static";

  return {
    matches,
    isLoading,
    isError,
    hasLive,
    lastUpdated,
    dataSource,
    refetch: () => {
      scoreboard.refetch();
      schedule.refetch();
    },
  };
}

// Lightweight scoreboard-only hook for quick live score checks
export function useScoreboard() {
  return useQuery({
    queryKey: ["scoreboard"],
    queryFn: fetchScoreboard,
    refetchInterval: REFETCH_NORMAL,
    retry: 2,
  });
}
