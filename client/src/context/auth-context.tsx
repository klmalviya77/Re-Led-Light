import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loadAdminAuth, saveAdminAuth, clearAdminAuth } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  isAdmin: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const authData = loadAdminAuth();
    if (authData) {
      setIsAdmin(authData.isAdmin);
      setUsername(authData.username);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/admin/login', { username, password });
      const data = await response.json();
      
      if (data.success) {
        setIsAdmin(true);
        setUsername(username);
        saveAdminAuth(username, true);
        return true;
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setUsername(null);
    clearAdminAuth();
  };

  return (
    <AuthContext.Provider value={{ isAdmin, username, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
