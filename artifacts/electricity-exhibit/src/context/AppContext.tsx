import React, { createContext, useContext, useState } from "react";

export type AgeGroup = "5-10" | "11-18" | "18+";
export type Page = "landing" | "scene" | "age" | "video" | "game" | "quiz" | "reward";

interface AppContextType {
  page: Page;
  setPage: (p: Page) => void;
  ageGroup: AgeGroup | null;
  setAgeGroup: (a: AgeGroup) => void;
  score: number;
  setScore: (s: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<Page>("landing");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [score, setScore] = useState(0);

  return (
    <AppContext.Provider value={{ page, setPage, ageGroup, setAgeGroup, score, setScore }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
