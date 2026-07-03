import { createContext, useContext, useState, ReactNode } from 'react';
import { User, MOCK_USERS, DEMO_ACCOUNTS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (correo: string, contrasena: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);

  const login = async (correo: string, contrasena: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 800));

    if (blockedUntil && new Date() < blockedUntil) {
      const mins = Math.ceil((blockedUntil.getTime() - Date.now()) / 60000);
      return { success: false, error: `Cuenta bloqueada temporalmente. Intenta en ${mins} minuto(s).` };
    }

    const account = DEMO_ACCOUNTS.find(a => a.correo === correo && a.contrasena === contrasena);
    if (!account) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 3) {
        setBlockedUntil(new Date(Date.now() + 5 * 60 * 1000));
        setFailedAttempts(0);
        return { success: false, error: 'Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos.' };
      }
      return { success: false, error: `Credenciales incorrectas. ${3 - newAttempts} intento(s) restante(s).` };
    }

    const foundUser = MOCK_USERS.find(u => u.id === account.userId);
    if (!foundUser) return { success: false, error: 'Usuario no encontrado.' };
    if (foundUser.estado === 'bloqueado') return { success: false, error: 'Tu cuenta está bloqueada. Contacta al administrador.' };

    setFailedAttempts(0);
    setBlockedUntil(null);
    setUser(foundUser);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
