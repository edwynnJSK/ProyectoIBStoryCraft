import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { resetPassword } from "../api/usersAPI";
import { useAuth } from "../context/AuthContext";

interface ResetPasswordProps {
  show: boolean;
  onHide: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ show, onHide }) => {
  const { userID } = useAuth();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");


  useEffect(() => {
    // Clear error and success messages after 3 seconds
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [password, confirmPassword]);

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    // Reset password
    try {
      if (!userID) {
        setError("User ID not found");
        return;
      }

      const message = await resetPassword(userID, { Password: password });
      setSuccess(message);
      // Clear form and close modal after 2 seconds
      setTimeout(() => {
        handleClean();
      }, 2000);
    } catch (err) {
      console.error('Reset Password Error:', err);
      setError(err instanceof Error ? err.message : "Error al actualizar la contraseña");
    }
  };

  const handleClean = () => {
    // Clear form
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    onHide(); // Close the modal after successful reset
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group controlId="formBasicPassword" className="mb-3">
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClean}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleResetPassword}
        >
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResetPassword;