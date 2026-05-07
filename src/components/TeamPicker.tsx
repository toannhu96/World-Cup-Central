import React, { useState } from "react";
import { Box, Text, Icon, Button, Input } from "zmp-ui";
import { TEAMS, Team } from "@/constants/worldcup2026";

interface TeamPickerProps {
  selectedTeams: string[];
  onToggleTeam: (teamId: string) => void;
  onDone: () => void;
}

export const TeamPicker: React.FC<TeamPickerProps> = ({ selectedTeams, onToggleTeam, onDone }) => {
  const [search, setSearch] = useState("");
  const allTeams = Object.values(TEAMS);
  
  const filteredTeams = allTeams.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.shortName.toLowerCase().includes(search.toLowerCase())
  );

  const confederations = Array.from(new Set(allTeams.map(t => t.confederation))).filter(Boolean).sort();

  return (
    <Box className="flex flex-col h-full">
      <Box className="p-4 glass-morphism border-none rounded-b-3xl shadow-lg">
        <Text size="large" className="font-black mb-4 text-blue-600">Follow Your Teams</Text>
        <Input
          placeholder="Search teams..."
          prefix={<Icon icon="zi-search" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/50 border-none rounded-xl"
        />
      </Box>

      <Box className="flex-1 overflow-y-auto p-4">
        {search ? (
           <Box className="grid grid-cols-3 gap-3">
           {filteredTeams.map((team) => (
             <TeamCard 
               key={team.id} 
               team={team} 
               isSelected={selectedTeams.includes(team.id)} 
               onToggle={() => onToggleTeam(team.id)} 
             />
           ))}
         </Box>
        ) : (
          confederations.map(conf => (
            <Box key={conf} className="mb-8">
              <Text size="xSmall" className="uppercase tracking-[0.2em] text-gray-400 font-bold mb-4">{conf}</Text>
              <Box className="grid grid-cols-3 gap-3">
                {allTeams.filter(t => t.confederation === conf).map((team) => (
                  <TeamCard 
                    key={team.id} 
                    team={team} 
                    isSelected={selectedTeams.includes(team.id)} 
                    onToggle={() => onToggleTeam(team.id)} 
                  />
                ))}
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box className="p-6 glass-morphism border-none rounded-t-3xl shadow-lg">
        <Button 
          fullWidth 
          onClick={onDone}
          className="bg-blue-600 rounded-2xl h-14 font-black tracking-widest uppercase shadow-xl"
        >
          Follow {selectedTeams.length} {selectedTeams.length === 1 ? "Team" : "Teams"}
        </Button>
      </Box>
    </Box>
  );
};

const TeamCard: React.FC<{ team: Team, isSelected: boolean, onToggle: () => void }> = ({ team, isSelected, onToggle }) => (
  <Box 
    onClick={onToggle}
    className={`p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center relative ${
      isSelected ? "border-blue-500 bg-blue-600 shadow-xl scale-95" : "glass-morphism border-white/20 shadow-sm"
    }`}
  >
    <Text className="text-4xl mb-2">{team.flag}</Text>
    <Text size="xxxSmall" className={`font-black text-center uppercase tracking-widest truncate w-full ${isSelected ? "text-white" : "text-gray-600"}`}>
      {team.shortName}
    </Text>
    {isSelected && (
      <Box className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
        <Icon icon="zi-check" size={12} className="text-white" />
      </Box>
    )}
  </Box>
);
