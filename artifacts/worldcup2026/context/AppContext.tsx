import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
  favoriteTeams: string[];
  favoriteMatches: string[];
  toggleFavoriteTeam: (teamId: string) => void;
  toggleFavoriteMatch: (matchId: string) => void;
  isFavoriteTeam: (teamId: string) => boolean;
  isFavoriteMatch: (matchId: string) => boolean;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
}

const AppContext = createContext<AppContextType>({
  favoriteTeams: [],
  favoriteMatches: [],
  toggleFavoriteTeam: () => {},
  toggleFavoriteMatch: () => {},
  isFavoriteTeam: () => false,
  isFavoriteMatch: () => false,
  notificationsEnabled: true,
  toggleNotifications: () => {},
  selectedGroup: "A",
  setSelectedGroup: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);
  const [favoriteMatches, setFavoriteMatches] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("A");

  useEffect(() => {
    (async () => {
      try {
        const [teams, matches, notifs] = await Promise.all([
          AsyncStorage.getItem("favoriteTeams"),
          AsyncStorage.getItem("favoriteMatches"),
          AsyncStorage.getItem("notificationsEnabled"),
        ]);
        if (teams) setFavoriteTeams(JSON.parse(teams));
        if (matches) setFavoriteMatches(JSON.parse(matches));
        if (notifs !== null) setNotificationsEnabled(JSON.parse(notifs));
      } catch {}
    })();
  }, []);

  const toggleFavoriteTeam = async (teamId: string) => {
    setFavoriteTeams((prev) => {
      const next = prev.includes(teamId) ? prev.filter((t) => t !== teamId) : [...prev, teamId];
      AsyncStorage.setItem("favoriteTeams", JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const toggleFavoriteMatch = async (matchId: string) => {
    setFavoriteMatches((prev) => {
      const next = prev.includes(matchId) ? prev.filter((m) => m !== matchId) : [...prev, matchId];
      AsyncStorage.setItem("favoriteMatches", JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const isFavoriteTeam = (teamId: string) => favoriteTeams.includes(teamId);
  const isFavoriteMatch = (matchId: string) => favoriteMatches.includes(matchId);

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => {
      AsyncStorage.setItem("notificationsEnabled", JSON.stringify(!prev)).catch(() => {});
      return !prev;
    });
  };

  return (
    <AppContext.Provider
      value={{
        favoriteTeams,
        favoriteMatches,
        toggleFavoriteTeam,
        toggleFavoriteMatch,
        isFavoriteTeam,
        isFavoriteMatch,
        notificationsEnabled,
        toggleNotifications,
        selectedGroup,
        setSelectedGroup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
