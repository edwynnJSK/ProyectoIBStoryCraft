import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Supón que tienes un hook que maneja la autenticación

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { username, userID } = useAuth(); 
    if (!username || !userID) {
      return <Navigate to="/login" />;
    }
    return children; 
};

export default ProtectedRoute;