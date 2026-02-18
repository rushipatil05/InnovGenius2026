import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, UserRole } from "../types";
import { storage } from "../utils/localStorage";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load current user on app start
  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);

      // Ensure language sync on refresh
      if (currentUser.language) {
        localStorage.setItem("app_language", currentUser.language);
      }
    }
  }, []);

  const signup = (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): boolean => {
    const existingUser = storage.getUserByEmail(email);
    if (existingUser) return false;

    // Get latest selected language dynamically
    const currentLanguage =
      localStorage.getItem("app_language") || "en";

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role,
      createdAt: new Date().toISOString(),
      language: currentLanguage, // ✅ dynamic language
    };

    storage.addUser(newUser);
    storage.setCurrentUser(newUser);
    setUser(newUser);

    storage.addAuditLog({
      id: Date.now().toString(),
      action: "USER_SIGNUP",
      userId: newUser.id,
      userName: newUser.name,
      details: `User signed up with role: ${role}`,
      timestamp: new Date().toISOString(),
    });

    return true;
  };

  const login = (email: string, password: string): boolean => {
    const existingUser = storage.getUserByEmail(email);

    if (existingUser && existingUser.password === password) {
      setUser(existingUser);
      storage.setCurrentUser(existingUser);

      // Sync language from profile
      if (existingUser.language) {
        localStorage.setItem(
          "app_language",
          existingUser.language
        );
      }

      storage.addAuditLog({
        id: Date.now().toString(),
        action: "USER_LOGIN",
        userId: existingUser.id,
        userName: existingUser.name,
        details: "User logged in",
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
        action: "USER_LOGOUT",
        userId: user.id,
        userName: user.name,
        details: "User logged out",
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
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
