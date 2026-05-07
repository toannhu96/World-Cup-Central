import React, { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
  favoriteTeams: string[];
  toggleFavoriteTeam: (teamId: string) => void;
  isFavoriteTeam: (teamId: string) => boolean;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
}

const AppContext = createContext<AppContextType>({
  favoriteTeams: [],
  toggleFavoriteTeam: () => {},
  isFavoriteTeam: () => false,
  notificationsEnabled: true,
  toggleNotifications: () => {},
  selectedGroup: "A",
  setSelectedGroup: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("A");

  useEffect(() => {
    try {
      const teams = localStorage.getItem("favoriteTeams");
      const notifs = localStorage.getItem("notificationsEnabled");
      
      if (teams) setFavoriteTeams(JSON.parse(teams));
      if (notifs !== null) setNotificationsEnabled(JSON.parse(notifs));
    } catch (e) {
      console.error("Failed to load state", e);
    }
  }, []);

  const toggleFavoriteTeam = (teamId: string) => {
    setFavoriteTeams((prev) => {
      const next = prev.includes(teamId) ? prev.filter((t) => t !== teamId) : [...prev, teamId];
      localStorage.setItem("favoriteTeams", JSON.stringify(next));
      return next;
    });
  };

  const isFavoriteTeam = (teamId: string) => favoriteTeams.includes(teamId);

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => {
      localStorage.setItem("notificationsEnabled", JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <AppContext.Provider
      value={{
        favoriteTeams,
        toggleFavoriteTeam,
        isFavoriteTeam,
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
