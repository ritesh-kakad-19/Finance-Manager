import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import TransactionGraph from "./TransactionGraph";
import "../styles/Dashboard.css";

const AnalyticsPage = () => {
  return (
    <Container fluid>
      <header className="mb-4">
        <h2 className="fw-bold">Visual Analytics</h2>
        <p className="text-muted">Track your financial growth and spending habits visually.</p>
      </header>

      <Row className="g-4">
        <Col lg={12}>
          <Card className="glass-panel p-4 border-0">
            <h4 className="mb-4">Monthly Status</h4>
            <div style={{ height: '500px' }}>
              <TransactionGraph />
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AnalyticsPage;
