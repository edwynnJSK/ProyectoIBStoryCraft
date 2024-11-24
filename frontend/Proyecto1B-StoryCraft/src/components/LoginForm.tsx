// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/usersAPI';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Llamada a la API de login
      const response = await loginUser({ Email:email, 
                                         Password:password });
      
      // Verificamos que los datos existan
      if (response.UserID && response.Username) {
        // Guardamos el ID de usuario y el nombre en el contexto
        login(response.Username, response.UserID); // Aquí guardamos el nombre y el ID de usuario

        // Redirigir al usuario a la página principal después de login
        navigate('/dashboard'); // O la página donde debe ir el usuario después de loguearse
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;