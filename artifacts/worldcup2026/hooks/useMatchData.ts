import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import {
  fetchScoreboard,
  fetchSchedule,
  espnEventsToMatches,
  mergeWithLive,
  patchTeamsFromEspn,
} from "@/lib/footballApi";
import { MATCHES, type Match } from "@/data/worldcup2026";

const REFETCH_LIVE = 30_000;      // 30s when a match is live
const REFETCH_NORMAL = 120_000;   // 2min otherwise
const REFETCH_SCHEDULE = 600_000; // 10min

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

  // Adjust polling based on live games
  useEffect(() => {
    const hasLive = scoreboard.data?.hasLive ?? false;
    setRefetchInterval(hasLive ? REFETCH_LIVE : REFETCH_NORMAL);
  }, [scoreboard.data?.hasLive]);

  const matches = useMemo<Match[]>(() => {
    const scheduleEvents = schedule.data?.events ?? [];
    const scoreboardEvents = scoreboard.data?.events ?? [];

    // Patch unknown teams into our TEAMS map
    if (scheduleEvents.length) patchTeamsFromEspn(scheduleEvents);
    if (scoreboardEvents.length) patchTeamsFromEspn(scoreboardEvents);

    if (scheduleEvents.length > 0) {
      // Use ESPN as primary source, overlay live scoreboard on top
      const espnMatches = espnEventsToMatches(scheduleEvents);
      return scoreboardEvents.length
        ? mergeWithLive(scoreboardEvents, espnMatches)
        : espnMatches;
    }

    // Fallback: static data + scoreboard overlay
    if (scoreboardEvents.length > 0) {
      return mergeWithLive(scoreboardEvents, MATCHES);
    }

    return MATCHES;
  }, [schedule.data, scoreboard.data]);

  const isLoading = scoreboard.isLoading && schedule.isLoading;
  const isError = scoreboard.isError && schedule.isError;
  const hasLive = scoreboard.data?.hasLive ?? false;
  const lastUpdated = scoreboard.data?.fetchedAt ?? schedule.data?.fetchedAt ?? null;
  const dataSource =
    schedule.data?.source ?? scoreboard.data?.source ?? "static";

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

export function useScoreboard() {
  return useQuery({
    queryKey: ["scoreboard"],
    queryFn: fetchScoreboard,
    refetchInterval: REFETCH_NORMAL,
    retry: 2,
  });
}
