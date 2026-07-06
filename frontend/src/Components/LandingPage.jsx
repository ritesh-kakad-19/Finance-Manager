import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Row, Col, Navbar, Nav, Form } from "react-bootstrap";
import { FaChartLine, FaWallet, FaLock, FaEnvelope } from "react-icons/fa";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container" data-bs-theme="dark">
      {/* Background Overlay */}
      <div className="landing-overlay"></div>

      {/* Sticky Navbar */}
      <Navbar expand="lg" fixed="top" bg="dark" variant="dark" className="glass-navbar px-4" data-bs-theme="dark">
        <Navbar.Brand href="#home" className="fw-bold hero-logo">
          Finance Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="landing-navbar" />
        <Navbar.Collapse id="landing-navbar">
          <Nav className="mx-auto nav-links">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
          <Nav>
            <Button variant="outline-light" className="btn-glass px-4 mx-2" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button variant="primary" className="btn-glow px-4" onClick={() => navigate("/signup")}>
              Register
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Content Container */}
      <div className="landing-content">

        {/* HERO SECTION */}
        <section id="home" className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
          <Container>
            <div className="glass-card mx-auto">
              <h1 className="hero-title">Master Your <span className="highlight">Financial Future</span></h1>
              <p className="hero-subtitle">
                Track expenses, analyze trends, and achieve your goals with our premium, modern dashboard.
              </p>
              <div className="hero-buttons mt-4">
                <Button variant="primary" className="btn-glow px-4 py-2 mx-2" onClick={() => navigate("/signup")}>
                  Start Free
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-5 section-dark">
          <Container>
            <h2 className="section-title text-center mb-5">What We <span className="highlight">Offer</span></h2>
            <Row className="g-4">
              <Col md={4}>
                <div className="feature-card glass-card text-center p-4">
                  <FaChartLine size={50} className="mb-3 feature-icon" />
                  <h4>Visual Analytics</h4>
                  <p className="text-muted mt-2">Interactive graphs tracking your income and expenses over time.</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="feature-card glass-card text-center p-4">
                  <FaWallet size={50} className="mb-3 feature-icon" />
                  <h4>Smart Tracking</h4>
                  <p className="text-muted mt-2">Automatically categorize transactions to see where your money goes.</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="feature-card glass-card text-center p-4">
                  <FaLock size={50} className="mb-3 feature-icon" />
                  <h4>Secure Data</h4>
                  <p className="text-muted mt-2">Your data is encrypted with enterprise-grade security standards.</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-5">
          <Container className="glass-card p-5 my-5">
            <Row className="align-items-center">
              <Col lg={6}>
                <h2 className="section-title mb-4">About <span className="highlight">Us</span></h2>
                <p className="about-text">
                  Finance Manager was built to give individuals control over their financial destiny.
                  We believe that understanding your money should not be complicated or require a degree in accounting.
                </p>
                <p className="about-text">
                  With a sleek interface, robust functionality, and actionable insights, our application is designed to help you save more, spend smartly, and achieve total financial freedom.
                </p>
              </Col>
              <Col lg={6} className="text-center mt-4 mt-lg-0">
                <div className="about-image-placeholder">
                  <div className="glass-circle animate-pulse"></div>
                  <div className="glass-circle small delay-1"></div>
                  <div className="glass-circle medium delay-2"></div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-5 section-dark mb-5">
          <Container>
            <h2 className="section-title text-center mb-5">Get in <span className="highlight">Touch</span></h2>
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <div className="glass-card p-4">
                  <Form>
                    <Form.Group className="mb-4" controlId="contactName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" placeholder="John Doe" className="glass-input" />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="contactEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" placeholder="john@example.com" className="glass-input" />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="contactMessage">
                      <Form.Label>Message</Form.Label>
                      <Form.Control as="textarea" rows={4} placeholder="How can we help?" className="glass-input" />
                    </Form.Group>
                    <Button variant="primary" className="btn-glow w-100 py-2 d-flex justify-content-center align-items-center" onClick={(e) => e.preventDefault()}>
                      <FaEnvelope className="me-2" /> Send Message
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* FOOTER */}
        <footer className="footer-glass py-4 text-center">
          <Container>
            <p className="mb-0 text-muted">© {new Date().getFullYear()} Finance Manager. All rights reserved.</p>
          </Container>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;
