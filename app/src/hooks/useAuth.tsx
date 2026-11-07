import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { apiRequest } from '../lib/api'

export interface User {
  userId: string;
  id?: string;
  username: string;
  name?: string | null;
}

interface LoginResponse {
  token: string;
  userId: string;
  name?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUserId = localStorage.getItem('user_id');
    const savedUsername = localStorage.getItem('username');
    const savedName = localStorage.getItem('name');
    if (savedToken && savedUserId && savedUsername) {
      return {
        token: savedToken,
        user: {
          userId: savedUserId,
          id: savedUserId,
          username: savedUsername,
          name: savedName ?? null,
        } as User,
      };
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
    if (res.name) {
      localStorage.setItem('name', res.name);
    } else {
      localStorage.removeItem('name');
    }
    setSession({
      token: res.token,
      user: {
        userId: res.userId,
        id: res.userId,
        username,
        name: res.name ?? null,
      },
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    setSession({ token: null, user: null });
  }, []);

  const updateUser = useCallback((partial: Partial<User>) => {
    setSession((prev) => {
      if (!prev.user) return prev;
      const updatedUser: User = {
        ...prev.user,
        ...partial,
      };
      if (partial.username !== undefined) {
        localStorage.setItem('username', partial.username);
      }
      if (partial.name !== undefined) {
        if (partial.name) {
          localStorage.setItem('name', partial.name);
        } else {
          localStorage.removeItem('name');
        }
      }
      if (partial.userId !== undefined || partial.id !== undefined) {
        const id = partial.id || partial.userId;
        if (id) localStorage.setItem('user_id', id);
      }
      return {
        ...prev,
        user: updatedUser,
      };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...session, login, logout, updateUser, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
