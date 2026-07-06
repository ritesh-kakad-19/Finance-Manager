import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import '../styles/LandingPage.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, formData);
      localStorage.setItem("userToken", data.token);
      
      // Simulate a small delay after successful login before navigating
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid Credentials');
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
          <h2 className="text-center mb-4 hero-logo">Login</h2>
          {message && <div className="glass-alert glass-alert-danger">{message}</div>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange} required className="glass-input" />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control type={showPassword ? "text" : "password"} name="password" placeholder="Enter password" onChange={handleChange} required className="glass-input border-end-0" />
                <Button variant="outline-secondary" className="glass-input text-white px-3" style={{ borderLeftColor: 'transparent' }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
              <div className="text-end mt-2">
                <a href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }} className="text-primary text-decoration-none" style={{ fontSize: '0.9rem' }}>Forgot password?</a>
              </div>
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
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </Form>

          <p className="text-center mt-4 text-muted border-top border-secondary pt-4">
            New user? <a href="/signup" className="text-primary fw-bold text-decoration-none" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Sign Up</a>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Login;
