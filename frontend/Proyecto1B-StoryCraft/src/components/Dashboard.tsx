import { useAuth } from "../context/AuthContext";
import Chat from "./Chat";

const Dashboard: React.FC = () => {
    const { username } = useAuth(); 

    return (
      <div>
        <h1>Bienvenido al Dashboard</h1>
        {username ? (
          <><p>Hola, {username}!</p>
          <Chat></Chat>
          </>
        ) : (
          <p>Por favor, inicia sesión.</p>  
        )}
      </div>
    );
  };
  
  export default Dashboard;