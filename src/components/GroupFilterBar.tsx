import React from "react";
import { Box, Text } from "zmp-ui";
import { useTranslation } from "react-i18next";

interface GroupFilterBarProps {
  selectedGroup: string;
  onSelectGroup: (group: string) => void;
}

export const GroupFilterBar: React.FC<GroupFilterBarProps> = ({ selectedGroup, onSelectGroup }) => {
  const { t } = useTranslation();
  const groups = ["All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  return (
    <Box className="px-4 mb-4">
      <Box flex className="gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {groups.map((g) => (
          <Box
            key={g}
            onClick={() => onSelectGroup(g)}
            className={`px-5 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 ${
              selectedGroup === g 
                ? "bg-blue-600 text-white shadow-xl scale-105" 
                : "glass-morphism text-gray-500 border-white/20"
            }`}
          >
            <Text size="xSmall" className="font-bold uppercase tracking-widest">
              {g === "All" ? t('common.all_groups') : t('common.group_name', { name: g })}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
