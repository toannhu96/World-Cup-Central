import React from "react";
import { Box, Text } from "zmp-ui";

interface TeamFlagProps {
  flag: string;
  size?: number;
}

export function TeamFlag({ flag, size = 32 }: TeamFlagProps) {
  return (
    <Box
      flex
      alignItems="center"
      justifyContent="center"
      className="rounded overflow-hidden"
      style={{ width: size + 8, height: size + 8 }}
    >
      <Text style={{ fontSize: size }}>{flag}</Text>
    </Box>
  );
}
