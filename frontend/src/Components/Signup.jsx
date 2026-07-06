import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import "../styles/LandingPage.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [demoHint, setDemoHint] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setDemoHint("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/-]).{8,}$/;

    if (!emailRegex.test(formData.email)) {
      setMessage("⚠ Please enter a valid email address.");
      setSuccess(false);
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setMessage("⚠ Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.");
      setDemoHint("Demo password hint: Demo@123");
      setSuccess(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("⚠ Passwords do not match!");
      setSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, formData);
      setMessage("✅ Registration Successful! Redirecting to Login...");
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "⚠ Error registering user");
      setSuccess(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-container" data-bs-theme="dark">
      <div className="landing-overlay"></div>
      <Container className="landing-content d-flex justify-content-center align-items-center min-vh-100">
        <div style={{ maxWidth: '450px', width: '100%', position: 'relative' }} className="glass-card p-5">
          <Button variant="link" onClick={() => navigate('/')} style={{ position: 'absolute', top: '20px', left: '20px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: 0 }}>
            <FaArrowLeft size={18} />
          </Button>
          <h2 className="text-center mb-4 hero-logo">Create Account</h2>
          {message && <div className={`glass-alert ${success ? "glass-alert-success" : "glass-alert-danger"}`}>{message}</div>}
          {demoHint && <div className="glass-alert glass-alert-success mt-2">{demoHint}</div>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="John Doe" onChange={handleChange} required className="glass-input" />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" placeholder="Enter email address" onChange={handleChange} required className="glass-input" />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control type={showPassword ? "text" : "password"} name="password" placeholder="Create a password" onChange={handleChange} required className="glass-input border-end-0" />
                <Button variant="outline-secondary" className="glass-input text-white px-3" style={{ borderLeftColor: 'transparent' }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <InputGroup>
                <Form.Control type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm your password" onChange={handleChange} required className="glass-input border-end-0" />
                <Button variant="outline-secondary" className="glass-input text-white px-3" style={{ borderLeftColor: 'transparent' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 btn-glow py-2 mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </Form>

          <p className="text-center mt-4 text-muted border-top border-secondary pt-4">
            Already have an account? <a href="/login" className="text-primary fw-bold text-decoration-none" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Signup;
