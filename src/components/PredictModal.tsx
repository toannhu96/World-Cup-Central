import React, { useState } from "react";
import { Modal, Box, Text, Button, Icon } from "zmp-ui";
import { Match, TEAMS } from "@/constants/worldcup2026";
import { trackEvent } from "../utils/analytics";

interface PredictModalProps {
  match: Match;
  visible: boolean;
  onClose: () => void;
  onSubmit: (homeScore: number, awayScore: number) => void;
  initialHome?: number;
  initialAway?: number;
}

export function PredictModal({
  match,
  visible,
  onClose,
  onSubmit,
  initialHome = 1,
  initialAway = 1,
}: PredictModalProps) {
  const [homeScore, setHomeScore] = useState(initialHome);
  const [awayScore, setAwayScore] = useState(initialAway);

  const homeTeam = TEAMS[match.homeTeam];
  const awayTeam = TEAMS[match.awayTeam];

  const handleSumbit = () => {
    onSubmit(homeScore, awayScore);
    trackEvent("prediction_submit", "engagement", match.id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Predict Score"
      description="What's your prediction for this match?"
    >
      <Box className="p-4">
        <Box flex alignItems="center" justifyContent="space-between" className="mb-8">
          {/* Home Team */}
          <Box flex flexDirection="column" alignItems="center" className="flex-1 gap-2">
            <Text className="text-4xl">{homeTeam?.flag ?? "🏳️"}</Text>
            <Text size="small" className="font-bold text-center">
              {homeTeam?.shortName ?? match.homeTeam}
            </Text>
            <Box flex alignItems="center" className="gap-4 mt-2">
              <Button
                size="small"
                variant="secondary"
                onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                icon={<Icon icon="zi-minus" />}
              />
              <Text size="large" className="font-bold w-6 text-center">
                {homeScore}
              </Text>
              <Button
                size="small"
                variant="secondary"
                onClick={() => setHomeScore(homeScore + 1)}
                icon={<Icon icon="zi-plus" />}
              />
            </Box>
          </Box>

          <Box className="px-4">
            <Text className="text-2xl font-light text-gray-300">VS</Text>
          </Box>

          {/* Away Team */}
          <Box flex flexDirection="column" alignItems="center" className="flex-1 gap-2">
            <Text className="text-4xl">{awayTeam?.flag ?? "🏳️"}</Text>
            <Text size="small" className="font-bold text-center">
              {awayTeam?.shortName ?? match.awayTeam}
            </Text>
            <Box flex alignItems="center" className="gap-4 mt-2">
              <Button
                size="small"
                variant="secondary"
                onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                icon={<Icon icon="zi-minus" />}
              />
              <Text size="large" className="font-bold w-6 text-center">
                {awayScore}
              </Text>
              <Button
                size="small"
                variant="secondary"
                onClick={() => setAwayScore(awayScore + 1)}
                icon={<Icon icon="zi-plus" />}
              />
            </Box>
          </Box>
        </Box>

        <Box flex className="gap-3 mt-6">
          <Button fullWidth variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSumbit}>
            Save Prediction
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
