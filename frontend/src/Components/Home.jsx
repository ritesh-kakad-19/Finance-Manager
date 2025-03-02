import React from "react";
import { Container, Row, Col, Card, Table, ProgressBar, Button } from "react-bootstrap";
import { FaDollarSign, FaChartLine, FaWallet, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css"; // Custom styles

const FinanceHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session (adjust based on authentication method)
    localStorage.removeItem("userToken"); // Example
    sessionStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  const transactions = [
    { id: 1, date: "2025-02-28", description: "Salary", amount: 5000, type: "income" },
    { id: 2, date: "2025-02-27", description: "Rent", amount: -1200, type: "expense" },
    { id: 3, date: "2025-02-25", description: "Groceries", amount: -150, type: "expense" },
  ];

  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const budgetLimit = 5000;
  const budgetProgress = (totalExpense / budgetLimit) * 100;

  return (
    <Container className="mt-4">
      {/* Logout Button */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="danger" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm finance-card income-card">
            <Card.Body>
              <FaDollarSign size={30} className="icon" />
              <h5>Total Income</h5>
              <h3 className="text-success">${totalIncome}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm finance-card expense-card">
            <Card.Body>
              <FaWallet size={30} className="icon" />
              <h5>Total Expenses</h5>
              <h3 className="text-danger">${totalExpense}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm finance-card budget-card">
            <Card.Body>
              <FaChartLine size={30} className="icon" />
              <h5>Budget Usage</h5>
              <ProgressBar now={budgetProgress} label={`${Math.round(budgetProgress)}%`} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <h4>Recent Transactions</h4>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.description}</td>
                  <td className={t.type === "income" ? "text-success" : "text-danger"}>
                    {t.type === "income" ? "+" : "-"}${Math.abs(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="primary" className="mt-2">
            <FaPlus /> Add Transaction
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FinanceHome;
