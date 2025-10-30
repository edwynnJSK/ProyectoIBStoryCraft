import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  username: string | null;
  userID: number | null;
  login: (username: string, tokenAuth: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userID, setUserID] = useState<number | null>(null);

  const login = (username: string, tokenAuth: string) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', tokenAuth);
    const userId =  getUserIdFromToken();
    setUserID(userId);
    setUsername(username);
    
  };

  const logout = () => {
    setUsername(null);
    setUserID(null);
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ username, userID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const getUserIdFromToken = (): number | null => {  
  const token = localStorage.getItem('token');

  if (!token) return null;

  try {
    const base64Payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(base64Payload));
    return decodedPayload.UserId;
  } catch (error) {
    return null;
  }
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


