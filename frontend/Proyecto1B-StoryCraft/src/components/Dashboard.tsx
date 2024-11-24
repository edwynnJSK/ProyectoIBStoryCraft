import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
    const { username } = useAuth();  // Obtener el nombre de usuario desde el contexto

    return (
      <div>
        <h1>Bienvenido al Dashboard</h1>
        {username ? (
          <p>Hola, {username}!</p>  
        ) : (
          <p>Por favor, inicia sesión.</p>  
        )}
      </div>
    );
  };
  
  export default Dashboard;