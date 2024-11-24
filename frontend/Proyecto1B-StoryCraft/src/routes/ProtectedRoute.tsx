import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Supón que tienes un hook que maneja la autenticación

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { username, userID } = useAuth();  // Obtenemos los datos de autenticación

    // Si el usuario no está autenticado, redirige a la página de login
    if (!username || !userID) {
      return <Navigate to="/login" />;
    }
  
    return children;  // Si está autenticado, renderizamos el componente protegido
};

export default ProtectedRoute;