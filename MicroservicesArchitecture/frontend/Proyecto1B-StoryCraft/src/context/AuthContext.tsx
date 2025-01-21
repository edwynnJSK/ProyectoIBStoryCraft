import { createContext, useState, useContext } from 'react';

interface AuthContextType {
  username: string | null;
  userID: number | null;
  login: (username: string, userID: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userID, setUserID] = useState<number | null>(null);

  const login = (username: string, userID: number) => {
    setUsername(username);
    setUserID(userID);
    localStorage.setItem('username', username);
    localStorage.setItem('userID', userID.toString());
  };

  const logout = () => {
    setUsername(null);
    setUserID(null);
    localStorage.removeItem('username');
    localStorage.removeItem('userID');
  };

  return (
    <AuthContext.Provider value={{ username, userID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};