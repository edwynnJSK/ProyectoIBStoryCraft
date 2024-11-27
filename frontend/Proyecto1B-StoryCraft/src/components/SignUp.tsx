import React, { useEffect, useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { SignupForm } from "../interfaces/user";
import { createUser } from "../api/usersAPI";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupForm>({
    Username: "",
    Email: "",
    Password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    /*
            // Validación básica
            if (formData.password !== formData.confirmPassword) {
              return setError("Passwords do not match!");
            }*/
    if (!formData.Email.includes("@")) {
      return setError("Por favor, ingrese un correo válido");
    }

    try {
      const response = createUser({
        Username: formData.Username,
        Email: formData.Email,
        Password: formData.Password,
      });

      setError(await response);

      alert("Registro exitoso!");
    } catch (err) {
      setError((err as Error).message);
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
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h1 className="text-center text-primary">Únete</h1>
      <br />
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username">
          <Col sm="4" className="text-start">
            <Form.Label>Usuario</Form.Label>
          </Col>
          <Form.Control
            type="text"
            name="Username"
            value={formData.Username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Col sm="4" className="text-start">
            <Form.Label>Email</Form.Label>
          </Col>
          <Form.Control
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Col sm="4" className="text-end">
            <Form.Label>Contraseña</Form.Label>
          </Col>
          <Form.Control
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Sign Up
        </Button>
      </Form>
      <div className="text-center mt-3">
        <p>
          ¿Ya tienes una cuenta?{" "}
          <Button variant="link" onClick={() => navigate("/login")}>
            Login
          </Button>
        </p>
      </div>
    </Container>
  );
};

export default Signup;
