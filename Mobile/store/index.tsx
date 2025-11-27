import React, { createContext, useContext, useState, ReactNode } from "react";
import { Person } from "../types";

// Tipe context
interface PeopleContextType {
  likedPeople: Person[];
  setLikedPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  dislikedPeople: Person[];
  setDislikedPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  currentPersonIndex: number;
  setCurrentPersonIndex: React.Dispatch<React.SetStateAction<number>>;
}

// Buat context
const PeopleContext = createContext<PeopleContextType | null>(null);

// Provider
export const PeopleProvider = ({ children }: { children: ReactNode }) => {
  const [likedPeople, setLikedPeople] = useState<Person[]>([]);
  const [dislikedPeople, setDislikedPeople] = useState<Person[]>([]);
  const [currentPersonIndex, setCurrentPersonIndex] = useState<number>(0);

  return (
    <PeopleContext.Provider
      value={{
        likedPeople,
        setLikedPeople,
        dislikedPeople,
        setDislikedPeople,
        currentPersonIndex,
        setCurrentPersonIndex,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

// Hook custom untuk akses context
export const usePeopleContext = (): PeopleContextType => {
  const context = useContext(PeopleContext);
  if (!context) {
    throw new Error("usePeopleContext must be used within a PeopleProvider");
  }
  return context;
};
