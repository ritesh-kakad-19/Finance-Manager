import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection


const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // To redirect after successful signup

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", formData);
      setMessage("✅ Registration Successful! Redirecting to Login...");
      setSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "⚠ Error registering user");
      setSuccess(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }} className="p-4 shadow signup-card">
        <h2 className="text-center mb-4">Sign Up</h2>
        {message && <Alert variant={success ? "success" : "danger"}>{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter name" onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" placeholder="Enter password" onChange={handleChange} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 signup-button">
            Register
          </Button>
        </Form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </Card>
    </Container>
  );
};

export default Signup;
