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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const isPasswordValid = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return hasMinLength && hasUpperCase && hasNumber;
  };

  const containsSpecialChars = (str: string): boolean => {
    const specialChars = /[ñÑáéíóúÁÉÍÓÚüÜ]/;
    return specialChars.test(str);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (containsSpecialChars(value)) {
      setError("No se permiten caracteres especiales");
      return;
    }
    
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (containsSpecialChars(formData.Username) || 
        containsSpecialChars(formData.Email) || 
        containsSpecialChars(formData.Password)) {
      return setError("No se permiten caracteres especiales");
    }
  
    if (!formData.Email.includes("@")) {
      return setError("Por favor, ingrese un correo válido");
    }
  
    if (!isPasswordValid(formData.Password)) {
      return setError("La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número");
    }

    if (formData.Password !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }
  
    try {
      const response = createUser({
        Username: formData.Username,
        Email: formData.Email,
        Password: formData.Password,
      });
  
      const errorResponse = await response;
      if (errorResponse) {
        setError(errorResponse);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);
  
  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h1 className="text-center text-primary">Únete</h1>
      <br />
      <div style={{ 
        position: "relative",
        height: "60px",
        width: "100%",
        marginBottom: "20px"
       }}>
        {error && (
          <Alert variant="danger" className="text-center" style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            wordWrap: "break-word",
            zIndex: 1
           }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="text-center" style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1
          }}>
            ¡Usuario creado exitosamente!
          </Alert>
        )}
      </div>

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
          <Col sm="4" className="text-start">
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

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Col sm="4" className="text-start">
            <Form.Label style={{ whiteSpace: 'nowrap' }}>Confirmar Contraseña</Form.Label>
          </Col>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              if (containsSpecialChars(e.target.value)) {
                setError("No se permiten caracteres especiales");
                return;
              }
              setConfirmPassword(e.target.value);
              setError(null);
            }}
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