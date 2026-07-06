import React from "react";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { FaMoon, FaSun, FaLock, FaBell, FaDatabase } from "react-icons/fa";
import "../styles/Dashboard.css";

const SettingsPage = () => {
  return (
    <Container fluid>
      <header className="mb-4">
        <h2 className="fw-bold">Account Settings</h2>
        <p className="text-muted">Manage your personal settings and security preferences.</p>
      </header>

      <Row className="g-4">
        <Col md={6}>
          <Card className="glass-panel p-4 border-0">
            <h5 className="mb-4 d-flex align-items-center">
              <FaLock className="me-2 text-primary" /> Security
            </h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Change Password</Form.Label>
                <div 
                  className="p-3 border rounded border-secondary text-primary cursor-pointer"
                  onClick={() => window.location.href = "/forgot-password"}
                  style={{ cursor: 'pointer' }}
                >
                  Go to Password Reset Page
                </div>
              </Form.Group>
            </Form>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="glass-panel p-4 border-0">
            <h5 className="mb-4 d-flex align-items-center">
              <FaBell className="me-2 text-warning" /> Preferences
            </h5>
            <Form>
              <Form.Check 
                type="switch"
                id="email-alerts"
                label="Receive Email Notifications"
                className="mb-3"
              />
              <Form.Check 
                type="switch"
                id="budget-reminders"
                label="Enable Budget Reminders"
                className="mb-3"
              />
            </Form>
          </Card>
        </Col>

        <Col md={12}>
          <Card className="glass-panel p-4 border-0">
            <h5 className="mb-4 d-flex align-items-center">
              <FaDatabase className="me-2 text-info" /> Data Management
            </h5>
            <p className="text-muted">Export or Wipe your financial data permanently.</p>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary">Export CSV</button>
              <button className="btn btn-outline-danger">Clear All Data</button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;
