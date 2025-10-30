// src/components/auth/LoginForm.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/usersAPI";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import "../styles/Auth.css";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({ Email: email, Password: password });
      // Verificamos que los datos existan
      if (response.TokenAuth && response.Username) {
        login(response.Username,response.TokenAuth);
        navigate("/dashboard");
      } else {
        setError("El email o contraseña son incorrectos");
      }
    } catch (err) {
      setError("El email o contraseña son incorrectos");
    }
  };
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000); // Elimina el mensaje después de 3 segundos

      return () => clearTimeout(timer); // Limpia el temporizador
    }
  }, [error]);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon">📚</div>
        </div>
        
        <h1>Bienvenido</h1>
        <p className="auth-subtitle">Inicia sesión en StoryCraft</p>
        
        <div className="alert-container">
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="auth-submit-btn">
            Iniciar Sesión
          </Button>
        </Form>
        
        <div className="auth-link">
          <p>
            ¿No tienes una cuenta?{" "}
            <Button
              variant="link"
              className="btn-link"
              onClick={() => navigate("/signup")}
            >
              Regístrate aquí
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
