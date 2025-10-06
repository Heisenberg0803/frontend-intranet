import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth} from '../service/auth';
import type { User } from "../types/type";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (name: string, password: string) => {
    try {
      const user = await auth.login(name, password);
      setUser(user);
      setError(null);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Error logging in');
      throw err;
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};