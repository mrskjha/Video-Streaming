"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { User } from "@/types";

// Define AuthContext type
type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean; // isLoading ab optional nahi hai
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initial state hamesha true rahega

  // Effect 1: Sirf component mount hone par chalta hai
  // Kaam: LocalStorage se user data load karna
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      // Agar data corrupt hai to usko remove kar dein
      localStorage.removeItem("user");
    } finally {
      // Yeh hamesha chalega, chahe user mile ya na mile
      setIsLoading(false);
    }
  }, []); // Empty array `[]` ka matlab hai ki yeh sirf ek baar chalega

  // Effect 2: Sirf 'user' state ke badalne par chalta hai
  // Kaam: User data ko LocalStorage mein save karna
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // Agar user logout hota hai (user becomes null), to localStorage se remove kar do
      localStorage.removeItem("user");
    }
  }, [user]); // Dependency sirf 'user' hai

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
