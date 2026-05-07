import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import {
  fetchScoreboard,
  fetchSchedule,
  fetchGroups,
  espnEventsToMatches,
  mergeWithLive,
  patchTeamsFromEspn,
  type EspnGroup,
} from "../lib/footballApi";
import { MATCHES, TEAMS, type Match } from "../constants/worldcup2026";

const REFETCH_LIVE = 30_000;
const REFETCH_NORMAL = 120_000;
const REFETCH_SCHEDULE = 600_000;

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

  const groupsQuery = useQuery({
    queryKey: ["espn-groups"],
    queryFn: fetchGroups,
    refetchInterval: REFETCH_SCHEDULE,
    retry: 2,
    staleTime: REFETCH_SCHEDULE,
  });

  useEffect(() => {
    const hasLive = scoreboard.data?.hasLive ?? false;
    if (hasLive) console.log("[useMatches] Live matches detected, switching to high-frequency refetch");
    setRefetchInterval(hasLive ? REFETCH_LIVE : REFETCH_NORMAL);
  }, [scoreboard.data?.hasLive]);

  const teamGroup = groupsQuery.data?.teamGroup ?? {};

  const matches = useMemo<Match[]>(() => {
    const scheduleEvents = schedule.data?.events ?? [];
    const scoreboardEvents = scoreboard.data?.events ?? [];

    if (scheduleEvents.length) patchTeamsFromEspn(scheduleEvents);
    if (scoreboardEvents.length) patchTeamsFromEspn(scoreboardEvents);

    if (scheduleEvents.length > 0) {
      console.log(`[useMatches] Success: Using ESPN schedule data (${scheduleEvents.length} events)`);
      const espnMatches = espnEventsToMatches(scheduleEvents, teamGroup);
      return scoreboardEvents.length
        ? mergeWithLive(scoreboardEvents, espnMatches)
        : espnMatches;
    }

    if (scoreboardEvents.length > 0) {
      console.log("[useMatches] Partial Fallback: Static schedule + Live scoreboard");
      return mergeWithLive(scoreboardEvents, MATCHES);
    }

    console.warn("[useMatches] Full Fallback: API returned no events for 2026. Using local static constants.");
    return MATCHES;
  }, [schedule.data, scoreboard.data, teamGroup]);

  const isLoading = scoreboard.isLoading && schedule.isLoading;
  const isError = scoreboard.isError && schedule.isError;
  const hasLive = scoreboard.data?.hasLive ?? false;
  const lastUpdated = scoreboard.data?.fetchedAt ?? schedule.data?.fetchedAt ?? null;
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
      groupsQuery.refetch();
    },
  };
}

export function useGroups() {
  const groupsQuery = useQuery({
    queryKey: ["espn-groups"],
    queryFn: fetchGroups,
    refetchInterval: REFETCH_SCHEDULE,
    retry: 2,
    staleTime: REFETCH_SCHEDULE,
  });

  return {
    groups: groupsQuery.data?.groups ?? [] as EspnGroup[],
    teamGroup: groupsQuery.data?.teamGroup ?? {} as Record<string, string>,
    isLoading: groupsQuery.isLoading,
    isError: groupsQuery.isError,
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
