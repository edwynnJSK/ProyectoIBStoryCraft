import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { SignupForm } from "../interfaces/user";
import { createUser } from "../api/usersAPI";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

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
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [error]);
  
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon">✨</div>
        </div>
        
        <h1>Crear Cuenta</h1>
        <p className="auth-subtitle">Únete a StoryCraft hoy</p>
        
        <div className="alert-container">
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="text-center">
              ¡Usuario creado exitosamente! Redirigiendo...
            </Alert>
          )}
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              name="Username"
              placeholder="Tu nombre de usuario"
              value={formData.Username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              placeholder="tu@email.com"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="Password"
              placeholder="••••••••"
              value={formData.Password}
              onChange={handleChange}
              required
            />
            <div className="password-requirements">
              <small>La contraseña debe contener:</small>
              <ul>
                <li>Mínimo 8 caracteres</li>
                <li>Al menos una letra mayúscula</li>
                <li>Al menos un número</li>
              </ul>
            </div>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
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

          <Button type="submit" className="auth-submit-btn">
            Crear Cuenta
          </Button>
        </Form>
        
        <div className="auth-link">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Button 
              variant="link" 
              className="btn-link"
              onClick={() => navigate("/login")}
            >
              Inicia sesión aquí
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;