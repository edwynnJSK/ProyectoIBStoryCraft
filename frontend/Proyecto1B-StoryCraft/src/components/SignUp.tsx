import React, { useState } from "react";
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
            return setError("Please enter a valid email address.");
        }

        try {
            const response = createUser({
                Username: formData.Username,
                Email: formData.Email,
                Password: formData.Password,
            });

            setError(await response)

            alert("Registration successful!");
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "600px" }}>
            <h1 className="text-center text-primary">Unete</h1>
            <p className="text-center text-muted">Crea y comparte tus historias!</p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="username">
                    <Col sm="4" className="text-end">
                        <Form.Label>Username</Form.Label>
                    </Col>
                    <Col sm="8">
                        <Form.Control
                            type="text"
                            placeholder="Enter your username"
                            name="Username"
                            value={formData.Username}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="email">
                    <Col sm="4" className="text-end">
                        <Form.Label>Email</Form.Label>
                    </Col>
                    <Col sm="8">
                        <Form.Control
                            placeholder="Enter your email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="password">
                    <Col sm="4" className="text-end">
                        <Form.Label>Password</Form.Label>
                    </Col>
                    <Col sm="8">
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Sign Up
                </Button>
            </Form>
            <div className="text-center mt-3">
                <p>
                    ¿Ya tienes una cuenta?{" "}
                    <Button
                        variant="link"
                        onClick={() => navigate("/login")} 
                    >
                        Login
                    </Button>
                </p>
            </div>
        </Container>
    );
};

export default Signup;