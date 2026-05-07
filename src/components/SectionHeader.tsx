import React from "react";
import { Box, Text } from "zmp-ui";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, right }: SectionHeaderProps) {
  return (
    <Box flex alignItems="center" justifyContent="space-between" className="px-6 pt-8 pb-3">
      <Box className="flex-1">
        <Text size="large" className="font-black tracking-widest uppercase text-gray-400 text-[10px]">
          {title}
        </Text>
        {subtitle && (
          <Text size="xxxSmall" className="mt-0.5 text-blue-600/60 font-bold">
            {subtitle}
          </Text>
        )}
      </Box>
      {right && <Box>{right}</Box>}
    </Box>
  );
}
