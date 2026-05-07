import { useQuery } from "@tanstack/react-query";
import { fetchMatchSummary } from "../lib/footballApi";

export function useMatchDetail(matchId: string | undefined) {
  // Extract ESPN ID if it's prefixed with 'espn-'
  const espnId = matchId?.startsWith("espn-") ? matchId.replace("espn-", "") : matchId;

  return useQuery({
    queryKey: ["match-detail", espnId],
    queryFn: () => (espnId ? fetchMatchSummary(espnId) : Promise.resolve(null)),
    enabled: !!espnId,
    staleTime: 60000, // 1 minute
  });
}
