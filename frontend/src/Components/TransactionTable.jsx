import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Button, Alert } from "react-bootstrap";
import { FaTrash, FaPlus } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/transactions";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    description: "",
    category: "Income",
    amount: "",
  });

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString("default", { month: "long" }));

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(API_URL, {
        headers: { Authorization: token },
      });
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  const handleInputChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const addTransaction = async () => {
    if (!newTransaction.date || !newTransaction.description || !newTransaction.amount) return;

    try {
      const { data } = await axios.post(API_URL, newTransaction, {
        headers: { Authorization: token },
      });
      setTransactions([...transactions, data]);
      setNewTransaction({ date: "", description: "", category: "Income", amount: "" });
    } catch (error) {
      console.error("Error adding transaction", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: token },
      });
      setTransactions(transactions.filter((tx) => tx._id !== id));
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  // 🟢 Get unique years from transactions
  const getYears = () => {
    const years = [...new Set(transactions.map((tx) => new Date(tx.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // 🟢 Filter transactions by selected year & month
  const filteredTransactions = transactions.filter((tx) => {
    const dateObj = new Date(tx.date);
    return dateObj.getFullYear() === selectedYear && dateObj.toLocaleString("default", { month: "long" }) === selectedMonth;
  });

  // 🟢 Calculate total income, expenses & balance
  const totalIncome = filteredTransactions
    .filter((tx) => tx.category === "Income")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const totalExpense = filteredTransactions
    .filter((tx) => tx.category === "Expense")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div>
      {/* Filters - Year & Month */}
      <div className="d-flex gap-2 mb-3">
        <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {getYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Form.Select>

        <Form.Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </Form.Select>
      </div>

      {/* Transaction Summary */}
      <div className="mb-3">
        <h5>
          <span className="text-primary">{selectedMonth} {selectedYear}</span>
        </h5>
        <p>
          <strong>Total Income:</strong> <span className="text-success">+${totalIncome.toFixed(2)}</span> |
          <strong> Total Expenses:</strong> <span className="text-danger">-${totalExpense.toFixed(2)}</span> |
          <strong> Balance:</strong> <span className={balance >= 0 ? "text-success" : "text-danger"}>
            ${balance.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Form to Add Transactions */}
      <Form className="mb-3 d-flex gap-2">
        <Form.Control type="date" name="date" value={newTransaction.date} onChange={handleInputChange} />
        <Form.Control type="text" name="description" placeholder="Description" value={newTransaction.description} onChange={handleInputChange} />
        <Form.Select name="category" value={newTransaction.category} onChange={handleInputChange}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </Form.Select>
        <Form.Control type="number" name="amount" placeholder="Amount" value={newTransaction.amount} onChange={handleInputChange} />
        <Button variant="success" onClick={addTransaction}>
          <FaPlus /> Add
        </Button>
      </Form>

      {/* If No Transactions */}
      {filteredTransactions.length === 0 ? (
        <Alert variant="info">No transactions found for {selectedMonth} {selectedYear}.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount ($)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.date}</td>
                <td>{tx.description}</td>
                <td>{tx.category}</td>
                <td className={tx.category === "Expense" ? "text-danger" : "text-success"}>
                  {tx.category === "Expense" ? `-${Math.abs(tx.amount)}` : `+${Math.abs(tx.amount)}`}
                </td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => deleteTransaction(tx._id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TransactionTable;
