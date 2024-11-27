// src/components/auth/LoginForm.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/usersAPI";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Col } from "react-bootstrap";

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
      if (response.UserID && response.Username) {
        login(response.Username, response.UserID);
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
      }, 2000); // Elimina el mensaje después de 2 segundos

      return () => clearTimeout(timer); // Limpia el temporizador
    }
  }, [error]);

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h1 className="text-center text-primary">Iniciar sesión</h1>
      <br />
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Col m="4" className="text-start">
            <Form.Label>Email</Form.Label>
          </Col>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Col m="4" className="text-start">
            <Form.Label>Contraseña</Form.Label>
          </Col>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
      <div className="text-center mt-3">
        <p>
          ¿No tienes una cuenta?{" "}
          <Button
            variant="link"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </Button>
        </p>
      </div>
    </Container>
  );
};

export default LoginForm;
