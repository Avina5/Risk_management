import { createContext, useContext, useState, ReactNode } from 'react';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // simple btoa hash — fine for a demo/prototype
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: StoredUser | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DB_KEY = 'rp_users';
const SESSION_KEY = 'rp_auth_user';

// Built-in demo account
const DEMO_USER: StoredUser = {
  id: 'demo',
  name: 'Alex Johnson',
  email: 'admin@riskpulse.ai',
  passwordHash: btoa('demo1234'),
  createdAt: '2026-01-01T00:00:00Z',
};

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(DB_KEY);
    const users: StoredUser[] = raw ? JSON.parse(raw) : [];
    // Always include demo account
    if (!users.find(u => u.email === DEMO_USER.email)) {
      users.unshift(DEMO_USER);
    }
    return users;
  } catch {
    return [DEMO_USER];
  }
}

function saveUsers(users: StoredUser[]) {
  // Don't persist the demo user — it's always injected at read time
  const toSave = users.filter(u => u.id !== 'demo');
  localStorage.setItem(DB_KEY, JSON.stringify(toSave));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = currentUser !== null;

  const login = (email: string, password: string): { ok: boolean; error?: string } => {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { ok: false, error: 'No account found with that email.' };
    if (user.passwordHash !== btoa(password)) return { ok: false, error: 'Incorrect password.' };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setCurrentUser(user);
    return { ok: true };
  };

  const register = (name: string, email: string, password: string): { ok: boolean; error?: string } => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const newUser: StoredUser = {
      id: `u_${Date.now()}`,
      name,
      email,
      passwordHash: btoa(password),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    return { ok: true };
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
