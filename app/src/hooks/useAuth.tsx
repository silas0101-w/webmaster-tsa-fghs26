import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { apiRequest } from '../lib/api'

interface User {
  userId: string;
  username: string;
}

interface LoginResponse { token: string; userId: string }

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUserId = localStorage.getItem('user_id');
    const savedUsername = localStorage.getItem('username');
    if (savedToken && savedUserId && savedUsername) {
      return { token: savedToken, user: { userId: savedUserId, username: savedUsername } as User };
    }
    return { token: null, user: null };
  });

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('auth_token', res.token);
    localStorage.setItem('user_id', res.userId);
    localStorage.setItem('username', username);
    setSession({ token: res.token, user: { userId: res.userId, username } });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    setSession({ token: null, user: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...session, login, logout, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
