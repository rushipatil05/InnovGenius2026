import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { storage } from '../utils/localStorage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, name: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    setUser(currentUser);
  }, []);

  const signup = (email: string, password: string, name: string, role: UserRole): boolean => {
    const existingUser = storage.getUserByEmail(email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role,
      createdAt: new Date().toISOString(),
    };

    storage.addUser(newUser);
    storage.addAuditLog({
      id: Date.now().toString(),
      action: 'USER_SIGNUP',
      userId: newUser.id,
      userName: newUser.name,
      details: `User signed up with role: ${role}`,
      timestamp: new Date().toISOString(),
    });

    setUser(newUser);
    storage.setCurrentUser(newUser);
    return true;
  };

  const login = (email: string, password: string): boolean => {
    const user = storage.getUserByEmail(email);
    if (user && user.password === password) {
      setUser(user);
      storage.setCurrentUser(user);
      storage.addAuditLog({
        id: Date.now().toString(),
        action: 'USER_LOGIN',
        userId: user.id,
        userName: user.name,
        details: `User logged in`,
        timestamp: new Date().toISOString(),
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    if (user) {
      storage.addAuditLog({
        id: Date.now().toString(),
        action: 'USER_LOGOUT',
        userId: user.id,
        userName: user.name,
        details: `User logged out`,
        timestamp: new Date().toISOString(),
      });
    }
    setUser(null);
    storage.setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
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
