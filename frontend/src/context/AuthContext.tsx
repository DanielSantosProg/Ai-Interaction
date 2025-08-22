import { createContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: number;
  id_empresa: number;
  nome: string;
  cargo: string;
  tipo_usuario: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (userData: any) => void;
  logout: () => void;
  loading: boolean;
}

// Criação do contexto com um valor padrão
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
  loading: true,
});

// Provedor do contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);
    }, []);

  const login = (userData: any) => {
    setUser(userData.user);
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('id_empresa', userData.user.id_empresa);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('id_empresa');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};