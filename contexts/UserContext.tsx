import { User } from "@/types/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const clearUser = () => setUser(null);

  // Debug logging for user state changes
  useEffect(() => {
    console.log("UserContext state changed:", user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
