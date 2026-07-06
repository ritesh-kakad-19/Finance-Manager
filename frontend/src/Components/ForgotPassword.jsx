import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/LandingPage.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({ otp: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [demoHint, setDemoHint] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("⚠ Please enter a valid email address.");
      setSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/forgot-password`, { email });
      setMessage("✅ OTP sent to your email!");
      setSuccess(true);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "⚠ Error sending OTP");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setDemoHint("");

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/-]).{8,}$/;

    if (!passwordRegex.test(formData.newPassword)) {
      setMessage("⚠ Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.");
      setDemoHint("Demo password hint: Demo@123");
      setSuccess(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("⚠ Passwords do not match!");
      setSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/reset-password`, {
        email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      setMessage("✅ Password reset successful! Redirecting to Login...");
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "⚠ Error resetting password");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-container" data-bs-theme="dark">
      <div className="landing-overlay"></div>
      <Container className="landing-content d-flex justify-content-center align-items-center min-vh-100">
        <div style={{ maxWidth: '450px', width: '100%' }} className="glass-card p-5">
          <h2 className="text-center mb-4 hero-logo">Reset Password</h2>
          {message && <div className={`glass-alert ${success ? "glass-alert-success" : "glass-alert-danger"}`}>{message}</div>}
          {demoHint && <div className="glass-alert glass-alert-success mt-2">{demoHint}</div>}
          
          {step === 1 ? (
            <Form onSubmit={handleEmailSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter your registered email" value={email} onChange={(e) => setEmail(e.target.value)} required className="glass-input" />
              </Form.Group>
              
              <Button variant="primary" type="submit" className="w-100 btn-glow py-2 mt-2" disabled={isLoading}>
                {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> : null}
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleResetSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>6-Digit OTP</Form.Label>
                <Form.Control type="text" name="otp" placeholder="Enter OTP received in email" onChange={handleChange} required className="glass-input" maxLength={6} />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>New Password</Form.Label>
                <InputGroup>
                  <Form.Control type={showPassword ? "text" : "password"} name="newPassword" placeholder="Create a new password" onChange={handleChange} required className="glass-input border-end-0" />
                  <Button variant="outline-secondary" className="glass-input text-white px-3" style={{ borderLeftColor: 'transparent' }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm New Password</Form.Label>
                <InputGroup>
                  <Form.Control type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm your new password" onChange={handleChange} required className="glass-input border-end-0" />
                  <Button variant="outline-secondary" className="glass-input text-white px-3" style={{ borderLeftColor: 'transparent' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 btn-glow py-2 mt-2" disabled={isLoading}>
                {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> : null}
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </Form>
          )}

          <p className="text-center mt-4 text-muted border-top border-secondary pt-4">
            Remembered your password? <a href="/login" className="text-primary fw-bold text-decoration-none" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default ForgotPassword;
