"use client";

import { getAuthUser } from "@/lib/authService";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  refetch: async () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    const [data, err] = await getAuthUser();

    if (err) {
      setError(err);
      setUser(null);
    } else {
      setUser(data.user);
      setError(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {

        if (!isMounted) return;

        await refetch()
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || "Something went wrong");
        setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
