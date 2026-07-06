import React from "react";
import { Container, Card } from "react-bootstrap";
import TransactionTable from "./TransactionTable";
import "../styles/Dashboard.css";

const TransactionsPage = () => {
  return (
    <Container fluid>
      <header className="mb-4">
        <h2 className="fw-bold">All Transactions</h2>
        <p className="text-muted">Manage and track every dollar you spend or earn.</p>
      </header>

      <Card className="glass-panel p-4 border-0">
        <TransactionTable />
      </Card>
    </Container>
  );
};

export default TransactionsPage;
